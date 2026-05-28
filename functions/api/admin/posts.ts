import { requireAuth } from "../../_lib/auth";
import { nullableUuid, requiredUuid, uuidList } from "../../_lib/payload";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

function viSlugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function nullableText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseTagIds(value: unknown): string[] {
  return uuidList(value);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const id = requiredUuid(url.searchParams.get("id"));

  const supabase = adminSupabase(env);

  if (id) {
    const [{ data, error }, { data: tagRows, error: tagError }] =
      await Promise.all([
        supabase
          .from("posts")
          .select(
            "*, category:categories(id, name, slug), person:people(id, name, slug), author:authors(id, name, slug)",
          )
          .eq("id", id)
          .maybeSingle(),
        supabase.from("post_tags").select("tag_id").eq("post_id", id),
      ]);
    if (error || !data)
      return json({ ok: false, error: "Khong tim thay" }, 404);
    if (tagError) return json({ ok: false, error: "Khong tai duoc tags" }, 500);
    return json({
      ok: true,
      post: { ...data, tag_ids: (tagRows ?? []).map((row) => row.tag_id) },
    });
  }

  let query = supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, status, reading_time, published_at, scheduled_at, is_featured, view_count, created_at, updated_at, newsletter_sends(id, status, sent_at, recipient_count), category:categories(name, slug), person:people(name, slug), author:authors(name, slug)",
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return json({ ok: false, error: "Khong tai duoc" }, 500);
  return json({ ok: true, posts: data ?? [] });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    title: string;
    slug?: string;
    excerpt?: string;
    cover_url?: string;
    body_mdx: string;
    category_id?: string | null;
    author_id?: string | null;
    people_id?: string | null;
    status?: "draft" | "scheduled" | "published";
    published_at?: string | null;
    scheduled_at?: string | null;
    is_featured?: boolean;
    seo_title?: string;
    seo_description?: string;
    tag_ids?: string[];
  };

  if (!body.title || !body.body_mdx) {
    return json({ ok: false, error: "Title va noi dung la bat buoc" }, 400);
  }

  const supabase = adminSupabase(env);
  const slug = viSlugify(body.slug?.trim() || body.title);
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);

  const insertData = {
    title: body.title,
    slug,
    excerpt: nullableText(body.excerpt),
    cover_url: nullableText(body.cover_url),
    body_mdx: body.body_mdx,
    category_id: nullableUuid(body.category_id) ?? null,
    author_id: nullableUuid(body.author_id) ?? null,
    people_id: nullableUuid(body.people_id) ?? null,
    status: body.status ?? "draft",
    published_at:
      body.status === "published"
        ? (nullableText(body.published_at) ?? new Date().toISOString())
        : null,
    scheduled_at:
      body.status === "scheduled" ? nullableText(body.scheduled_at) : null,
    is_featured: body.is_featured ?? false,
    seo_title: nullableText(body.seo_title),
    seo_description: nullableText(body.seo_description),
    reading_time: readingTime(body.body_mdx),
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(insertData)
    .select("id, slug")
    .single();

  if (error) {
    console.error("[posts-insert]", error);
    return json({ ok: false, error: error.message }, 500);
  }

  const tagIds = parseTagIds(body.tag_ids);
  if (tagIds.length > 0) {
    const { error: tagsError } = await supabase
      .from("post_tags")
      .insert(tagIds.map((tag_id) => ({ post_id: data.id, tag_id })));
    if (tagsError) return json({ ok: false, error: tagsError.message }, 500);
  }

  return json({ ok: true, post: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown> & {
    id?: string;
  };
  const postId = requiredUuid(body.id);
  if (!postId) return json({ ok: false, error: "Thieu id" }, 400);

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  for (const key of [
    "title",
    "slug",
    "body_mdx",
    "status",
    "is_featured",
  ] as const) {
    if (key in body) update[key] = body[key];
  }

  for (const key of [
    "excerpt",
    "cover_url",
    "published_at",
    "scheduled_at",
    "seo_title",
    "seo_description",
  ] as const) {
    if (key in body) update[key] = nullableText(body[key]);
  }

  for (const key of ["category_id", "author_id", "people_id"] as const) {
    if (key in body) update[key] = nullableUuid(body[key]) ?? null;
  }

  if (typeof body.slug === "string" || typeof body.title === "string") {
    const source =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : typeof body.title === "string"
          ? body.title
          : "";
    const slug = viSlugify(source);
    if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);
    update.slug = slug;
  }

  if (typeof body.body_mdx === "string") {
    update.reading_time = readingTime(body.body_mdx);
  }

  if (body.status === "published" && !update.published_at) {
    update.published_at = new Date().toISOString();
  }

  const supabase = adminSupabase(env);
  const { error } = await supabase
    .from("posts")
    .update(update)
    .eq("id", postId);
  if (error) {
    console.error("[posts-update]", error);
    return json({ ok: false, error: error.message }, 500);
  }

  if ("tag_ids" in body) {
    const tagIds = parseTagIds(body.tag_ids);
    const { error: deleteError } = await supabase
      .from("post_tags")
      .delete()
      .eq("post_id", postId);
    if (deleteError)
      return json({ ok: false, error: deleteError.message }, 500);
    if (tagIds.length > 0) {
      const { error: insertError } = await supabase
        .from("post_tags")
        .insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
      if (insertError)
        return json({ ok: false, error: insertError.message }, 500);
    }
  }

  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const id = requiredUuid(url.searchParams.get("id"));
  if (!id) return json({ ok: false, error: "Thieu id" }, 400);

  const supabase = adminSupabase(env);
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
