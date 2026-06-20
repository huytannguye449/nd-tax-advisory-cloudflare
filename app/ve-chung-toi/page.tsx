import type { Metadata } from "next";
import { FounderSection } from "@/components/about/founder-section";
import { TeamGrid } from "@/components/about/team-grid";
import { ValuesGrid } from "@/components/about/values-grid";
import { ClientLogos } from "@/components/about/client-logos";
import { AboutFinalCta, AboutHero, AboutStory } from "@/components/about/about-cms-sections";
import { SiteContentProvider } from "@/components/site/site-content-context";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Câu chuyện và đội ngũ NHN&D Tax Advisory - 20+ năm kinh nghiệm tư vấn thuế chiến lược tại Việt Nam.",
};

export default function VeChungToiPage() {
  return (
    <SiteContentProvider pageSlug="about">
      <AboutHero />
      <AboutStory />
      <FounderSection />
      <TeamGrid />
      <ValuesGrid />
      <ClientLogos />
      <AboutFinalCta />
    </SiteContentProvider>
  );
}