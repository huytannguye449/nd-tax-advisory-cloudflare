"use client";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useSiteContent } from "@/components/site/site-content-context";

export function Testimonials() {
  const { loading, testimonials } = useSiteContent();

  if (loading) return null;

  if (testimonials.length > 0) {
    const featuredCms = testimonials.slice(0, 6);
    return (
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="default">
          <div className="flex flex-col gap-4 mb-16">
            <Eyebrow color="gold">Khách hàng nói</Eyebrow>
            <h2 className="font-heading text-headline-lg text-navy text-balance">
              Câu chuyện từ những doanh nghiệp đã tin tưởng
            </h2>
          </div>
          <div className="grid gap-[var(--spacing-gutter)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {featuredCms.map((item) => (
              <blockquote
                key={item.id}
                className="flex flex-col gap-6 border-t-hairline border-gold pt-6"
              >
                <p className="font-heading text-quote italic text-navy/80 leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="flex flex-col gap-1">
                  <cite className="not-italic font-heading text-headline-sm text-navy">
                    {item.author}
                  </cite>
                  {item.title && (
                    <span className="text-body-sm text-navy/55">{item.title}</span>
                  )}
                  {item.industry && (
                    <Eyebrow color="gold" className="mt-2">{item.industry}</Eyebrow>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  return null;
}
