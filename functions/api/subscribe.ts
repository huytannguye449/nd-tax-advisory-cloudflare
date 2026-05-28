/**
 * POST /api/subscribe - newsletter subscription.
 */

import { z } from "zod";
import { sendEmail } from "../_lib/email";
import { adminSupabase } from "../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  EMAIL_PROVIDER?: string;
  EMAIL_AUTOMATION_DISABLED?: string;
  RESEND_API_KEY?: string;
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
  if (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  return {};
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function welcomeEmail(siteUrl: string, token: string) {
  const unsubUrl = `${siteUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
  return `<!DOCTYPE html><html lang="vi"><body style="margin:0;background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46"><div style="max-width:640px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #F0EBDD;padding:40px"><p style="margin:0 0 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9B7A2F">NHN&D Tax Advisory</p><h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 16px">Cam on ban da dang ky.</h1><p style="font-size:15px;line-height:1.7;margin:0 0 24px">Cac an pham moi ve thue, quan tri va van hanh doanh nghiep se duoc gui truc tiep toi email cua ban.</p><p style="margin:0"><a href="${siteUrl}/an-pham" style="display:inline-block;background:#0F2B46;color:#FAF7F0;text-decoration:none;padding:12px 20px;font-weight:600">Xem an pham</a></p><p style="margin:32px 0 0;font-size:12px;color:#486581"><a href="${unsubUrl}" style="color:#486581">Huy dang ky</a></p></div></div></body></html>`;
}

async function sendWelcome(
  env: Env,
  args: { email: string; token: string; siteUrl: string },
) {
  const result = await sendEmail(env, {
    to: args.email,
    subject: "Chao mung ban den voi NHN&D Insights",
    html: welcomeEmail(args.siteUrl, args.token),
  });
  if (!result.ok) console.error("[subscribe-email]", result.error);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await readBody(request);
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return json({ ok: false, error: "Email khong hop le" }, { status: 400 });
    }

    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      return json(
        { ok: false, error: "Thieu cau hinh server de luu subscriber" },
        { status: 500 },
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const source = parsed.data.source?.trim() || null;
    const siteUrl = new URL(request.url).origin;
    const supabase = adminSupabase(env);

    const { data: existing, error: lookupError } = await supabase
      .from("subscribers")
      .select("id, status, unsub_token")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      console.error("[subscribe-lookup]", lookupError);
      return json({ ok: false, error: "Khong luu duoc" }, { status: 500 });
    }

    if (existing?.status === "active") {
      return json({ ok: true, alreadySubscribed: true });
    }

    const token = existing?.unsub_token || crypto.randomUUID();
    if (existing) {
      const { error } = await supabase
        .from("subscribers")
        .update({
          status: "active",
          source,
          subscribed_at: new Date().toISOString(),
          unsub_token: token,
        })
        .eq("id", existing.id);
      if (error) {
        console.error("[subscribe-resubscribe]", error);
        return json({ ok: false, error: "Khong luu duoc" }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from("subscribers").insert({
        email,
        source,
        status: "active",
        unsub_token: token,
      });
      if (error) {
        console.error("[subscribe-insert]", error);
        return json({ ok: false, error: "Khong luu duoc" }, { status: 500 });
      }
    }

    await sendWelcome(env, { email, token, siteUrl });
    return json({ ok: true });
  } catch (err) {
    console.error("[subscribe-fn]", err);
    return json({ ok: false, error: "Da co loi xay ra" }, { status: 500 });
  }
};
