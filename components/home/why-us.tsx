"use client";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useSiteContent } from "@/components/site/site-content-context";

// Number labels for each value
const VALUE_NUMBERS = ["01", "02", "03", "04"];

export function WhyUs() {
  const { loading, values } = useSiteContent();

  if (loading) return null;

  if (values.length > 0) {
    return (
      <Section bg="cream" spacing="md" hairlineTop>
        <Container size="default">
          <div className="flex flex-col gap-4 mb-16">
            <Eyebrow color="gold">Giá trị cốt lõi</Eyebrow>
            <h2 className="font-heading text-headline-lg text-navy">
              Bốn nguyên tắc dẫn lối
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {values.map((value, index) => (
              <div
                key={value.id}
                className="flex flex-col gap-4 pt-8 pb-10 border-t-hairline border-gold lg:pr-[var(--spacing-gutter)]"
              >
                <span className="text-label-caps text-gold-700 uppercase tracking-[0.1em]">
                  {VALUE_NUMBERS[index] ?? `0${index + 1}`}
                </span>
                <h3 className="font-heading text-headline-md text-navy">
                  {value.title}
                </h3>
                {value.description && (
                  <p className="text-body-md text-navy/65 leading-relaxed">
                    {value.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  return null;
}
