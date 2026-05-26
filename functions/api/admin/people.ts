import { requireAuth } from "../../_lib/auth";
import { requiredUuid } from "../../_lib/payload";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

type PublishStatus = "draft" | "published";

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

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function socialLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, val]) => typeof val === "string" && val.trim().length > 0)
    .map(([key, val]) => [key, String(val).trim()]);
  return Object.fromEntries(entries);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = requiredUuid(new URL(request.url).searchParams.get("id"));
  const supabase = adminSupabase(env);
  let query = supabase
    .from("people")
    .select("*")
    .order("display_order")
    .order("name");
  if (id) query = query.eq("id", id);
  const { data, error } = id ? await query.maybeSingle() : await query;
  if (error) return json({ ok: false, error: error.message }, 500);
  return json(
    id ? { ok: true, person: data } : { ok: true, people: data ?? [] },
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return json({ ok: false, error: "Ten la bat buoc" }, 400);
  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim() ? body.slug : name,
  );
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);

  const payload = personPayload(body, name, slug);
  const { data, error } = await adminSupabase(env)
    .from("people")
    .insert(payload)
    .select("*")
    .single();
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, person: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown> & {
    id?: string;
  };
  const personId = requiredUuid(body.id);
  if (!personId) return json({ ok: false, error: "Thieu id" }, 400);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return json({ ok: false, error: "Ten la bat buoc" }, 400);
  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim() ? body.slug : name,
  );
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);

  const payload = {
    ...personPayload(body, name, slug),
    updated_at: new Date().toISOString(),
  };
  const { error } = await adminSupabase(env)
    .from("people")
    .update(payload)
    .eq("id", personId);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = requiredUuid(new URL(request.url).searchParams.get("id"));
  if (!id) return json({ ok: false, error: "Thieu id" }, 400);
  const supabase = adminSupabase(env);
  const [{ count: postCount }, { count: serviceCount }, { count: eventCount }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("people_id", id),
      supabase
        .from("service_people")
        .select("person_id", { count: "exact", head: true })
        .eq("person_id", id),
      supabase
        .from("event_people")
        .select("person_id", { count: "exact", head: true })
        .eq("person_id", id),
    ]);
  if ((postCount ?? 0) + (serviceCount ?? 0) + (eventCount ?? 0) > 0) {
    return json(
      {
        ok: false,
        error:
          "Khong the xoa person dang duoc bai viet, dich vu hoac su kien su dung",
      },
      409,
    );
  }
  const { error } = await supabase.from("people").delete().eq("id", id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

function personPayload(
  body: Record<string, unknown>,
  name: string,
  slug: string,
) {
  return {
    name,
    slug,
    title:
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : null,
    bio:
      typeof body.bio === "string" && body.bio.trim() ? body.bio.trim() : null,
    avatar_url:
      typeof body.avatar_url === "string" && body.avatar_url.trim()
        ? body.avatar_url.trim()
        : null,
    expertise: stringList(body.expertise),
    credentials: stringList(body.credentials),
    social_links: socialLinks(body.social_links),
    status:
      body.status === "published"
        ? ("published" as PublishStatus)
        : ("draft" as PublishStatus),
    display_order: Number(body.display_order ?? 0),
    is_featured: Boolean(body.is_featured),
    profile_enabled: body.profile_enabled !== false,
  };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
