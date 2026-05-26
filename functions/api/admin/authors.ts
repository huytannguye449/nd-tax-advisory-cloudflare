import { requireAuth } from "../../_lib/auth";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

function slugify(input: string): string {
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = new URL(request.url).searchParams.get("id");
  const supabase = adminSupabase(env);
  let query = supabase.from("authors").select("*").order("name");
  if (id) query = query.eq("id", id);
  const { data, error } = id ? await query.maybeSingle() : await query;
  if (error) return json({ ok: false, error: error.message }, 500);
  return json(
    id ? { ok: true, author: data } : { ok: true, authors: data ?? [] },
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    name?: string;
    slug?: string;
    title?: string;
    bio?: string;
    avatar_url?: string;
  };
  if (!body.name?.trim())
    return json({ ok: false, error: "Tên tác giả là bắt buộc" }, 400);
  const slug = slugify(body.slug?.trim() || body.name);
  if (!slug) return json({ ok: false, error: "Slug không hợp lệ" }, 400);

  const supabase = adminSupabase(env);
  const { data, error } = await supabase
    .from("authors")
    .insert({
      name: body.name.trim(),
      slug,
      title: body.title || null,
      bio: body.bio || null,
      avatar_url: body.avatar_url || null,
    })
    .select("*")
    .single();
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, author: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    id?: string;
    name?: string;
    slug?: string;
    title?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
  };
  if (!body.id) return json({ ok: false, error: "Thiếu id" }, 400);
  if (!body.name?.trim())
    return json({ ok: false, error: "Tên tác giả là bắt buộc" }, 400);
  const slug = slugify(body.slug?.trim() || body.name);
  if (!slug) return json({ ok: false, error: "Slug không hợp lệ" }, 400);

  const supabase = adminSupabase(env);
  const { error } = await supabase
    .from("authors")
    .update({
      name: body.name.trim(),
      slug,
      title: body.title || null,
      bio: body.bio || null,
      avatar_url: body.avatar_url || null,
    })
    .eq("id", body.id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ ok: false, error: "Thiếu id" }, 400);

  const supabase = adminSupabase(env);
  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) {
    const status = error.code === "23503" ? 409 : 500;
    const message =
      error.code === "23503"
        ? "Không thể xóa tác giả đang được bài viết sử dụng"
        : error.message;
    return json({ ok: false, error: message }, status);
  }
  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
