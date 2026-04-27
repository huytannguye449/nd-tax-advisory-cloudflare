import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/dich-vu`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ve-chung-toi`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kien-thuc`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/lien-he`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/dat-lich`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chinh-sach-bao-mat`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/dieu-khoan`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
      url: `${base}/kien-thuc/${p.slug}`,
      lastModified: new Date(p.updated_at ?? p.published_at ?? now),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
