import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { SERVICES, SERVICE_BUNDLE } from "@/lib/data";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { ServiceBlock } from "@/components/services/service-block";
import { ServicesFaq } from "@/components/services/services-faq";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "Tư vấn thuế chiến lược, kiện toàn kế toán, cấu trúc kinh doanh, đào tạo doanh nghiệp.",
};

const SERVICE_ANCHORS = [
  { slug: "kien-toan-ke-toan", label: "Kiện toàn kế toán" },
  { slug: "tu-van-phap-ly", label: "Tư vấn pháp lý & thuế" },
  { slug: "cau-truc-kinh-doanh", label: "Cấu trúc kinh doanh" },
  { slug: "dao-tao", label: "Đào tạo doanh nghiệp" },
];

export default function DichVuPage() {
  return (
    <>
      {/* Hero */}
      <Section bg="cream" spacing="lg">
        <Container size="default">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-body-sm text-navy/50">
              <li>
                <Link href="/" className="hover:text-navy/80 transition">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-navy font-medium">Dịch vụ</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Eyebrow color="gold" className="mb-4">
              DỊCH VỤ
            </Eyebrow>
            <h1 className="font-heading text-headline-lg text-navy leading-tight mb-6">
              Bốn lĩnh vực chuyên sâu phục vụ doanh nghiệp
            </h1>
            <p className="text-body-lg text-navy/70 leading-relaxed">
              NHN&amp;D Tax Advisory cung cấp bốn nhóm dịch vụ cốt lõi, được thiết kế để
              đáp ứng toàn diện nhu cầu tư vấn thuế và tài chính của doanh nghiệp SME và FDI
              tại Việt Nam. Từ kiện toàn quy trình kế toán đến cấu trúc chiến lược dài hạn —
              mỗi giải pháp đều được cá nhân hóa theo thực tế của từng doanh nghiệp.
            </p>
          </div>
        </Container>
      </Section>

      {/* Anchor nav strip — hidden on mobile, sticky on md+ */}
      <div className="hidden md:block bg-cream-100 border-b border-cream-300 sticky top-0 z-30">
        <Container size="default">
          <nav
            aria-label="Danh mục dịch vụ"
            className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-none"
          >
            {SERVICE_ANCHORS.map((item) => (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className="whitespace-nowrap text-label-caps uppercase tracking-[0.1em] text-navy/60 hover:text-navy transition-colors min-h-[44px] flex items-center px-1"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* Bundle banner */}
      <Section bg="cream-100" spacing="sm" hairlineTop>
        <Container size="default">
          <div className="bg-navy text-cream p-8 md:p-10 lg:p-12 grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="size-4 text-gold" aria-hidden />
                <span className="text-label-caps uppercase tracking-[0.1em] text-gold">
                  Gói được khuyên dùng
                </span>
              </div>
              <h2 className="font-heading text-headline-sm text-cream mb-3">
                {SERVICE_BUNDLE.title}
              </h2>
              <p className="text-body-md text-cream/80 leading-relaxed mb-2">
                {SERVICE_BUNDLE.description}
              </p>
              <p className="text-label-caps text-cream/55">{SERVICE_BUNDLE.priceNote}</p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4 lg:items-end lg:text-right">
              <div>
                <p className="text-label-caps text-cream/60 uppercase tracking-[0.1em]">
                  Phí dịch vụ
                </p>
                <p className="font-heading text-headline-lg text-gold mt-1">
                  120 triệu
                </p>
                <p className="text-body-sm text-cream/60">/ 6 tháng đồng hành</p>
              </div>
              <Button asChild variant="secondary" size="md">
                <Link href="/dat-lich">
                  Đặt lịch tư vấn
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4 Service blocks */}
      {SERVICES.map((service, idx) => (
        <ServiceBlock key={service.slug} service={service} idx={idx} />
      ))}

      {/* FAQ */}
      <ServicesFaq />

      {/* Final CTA */}
      <Section bg="navy" spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <Eyebrow color="cream" className="mb-4">
              BẮT ĐẦU NGAY HÔM NAY
            </Eyebrow>
            <h2 className="font-heading text-headline-md text-cream mb-4">
              Bắt đầu hành trình tối ưu thuế cùng NHN&amp;D
            </h2>
            <p className="text-body-lg text-cream/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Chúng tôi sẽ lắng nghe
              và đề xuất giải pháp phù hợp nhất với doanh nghiệp của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/dat-lich">Đặt lịch tư vấn miễn phí</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link href="/lien-he">Liên hệ trực tiếp</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
