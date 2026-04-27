import { Quote } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { TESTIMONIALS } from "@/lib/data";

export function Testimonials() {
  const featured = TESTIMONIALS.slice(0, 6);

  return (
    <Section bg="cream" spacing="md" className="bg-cream-100">
      <Container size="xl">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Eyebrow color="gold">Khách hàng nói</Eyebrow>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Câu chuyện từ những doanh nghiệp đã tin tưởng
          </h2>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <blockquote
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-cream-200 bg-white p-6"
            >
              <Quote
                className="h-8 w-8 text-gold/50 shrink-0"
                aria-hidden="true"
              />
              <p className="flex-1 text-sm italic leading-relaxed text-navy/70">
                {item.quote}
              </p>
              <footer className="flex flex-col gap-0.5 border-t border-cream-200 pt-4">
                <cite className="not-italic font-semibold text-navy text-sm">
                  {item.author}
                </cite>
                <span className="text-xs text-navy/55">{item.title}</span>
                <span className="text-xs font-medium text-gold-700 uppercase tracking-wide mt-1">
                  {item.industry}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </Section>
  );
}
