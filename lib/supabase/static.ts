/**
 * Build-time / static-export Supabase client.
 * No cookies — pure server-side data fetching at build time.
 */

import { createClient as createSb } from "@supabase/supabase-js";

export function createStaticClient() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
