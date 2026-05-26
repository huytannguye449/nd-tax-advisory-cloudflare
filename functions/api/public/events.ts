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
    .from("events")
    .select(
      "id, slug, title, excerpt, cover_url, event_date, location, format, status, display_order",
    )
    .in("status", ["published", "upcoming", "past"])
    .order("display_order")
    .order("event_date");

  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, events: data ?? [] });
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
