import type { Metadata } from "next";
import { PublicationDetailLive } from "@/components/content/publication-detail-live";

export const metadata: Metadata = {
  title: "Ấn phẩm",
  description: "Ấn phẩm chuyên môn của NHN&D Tax Advisory.",
};

export default function PublicationRewritePage() {
  return <PublicationDetailLive />;
}
