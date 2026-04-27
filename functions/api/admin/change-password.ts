import bcrypt from "bcryptjs";
import { requireAuth } from "../../_lib/auth";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!body.currentPassword || !body.newPassword) {
    return json({ ok: false, error: "Vui lòng điền đầy đủ" }, 400);
  }
  if (body.newPassword.length < 6) {
    return json({ ok: false, error: "Mật khẩu mới tối thiểu 6 ký tự" }, 400);
  }

  const supabase = adminSupabase(env);
  const { data: user } = await supabase
    .from("admin_users")
    .select("id, password_hash")
    .eq("id", auth.uid)
    .maybeSingle();

  if (!user) return json({ ok: false, error: "User không tồn tại" }, 401);

  const ok = await bcrypt.compare(body.currentPassword, user.password_hash);
  if (!ok) return json({ ok: false, error: "Mật khẩu hiện tại không đúng" }, 401);

  const newHash = await bcrypt.hash(body.newPassword, 10);
  const { error } = await supabase
    .from("admin_users")
    .update({ password_hash: newHash, updated_at: new Date().toISOString() })
    .eq("id", auth.uid);

  if (error) {
    console.error("[change-password]", error);
    return json({ ok: false, error: "Không cập nhật được" }, 500);
  }

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
