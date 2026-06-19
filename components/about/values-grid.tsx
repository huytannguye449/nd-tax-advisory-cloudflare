"use client";

import { Target, ShieldCheck, HeartHandshake, Zap } from "lucide-react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { useSiteContent } from "@/components/site/site-content-context";

const VALUE_ICONS: Record<string, React.ReactNode> = {
  "chinh-xac": <Target className="size-6" aria-hidden="true" />,
  "bao-mat": <ShieldCheck className="size-6" aria-hidden="true" />,
  "tan-tam": <HeartHandshake className="size-6" aria-hidden="true" />,
  "sac-ben": <Zap className="size-6" aria-hidden="true" />,
};

const VALUE_NUMBERS = ["01", "02", "03", "04"];

export function ValuesGrid() {
  const { loading, values } = useSiteContent();

  if (loading) return null;

  if (values.length > 0) {
    return (
      <Section bg="cream" spacing="md" hairlineTop aria-labelledby="values-heading">
        <Container size="default">
          <div className="mb-12">
            <Eyebrow color="gold" className="mb-3">
              Giá trị cốt lõi
            </Eyebrow>
            <h2
              id="values-heading"
              className="font-heading text-headline-md text-navy mt-2"
            >
              Bốn nguyên tắc dẫn lối
            </h2>
          </div>
          <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-2">
            {values.map((value, idx) => (
              <div
                key={value.id}
                className="flex items-start gap-6 border-t-hairline border-gold pt-6"
              >
                <div className="shrink-0">
                  <Eyebrow color="gold">{VALUE_NUMBERS[idx] ?? `0${idx + 1}`}</Eyebrow>
                </div>
                <div>
                  {value.icon_key && VALUE_ICONS[value.icon_key] && (
                    <div className="text-navy mb-3" aria-hidden="true">
                      {VALUE_ICONS[value.icon_key]}
                    </div>
                  )}
                  <h3 className="font-heading text-headline-sm text-navy mb-2">
                    {value.title}
                  </h3>
                  {value.description && (
                    <p className="text-body-md text-navy/70 leading-relaxed">
                      {value.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  return null;
}
