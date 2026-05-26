import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const POST_SELECT =
  "id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, people_id, category_id, scheduled_at, category:categories(name, slug), person:people(name, slug, avatar_url, title), author:authors(name, slug, avatar_url, title)";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const [
    { data: categories, error: categoriesError },
    { data: posts, error: postsError },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  if (categoriesError || postsError) {
    return json(
      {
        ok: false,
        error:
          categoriesError?.message ?? postsError?.message ?? "Không tải được",
      },
      500,
    );
  }

  return json({ ok: true, categories: categories ?? [], posts: posts ?? [] });
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
