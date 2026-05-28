/**
 * GET /api/unsubscribe?token=xxx - legacy-compatible unsubscribe endpoint.
 */

import { adminSupabase } from "../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return unsubscribe(request, env);
};

export async function unsubscribe(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return new Response("Missing token", { status: 400 });

  const supabase = adminSupabase(env);
  await supabase
    .from("subscribers")
    .update({ status: "unsubscribed" })
    .eq("unsub_token", token);

  return new Response(
    `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Đã hủy đăng ký</title><style>body{font-family:system-ui;max-width:560px;margin:80px auto;padding:24px;background:#FAF7F0;color:#0F2B46;text-align:center}h1{font-family:Georgia,serif}</style></head><body><h1>Đã hủy đăng ký</h1><p>Cảm ơn bạn đã từng đồng hành cùng NHN&D Tax Advisory.</p><p><a href="/" style="color:#C9A961">← Về trang chủ</a></p></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
