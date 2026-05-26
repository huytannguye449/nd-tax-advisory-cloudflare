import { requireAuth } from "../../_lib/auth";
import { requiredUuid, uuidList } from "../../_lib/payload";
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

function list(value: unknown): string[] {
  if (Array.isArray(value))
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function personIds(value: unknown): string[] {
  return uuidList(value);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = requiredUuid(new URL(request.url).searchParams.get("id"));
  const supabase = adminSupabase(env);
  const select =
    "*, service_people(role_label, display_order, person:people(id, slug, name, title, avatar_url, status))";
  let query = supabase
    .from("services")
    .select(select)
    .order("display_order")
    .order("title");
  if (id) query = query.eq("id", id);
  const { data, error } = id ? await query.maybeSingle() : await query;
  if (error) return json({ ok: false, error: error.message }, 500);
  return json(
    id ? { ok: true, service: data } : { ok: true, services: data ?? [] },
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return json({ ok: false, error: "Ten dich vu la bat buoc" }, 400);
  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title,
  );
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);

  const supabase = adminSupabase(env);
  const { data, error } = await supabase
    .from("services")
    .insert(servicePayload(body, title, slug))
    .select("id")
    .single();
  if (error) return json({ ok: false, error: error.message }, 500);
  const relationError = await replaceServicePeople(
    supabase,
    data.id,
    personIds(body.people_ids),
  );
  if (relationError) return json({ ok: false, error: relationError }, 500);
  return json({ ok: true, service: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Record<string, unknown> & {
    id?: string;
  };
  const serviceId = requiredUuid(body.id);
  if (!serviceId) return json({ ok: false, error: "Thieu id" }, 400);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return json({ ok: false, error: "Ten dich vu la bat buoc" }, 400);
  const slug = slugify(
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title,
  );
  if (!slug) return json({ ok: false, error: "Slug khong hop le" }, 400);

  const supabase = adminSupabase(env);
  const { error } = await supabase
    .from("services")
    .update({
      ...servicePayload(body, title, slug),
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId);
  if (error) return json({ ok: false, error: error.message }, 500);
  if ("people_ids" in body) {
    const relationError = await replaceServicePeople(
      supabase,
      serviceId,
      personIds(body.people_ids),
    );
    if (relationError) return json({ ok: false, error: relationError }, 500);
  }
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const id = requiredUuid(new URL(request.url).searchParams.get("id"));
  if (!id) return json({ ok: false, error: "Thieu id" }, 400);
  const { error } = await adminSupabase(env)
    .from("services")
    .delete()
    .eq("id", id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

function servicePayload(
  body: Record<string, unknown>,
  title: string,
  slug: string,
) {
  return {
    title,
    slug,
    short_description:
      typeof body.short_description === "string" &&
      body.short_description.trim()
        ? body.short_description.trim()
        : null,
    description:
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null,
    cover_url:
      typeof body.cover_url === "string" && body.cover_url.trim()
        ? body.cover_url.trim()
        : null,
    status: body.status === "published" ? "published" : "draft",
    display_order: Number(body.display_order ?? 0),
    pricing:
      typeof body.pricing === "string" && body.pricing.trim()
        ? body.pricing.trim()
        : null,
    cta_label:
      typeof body.cta_label === "string" && body.cta_label.trim()
        ? body.cta_label.trim()
        : null,
    cta_href:
      typeof body.cta_href === "string" && body.cta_href.trim()
        ? body.cta_href.trim()
        : null,
    seo_title:
      typeof body.seo_title === "string" && body.seo_title.trim()
        ? body.seo_title.trim()
        : null,
    seo_description:
      typeof body.seo_description === "string" && body.seo_description.trim()
        ? body.seo_description.trim()
        : null,
    when_items: list(body.when_items),
    process_items: list(body.process_items),
    deliverable_items: list(body.deliverable_items),
  };
}

async function replaceServicePeople(
  supabase: ReturnType<typeof adminSupabase>,
  serviceId: string,
  ids: string[],
) {
  const cleanServiceId = requiredUuid(serviceId);
  if (!cleanServiceId) return "Thieu service_id";
  const cleanIds = personIds(ids);
  const { error: deleteError } = await supabase
    .from("service_people")
    .delete()
    .eq("service_id", cleanServiceId);
  if (deleteError) return deleteError.message;
  if (cleanIds.length === 0) return "";
  const { error } = await supabase.from("service_people").insert(
    cleanIds.map((person_id, index) => ({
      service_id: cleanServiceId,
      person_id,
      role_label: "Responsible expert",
      display_order: index + 1,
    })),
  );
  return error?.message ?? "";
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
