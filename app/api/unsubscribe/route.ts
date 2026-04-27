import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase
    .from("subscribers")
    .update({ status: "unsubscribed" })
    .eq("unsub_token", token);

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return new Response(
    `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Đã hủy đăng ký</title><style>body{font-family:system-ui;max-width:560px;margin:80px auto;padding:24px;background:#FAF7F0;color:#0F2B46;text-align:center}h1{font-family:Georgia,serif}</style></head><body><h1>Đã hủy đăng ký</h1><p>Bạn đã được gỡ khỏi danh sách newsletter của N&D Tax Advisory. Cảm ơn bạn đã từng đồng hành.</p><p><a href="/" style="color:#C9A961">← Về trang chủ</a></p></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
