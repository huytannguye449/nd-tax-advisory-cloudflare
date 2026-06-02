/**
 * POST /api/booking - consultation request flow.
 * Creates a pending booking request. Admin confirms the actual schedule later.
 */

import { z } from "zod";
import { sendEmail as deliverEmail } from "../_lib/email";
import { adminSupabase } from "../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  EMAIL_PROVIDER?: string;
  EMAIL_AUTOMATION_DISABLED?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_NOTIFY_EMAIL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const PHONE_VN = /^(\+84|0)\d{9,10}$/;
const CONSENT_MESSAGE =
  "Vui lòng xác nhận rằng bạn đã đọc và đồng ý với Điều khoản và Chính sách bảo mật.";

const bookingRequestSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(PHONE_VN),
  company: z.string().max(200).optional().or(z.literal("")),
  services: z.array(z.string().trim().min(1)).min(1).max(10),
  meeting_type: z.enum(["online", "offline"]).default("online"),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: z.boolean().refine((value) => value === true, {
    message: CONSENT_MESSAGE,
  }),
  turnstileToken: z.string().min(1),
});

const json = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

function normalizePhone(phone: string) {
  return phone.trim().replace(/[\s.-]/g, "");
}

async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  ip: string | null,
) {
  if (!secret) return true;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function sendEmail(
  env: Env,
  args: { to: string; subject: string; html: string; replyTo?: string },
) {
  const result = await deliverEmail(env, {
    ...args,
    category: "transactional",
  });
  if (!result.ok) console.error("[booking-email]", result.error);
}

const wrap = (body: string) =>
  `<!DOCTYPE html><html lang="vi"><body style="background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46;padding:32px;margin:0"><div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:48px 40px;border:1px solid #F0EBDD;box-shadow:0 1px 3px rgba(15,43,70,0.06)"><div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #F0EBDD"><div style="font-family:Georgia,serif;font-size:56px;font-weight:700;line-height:1;letter-spacing:-2px">NHN<span style="color:#C9A961;margin:0 4px">&amp;</span>D</div><div style="font-size:13px;letter-spacing:5px;margin-top:8px;font-weight:600">TAX ADVISORY</div></div>${body}<div style="margin-top:32px;padding-top:24px;border-top:1px solid #F0EBDD;text-align:center;font-size:12px;color:#486581"><p style="margin:0">Công ty TNHH Tư vấn thuế NHN&D · Hà Nội, Việt Nam</p><p style="margin:6px 0 0">Hoaingoc.sa@gmail.com · 0986 032 472</p></div></div></body></html>`;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    if (typeof raw.phone === "string") raw.phone = normalizePhone(raw.phone);

    const parsed = bookingRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
        },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for");
    const captchaOk = await verifyTurnstile(
      data.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      ip,
    );
    if (!captchaOk) {
      return json({ ok: false, error: "Captcha thất bại" }, { status: 403 });
    }

    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[booking-request-config] Missing SUPABASE_SERVICE_ROLE_KEY");
      return json(
        { ok: false, error: "Thiếu cấu hình server để tạo yêu cầu tư vấn" },
        { status: 500 },
      );
    }

    const supabase = adminSupabase(env);
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        service: data.services[0] ?? null,
        services: data.services,
        scheduled_at: null,
        meeting_type: data.meeting_type,
        meeting_link: null,
        message: data.message || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !booking) {
      console.error("[booking-request-insert]", error);
      return json(
        { ok: false, error: "Không tạo được yêu cầu tư vấn" },
        { status: 500 },
      );
    }

    const meetingType =
      data.meeting_type === "online" ? "Trực tuyến" : "Trực tiếp";
    const services = data.services.join(", ");
    const internalHtml = wrap(`
      <h1 style="font-family:Georgia,serif">Yêu cầu tư vấn mới</h1>
      <p><strong>${data.full_name}</strong> · ${data.email} · ${data.phone}</p>
      ${data.company ? `<p>${data.company}</p>` : ""}
      <p><strong>Dịch vụ:</strong> ${services}<br><strong>Hình thức mong muốn:</strong> ${meetingType}</p>
      ${data.message ? `<blockquote>${data.message.replace(/\n/g, "<br>")}</blockquote>` : ""}
    `);
    const customerHtml = wrap(`
      <h1 style="font-family:Georgia,serif">Đã ghi nhận yêu cầu tư vấn của bạn</h1>
      <p>Cảm ơn ${data.full_name}. Đội ngũ NHN&D đã nhận được thông tin và sẽ liên hệ lại để chốt lịch phù hợp.</p>
      <p><strong>Dịch vụ:</strong> ${services}<br><strong>Hình thức mong muốn:</strong> ${meetingType}</p>
      <p>Trân trọng,<br><strong>NHN&D Tax Advisory</strong></p>
    `);

    await Promise.allSettled([
      sendEmail(env, {
        to: env.RESEND_NOTIFY_EMAIL ?? "hello@ndtax.vn",
        subject: `[Yêu cầu tư vấn] ${data.full_name}`,
        html: internalHtml,
        replyTo: data.email,
      }),
      sendEmail(env, {
        to: data.email,
        subject: "NHN&D đã ghi nhận yêu cầu tư vấn của bạn",
        html: customerHtml,
      }),
    ]);

    return json({ ok: true, bookingId: booking.id });
  } catch (err) {
    console.error("[booking-request-fn]", err);
    return json(
      { ok: false, error: "Đã có lỗi xảy ra" },
      { status: 500 },
    );
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
