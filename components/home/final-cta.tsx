import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";

export function FinalCta() {
  return (
    <Section bg="navy" spacing="lg">
      <Container size="sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <Eyebrow color="gold">Bắt đầu ngay</Eyebrow>
          <h2 className="text-3xl font-bold text-cream md:text-4xl lg:text-5xl">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-base leading-relaxed text-cream/70 max-w-lg md:text-lg">
            Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Đặt lịch ngay hôm nay.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-2">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/dat-lich">Đặt lịch tư vấn</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-cream/30 text-cream hover:bg-cream hover:text-navy focus-visible:ring-cream"
            >
              <Link href="/lien-he">Liên hệ trực tiếp</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
