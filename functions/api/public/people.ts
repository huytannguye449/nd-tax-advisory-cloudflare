import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
    },
  );

  const { data, error } = await supabase
    .from("people")
    .select(
      "id, slug, name, title, bio, avatar_url, expertise, credentials, social_links, display_order, is_featured, profile_enabled",
    )
    .eq("status", "published")
    .order("display_order")
    .order("name");

  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, people: data ?? [] });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
