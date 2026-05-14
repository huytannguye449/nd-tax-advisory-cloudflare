import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { FounderSection } from "@/components/about/founder-section";
import { TeamGrid } from "@/components/about/team-grid";
import { ValuesGrid } from "@/components/about/values-grid";
import { ClientLogos } from "@/components/about/client-logos";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Câu chuyện và đội ngũ NHN&D Tax Advisory — 20+ năm kinh nghiệm tư vấn thuế chiến lược tại Việt Nam.",
};

export default function VeChungToiPage() {
  return (
    <>
      {/* Hero */}
      <Section bg="cream" spacing="lg">
        <Container size="default">
          <div className="grid lg:grid-cols-2 gap-[var(--spacing-gutter)] items-center">
            <div>
              <Eyebrow color="gold" className="mb-4">
                VỀ CHÚNG TÔI
              </Eyebrow>
              <h1 className="font-heading text-headline-lg text-navy leading-tight mb-6">
                Cố vấn thuế bạn có thể tin cậy
              </h1>
              <p className="text-body-lg text-navy/70 leading-relaxed">
                NHN&amp;D Tax Advisory là advisory boutique chuyên tư vấn thuế chiến lược
                cho SME và FDI tại Việt Nam. Chúng tôi không chỉ đảm bảo tuân thủ —
                chúng tôi đồng hành cùng doanh nghiệp trong mọi quyết định thuế quan trọng,
                từ giai đoạn khởi nghiệp đến tái cấu trúc và M&amp;A.
              </p>
            </div>
            <div className="overflow-hidden aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80"
                alt="Đội ngũ NHN&D Tax Advisory"
                width={1600}
                height={1200}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Brand story */}
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="narrow">
          <div className="mb-8">
            <Eyebrow color="gold" className="mb-3">
              CÂU CHUYỆN
            </Eyebrow>
            <h2 className="font-heading text-headline-md text-navy mt-2">
              Tại sao chúng tôi thành lập NHN&amp;D
            </h2>
          </div>
          <div className="space-y-5 text-body-lg text-navy/80 leading-relaxed">
            <p>
              NHN&amp;D Tax Advisory được thành lập năm 2026 từ một nhận thức đơn giản — sau hơn
              20 năm trong nghề tư vấn thuế tại Việt Nam, chúng tôi nhận ra: phần lớn doanh
              nghiệp Việt không thiếu kế toán giỏi. Họ thiếu một cố vấn thuế chiến lược ở vai
              trò ngang hàng với CEO — người vừa hiểu sâu luật pháp, vừa hiểu kinh doanh, và
              có thể đồng hành lâu dài qua từng quyết định lớn.
            </p>
            <p>
              NHN&amp;D ra đời để lấp khoảng trống đó. Chúng tôi không cạnh tranh với Big4 ở
              quy mô. Chúng tôi cạnh tranh ở chiều sâu — cam kết phục vụ một số lượng giới hạn
              khách hàng để đảm bảo mỗi doanh nghiệp đều nhận được sự chú ý xứng đáng từ những
              chuyên gia hàng đầu của chúng tôi.
            </p>
            <p>
              Mỗi engagement bắt đầu từ việc lắng nghe — thực sự lắng nghe về mục tiêu kinh
              doanh, không chỉ về vấn đề thuế. Bởi vì tư vấn thuế tốt không bao giờ tách rời
              khỏi chiến lược kinh doanh.
            </p>
          </div>
        </Container>
      </Section>

      {/* Founder */}
      <FounderSection />

      {/* Team */}
      <TeamGrid />

      {/* Values */}
      <ValuesGrid />

      {/* Client logos */}
      <ClientLogos />

      {/* Final CTA */}
      <Section bg="navy" spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <Eyebrow color="cream" className="mb-4">
              HỢP TÁC CÙNG CHÚNG TÔI
            </Eyebrow>
            <h2 className="font-heading text-headline-md text-cream mb-4">
              Sẵn sàng đồng hành?
            </h2>
            <p className="text-body-lg text-cream/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Hãy để chúng tôi
              lắng nghe và cùng bạn xác định rõ những gì cần làm.
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
                <Link href="/lien-he">Liên hệ</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
