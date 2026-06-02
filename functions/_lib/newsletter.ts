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
    .normalize("NFC")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailText(value: string) {
  return escapeHtml(value.normalize("NFC"));
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
  const fontStack =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif";

  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head><body style="margin:0;background:#FAF7F0;font-family:${fontStack};color:#0F2B46"><div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #F0EBDD"><div style="padding:28px 32px;border-bottom:1px solid #F0EBDD"><p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9B7A2F">NHN&amp;D Tax Advisory</p></div>${coverUrl ? `<img src="${coverUrl}" alt="" style="display:block;width:100%;max-height:320px;object-fit:cover">` : ""}<div style="padding:32px"><p style="margin:0 0 14px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9B7A2F">${emailText("Ấn phẩm mới")}</p><h1 style="font-family:${fontStack};font-size:30px;line-height:1.25;margin:0 0 16px;color:#0F2B46;font-weight:700;letter-spacing:0">${title}</h1>${excerpt ? `<p style="font-size:16px;line-height:1.7;margin:0 0 28px;color:#486581">${excerpt}</p>` : ""}<a href="${postUrl}" style="display:inline-block;background:#0F2B46;color:#FAF7F0;text-decoration:none;padding:14px 22px;font-weight:600">${emailText("Đọc ấn phẩm")}</a><p style="margin:32px 0 0;font-size:12px;color:#486581">${emailText("Bạn nhận email này vì đã đăng ký nhận ấn phẩm từ NHN&D.")} <a href="${unsubUrl}" style="color:#486581">${emailText("Hủy đăng ký")}</a></p></div></div></div></body></html>`;
}

export async function sendNewsletterEmail(
  env: {
    EMAIL_PROVIDER?: string;
    EMAIL_AUTOMATION_DISABLED?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_SECURE?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM_EMAIL?: string;
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
