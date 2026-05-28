import { requireAuth } from "../../../_lib/auth";
import { requiredUuid } from "../../../_lib/payload";
import { adminSupabase } from "../../../_lib/supabase";
import {
  publicationNewsletterEmail,
  sendNewsletterEmail,
} from "../../../_lib/newsletter";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
  EMAIL_PROVIDER?: string;
  EMAIL_AUTOMATION_DISABLED?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json().catch(() => ({}))) as { post_id?: string };
  const postId = requiredUuid(body.post_id);
  if (!postId) return json({ ok: false, error: "Thieu post_id" }, 400);

  const supabase = adminSupabase(env);
  const { data: existing } = await supabase
    .from("newsletter_sends")
    .select("id")
    .eq("post_id", postId)
    .eq("status", "sent")
    .maybeSingle();
  if (existing) {
    return json({ ok: false, error: "Newsletter cho bai nay da duoc gui" }, 409);
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_url, status")
    .eq("id", postId)
    .maybeSingle();
  if (postError || !post) {
    return json({ ok: false, error: "Khong tim thay bai viet" }, 404);
  }
  if (post.status !== "published") {
    return json({ ok: false, error: "Chi gui newsletter cho bai published" }, 400);
  }

  const { data: subscribers, error: subscribersError } = await supabase
    .from("subscribers")
    .select("email, unsub_token")
    .eq("status", "active");
  if (subscribersError) {
    return json({ ok: false, error: "Khong tai duoc subscribers" }, 500);
  }

  const recipients = (subscribers ?? []).filter(
    (item) => item.email && item.unsub_token,
  );
  if (recipients.length === 0) {
    return json({ ok: false, error: "Chua co subscriber active" }, 400);
  }

  const subject = `An pham moi: ${post.title}`;
  const siteUrl = new URL(request.url).origin;
  const results = await Promise.allSettled(
    recipients.map((subscriber) =>
      sendNewsletterEmail(env, {
        to: subscriber.email,
        subject,
        html: publicationNewsletterEmail({
          siteUrl,
          post,
          subscriber,
        }),
      }),
    ),
  );

  const failureDetails = results
    .map((result, index) => {
      const email = recipients[index]?.email ?? "unknown";
      if (result.status === "rejected") {
        const message =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        return `${email}: ${message}`;
      }
      if (!result.value.ok) return `${email}: ${result.value.error}`;
      return null;
    })
    .filter((item): item is string => Boolean(item));

  const failedCount = failureDetails.length;
  const firstSettled = results.find((result) => result.status === "fulfilled");
  const firstDelivery =
    firstSettled?.status === "fulfilled" ? firstSettled.value : null;
  const provider = firstDelivery?.provider;
  const runtime = firstDelivery?.runtime;
  const mockedCount = results.filter(
    (result) =>
      result.status === "fulfilled" &&
      result.value.ok &&
      result.value.status === "mocked",
  ).length;
  const status = failedCount > 0 ? "failed" : mockedCount > 0 ? "mocked" : "sent";
  const errorMessage =
    failedCount > 0 ? `${failedCount} email khong gui duoc` : null;

  if (failureDetails.length > 0) {
    console.error("[newsletter-send-failed]", {
      post_id: postId,
      failures: failureDetails,
    });
  }

  const { data: send, error: insertError } = await supabase
    .from("newsletter_sends")
    .insert({
      post_id: postId,
      status,
      subject,
      recipient_count: recipients.length - failedCount,
      error_message: failureDetails.slice(0, 5).join("\n") || errorMessage,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[newsletter-send-log]", insertError);
    return json({ ok: false, error: insertError.message }, 500);
  }

  if (status === "failed") {
    return json(
      {
        ok: false,
        error: errorMessage,
        details: failureDetails.slice(0, 5),
        send_id: send.id,
        recipient_count: recipients.length - failedCount,
        provider,
        runtime,
        delivery_status: status,
      },
      500,
    );
  }

  return json({
    ok: true,
    send_id: send.id,
    recipient_count: recipients.length,
    status,
    provider,
    runtime,
    delivery_status: status,
  });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
