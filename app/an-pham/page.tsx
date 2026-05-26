import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { PublicationsLive } from "@/components/content/publications-live";

export const metadata: Metadata = {
  title: "Ấn phẩm",
  description:
    "Ấn phẩm, phân tích chuyên môn và cập nhật chính sách thuế cho founder, CFO và đội ngũ điều hành.",
};

export default function AnPhamPage() {
  return (
    <>
      <Section bg="cream" spacing="sm" className="py-12 md:py-16">
        <Container size="xl">
          <div className="max-w-4xl">
            <h1 className="font-heading text-headline-lg leading-[1.08] text-navy text-balance">
              Phân tích chuyên môn cho quyết định thuế và quản trị
            </h1>
            <p className="mt-4 max-w-2xl text-body-md leading-relaxed text-navy/70">
              Cập nhật những thay đổi mới nhất về chính sách thuế, pháp luật
              kinh doanh và các báo cáo phân tích chuyên sâu từ đội ngũ cố vấn
              của NHN&amp;D.
            </p>
          </div>
        </Container>
      </Section>

      <PublicationsLive />
    </>
  );
}
