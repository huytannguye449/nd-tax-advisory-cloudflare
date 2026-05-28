import { unsubscribe } from "./api/unsubscribe";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return unsubscribe(request, env);
};
