import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const DETAIL_SELECT = `id, slug, title, excerpt, cover_url, body_mdx, body_html, reading_time, published_at, category_id,
 category:categories(id, name, slug),
 person:people(name, slug, title, bio, avatar_url),
 author:authors(name, slug, title, bio, avatar_url)`;

const RELATED_SELECT = `id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, people_id, category_id, scheduled_at,
 category:categories(name, slug),
 person:people(name, slug, avatar_url, title),
 author:authors(name, slug, avatar_url, title)`;

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) return json({ ok: false, error: "Thiếu slug" }, 400);

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { data: post, error } = await supabase
    .from("posts")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) return json({ ok: false, error: error.message }, 500);
  if (!post) return json({ ok: false, error: "Không tìm thấy ấn phẩm" }, 404);

  const { data: related, error: relatedError } = post.category_id
    ? await supabase
        .from("posts")
        .select(RELATED_SELECT)
        .eq("status", "published")
        .eq("category_id", post.category_id)
        .neq("id", post.id)
        .order("published_at", { ascending: false })
        .limit(3)
    : { data: [], error: null };

  if (relatedError)
    return json({ ok: false, error: relatedError.message }, 500);

  return json({ ok: true, post, related: related ?? [] });
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
