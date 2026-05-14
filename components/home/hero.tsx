import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";

export function Hero() {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="default">
        <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
          {/* Text column */}
          <div className="flex flex-col gap-10">
            {/* Eyebrow above headline */}
            <Eyebrow color="gold">Tư vấn thuế chiến lược</Eyebrow>

            <div className="flex flex-col gap-6">
              <h1 className="text-display font-heading text-navy text-balance">
                Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế.
              </h1>
              <p className="text-body-lg font-body text-navy/70 text-pretty max-w-xl">
                Tư vấn thuế chiến lược cho SME &amp; FDI tại Việt Nam, dẫn dắt bởi đội ngũ CPA/CPTA với 20 năm kinh nghiệm tại Vingroup &amp; MIK Group.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/dat-lich">Đặt lịch tư vấn</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/dich-vu">Xem dịch vụ</Link>
              </Button>
            </div>

            {/* Trust signal — hairline + label-caps */}
            <div className="flex items-center gap-4">
              <hr className="hr-gold w-8" aria-hidden="true" />
              <span className="text-label-caps text-navy/60 uppercase tracking-[0.1em]">
                Buổi tư vấn đầu tiên 45 phút miễn phí
              </span>
            </div>
          </div>

          {/* Image column — sharp corners, no shadow */}
          <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[560px] border-t-hairline border-gold">
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80"
              alt="Văn phòng tư vấn chuyên nghiệp — NHN&D Tax Advisory"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Navy overlay */}
            <div
              className="absolute inset-0 bg-navy/10"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Gold hairline divider after content */}
        <hr className="hr-gold mt-16" aria-hidden="true" />
      </Container>
    </Section>
  );
}
