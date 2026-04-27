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

  const supabase = adminSupabase(env);
  let query = supabase
    .from("bookings")
    .select(
      "id, full_name, email, phone, company, service, scheduled_at, duration_min, meeting_type, meeting_link, status, message, created_at",
    )
    .order("scheduled_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return json({ ok: false, error: "Không tải được" }, 500);

  return json({ ok: true, bookings: data ?? [] });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    id?: string;
    status?: string;
    meeting_link?: string;
  };
  if (!body.id) return json({ ok: false, error: "Thiếu id" }, 400);

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status) update.status = body.status;
  if (body.meeting_link !== undefined) update.meeting_link = body.meeting_link;

  const supabase = adminSupabase(env);
  const { error } = await supabase.from("bookings").update(update).eq("id", body.id);
  if (error) return json({ ok: false, error: "Update fail" }, 500);

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
