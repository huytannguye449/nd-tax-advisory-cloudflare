import Image from "next/image";
import { FOUNDER_BIO } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

const TIMELINE = [
  { years: "2002–2008", role: "Tax Consultant, Big4 (Deloitte / EY)" },
  { years: "2008–2016", role: "CFO, Tập đoàn corporate tier 1" },
  { years: "2016–2020", role: "Strategic Tax Advisor độc lập (50+ SME & founder)" },
  { years: "2026", role: "Thành lập N&D Tax Advisory" },
];

export function FounderSection() {
  const bioParagraphs = FOUNDER_BIO.split("\n\n").filter(Boolean);

  return (
    <section className="bg-cream py-16 md:py-24" aria-labelledby="founder-heading">
      <Container size="xl">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Image */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg aspect-square max-w-md mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80"
                alt="Anh Ngọc — Founder & CEO N&D Tax Advisory"
                width={900}
                height={900}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Decorative badge */}
            <div className="absolute -bottom-4 -right-4 hidden lg:flex bg-navy text-cream rounded-lg px-5 py-4 shadow-lg">
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-gold">20+</p>
                <p className="text-xs text-cream/80 mt-0.5">năm kinh nghiệm</p>
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
              className="font-heading text-3xl md:text-4xl font-bold text-navy mb-2"
            >
              Anh Ngọc
            </h2>
            <p className="text-gold-700 font-semibold text-lg mb-6">
              Founder &amp; CEO, N&amp;D Tax Advisory
            </p>

            <div className="space-y-4 text-navy/80 leading-relaxed mb-10">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-navy text-sm uppercase tracking-wider mb-5">
                Hành trình sự nghiệp
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-3.5 top-0 bottom-0 w-px bg-cream-300"
                  aria-hidden="true"
                />
                <ol className="space-y-5">
                  {TIMELINE.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 relative">
                      <span
                        className="size-7 rounded-full bg-navy flex items-center justify-center shrink-0 relative z-10"
                        aria-hidden="true"
                      >
                        <span className="size-2.5 rounded-full bg-gold" />
                      </span>
                      <div className="pt-0.5">
                        <span className="text-gold-700 font-semibold text-sm">
                          {item.years}
                        </span>
                        <p className="text-navy/80 text-sm mt-0.5">{item.role}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
