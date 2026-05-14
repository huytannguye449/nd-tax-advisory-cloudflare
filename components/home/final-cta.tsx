import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";

export function FinalCta() {
  return (
    <Section bg="navy" spacing="lg">
      <Container size="default">
        <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
          {/* Left — headline block */}
          <div className="flex flex-col gap-6">
            <Eyebrow color="gold">Bắt đầu ngay</Eyebrow>
            <h2 className="font-heading text-display text-cream text-balance">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-body-lg text-cream/70 max-w-md">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Đặt lịch ngay hôm nay.
            </p>
          </div>

          {/* Right — CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end">
            {/* Primary: cream bg, navy text → hover gold (on navy bg) */}
            <Button
              variant="primary"
              size="lg"
              asChild
              className="bg-cream text-navy border-cream hover:bg-gold hover:border-gold hover:text-navy"
            >
              <Link href="/dat-lich">Đặt lịch tư vấn</Link>
            </Button>

            {/* Secondary: transparent cream border */}
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="border-cream/40 text-cream hover:bg-cream hover:text-navy hover:border-cream"
            >
              <Link href="/lien-he">Liên hệ trực tiếp</Link>
            </Button>
          </div>
        </div>

        {/* Gold hairline at bottom for structural close */}
        <hr className="hr-gold mt-16" aria-hidden="true" />
      </Container>
    </Section>
  );
}
