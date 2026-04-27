import Link from "next/link";
import { ScrollText, Scale, Building2, GraduationCap, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SERVICES } from "@/lib/data";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "kien-toan-ke-toan": ScrollText,
  "tu-van-phap-ly": Scale,
  "cau-truc-kinh-doanh": Building2,
  "dao-tao": GraduationCap,
};

export function ServicesPreview() {
  return (
    <Section bg="cream" spacing="md" className="bg-cream-100">
      <Container size="xl">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Eyebrow color="gold">Dịch vụ</Eyebrow>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Bốn lĩnh vực chuyên sâu
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? ScrollText;
            return (
              <article
                key={service.slug}
                className={cn(
                  "group flex flex-col gap-4 rounded-xl border border-cream-200 bg-white p-6",
                  "transition-all duration-200 hover:border-gold hover:shadow-md",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-lg",
                    "bg-cream-100 text-gold-700 transition-colors duration-200",
                    "group-hover:bg-gold/10",
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-bold text-navy leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-navy/60 flex-1">
                    {service.short}
                  </p>
                </div>

                <Link
                  href={`/dich-vu#${service.slug}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700",
                    "transition-colors duration-200 hover:text-navy",
                    "min-h-[44px] self-start",
                  )}
                  aria-label={`Tìm hiểu thêm về ${service.title}`}
                >
                  Tìm hiểu
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
