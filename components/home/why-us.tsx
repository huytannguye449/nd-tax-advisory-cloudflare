import { Target, ShieldCheck, HeartHandshake, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { VALUES } from "@/lib/data";

const VALUE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "chinh-xac": Target,
  "bao-mat": ShieldCheck,
  "tan-tam": HeartHandshake,
  "sac-ben": Zap,
};

export function WhyUs() {
  return (
    <Section bg="cream" spacing="md">
      <Container size="xl">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Eyebrow color="gold">Giá trị cốt lõi</Eyebrow>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Bốn nguyên tắc dẫn lối
          </h2>
        </div>

        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => {
            const Icon = VALUE_ICONS[value.key] ?? Target;
            return (
              <div key={value.key} className="flex flex-col gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold-700"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-gold-700">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-navy/65">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
