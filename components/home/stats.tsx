import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { STATS } from "@/lib/data";

export function Stats() {
  return (
    <Section bg="navy" spacing="md">
      <Container size="xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <span className="font-heading text-5xl font-bold text-gold md:text-6xl">
                {stat.value}
              </span>
              <span className="text-sm font-medium leading-snug text-cream/70 md:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
