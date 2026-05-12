import Image from "next/image";
import { FOUNDER_BIO, TIMELINE } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

export function FounderSection() {
  const bioParagraphs = FOUNDER_BIO.split("\n\n").filter(Boolean);

  return (
    <section className="bg-cream py-16 md:py-24" aria-labelledby="founder-heading">
      <Container size="xl">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Image */}
          <div className="relative lg:sticky lg:top-32">
            <div className="rounded-xl overflow-hidden shadow-lg aspect-square max-w-md mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80"
                alt="Nguyễn Hoài Ngọc — Founder & CEO NHN&D Tax Advisory"
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

            {/* Credentials badge */}
            <div className="absolute -top-4 -left-4 hidden lg:flex bg-gold text-navy rounded-lg px-4 py-3 shadow-lg">
              <div className="text-center">
                <p className="font-bold text-sm tracking-wider">CPA · CPTA</p>
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
              Nguyễn Hoài Ngọc
            </h2>
            <p className="text-gold-700 font-semibold text-lg mb-6">
              CPA / CPTA — Founder &amp; CEO, Công ty TNHH Tư vấn thuế NHN&amp;D
            </p>

            <div className="space-y-4 text-navy/80 leading-relaxed mb-12">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-heading text-2xl font-bold text-navy mb-2">
                Hành trình sự nghiệp
              </h3>
              <p className="text-sm text-navy/60 mb-6">
                Tám mốc dấu — từ kiểm toán độc lập đến Kế toán Trưởng tập đoàn.
              </p>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-3.5 top-2 bottom-2 w-px bg-cream-300"
                  aria-hidden="true"
                />
                <ol className="space-y-6">
                  {TIMELINE.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 relative">
                      <span
                        className="size-7 rounded-full bg-navy flex items-center justify-center shrink-0 relative z-10 mt-0.5"
                        aria-hidden="true"
                      >
                        <span className="size-2.5 rounded-full bg-gold" />
                      </span>
                      <div className="flex-1">
                        <span className="text-gold-700 font-semibold text-xs uppercase tracking-wider">
                          {item.period}
                        </span>
                        <p className="font-semibold text-navy mt-1">
                          {item.title}
                        </p>
                        <p className="text-navy/60 text-sm">{item.org}</p>
                        <p className="text-navy/70 text-sm mt-1.5 leading-relaxed">
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
    </section>
  );
}
