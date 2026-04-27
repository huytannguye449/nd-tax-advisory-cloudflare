import bcrypt from "bcryptjs";
import { adminSupabase } from "../../_lib/supabase";
import { signJwt } from "../../_lib/jwt";
import { setSessionCookie } from "../../_lib/auth";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = (body.username ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!username || !password) {
      return json({ ok: false, error: "Vui lòng nhập đầy đủ" }, 400);
    }

    const supabase = adminSupabase(env);
    const { data: user } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, name, role")
      .eq("username", username)
      .maybeSingle();

    if (!user) {
      return json({ ok: false, error: "Tài khoản hoặc mật khẩu không đúng" }, 401);
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return json({ ok: false, error: "Tài khoản hoặc mật khẩu không đúng" }, 401);
    }

    // Update last login
    await supabase
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id);

    const token = await signJwt(
      { uid: user.id, username: user.username, role: user.role },
      env.ADMIN_JWT_SECRET,
    );

    return new Response(
      JSON.stringify({
        ok: true,
        user: { id: user.id, username: user.username, name: user.name, role: user.role },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setSessionCookie(token),
        },
      },
    );
  } catch (err) {
    console.error("[admin-login]", err);
    return json({ ok: false, error: "Đã có lỗi xảy ra" }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
