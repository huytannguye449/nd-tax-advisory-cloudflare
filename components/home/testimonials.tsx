import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { TESTIMONIALS } from "@/lib/data";

export function Testimonials() {
  const featured = TESTIMONIALS.slice(0, 6);

  return (
    <Section bg="cream-100" spacing="md" hairlineTop>
      <Container size="default">
        {/* Section header */}
        <div className="flex flex-col gap-4 mb-16">
          <Eyebrow color="gold">Khách hàng nói</Eyebrow>
          <h2 className="font-heading text-headline-lg text-navy text-balance">
            Câu chuyện từ những doanh nghiệp đã tin tưởng
          </h2>
        </div>

        {/* Testimonial grid — hairline top per card, no bg box */}
        <div className="grid gap-[var(--spacing-gutter)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <blockquote
              key={i}
              className="flex flex-col gap-6 border-t-hairline border-gold pt-6"
            >
              {/* Pull-quote — Playfair 24px italic */}
              <p className="font-heading text-quote italic text-navy/80 leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Attribution */}
              <footer className="flex flex-col gap-1">
                <cite className="not-italic font-heading text-headline-sm text-navy">
                  {item.author}
                </cite>
                <span className="text-body-sm text-navy/55">{item.title}</span>
                <Eyebrow color="gold" className="mt-2">{item.industry}</Eyebrow>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </Section>
  );
}
