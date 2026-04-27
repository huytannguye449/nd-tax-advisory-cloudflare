import { Target, ShieldCheck, HeartHandshake, Zap } from "lucide-react";
import { VALUES } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

const VALUE_ICONS: Record<string, React.ReactNode> = {
  "chinh-xac": <Target className="size-7" aria-hidden="true" />,
  "bao-mat": <ShieldCheck className="size-7" aria-hidden="true" />,
  "tan-tam": <HeartHandshake className="size-7" aria-hidden="true" />,
  "sac-ben": <Zap className="size-7" aria-hidden="true" />,
};

export function ValuesGrid() {
  return (
    <section className="bg-cream py-16 md:py-24" aria-labelledby="values-heading">
      <Container size="xl">
        <div className="text-center mb-12">
          <Eyebrow color="gold" className="mb-3">
            GIÁ TRỊ CỐT LÕI
          </Eyebrow>
          <h2
            id="values-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2"
          >
            Bốn nguyên tắc dẫn lối
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {VALUES.map((value) => (
            <div
              key={value.key}
              className="bg-white rounded-xl p-8 border border-cream-300 flex items-start gap-5 shadow-sm"
            >
              <div
                className="size-12 rounded-lg bg-navy/5 flex items-center justify-center text-navy shrink-0"
                aria-hidden="true"
              >
                {VALUE_ICONS[value.key]}
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-navy mb-2">
                  {value.title}
                </h3>
                <p className="text-navy/70 leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
