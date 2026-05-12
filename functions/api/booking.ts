/**
 * POST /api/booking — Cloudflare Pages Function
 * Native booking flow: validate slot conflict + .ics + emails
 */

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_SITE_URL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_NOTIFY_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const PHONE_VN = /^(\+84|0)\d{9,10}$/;

const bookingSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(PHONE_VN),
  company: z.string().max(200).optional().or(z.literal("")),
  service: z.string().min(1),
  scheduled_at: z.string().datetime(),
  meeting_type: z.enum(["online", "offline"]).default("online"),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: z.literal(true),
  turnstileToken: z.string().min(1),
});

const json = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

async function verifyTurnstile(token: string, secret: string | undefined, ip: string | null) {
  if (!secret) return true;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

function fmtIcs(d: Date) {
  return (
    d.getUTCFullYear().toString().padStart(4, "0") +
    (d.getUTCMonth() + 1).toString().padStart(2, "0") +
    d.getUTCDate().toString().padStart(2, "0") +
    "T" +
    d.getUTCHours().toString().padStart(2, "0") +
    d.getUTCMinutes().toString().padStart(2, "0") +
    "00Z"
  );
}

function generateIcs(args: {
  uid: string;
  start: Date;
  durationMin: number;
  summary: string;
  description: string;
  location: string;
  attendeeEmail: string;
  attendeeName: string;
}) {
  const end = new Date(args.start.getTime() + args.durationMin * 60_000);
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NHN&D Tax Advisory//VI",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${args.uid}`,
    `DTSTAMP:${fmtIcs(new Date())}`,
    `DTSTART:${fmtIcs(args.start)}`,
    `DTEND:${fmtIcs(end)}`,
    `SUMMARY:${esc(args.summary)}`,
    `DESCRIPTION:${esc(args.description)}`,
    `LOCATION:${esc(args.location)}`,
    `ATTENDEE;CN=${esc(args.attendeeName)}:mailto:${args.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

async function sendEmail(env: Env, args: { to: string; subject: string; html: string; attachments?: { filename: string; content: string; contentType: string }[]; replyTo?: string }) {
  if (!env.RESEND_API_KEY) {
    console.log("[email-mock]", { to: args.to, subject: args.subject });
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `NHN&D Tax Advisory <${env.RESEND_FROM_EMAIL ?? "noreply@ndtax.vn"}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
      reply_to: args.replyTo,
      attachments: args.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        content_type: a.contentType,
      })),
    }),
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return json({ ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    const data = parsed.data;

    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for");
    const captchaOk = await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!captchaOk) return json({ ok: false, error: "Captcha thất bại" }, { status: 403 });

    const scheduledAt = new Date(data.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) {
      return json({ ok: false, error: "Thời gian không hợp lệ" }, { status: 400 });
    }

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const slotEnd = new Date(scheduledAt.getTime() + 30 * 60_000);
    const { data: conflict } = await supabase
      .from("bookings")
      .select("id")
      .gte("scheduled_at", scheduledAt.toISOString())
      .lt("scheduled_at", slotEnd.toISOString())
      .in("status", ["pending", "confirmed"])
      .maybeSingle();
    if (conflict) {
      return json({ ok: false, error: "Slot này đã có người đặt — vui lòng chọn slot khác" }, { status: 409 });
    }

    const icsUid = `${crypto.randomUUID()}@ndtax.vn`;
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        service: data.service,
        scheduled_at: scheduledAt.toISOString(),
        meeting_type: data.meeting_type,
        message: data.message || null,
        ics_uid: icsUid,
      })
      .select("id, ics_uid")
      .single();
    if (error || !booking) {
      console.error("[booking-insert]", error);
      return json({ ok: false, error: "Không tạo được lịch hẹn" }, { status: 500 });
    }

    const ics = generateIcs({
      uid: icsUid,
      start: scheduledAt,
      durationMin: 30,
      summary: `Tư vấn NHN&D — ${data.service}`,
      description: `Buổi tư vấn 30 phút với anh Ngọc. Khách: ${data.full_name}. SĐT: ${data.phone}.`,
      location: data.meeting_type === "online" ? "Online (link sẽ được gửi sau)" : "Hà Nội, Việt Nam",
      attendeeEmail: data.email,
      attendeeName: data.full_name,
    });
    const icsBytes = new TextEncoder().encode(ics);
    let bin = "";
    for (let i = 0; i < icsBytes.length; i++) bin += String.fromCharCode(icsBytes[i]);
    const icsBase64 = btoa(bin);

    const date = scheduledAt.toLocaleString("vi-VN", { dateStyle: "full", timeStyle: "short" });
    const wrap = (body: string) => `<!DOCTYPE html><html lang="vi"><body style="background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46;padding:32px;margin:0"><div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:48px 40px;border:1px solid #F0EBDD;box-shadow:0 1px 3px rgba(15,43,70,0.06)"><div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #F0EBDD"><div style="font-family:Georgia,serif;font-size:56px;font-weight:700;line-height:1;letter-spacing:-2px">NHN<span style="color:#C9A961;margin:0 4px">&amp;</span>D</div><div style="font-size:13px;letter-spacing:5px;margin-top:8px;font-weight:600">TAX ADVISORY</div></div>${body}<div style="margin-top:32px;padding-top:24px;border-top:1px solid #F0EBDD;text-align:center;font-size:12px;color:#486581"><p style="margin:0">Công ty TNHH Tư vấn thuế NHN&D · Hà Nội, Việt Nam</p><p style="margin:6px 0 0">Hoaingoc.sa@gmail.com · 0986 032 472</p></div></div></body></html>`;
    const customerHtml = wrap(`<h1 style="font-family:Georgia,serif">Đã ghi nhận lịch hẹn của bạn</h1><p>Cảm ơn ${data.full_name}.</p><p><strong>Thời gian:</strong> ${date}<br><strong>Dịch vụ:</strong> ${data.service}<br><strong>Hình thức:</strong> ${data.meeting_type === "online" ? "Trực tuyến" : "Tại văn phòng"}</p><p>File lịch (.ics) đính kèm. Anh Ngọc sẽ confirm slot và gửi link Zoom (nếu online) trong 4 giờ.</p>`);
    const internalHtml = wrap(`<h1 style="font-family:Georgia,serif">Booking mới</h1><p><strong>${data.full_name}</strong> · ${data.email} · ${data.phone}</p><p>${data.company ?? ""}</p><p><strong>${date}</strong> — ${data.service} (${data.meeting_type})</p>${data.message ? `<blockquote>${data.message}</blockquote>` : ""}`);

    const attachments = [{ filename: "n-d-tu-van.ics", content: icsBase64, contentType: "text/calendar" }];

    await Promise.allSettled([
      sendEmail(env, { to: data.email, subject: "Xác nhận lịch tư vấn NHN&D Tax Advisory", html: customerHtml, attachments }),
      sendEmail(env, {
        to: env.RESEND_NOTIFY_EMAIL ?? "hello@ndtax.vn",
        subject: `[Booking] ${date} — ${data.full_name}`,
        html: internalHtml,
        attachments,
        replyTo: data.email,
      }),
    ]);

    return json({ ok: true, bookingId: booking.id });
  } catch (err) {
    console.error("[booking-fn]", err);
    return json({ ok: false, error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
};
