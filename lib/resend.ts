/**
 * Resend email helper.
 *
 * Server-side Resend helper for Next/server code. Pages Functions use
 * functions/_lib/email.ts.
 */

import { Resend } from "resend";

const provider = (process.env.EMAIL_PROVIDER || "mock").trim().toLowerCase();
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "";
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
  if (provider !== "resend") {
    console.log("[email-mock-send]", { to: args.to, subject: args.subject });
    return { ok: true, id: "mock" };
  }
  if (!resend) {
    return { ok: false, error: "EMAIL_PROVIDER=resend requires RESEND_API_KEY" };
  }
  if (!FROM_EMAIL) {
    return { ok: false, error: "EMAIL_PROVIDER=resend requires RESEND_FROM_EMAIL" };
  }
  try {
    const result = await resend.emails.send({
      from: `NHN&D Tax Advisory <${FROM_EMAIL}>`,
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
