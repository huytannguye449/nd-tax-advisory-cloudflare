import Image from "next/image";
import { FOUNDER_BIO, TIMELINE } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

export function FounderSection() {
  const bioParagraphs = FOUNDER_BIO.split("\n\n").filter(Boolean);

  return (
    <Section bg="cream" spacing="md" hairlineTop aria-labelledby="founder-heading">
      <Container size="default">
        <div className="flex flex-col gap-[var(--spacing-gutter)] lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Image */}
          <div className="relative lg:sticky lg:top-32">
            <div className="overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80"
                alt="Nguyễn Hoài Ngọc — Founder & CEO NHN&D Tax Advisory"
                width={900}
                height={900}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Experience badge — flat navy block, no shadow, no rounded */}
            <div className="absolute -bottom-4 -right-4 hidden lg:flex bg-navy text-cream px-5 py-4">
              <div className="text-center">
                <p className="font-heading text-headline-sm text-gold">20+</p>
                <p className="text-body-sm text-cream/80 mt-0.5">năm kinh nghiệm</p>
              </div>
            </div>

            {/* Credentials badge — flat gold block */}
            <div className="absolute -top-4 -left-4 hidden lg:flex bg-gold text-navy px-4 py-3">
              <div className="text-center">
                <p className="text-label-caps font-bold tracking-wider">CPA · CPTA</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <Eyebrow color="gold" className="mb-4">
              FOUNDER &amp; CEO
            </Eyebrow>
            <h2
              id="founder-heading"
              className="font-heading text-headline-md text-navy mb-2"
            >
              Nguyễn Hoài Ngọc
            </h2>
            <p className="text-body-md text-gold-700 font-semibold mb-6">
              CPA / CPTA — Founder &amp; CEO, Công ty TNHH Tư vấn thuế NHN&amp;D
            </p>

            <div className="space-y-4 text-body-md text-navy/80 leading-relaxed mb-12">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Timeline */}
            <div className="border-t-hairline border-gold pt-8">
              <Eyebrow color="gold" className="mb-4">HÀNH TRÌNH SỰ NGHIỆP</Eyebrow>
              <h3 className="font-heading text-headline-sm text-navy mb-2">
                Tám mốc dấu — từ kiểm toán độc lập đến Kế toán Trưởng tập đoàn.
              </h3>
              <div className="relative mt-6">
                {/* Vertical line */}
                <div
                  className="absolute left-3.5 top-2 bottom-2 w-px bg-cream-300"
                  aria-hidden="true"
                />
                <ol className="space-y-6">
                  {TIMELINE.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 relative">
                      <span
                        className="size-7 bg-navy flex items-center justify-center shrink-0 relative z-10 mt-0.5"
                        aria-hidden="true"
                      >
                        <span className="size-2.5 bg-gold" />
                      </span>
                      <div className="flex-1">
                        <span className="text-label-caps text-gold-700 uppercase tracking-[0.1em]">
                          {item.period}
                        </span>
                        <p className="text-body-md text-navy font-semibold mt-1">
                          {item.title}
                        </p>
                        <p className="text-body-sm text-navy/60">{item.org}</p>
                        <p className="text-body-sm text-navy/70 mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
