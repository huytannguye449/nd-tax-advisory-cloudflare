import { requireAuth } from "../../_lib/auth";
import { nullableUuid, requiredUuid } from "../../_lib/payload";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

type ResourceKey =
  | "page_sections"
  | "client_logos"
  | "site_values"
  | "site_stats"
  | "testimonials"
  | "timeline_items";

const RESOURCES: Record<
  ResourceKey,
  {
    table: ResourceKey;
    listKey: string;
    required: string[];
    order: string;
    fields: string[];
  }
> = {
  page_sections: {
    table: "page_sections",
    listKey: "page_sections",
    required: ["page_slug", "section_key"],
    order: "page_slug,display_order,section_key",
    fields: [
      "page_slug",
      "section_key",
      "eyebrow",
      "title",
      "subtitle",
      "body",
      "image_url",
      "image_alt",
      "cta_label",
      "cta_href",
      "secondary_cta_label",
      "secondary_cta_href",
      "display_order",
      "status",
    ],
  },
  client_logos: {
    table: "client_logos",
    listKey: "client_logos",
    required: ["name"],
    order: "display_order,name",
    fields: [
      "name",
      "logo_url",
      "website_url",
      "show_on_home",
      "display_order",
      "status",
    ],
  },
  site_values: {
    table: "site_values",
    listKey: "site_values",
    required: ["key", "title"],
    order: "display_order,title",
    fields: ["key", "title", "description", "icon_key", "display_order", "status"],
  },
  site_stats: {
    table: "site_stats",
    listKey: "site_stats",
    required: ["value", "label"],
    order: "display_order,label",
    fields: ["value", "label", "display_order", "status"],
  },
  testimonials: {
    table: "testimonials",
    listKey: "testimonials",
    required: ["quote", "author"],
    order: "display_order,author",
    fields: ["quote", "author", "title", "industry", "display_order", "status"],
  },
  timeline_items: {
    table: "timeline_items",
    listKey: "timeline_items",
    required: ["period", "title"],
    order: "display_order,period",
    fields: [
      "person_id",
      "page_slug",
      "period",
      "title",
      "organization",
      "description",
      "display_order",
      "status",
    ],
  },
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const resource = getResource(url);
  if (!resource) return json({ ok: false, error: "Resource khong hop le" }, 400);

  const config = RESOURCES[resource];
  const supabase = adminSupabase(env) as any;
  let query = supabase.from(config.table).select("*");
  for (const column of config.order.split(",")) {
    query = query.order(column.trim());
  }
  const { data, error } = await query;
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, [config.listKey]: data ?? [] });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const resource = getResource(url);
  if (!resource) return json({ ok: false, error: "Resource khong hop le" }, 400);

  const body = (await request.json()) as Record<string, unknown>;
  const config = RESOURCES[resource];
  const payload = buildPayload(config, body);
  const missing = missingRequired(config, payload);
  if (missing) return json({ ok: false, error: `${missing} la bat buoc` }, 400);
  const homeLogoLimitError = await validateHomeLogoLimit(env, resource, payload);
  if (homeLogoLimitError) return json({ ok: false, error: homeLogoLimitError }, 400);

  const { data, error } = await (adminSupabase(env) as any)
    .from(config.table)
    .insert(payload)
    .select("*")
    .single();
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, item: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const resource = getResource(url);
  if (!resource) return json({ ok: false, error: "Resource khong hop le" }, 400);

  const body = (await request.json()) as Record<string, unknown>;
  const id = requiredUuid(body.id);
  if (!id) return json({ ok: false, error: "Thieu id" }, 400);

  const config = RESOURCES[resource];
  const payload = {
    ...buildPayload(config, body),
    updated_at: new Date().toISOString(),
  };
  const missing = missingRequired(config, payload);
  if (missing) return json({ ok: false, error: `${missing} la bat buoc` }, 400);
  const homeLogoLimitError = await validateHomeLogoLimit(env, resource, payload, id);
  if (homeLogoLimitError) return json({ ok: false, error: homeLogoLimitError }, 400);

  const { error } = await (adminSupabase(env) as any)
    .from(config.table)
    .update(payload)
    .eq("id", id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const resource = getResource(url);
  const id = requiredUuid(url.searchParams.get("id"));
  if (!resource) return json({ ok: false, error: "Resource khong hop le" }, 400);
  if (!id) return json({ ok: false, error: "Thieu id" }, 400);

  const { error } = await (adminSupabase(env) as any)
    .from(RESOURCES[resource].table)
    .delete()
    .eq("id", id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};

function getResource(url: URL): ResourceKey | null {
  const resource = url.searchParams.get("resource");
  return resource && resource in RESOURCES ? (resource as ResourceKey) : null;
}

function buildPayload(
  config: (typeof RESOURCES)[ResourceKey],
  body: Record<string, unknown>,
) {
  const payload: Record<string, unknown> = {};
  for (const field of config.fields) {
    if (field === "status") {
      payload.status = body.status === "published" ? "published" : "draft";
      continue;
    }
    if (field === "display_order") {
      payload.display_order = Number(body.display_order ?? 0);
      continue;
    }
    if (field === "person_id") {
      payload.person_id = nullableUuid(body.person_id) ?? null;
      continue;
    }
    if (field === "show_on_home") {
      payload.show_on_home = body.show_on_home === true;
      continue;
    }
    payload[field] = nullableText(body[field]);
  }
  return payload;
}

async function validateHomeLogoLimit(
  env: Env,
  resource: ResourceKey,
  payload: Record<string, unknown>,
  currentId?: string,
) {
  if (resource !== "client_logos" || payload.show_on_home !== true) return "";

  let query = (adminSupabase(env) as any)
    .from("client_logos")
    .select("id", { count: "exact", head: true })
    .eq("show_on_home", true);

  if (currentId) query = query.neq("id", currentId);

  const { count, error } = await query;
  if (error) return error.message;
  if ((count ?? 0) >= 8) {
    return "Trang chủ chỉ hiển thị tối đa 8 logo đối tác. Vui lòng bỏ chọn một logo khác trước.";
  }
  return "";
}

function missingRequired(
  config: (typeof RESOURCES)[ResourceKey],
  payload: Record<string, unknown>,
) {
  return config.required.find((field) => {
    const value = payload[field];
    return typeof value !== "string" || !value.trim();
  });
}

function nullableText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
