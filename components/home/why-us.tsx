import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { VALUES } from "@/lib/data";

// Number labels for each value
const VALUE_NUMBERS = ["01", "02", "03", "04"];

export function WhyUs() {
  return (
    <Section bg="cream" spacing="md" hairlineTop>
      <Container size="default">
        {/* Section header */}
        <div className="flex flex-col gap-4 mb-16">
          <Eyebrow color="gold">Giá trị cốt lõi</Eyebrow>
          <h2 className="font-heading text-headline-lg text-navy">
            Bốn nguyên tắc dẫn lối
          </h2>
        </div>

        {/* Values — hairline between rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {VALUES.map((value, index) => (
            <div
              key={value.key}
              className="flex flex-col gap-4 pt-8 pb-10 border-t-hairline border-gold lg:pr-[var(--spacing-gutter)]"
            >
              {/* Number label */}
              <span className="text-label-caps text-gold-700 uppercase tracking-[0.1em]">
                {VALUE_NUMBERS[index] ?? `0${index + 1}`}
              </span>

              {/* Statement */}
              <h3 className="font-heading text-headline-md text-navy">
                {value.title}
              </h3>

              {/* Detail */}
              <p className="text-body-md text-navy/65 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
