import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Logo } from "@/components/shared/logo";

export function Hero() {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text column */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {/* Brand mark — minimal, theo brand guideline section 08 */}
              <Logo variant="primary" size="xl" className="self-start" />

              <h1 className="font-heading text-4xl font-bold leading-[1.1] text-balance md:text-5xl xl:text-6xl text-navy">
                Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế.
              </h1>
              <p className="text-lg leading-relaxed text-navy/70 text-pretty md:text-xl max-w-xl">
                Tư vấn thuế chiến lược cho SME &amp; FDI tại Việt Nam, dẫn dắt bởi đội ngũ CPA/CPTA với 20 năm kinh nghiệm tại Vingroup &amp; MIK Group.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/dat-lich">Đặt lịch tư vấn</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dich-vu">Xem dịch vụ</Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-3 text-sm text-navy/60">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span>Buổi tư vấn đầu tiên 45 phút miễn phí</span>
            </div>
          </div>

          {/* Image column */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80"
              alt="Văn phòng tư vấn chuyên nghiệp — NHN&D Tax Advisory"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay to reinforce brand */}
            <div
              className="absolute inset-0 bg-navy/10"
              aria-hidden="true"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
