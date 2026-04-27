import { requireAuth } from "../../_lib/auth";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const supabase = adminSupabase(env);
  const { data: user } = await supabase
    .from("admin_users")
    .select("id, username, name, role, last_login_at, created_at")
    .eq("id", auth.uid)
    .maybeSingle();

  if (!user) {
    return new Response(JSON.stringify({ ok: false, error: "User không tồn tại" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
