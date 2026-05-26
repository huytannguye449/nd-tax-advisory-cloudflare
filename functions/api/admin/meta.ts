/**
 * GET /api/admin/meta — return categories + people/authors + tags cho dropdowns trong admin form
 */
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
  const [
    { data: categories },
    { data: people },
    { data: authors },
    { data: tags },
  ] = await Promise.all([
    supabase.from("categories").select("id, slug, name").order("display_order"),
    supabase
      .from("people")
      .select("id, slug, name, title, status")
      .order("display_order")
      .order("name"),
    supabase.from("authors").select("id, slug, name, title"),
    supabase.from("tags").select("id, slug, name").order("name"),
  ]);

  return new Response(
    JSON.stringify({
      ok: true,
      categories: categories ?? [],
      people: people ?? [],
      authors: authors ?? [],
      tags: tags ?? [],
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
