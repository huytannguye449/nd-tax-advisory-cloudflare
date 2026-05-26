import type { Metadata } from "next";
import { createStaticClient as createClient } from "@/lib/supabase/static";
import { PublicationDetailLive } from "@/components/content/publication-detail-live";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Ấn phẩm",
  description: "Ấn phẩm chuyên môn của NHN&D Tax Advisory.",
};

export async function generateStaticParams() {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published")
    .returns<{ slug: string }[]>();

  return (data ?? []).map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  return <PublicationDetailLive initialSlug={slug} />;
}
