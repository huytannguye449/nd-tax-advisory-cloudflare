import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const page = new URL(request.url).searchParams.get("page")?.trim() || "";
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const sectionsQuery = supabase
    .from("page_sections")
    .select("*")
    .eq("status", "published")
    .order("display_order")
    .order("section_key");
  const [
    sections,
    clientLogos,
    homeClientLogos,
    values,
    stats,
    testimonials,
    timelineItems,
  ] = await Promise.all([
    page ? sectionsQuery.eq("page_slug", page) : sectionsQuery,
    supabase
      .from("client_logos")
      .select("*")
      .eq("status", "published")
      .order("display_order")
      .order("name"),
    supabase
      .from("client_logos")
      .select("*")
      .eq("status", "published")
      .eq("show_on_home", true)
      .order("display_order")
      .order("name")
      .limit(8),
    supabase
      .from("site_values")
      .select("*")
      .eq("status", "published")
      .order("display_order")
      .order("title"),
    supabase
      .from("site_stats")
      .select("*")
      .eq("status", "published")
      .order("display_order")
      .order("label"),
    supabase
      .from("testimonials")
      .select("*")
      .eq("status", "published")
      .order("display_order")
      .order("author"),
    supabase
      .from("timeline_items")
      .select("*")
      .eq("status", "published")
      .order("display_order")
      .order("period"),
  ]);

  const firstError =
    sections.error ??
    clientLogos.error ??
    homeClientLogos.error ??
    values.error ??
    stats.error ??
    testimonials.error ??
    timelineItems.error;
  if (firstError) return json({ ok: false, error: firstError.message }, 500);

  return json({
    ok: true,
    sections: sections.data ?? [],
    client_logos: clientLogos.data ?? [],
    home_client_logos: homeClientLogos.data ?? [],
    values: values.data ?? [],
    stats: stats.data ?? [],
    testimonials: testimonials.data ?? [],
    timeline_items: timelineItems.data ?? [],
  });
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
