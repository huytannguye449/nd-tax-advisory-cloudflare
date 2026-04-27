/**
 * Resend email helper.
 *
 * If RESEND_API_KEY is not configured (Phase 1 dev mode), email sends are
 * logged to console and skipped. Hot-swap by adding the env var.
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@ndtax.vn";
export const NOTIFY_EMAIL = process.env.RESEND_NOTIFY_EMAIL || "hello@ndtax.vn";

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: { filename: string; content: string | Buffer; contentType?: string }[];
}

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.log("[email-mock] would send:", { to: args.to, subject: args.subject });
    return { ok: true, id: "mock" };
  }
  try {
    const result = await resend.emails.send({
      from: `N&D Tax Advisory <${FROM_EMAIL}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
      attachments: args.attachments,
    });
    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true, id: result.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Email send failed";
    console.error("[email-error]", msg);
    return { ok: false, error: msg };
  }
}

export async function addToAudience(email: string): Promise<{ ok: boolean; id?: string }> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!resend || !audienceId) {
    console.log("[audience-mock] would add:", email);
    return { ok: true, id: "mock" };
  }
  try {
    const result = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error("[audience-error]", err);
    return { ok: false };
  }
}
