import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { STATS } from "@/lib/data";

export function Stats() {
  return (
    <Section bg="navy" spacing="md">
      <Container size="default">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-3 text-center px-6 py-4 border-t-hairline border-gold lg:border-t-0 lg:border-l-0 lg:first:border-l-0"
              style={index > 0 ? { borderLeft: "0.5pt solid var(--color-gold)" } : undefined}
            >
              {/* Large display number — Playfair on navy */}
              <span className="font-heading text-display text-cream">
                {stat.value}
              </span>
              {/* Label-caps label — gold */}
              <Eyebrow color="gold">{stat.label}</Eyebrow>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
