import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
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
              <Link
                href="/dat-lich"
                className="inline-flex h-14 min-h-[44px] items-center justify-center border border-cream bg-transparent px-9 text-[15px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Đặt lịch tư vấn
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex h-14 min-h-[44px] items-center justify-center border border-cream bg-transparent px-9 text-[15px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Liên hệ trực tiếp
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
