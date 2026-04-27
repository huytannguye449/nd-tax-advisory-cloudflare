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

  const supabase = adminSupabase(env);
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();

  const [leadsTotal, leadsNew, bookingsPending, bookingsTotal, subsActive, postsPublished, postsDraft] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since30),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", since30),
    supabase.from("subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  return new Response(
    JSON.stringify({
      ok: true,
      stats: {
        leads_30d: leadsTotal.count ?? 0,
        leads_new: leadsNew.count ?? 0,
        bookings_pending: bookingsPending.count ?? 0,
        bookings_30d: bookingsTotal.count ?? 0,
        subs_active: subsActive.count ?? 0,
        posts_published: postsPublished.count ?? 0,
        posts_draft: postsDraft.count ?? 0,
      },
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
