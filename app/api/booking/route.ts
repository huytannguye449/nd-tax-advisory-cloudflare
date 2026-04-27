import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validators";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, NOTIFY_EMAIL } from "@/lib/resend";
import { bookingConfirmEmail, bookingNotifyEmail } from "@/lib/email-templates";
import { generateIcs } from "@/lib/ics";
import { SITE } from "@/lib/utils";

export const runtime = "edge";

const randomUUID = () => crypto.randomUUID();

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const ip = req.headers.get("x-forwarded-for") ?? undefined;
    const captchaOk = await verifyTurnstile(data.turnstileToken, ip);
    if (!captchaOk) {
      return NextResponse.json(
        { ok: false, error: "Xác thực captcha thất bại" },
        { status: 403 },
      );
    }

    const scheduledAt = new Date(data.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "Thời gian không hợp lệ" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Slot conflict check
    const slotEnd = new Date(scheduledAt.getTime() + 30 * 60_000);
    const { data: conflict } = await supabase
      .from("bookings")
      .select("id")
      .gte("scheduled_at", scheduledAt.toISOString())
      .lt("scheduled_at", slotEnd.toISOString())
      .in("status", ["pending", "confirmed"])
      .maybeSingle();

    if (conflict) {
      return NextResponse.json(
        { ok: false, error: "Slot này đã có người đặt — vui lòng chọn slot khác" },
        { status: 409 },
      );
    }

    const icsUid = `${randomUUID()}@ndtax.vn`;

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        service: data.service,
        scheduled_at: scheduledAt.toISOString(),
        meeting_type: data.meeting_type,
        message: data.message || null,
        ics_uid: icsUid,
      })
      .select("id, ics_uid")
      .single();

    if (error || !booking) {
      console.error("[booking-insert]", error);
      return NextResponse.json({ ok: false, error: "Không thể tạo lịch hẹn" }, { status: 500 });
    }

    const ics = generateIcs({
      uid: icsUid,
      startUtc: scheduledAt,
      durationMin: 30,
      summary: `Tư vấn ${SITE.name} — ${data.service}`,
      description: `Buổi tư vấn 30 phút với ${SITE.founder}.\n\nDịch vụ: ${data.service}\nKhách: ${data.full_name}\nSĐT: ${data.phone}\n\n${data.message ?? ""}`,
      location: data.meeting_type === "online" ? "Online (link sẽ được gửi sau)" : SITE.address,
      organizerEmail: NOTIFY_EMAIL,
      organizerName: SITE.name,
      attendeeEmail: data.email,
      attendeeName: data.full_name,
    });

    // Edge-compatible base64 encoding
    const icsBytes = new TextEncoder().encode(ics);
    let binary = "";
    for (let i = 0; i < icsBytes.length; i++) binary += String.fromCharCode(icsBytes[i]);
    const icsBase64 = btoa(binary);
    const icsAttachment = {
      filename: "n-d-tu-van.ics",
      content: icsBase64,
      contentType: "text/calendar",
    };

    const customerTpl = bookingConfirmEmail({
      full_name: data.full_name,
      scheduled_at: scheduledAt.toISOString(),
      service: data.service,
      meeting_type: data.meeting_type,
    });
    const internalTpl = bookingNotifyEmail({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      scheduled_at: scheduledAt.toISOString(),
      message: data.message,
    });

    await Promise.allSettled([
      sendEmail({
        to: data.email,
        subject: customerTpl.subject,
        html: customerTpl.html,
        text: customerTpl.text,
        attachments: [icsAttachment],
      }),
      sendEmail({
        to: NOTIFY_EMAIL,
        subject: internalTpl.subject,
        html: internalTpl.html,
        text: internalTpl.text,
        replyTo: data.email,
        attachments: [icsAttachment],
      }),
    ]);

    return NextResponse.json({ ok: true, bookingId: booking.id, icsUid });
  } catch (err) {
    console.error("[booking-route]", err);
    return NextResponse.json({ ok: false, error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
