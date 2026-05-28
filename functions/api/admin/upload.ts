import { requireAuth } from "../../_lib/auth";
import { adminSupabase } from "../../_lib/supabase";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

const ALLOWED_FOLDERS = new Set(["people", "services", "events", "posts"]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAuth(request, env.ADMIN_JWT_SECRET);
  if (auth instanceof Response) return auth;

  const form = await request.formData();
  const file = form.get("file") as unknown as {
    name: string;
    type: string;
    size: number;
    arrayBuffer: () => Promise<ArrayBuffer>;
  } | null;
  const folderRaw = String(form.get("folder") || "misc");
  const entityId = String(form.get("entityId") || "new");
  if (!file || typeof file.arrayBuffer !== "function") {
    return json({ ok: false, error: "Thiếu file" }, 400);
  }
  const folder = ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "misc";
  if (!file.type.startsWith("image/"))
    return json({ ok: false, error: "Chỉ hỗ trợ ảnh" }, 400);
  if (file.size > 5 * 1024 * 1024)
    return json({ ok: false, error: "Ảnh tối đa 5MB" }, 400);

  const ext =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "jpg";
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const path = `${folder}/${entityId.replace(/[^a-zA-Z0-9_-]/g, "")}/${filename}`;
  const uploadBody = new Blob([await file.arrayBuffer()], { type: file.type });
  const supabase = adminSupabase(env);
  const { error } = await supabase.storage
    .from("cms-assets")
    .upload(path, uploadBody, {
      contentType: file.type,
      upsert: true,
    });
  if (error) return json({ ok: false, error: error.message }, 500);
  const { data } = supabase.storage.from("cms-assets").getPublicUrl(path);
  return json({ ok: true, url: data.publicUrl, path });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
