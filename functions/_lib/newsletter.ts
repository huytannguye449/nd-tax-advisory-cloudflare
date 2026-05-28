import { sendEmail } from "./email";

interface NewsletterPost {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
}

interface Subscriber {
  email: string;
  unsub_token: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absoluteUrl(siteUrl: string, value: string | null) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith("/") ? "" : "/"}${value}`;
}

export function publicationNewsletterEmail(args: {
  siteUrl: string;
  post: NewsletterPost;
  subscriber: Subscriber;
}) {
  const postUrl = `${args.siteUrl}/an-pham/${args.post.slug}`;
  const unsubUrl = `${args.siteUrl}/unsubscribe?token=${encodeURIComponent(
    args.subscriber.unsub_token,
  )}`;
  const coverUrl = absoluteUrl(args.siteUrl, args.post.cover_url);
  const title = escapeHtml(args.post.title);
  const excerpt = args.post.excerpt ? escapeHtml(args.post.excerpt) : "";

  return `<!DOCTYPE html><html lang="vi"><body style="margin:0;background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46"><div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #F0EBDD"><div style="padding:28px 32px;border-bottom:1px solid #F0EBDD"><p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9B7A2F">NHN&D Tax Advisory</p></div>${coverUrl ? `<img src="${coverUrl}" alt="" style="display:block;width:100%;max-height:320px;object-fit:cover">` : ""}<div style="padding:32px"><p style="margin:0 0 14px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9B7A2F">An pham moi</p><h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.2;margin:0 0 16px;color:#0F2B46">${title}</h1>${excerpt ? `<p style="font-size:16px;line-height:1.7;margin:0 0 28px;color:#486581">${excerpt}</p>` : ""}<a href="${postUrl}" style="display:inline-block;background:#0F2B46;color:#FAF7F0;text-decoration:none;padding:14px 22px;font-weight:600">Doc an pham</a><p style="margin:32px 0 0;font-size:12px;color:#486581">Ban nhan email nay vi da dang ky nhan an pham tu NHN&D. <a href="${unsubUrl}" style="color:#486581">Huy dang ky</a></p></div></div></div></body></html>`;
}

export async function sendNewsletterEmail(
  env: {
    EMAIL_PROVIDER?: string;
    EMAIL_AUTOMATION_DISABLED?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
  },
  args: {
    to: string;
    subject: string;
    html: string;
  },
) {
  return sendEmail(env, {
    ...args,
    category: "newsletter",
  });
}
