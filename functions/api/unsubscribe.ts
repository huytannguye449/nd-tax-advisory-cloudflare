/**
 * GET /api/unsubscribe?token=xxx — Cloudflare Pages Function
 */

import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return new Response("Missing token", { status: 400 });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  await supabase
    .from("subscribers")
    .update({ status: "unsubscribed" })
    .eq("unsub_token", token);

  return new Response(
    `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Đã hủy đăng ký</title><style>body{font-family:system-ui;max-width:560px;margin:80px auto;padding:24px;background:#FAF7F0;color:#0F2B46;text-align:center}h1{font-family:Georgia,serif}</style></head><body><h1>Đã hủy đăng ký</h1><p>Cảm ơn bạn đã từng đồng hành cùng NHN&D Tax Advisory.</p><p><a href="/" style="color:#C9A961">← Về trang chủ</a></p></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
};
