import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SERVICES } from "@/lib/data";

// Service number labels — editorial style
const SERVICE_NUMBERS = ["01", "02", "03", "04"];

export function ServicesPreview() {
  return (
    <Section bg="cream-100" spacing="md" hairlineTop>
      <Container size="default">
        {/* Section header — centered */}
        <div className="flex flex-col items-start gap-4 mb-16">
          <Eyebrow color="gold">Dịch vụ</Eyebrow>
          <h2 className="font-heading text-headline-lg text-navy text-balance">
            Bốn lĩnh vực chuyên sâu
          </h2>
        </div>

        {/* Service cards grid — hairline-top, no bg, no border sides/bottom */}
        <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <article
              key={service.slug}
              className="group flex flex-col gap-6 border-t-hairline border-gold pt-6"
            >
              {/* Service number eyebrow */}
              <Eyebrow color="gold">
                {SERVICE_NUMBERS[index] ?? `0${index + 1}`}
              </Eyebrow>

              {/* Title */}
              <h3 className="font-heading text-headline-md text-navy leading-snug flex-1">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-body-md text-navy/65 leading-relaxed">
                {service.short}
              </p>

              {/* Ghost CTA */}
              <Button variant="ghost" size="sm" asChild className="self-start px-0">
                <Link
                  href={`/dich-vu#${service.slug}`}
                  aria-label={`Xem chi tiết về ${service.title}`}
                >
                  Xem chi tiết →
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
