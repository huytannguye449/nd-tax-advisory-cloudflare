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

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(200, parseInt(url.searchParams.get("limit") ?? "100"));

  const supabase = adminSupabase(env);
  let query = supabase
    .from("leads")
    .select(
      "id, full_name, email, phone, company, company_size, services, message, source, status, internal_notes, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status && status !== "all") query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) {
    console.error("[admin-leads]", error);
    return json({ ok: false, error: "Không tải được" }, 500);
  }

  return json({ ok: true, leads: data ?? [], total: count ?? 0 });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    id?: string;
    status?: string;
    internal_notes?: string;
  };
  if (!body.id) return json({ ok: false, error: "Thiếu id" }, 400);

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status) update.status = body.status;
  if (body.internal_notes !== undefined) update.internal_notes = body.internal_notes;

  const supabase = adminSupabase(env);
  const { error } = await supabase.from("leads").update(update).eq("id", body.id);
  if (error) return json({ ok: false, error: "Update fail" }, 500);

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
