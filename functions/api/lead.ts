/**
 * POST /api/lead — Cloudflare Pages Function
 * Validate + insert vào Supabase + gửi email notify + auto-reply
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

const leadSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(PHONE_VN),
  company: z.string().max(200).optional().or(z.literal("")),
  company_size: z.enum(["<10", "10-50", "50-200", ">200"]).optional(),
  services: z.array(z.string()).max(10).optional(),
  meeting_type: z.enum(["online", "offline"]).default("online"),
  meeting_link: z.string().max(500).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().max(100).optional(),
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

function nullableText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function verifyTurnstile(token: string, secret: string | undefined, ip: string | null) {
  if (!secret) return true;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function sendEmail(env: Env, args: { to: string; subject: string; html: string; replyTo?: string }) {
  const result = await deliverEmail(env, {
    ...args,
    category: "transactional",
  });
  if (!result.ok) console.error("[lead-email]", result.error);
}

const wrap = (body: string) => `<!DOCTYPE html><html lang="vi"><body style="background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46;padding:32px;margin:0"><div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:48px 40px;border:1px solid #F0EBDD;box-shadow:0 1px 3px rgba(15,43,70,0.06)"><div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #F0EBDD"><div style="font-family:Georgia,serif;font-size:56px;font-weight:700;line-height:1;letter-spacing:-2px">NHN<span style="color:#C9A961;margin:0 4px">&amp;</span>D</div><div style="font-size:13px;letter-spacing:5px;margin-top:8px;font-weight:600">TAX ADVISORY</div></div>${body}<div style="margin-top:32px;padding-top:24px;border-top:1px solid #F0EBDD;text-align:center;font-size:12px;color:#486581"><p style="margin:0">Công ty TNHH Tư vấn thuế NHN&D · Hà Nội, Việt Nam</p><p style="margin:6px 0 0">Hoaingoc.sa@gmail.com · 0986 032 472</p></div></div></body></html>`;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    if (typeof raw.phone === "string") raw.phone = normalizePhone(raw.phone);

    const data = leadSchema.safeParse(raw);
    if (!data.success) {
      return json({ ok: false, error: data.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    const lead = data.data;

    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for");
    const captchaOk = await verifyTurnstile(lead.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!captchaOk) return json({ ok: false, error: "Captcha thất bại" }, { status: 403 });

    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[lead-config] Missing SUPABASE_SERVICE_ROLE_KEY");
      return json({ ok: false, error: "Thiếu cấu hình server để lưu lead" }, { status: 500 });
    }

    const supabase = adminSupabase(env);
    const { error } = await supabase.from("leads").insert({
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || null,
      company_size: lead.company_size ?? null,
      services: lead.services?.length ? lead.services : null,
      meeting_type: lead.meeting_type,
      meeting_link: nullableText(lead.meeting_link),
      message: lead.message || null,
      source: lead.source ?? "lien-he",
      ip_address: ip,
      user_agent: request.headers.get("user-agent"),
    });
    if (error) {
      console.error("[lead-insert]", error);
      return json({ ok: false, error: "Không lưu được" }, { status: 500 });
    }

    const notifyTo = env.RESEND_NOTIFY_EMAIL ?? "hello@ndtax.vn";
    const tableRows = `
      <tr><td style="background:#F0EBDD;font-weight:600;width:140px;padding:8px">Họ tên</td><td style="padding:8px">${lead.full_name}</td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600;padding:8px">Email</td><td style="padding:8px">${lead.email}</td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600;padding:8px">SĐT</td><td style="padding:8px">${lead.phone}</td></tr>
      ${lead.company ? `<tr><td style="background:#F0EBDD;font-weight:600;padding:8px">Công ty</td><td style="padding:8px">${lead.company}</td></tr>` : ""}
      ${lead.services?.length ? `<tr><td style="background:#F0EBDD;font-weight:600;padding:8px">Dịch vụ</td><td style="padding:8px">${lead.services.join(", ")}</td></tr>` : ""}
      <tr><td style="background:#F0EBDD;font-weight:600;padding:8px">Hình thức</td><td style="padding:8px">${lead.meeting_type === "online" ? "Trực tuyến" : "Trực tiếp"}</td></tr>
    `;
    const notifyHtml = wrap(`
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:24px 0 16px">Có lead mới từ website</h1>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table>
      ${lead.message ? `<div style="margin-top:20px;padding:16px;background:#FAF7F0;border-left:3px solid #C9A961"><strong>Lời nhắn:</strong><br>${lead.message.replace(/\n/g, "<br>")}</div>` : ""}
    `);
    const replyHtml = wrap(`
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:24px 0 16px">Cảm ơn ${lead.full_name}.</h1>
      <p style="font-size:15px;line-height:1.7">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng <strong>4 giờ làm việc</strong> (T2-T6, 9h-18h).</p>
      <p style="font-size:15px">Trân trọng,<br><strong>Anh Ngọc</strong><br>Founder &amp; CEO, NHN&amp;D Tax Advisory</p>
    `);

    await Promise.allSettled([
      sendEmail(env, { to: notifyTo, subject: `[Lead mới] ${lead.full_name}`, html: notifyHtml, replyTo: lead.email }),
      sendEmail(env, { to: lead.email, subject: "Cảm ơn bạn đã liên hệ NHN&D Tax Advisory", html: replyHtml }),
    ]);

    return json({ ok: true });
  } catch (err) {
    console.error("[lead-fn]", err);
    return json({ ok: false, error: "Đã có lỗi xảy ra" }, { status: 500 });
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
