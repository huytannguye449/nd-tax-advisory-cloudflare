import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const PUBLIC_STATUSES = ["published", "upcoming", "past"];
const DETAIL_SELECT =
  "id, slug, title, excerpt, description, cover_url, event_date, location, format, status, agenda_items, audience_items, cta_label, cta_href";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) return json({ ok: false, error: "Thiếu slug" }, 400);

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { data: event, error } = await supabase
    .from("events")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .in("status", PUBLIC_STATUSES)
    .maybeSingle();

  if (error) return json({ ok: false, error: error.message }, 500);
  if (!event) return json({ ok: false, error: "Không tìm thấy sự kiện" }, 404);

  return json({ ok: true, event });
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
