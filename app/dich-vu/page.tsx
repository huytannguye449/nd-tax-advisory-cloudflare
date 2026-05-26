import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { ServicesFaq } from "@/components/services/services-faq";
import { ServicesLive } from "@/components/services/services-live";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "Tư vấn thuế chiến lược, kiện toàn kế toán, cấu trúc kinh doanh và đào tạo doanh nghiệp.",
};

export default function DichVuPage() {
  return (
    <>
      <Section bg="cream" spacing="sm" className="py-12 md:py-16">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-body-sm text-navy/50">
              <li>
                <Link href="/" className="transition hover:text-navy/80">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-navy">Dịch vụ</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <Eyebrow color="gold" className="mb-4">
              DỊCH VỤ
            </Eyebrow>
            <h1 className="font-heading text-headline-lg leading-[1.08] text-navy text-balance">
              Các lĩnh vực chuyên sâu phục vụ quyết định thuế và quản trị.
            </h1>
            <p className="mt-4 max-w-2xl text-body-md leading-relaxed text-navy/70">
              Các nhóm dịch vụ được xây dựng cho nhu cầu thuế, quản trị và vận
              hành doanh nghiệp.
            </p>
          </div>
        </Container>
      </Section>

      <ServicesLive />

      <ServicesFaq />

      <Section bg="navy" spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <Eyebrow color="cream" className="mb-4">
              LÀM VIỆC CÙNG NHN&amp;D
            </Eyebrow>
            <h2 className="mb-4 font-heading text-headline-md text-cream">
              Trao đổi trực tiếp với đội ngũ tư vấn
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-body-lg leading-relaxed text-cream/72">
              Buổi tư vấn đầu tiên giúp xác định bối cảnh, mức độ rủi ro và phạm
              vi hỗ trợ phù hợp.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/dat-lich">Đặt lịch tư vấn</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/lien-he">Liên hệ trực tiếp</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
