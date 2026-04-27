/**
 * POST /api/subscribe — Cloudflare Pages Function
 * Newsletter subscription
 */

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
  RESEND_FROM_EMAIL?: string;
}

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional(),
});

const json = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

async function readBody(request: Request) {
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) return request.json();
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  return {};
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await readBody(request);
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return json({ ok: false, error: "Email không hợp lệ" }, { status: 400 });
    }
    const { email, source } = parsed.data;

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, status, unsub_token")
      .eq("email", email)
      .maybeSingle();

    if (existing && existing.status === "active") {
      return json({ ok: true, alreadySubscribed: true });
    }

    if (!existing) {
      await supabase.from("subscribers").insert({
        email,
        source: source ?? null,
        status: "pending",
      });
    }

    if (env.RESEND_API_KEY) {
      const welcome = `<!DOCTYPE html><html lang="vi"><body style="background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46;padding:32px;margin:0"><div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:48px 40px;border:1px solid #F0EBDD"><div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #F0EBDD"><div style="font-family:Georgia,serif;font-size:56px;font-weight:700;line-height:1;letter-spacing:-2px">N<span style="color:#C9A961;margin:0 4px">&amp;</span>D</div><div style="font-size:13px;letter-spacing:5px;margin-top:8px;font-weight:600">TAX ADVISORY</div></div><h1 style="font-family:Georgia,serif;font-size:24px;margin:24px 0 16px">Cảm ơn bạn đã đăng ký.</h1><p style="font-size:15px;line-height:1.7">Mỗi tuần, bạn sẽ nhận một bài viết về thuế chiến lược, cập nhật chính sách, và case study thực tế — biên soạn bởi đội ngũ NHN&D.</p><p style="font-size:15px;margin-top:24px">Số đầu tiên sẽ đến trong tuần này.</p></div></body></html>`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `N&D Tax Advisory <${env.RESEND_FROM_EMAIL ?? "noreply@ndtax.vn"}>`,
          to: email,
          subject: "Chào mừng đến N&D Insights",
          html: welcome,
        }),
      });
    } else {
      console.log("[email-mock] welcome →", email);
    }

    await supabase.from("subscribers").update({ status: "active" }).eq("email", email);

    return json({ ok: true });
  } catch (err) {
    console.error("[subscribe-fn]", err);
    return json({ ok: false, error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
};
