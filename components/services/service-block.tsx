import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ScrollText, Scale, Building2, GraduationCap } from "lucide-react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";

type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  when: readonly string[];
  process: readonly string[];
  deliverables: readonly string[];
  pricing: string;
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "kien-toan-ke-toan": <ScrollText className="size-5" aria-hidden="true" />,
  "tu-van-phap-ly": <Scale className="size-5" aria-hidden="true" />,
  "cau-truc-kinh-doanh": <Building2 className="size-5" aria-hidden="true" />,
  "dao-tao": <GraduationCap className="size-5" aria-hidden="true" />,
};

const SERVICE_IMAGES: Record<string, string> = {
  "kien-toan-ke-toan": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80",
  "tu-van-phap-ly": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80",
  "cau-truc-kinh-doanh": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
  "dao-tao": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80",
};

const SERVICE_IMAGE_ALTS: Record<string, string> = {
  "kien-toan-ke-toan": "Chuyên gia kế toán làm việc với báo cáo tài chính",
  "tu-van-phap-ly": "Tư vấn pháp lý và thuế chuyên nghiệp",
  "cau-truc-kinh-doanh": "Cấu trúc tổ chức doanh nghiệp hiện đại",
  "dao-tao": "Buổi đào tạo kế toán và thuế doanh nghiệp",
};

const SERVICE_NUMBERS = ["01", "02", "03", "04"];

interface ServiceBlockProps {
  service: Service;
  idx: number;
}

export function ServiceBlock({ service, idx }: ServiceBlockProps) {
  const imageFirst = idx % 2 !== 0;
  const bgClass = idx % 2 === 0 ? "bg-cream" : "bg-cream-100";
  const imageUrl = SERVICE_IMAGES[service.slug];
  const imageAlt = SERVICE_IMAGE_ALTS[service.slug];
  const icon = SERVICE_ICONS[service.slug];
  const isFirst = idx === 0;

  return (
    <section
      id={service.slug}
      className={`${bgClass} py-[var(--spacing-section-md)] border-t-hairline border-gold scroll-mt-20`}
      aria-labelledby={`service-heading-${service.slug}`}
    >
      <Container size="default">
        <div
          className={`flex flex-col gap-[var(--spacing-gutter)] lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center ${
            imageFirst ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text side */}
          <div className={imageFirst ? "lg:order-1" : ""}>
            <div className="flex items-center gap-3 mb-4">
              <Eyebrow color="gold">
                {SERVICE_NUMBERS[idx] ?? `0${idx + 1}`}
              </Eyebrow>
              <span className="text-gold" aria-hidden="true">{icon}</span>
            </div>
            <h2
              id={`service-heading-${service.slug}`}
              className="font-heading text-headline-md text-navy mb-3"
            >
              {service.title}
            </h2>
            <p className="text-body-lg text-gold-700 italic mb-6 leading-relaxed">
              {service.short}
            </p>
            <p className="text-body-md text-navy/80 leading-relaxed mb-10">
              {service.description}
            </p>

            {/* Data panels — hairline top, no card bg/shadow */}
            <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 mb-10">
              {/* Khi nào cần */}
              <div className="border-t-hairline border-gold pt-5">
                <h3 className="text-label-caps text-navy uppercase tracking-[0.1em] mb-4">
                  Khi nào doanh nghiệp cần
                </h3>
                <ul className="space-y-2">
                  {service.when.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-body-sm text-navy/80">
                      <CheckCircle2
                        className="size-4 text-gold-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quy trình */}
              <div className="border-t-hairline border-gold pt-5">
                <h3 className="text-label-caps text-navy uppercase tracking-[0.1em] mb-4">
                  Quy trình triển khai
                </h3>
                <ol className="space-y-2">
                  {service.process.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-body-sm text-navy/80">
                      <span
                        className="size-6 bg-navy text-cream flex items-center justify-center text-xs font-semibold shrink-0"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sản phẩm bàn giao */}
              <div className="border-t-hairline border-gold pt-5">
                <h3 className="text-label-caps text-navy uppercase tracking-[0.1em] mb-4">
                  Sản phẩm bàn giao
                </h3>
                <ul className="space-y-2">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-body-sm text-navy/80">
                      <CheckCircle2
                        className="size-4 text-gold-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phí tham khảo */}
              <div className="border-t-hairline border-gold pt-5">
                <h3 className="text-label-caps text-navy uppercase tracking-[0.1em] mb-4">
                  Phí tham khảo
                </h3>
                <p className="text-body-md text-navy font-semibold">{service.pricing}</p>
                <p className="text-label-caps text-navy/60 mt-1.5">
                  * Báo giá chính xác sau buổi tư vấn miễn phí đầu tiên
                </p>
              </div>
            </div>

            <Button asChild variant="primary" size="lg">
              <Link href="/dat-lich">Đặt lịch tư vấn về dịch vụ này</Link>
            </Button>
          </div>

          {/* Image side */}
          <div className={`relative ${imageFirst ? "lg:order-0" : ""}`}>
            <div className="overflow-hidden aspect-[3/2]">
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={900}
                height={600}
                className="object-cover w-full h-full"
                priority={isFirst}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
