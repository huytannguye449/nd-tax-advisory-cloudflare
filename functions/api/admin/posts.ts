import { requireAuth } from "../../_lib/auth";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

const VI_DIACRITICS: Record<string, string> = {
  à: "a", á: "a", ả: "a", ã: "a", ạ: "a", ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
  â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
  è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e", ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
  ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
  ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o", ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
  ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
  ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u", ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y", đ: "d",
};

function viSlugify(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((c) => VI_DIACRITICS[c] ?? c)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const id = url.searchParams.get("id");

  const supabase = adminSupabase(env);

  if (id) {
    const { data, error } = await supabase
      .from("posts")
      .select("*, category:categories(id, name, slug), author:authors(id, name, slug)")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return json({ ok: false, error: "Không tìm thấy" }, 404);
    return json({ ok: true, post: data });
  }

  let query = supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, status, reading_time, published_at, scheduled_at, is_featured, view_count, created_at, updated_at, category:categories(name, slug), author:authors(name, slug)",
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return json({ ok: false, error: "Không tải được" }, 500);
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
    category_id?: string;
    author_id?: string;
    status?: "draft" | "scheduled" | "published";
    published_at?: string;
    scheduled_at?: string;
    is_featured?: boolean;
    seo_title?: string;
    seo_description?: string;
  };

  if (!body.title || !body.body_mdx) {
    return json({ ok: false, error: "Tiêu đề và nội dung là bắt buộc" }, 400);
  }

  const supabase = adminSupabase(env);
  const slug = body.slug?.trim() || viSlugify(body.title);

  const insertData = {
    title: body.title,
    slug,
    excerpt: body.excerpt || null,
    cover_url: body.cover_url || null,
    body_mdx: body.body_mdx,
    category_id: body.category_id || null,
    author_id: body.author_id || null,
    status: body.status ?? "draft",
    published_at:
      body.status === "published"
        ? body.published_at ?? new Date().toISOString()
        : null,
    scheduled_at: body.status === "scheduled" ? body.scheduled_at ?? null : null,
    is_featured: body.is_featured ?? false,
    seo_title: body.seo_title || null,
    seo_description: body.seo_description || null,
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
  return json({ ok: true, post: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown> & { id?: string };
  if (!body.id) return json({ ok: false, error: "Thiếu id" }, 400);

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  for (const key of [
    "title",
    "slug",
    "excerpt",
    "cover_url",
    "body_mdx",
    "category_id",
    "author_id",
    "status",
    "published_at",
    "scheduled_at",
    "is_featured",
    "seo_title",
    "seo_description",
  ] as const) {
    if (key in body) update[key] = body[key];
  }

  if (typeof body.body_mdx === "string") {
    update.reading_time = readingTime(body.body_mdx);
  }

  if (body.status === "published" && !update.published_at) {
    update.published_at = new Date().toISOString();
  }

  const supabase = adminSupabase(env);
  const { error } = await supabase.from("posts").update(update).eq("id", body.id);
  if (error) {
    console.error("[posts-update]", error);
    return json({ ok: false, error: error.message }, 500);
  }
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ ok: false, error: "Thiếu id" }, 400);

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
