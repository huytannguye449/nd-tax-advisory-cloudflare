import { requireAuth } from "../../_lib/auth";
import { requiredUuid } from "../../_lib/payload";
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

  const id = requiredUuid(new URL(request.url).searchParams.get("id"));
  const supabase = adminSupabase(env);
  let query = supabase
    .from("events")
    .select("*")
    .order("display_order")
    .order("event_date");
  if (id) query = query.eq("id", id);
  const { data, error } = id ? await query.maybeSingle() : await query;
  if (error) return json({ ok: false, error: error.message }, 500);
  return json(
    id ? { ok: true, event: data } : { ok: true, events: data ?? [] },
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return json({ ok: false, error: "Ten su kien la bat buoc" }, 400);
  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title,
  );
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);
  const { data, error } = await adminSupabase(env)
    .from("events")
    .insert(eventPayload(body, title, slug))
    .select("*")
    .single();
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, event: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown> & {
    id?: string;
  };
  const eventId = requiredUuid(body.id);
  if (!eventId) return json({ ok: false, error: "Thieu id" }, 400);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return json({ ok: false, error: "Ten su kien la bat buoc" }, 400);
  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title,
  );
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);
  const { error } = await adminSupabase(env)
    .from("events")
    .update({
      ...eventPayload(body, title, slug),
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = requiredUuid(new URL(request.url).searchParams.get("id"));
  if (!id) return json({ ok: false, error: "Thieu id" }, 400);
  const { error } = await adminSupabase(env)
    .from("events")
    .delete()
    .eq("id", id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

function nullableDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function eventPayload(
  body: Record<string, unknown>,
  title: string,
  slug: string,
) {
  const status = ["published", "upcoming", "past"].includes(String(body.status))
    ? String(body.status)
    : "draft";
  return {
    title,
    slug,
    excerpt:
      typeof body.excerpt === "string" && body.excerpt.trim()
        ? body.excerpt.trim()
        : null,
    cover_url:
      typeof body.cover_url === "string" && body.cover_url.trim()
        ? body.cover_url.trim()
        : null,
    event_date: nullableDate(body.event_date),
    location:
      typeof body.location === "string" && body.location.trim()
        ? body.location.trim()
        : null,
    format:
      typeof body.format === "string" && body.format.trim()
        ? body.format.trim()
        : null,
    status,
    display_order: Number(body.display_order ?? 0),
  };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
