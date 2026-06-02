import { requireAuth } from "../../../_lib/auth";
import {
  resolveEmailProvider,
  sendEmail,
  type EmailEnv,
} from "../../../_lib/email";

interface Env extends EmailEnv {
  ADMIN_JWT_SECRET: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  if (resolveEmailProvider(env) !== "gmail_smtp") {
    return json(
      {
        ok: false,
        error: "Set EMAIL_PROVIDER=gmail_smtp before testing Gmail SMTP.",
      },
      400,
    );
  }

  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const to = normalizeEmail(body.to) || normalizeEmail(env.SMTP_USER);
  if (!to) {
    return json(
      {
        ok: false,
        error: "Provide a valid test recipient or set SMTP_USER.",
      },
      400,
    );
  }

  const result = await sendEmail(env, {
    to,
    subject: "NHN&D Gmail SMTP test",
    category: "transactional",
    html: `<!DOCTYPE html><html lang="vi"><body><p>Gmail SMTP test thanh cong tu Cloudflare Pages Function.</p><p>${new Date().toISOString()}</p></body></html>`,
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: result.error,
        provider: result.provider,
        runtime: result.runtime,
      },
      500,
    );
  }

  return json({
    ok: true,
    provider: result.provider,
    runtime: result.runtime,
    delivery_status: result.status,
    message_id: result.messageId,
    accepted: result.accepted ?? [to],
    rejected: result.rejected ?? [],
  });
};
