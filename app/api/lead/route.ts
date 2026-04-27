import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validators";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, NOTIFY_EMAIL } from "@/lib/resend";
import { leadNotifyEmail, leadAutoReplyEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = leadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    // Captcha
    const ip = req.headers.get("x-forwarded-for") ?? undefined;
    const captchaOk = await verifyTurnstile(data.turnstileToken, ip);
    if (!captchaOk) {
      return NextResponse.json(
        { ok: false, error: "Xác thực captcha thất bại — vui lòng thử lại" },
        { status: 403 },
      );
    }

    // Insert
    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      company_size: data.company_size ?? null,
      services: data.services?.length ? data.services : null,
      message: data.message || null,
      source: data.source ?? "lien-he",
      ip_address: ip ?? null,
      user_agent: req.headers.get("user-agent"),
    });
    if (error) {
      console.error("[lead-insert]", error);
      return NextResponse.json({ ok: false, error: "Không thể lưu yêu cầu" }, { status: 500 });
    }

    // Emails (don't block response on these — fire and forget)
    const notify = leadNotifyEmail(data);
    const autoReply = leadAutoReplyEmail({ full_name: data.full_name });

    await Promise.allSettled([
      sendEmail({ to: NOTIFY_EMAIL, subject: notify.subject, html: notify.html, text: notify.text, replyTo: data.email }),
      sendEmail({ to: data.email, subject: autoReply.subject, html: autoReply.html, text: autoReply.text }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead-route]", err);
    return NextResponse.json({ ok: false, error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
