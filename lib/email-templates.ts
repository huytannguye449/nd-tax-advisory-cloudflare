/**
 * Email template HTML generators (inline-styled for max client compat).
 * Keep simple — no React Email needed for Phase 1.
 */

import { SITE } from "./utils";

const wrap = (title: string, body: string) => `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F2B46;line-height:1.6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:32px 16px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(15,43,70,0.08)">
      <tr><td style="padding:24px 32px;background:#0F2B46;color:#FAF7F0;text-align:center">
        <span style="font-family:Georgia,serif;font-size:24px;font-weight:700">N<span style="color:#C9A961">&amp;</span>D</span>
        <div style="font-size:11px;letter-spacing:3px;margin-top:2px">TAX ADVISORY</div>
      </td></tr>
      <tr><td style="padding:32px">${body}</td></tr>
      <tr><td style="padding:24px 32px;background:#F0EBDD;color:#0F2B46;font-size:12px;text-align:center">
        <p style="margin:0">${SITE.name} · ${SITE.address}</p>
        <p style="margin:6px 0 0">${SITE.email} · ${SITE.phone}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

export function leadNotifyEmail(lead: {
  full_name: string;
  email: string;
  phone: string;
  company?: string | null;
  company_size?: string | null;
  services?: string[] | null;
  message?: string | null;
  source?: string | null;
}): { subject: string; html: string; text: string } {
  const subject = `[Lead mới] ${lead.full_name} — ${lead.company || "Cá nhân"}`;
  const body = `
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 20px;color:#0F2B46">Có lead mới từ website</h1>
    <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="background:#F0EBDD;font-weight:600;width:140px">Họ tên</td><td>${lead.full_name}</td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600">Email</td><td><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600">SĐT</td><td><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
      ${lead.company ? `<tr><td style="background:#F0EBDD;font-weight:600">Công ty</td><td>${lead.company}</td></tr>` : ""}
      ${lead.company_size ? `<tr><td style="background:#F0EBDD;font-weight:600">Quy mô</td><td>${lead.company_size}</td></tr>` : ""}
      ${lead.services?.length ? `<tr><td style="background:#F0EBDD;font-weight:600">Dịch vụ</td><td>${lead.services.join(", ")}</td></tr>` : ""}
      ${lead.source ? `<tr><td style="background:#F0EBDD;font-weight:600">Nguồn</td><td>${lead.source}</td></tr>` : ""}
    </table>
    ${lead.message ? `<div style="margin-top:20px;padding:16px;background:#FAF7F0;border-left:3px solid #C9A961;font-size:14px"><strong>Lời nhắn:</strong><br>${lead.message.replace(/\n/g, "<br>")}</div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#486581">Vui lòng phản hồi trong vòng 4 giờ làm việc.</p>
  `;
  const text = `Lead mới: ${lead.full_name} (${lead.email}, ${lead.phone}). Công ty: ${lead.company || "—"}. ${lead.message || ""}`;
  return { subject, html: wrap(subject, body), text };
}

export function leadAutoReplyEmail(lead: {
  full_name: string;
}): { subject: string; html: string; text: string } {
  const subject = "Cảm ơn bạn đã liên hệ với N&D Tax Advisory";
  const body = `
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:#0F2B46">Cảm ơn bạn, ${lead.full_name}.</h1>
    <p style="font-size:15px;line-height:1.7">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng <strong>4 giờ làm việc</strong> (T2-T6, 9h-18h).</p>
    <p style="font-size:15px;line-height:1.7">Trong thời gian chờ, bạn có thể:</p>
    <ul style="font-size:15px;line-height:1.8">
      <li><a href="${SITE.url}/dat-lich" style="color:#C9A961;font-weight:600">Đặt lịch tư vấn miễn phí 45 phút</a> — chọn slot phù hợp với bạn</li>
      <li><a href="${SITE.url}/kien-thuc" style="color:#C9A961;font-weight:600">Đọc blog kiến thức thuế</a> — insights cập nhật hàng tuần</li>
      <li><a href="${SITE.url}/dich-vu" style="color:#C9A961;font-weight:600">Xem dịch vụ chi tiết</a></li>
    </ul>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #F0EBDD;font-size:14px;color:#486581">
      <p style="margin:0 0 8px">Trân trọng,</p>
      <p style="margin:0;font-weight:600;color:#0F2B46">Anh Ngọc</p>
      <p style="margin:0">Founder &amp; CEO, N&amp;D Tax Advisory</p>
    </div>
  `;
  const text = `Cảm ơn ${lead.full_name}. Chúng tôi sẽ phản hồi trong 4 giờ làm việc.`;
  return { subject, html: wrap(subject, body), text };
}

export function bookingConfirmEmail(booking: {
  full_name: string;
  scheduled_at: string;
  service: string;
  meeting_type: string;
  meeting_link?: string | null;
}): { subject: string; html: string; text: string } {
  const subject = "Xác nhận lịch tư vấn tại N&D Tax Advisory";
  const date = new Date(booking.scheduled_at);
  const dateStr = date.toLocaleString("vi-VN", { dateStyle: "full", timeStyle: "short" });
  const body = `
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:#0F2B46">Lịch hẹn của bạn đã được ghi nhận</h1>
    <p style="font-size:15px">Cảm ơn ${booking.full_name}, chúng tôi đã nhận được yêu cầu đặt lịch tư vấn của bạn.</p>
    <div style="margin:24px 0;padding:20px;background:#FAF7F0;border-left:4px solid #C9A961;border-radius:4px">
      <p style="margin:0 0 6px;font-size:13px;color:#486581;text-transform:uppercase;letter-spacing:1.5px">Chi tiết lịch hẹn</p>
      <p style="margin:6px 0;font-size:16px"><strong>Thời gian:</strong> ${dateStr}</p>
      <p style="margin:6px 0;font-size:16px"><strong>Dịch vụ:</strong> ${booking.service}</p>
      <p style="margin:6px 0;font-size:16px"><strong>Hình thức:</strong> ${booking.meeting_type === "online" ? "Trực tuyến" : "Tại văn phòng"}</p>
      ${booking.meeting_link ? `<p style="margin:6px 0;font-size:16px"><strong>Link họp:</strong> <a href="${booking.meeting_link}" style="color:#C9A961">${booking.meeting_link}</a></p>` : ""}
    </div>
    <p style="font-size:15px">Anh Ngọc sẽ xác nhận lịch và gửi link Zoom/Meet (nếu online) trong vòng <strong>4 giờ làm việc</strong>.</p>
    <p style="font-size:15px">File lịch (.ics) đính kèm — bạn có thể thêm ngay vào Google Calendar / Outlook.</p>
    <p style="font-size:14px;color:#486581;margin-top:24px">Cần đổi lịch? Vui lòng reply email này hoặc gọi ${SITE.phone}.</p>
  `;
  const text = `Đã ghi nhận lịch hẹn ngày ${dateStr} cho dịch vụ ${booking.service}. Anh Ngọc sẽ confirm trong 4 giờ.`;
  return { subject, html: wrap(subject, body), text };
}

export function bookingNotifyEmail(booking: {
  full_name: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  scheduled_at: string;
  message?: string | null;
}): { subject: string; html: string; text: string } {
  const date = new Date(booking.scheduled_at).toLocaleString("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const subject = `[Booking mới] ${date} — ${booking.full_name}`;
  const body = `
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 20px;color:#0F2B46">Khách đặt lịch tư vấn</h1>
    <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="background:#F0EBDD;font-weight:600;width:140px">Khách hàng</td><td>${booking.full_name}</td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600">Email</td><td><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600">SĐT</td><td><a href="tel:${booking.phone}">${booking.phone}</a></td></tr>
      ${booking.company ? `<tr><td style="background:#F0EBDD;font-weight:600">Công ty</td><td>${booking.company}</td></tr>` : ""}
      <tr><td style="background:#F0EBDD;font-weight:600">Dịch vụ</td><td>${booking.service}</td></tr>
      <tr><td style="background:#F0EBDD;font-weight:600">Thời gian</td><td><strong>${date}</strong></td></tr>
    </table>
    ${booking.message ? `<div style="margin-top:20px;padding:16px;background:#FAF7F0;border-left:3px solid #C9A961;font-size:14px"><strong>Ghi chú:</strong><br>${booking.message.replace(/\n/g, "<br>")}</div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#486581">Vui lòng confirm slot trong admin panel hoặc reply email khách hàng.</p>
  `;
  const text = `Booking: ${booking.full_name} - ${date} - ${booking.service}`;
  return { subject, html: wrap(subject, body), text };
}

export function newsletterWelcomeEmail(unsubToken: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Chào mừng bạn đến với N&D Insights";
  const unsubUrl = `${SITE.url}/api/unsubscribe?token=${unsubToken}`;
  const body = `
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Cảm ơn bạn đã đăng ký.</h1>
    <p style="font-size:15px">Mỗi tuần, bạn sẽ nhận một bài viết về thuế chiến lược, cập nhật chính sách, và case study thực tế — biên soạn bởi đội ngũ N&D.</p>
    <p style="font-size:15px">Số đầu tiên sẽ đến trong tuần này.</p>
    <div style="margin-top:32px;text-align:center">
      <a href="${SITE.url}/kien-thuc" style="display:inline-block;background:#0F2B46;color:#FAF7F0;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600">Đọc bài viết mới nhất</a>
    </div>
    <p style="margin-top:32px;font-size:12px;color:#486581;text-align:center"><a href="${unsubUrl}" style="color:#486581">Hủy đăng ký</a></p>
  `;
  const text = `Chào mừng. Bạn đã đăng ký newsletter N&D. Hủy: ${unsubUrl}`;
  return { subject, html: wrap(subject, body), text };
}
