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
    .from("services")
    .select(
      "id, slug, title, short_description, description, cover_url, display_order, pricing, cta_label, cta_href, seo_title, seo_description, when_items, process_items, deliverable_items, service_people(role_label, display_order, person:people(id, slug, name, title, avatar_url))",
    )
    .eq("status", "published")
    .order("display_order")
    .order("title");

  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, services: data ?? [] });
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
