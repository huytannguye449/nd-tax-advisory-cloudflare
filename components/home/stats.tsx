"use client";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useSiteContent } from "@/components/site/site-content-context";

export function Stats() {
  const { loading, stats } = useSiteContent();

  if (loading) return null;

  if (stats.length > 0) {
    return (
      <Section bg="navy" spacing="md">
        <Container size="default">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="flex flex-col items-center gap-3 text-center px-6 py-4 border-t-hairline border-gold lg:border-t-0 lg:border-l-0 lg:first:border-l-0"
                style={index > 0 ? { borderLeft: "0.5pt solid var(--color-gold)" } : undefined}
              >
                <span className="font-heading text-display text-cream">
                  {stat.value}
                </span>
                <Eyebrow color="gold">{stat.label}</Eyebrow>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  return null;
}
