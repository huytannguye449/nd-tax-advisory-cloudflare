import type { Metadata } from "next";
import { SITE } from "@/lib/utils";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { BrandStory } from "@/components/home/brand-story";
import { ServicesPreview } from "@/components/home/services-preview";
import { WhyUs } from "@/components/home/why-us";
import { Stats } from "@/components/home/stats";
import { BlogPreview } from "@/components/home/blog-preview";
import { HomeSubscribe } from "@/components/home/subscribe-section";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";

export const runtime = "edge";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "Tư vấn thuế chiến lược cho SME & FDI tại Việt Nam. 20+ năm kinh nghiệm. Buổi tư vấn đầu tiên 45 phút miễn phí.",
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Tư vấn thuế chiến lược cho doanh nghiệp Việt. Chính xác, bảo mật, tận tâm.",
    url: SITE.url,
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust bar — client logos */}
      <TrustBar />

      {/* 3. Brand story */}
      <BrandStory />

      {/* 4. Services preview */}
      <ServicesPreview />

      {/* 5. Why N&D / Values */}
      <WhyUs />

      {/* 6. Stats */}
      <Stats />

      {/* 7. Blog preview — async RSC */}
      <BlogPreview />

      {/* 8. Newsletter subscribe */}
      <HomeSubscribe />

      {/* 9. Testimonials */}
      <Testimonials />

      {/* 10. Final CTA */}
      <FinalCta />
    </>
  );
}
