import type { Metadata } from "next";
import { createStaticClient as createClient } from "@/lib/supabase/static";
import { PublicationDetailLive } from "@/components/content/publication-detail-live";
import { SubscribePopup } from "@/components/marketing/subscribe-popup";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Ấn phẩm",
  description: "Ấn phẩm chuyên môn của NHN&D Tax Advisory.",
};

export async function generateStaticParams() {
  // Build must not crash if Supabase env/data is unavailable at build time
  // (e.g. missing build-time vars on the host). Fall back to no prebuilt
  // detail pages; they get generated once env + published posts exist.
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published")
      .returns<{ slug: string }[]>();

    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <PublicationDetailLive initialSlug={slug} />
      <SubscribePopup />
    </>
  );
}
