import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { subscribeSchema } from "@/lib/validators";
import { sendEmail, addToAudience } from "@/lib/resend";
import { newsletterWelcomeEmail } from "@/lib/email-templates";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = subscribeSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Email không hợp lệ" },
        { status: 400 },
      );
    }
    const { email, source } = parsed.data;

    const supabase = await createClient();

    // Upsert by email
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, status, unsub_token")
      .eq("email", email)
      .maybeSingle();

    let unsubToken: string;

    if (existing) {
      if (existing.status === "active" || existing.status === "pending") {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      // Re-subscribe
      const { data: updated, error } = await supabase
        .from("subscribers")
        .update({ status: "pending", source: source ?? null })
        .eq("id", existing.id)
        .select("unsub_token")
        .single();
      if (error) throw error;
      unsubToken = updated.unsub_token;
    } else {
      const { data: created, error } = await supabase
        .from("subscribers")
        .insert({ email, source: source ?? null, status: "pending" })
        .select("unsub_token")
        .single();
      if (error) {
        console.error("[subscribe-insert]", error);
        return NextResponse.json({ ok: false, error: "Không thể đăng ký" }, { status: 500 });
      }
      unsubToken = created.unsub_token;
    }

    // Resend Audience + welcome email
    await Promise.allSettled([
      addToAudience(email),
      (async () => {
        const tpl = newsletterWelcomeEmail(unsubToken);
        await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
        // Mark active after welcome sent
        await supabase.from("subscribers").update({ status: "active" }).eq("email", email);
      })(),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe-route]", err);
    return NextResponse.json({ ok: false, error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
