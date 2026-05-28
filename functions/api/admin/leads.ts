import { requireAuth } from "../../_lib/auth";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

const LEAD_STATUSES = ["new", "contacted", "qualified", "closed", "spam"];
const MEETING_TYPES = ["online", "offline"];

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
      "id, full_name, email, phone, company, company_size, services, meeting_type, meeting_link, message, source, status, internal_notes, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status && status !== "all") {
    if (!LEAD_STATUSES.includes(status)) {
      return json({ ok: false, error: "Trạng thái không hợp lệ" }, 400);
    }
    query = query.eq("status", status);
  }

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
    meeting_type?: string;
    meeting_link?: string;
    internal_notes?: string;
  };
  if (!body.id) return json({ ok: false, error: "Thiếu id" }, 400);
  if (body.status && !LEAD_STATUSES.includes(body.status)) {
    return json({ ok: false, error: "Trạng thái không hợp lệ" }, 400);
  }
  if (body.meeting_type && !MEETING_TYPES.includes(body.meeting_type)) {
    return json({ ok: false, error: "Hình thức làm việc không hợp lệ" }, 400);
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const supabase = adminSupabase(env);
  const { data: lead, error: loadError } = await supabase
    .from("leads")
    .select("id, meeting_type")
    .eq("id", body.id)
    .single();

  if (loadError || !lead) {
    return json({ ok: false, error: "Không tìm thấy lead" }, 404);
  }

  if (body.status) update.status = body.status;
  if (body.meeting_type) {
    update.meeting_type = body.meeting_type;
    if (body.meeting_type === "offline") update.meeting_link = null;
  }
  if (body.meeting_link !== undefined) {
    const meetingType = body.meeting_type ?? lead.meeting_type ?? "online";
    const meetingLink =
      typeof body.meeting_link === "string"
        ? body.meeting_link.trim() || null
        : null;
    update.meeting_link = meetingType === "online" ? meetingLink : null;
  }
  if (body.internal_notes !== undefined) update.internal_notes = body.internal_notes;

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
