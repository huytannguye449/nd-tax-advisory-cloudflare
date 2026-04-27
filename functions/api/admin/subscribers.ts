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
  const { data, error } = await supabase
    .from("subscribers")
    .select("id, email, source, status, subscribed_at")
    .order("subscribed_at", { ascending: false });

  if (error) return json({ ok: false, error: "Không tải được" }, 500);
  return json({ ok: true, subscribers: data ?? [] });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
