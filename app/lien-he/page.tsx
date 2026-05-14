import type { Metadata } from "next";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, ChevronDown, Calendar } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { ContactForm } from "@/components/contact/contact-form";
import { OfficeInfo } from "@/components/contact/office-info";
import { FAQ_CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ NHN&D Tax Advisory để được tư vấn thuế chiến lược. Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section bg="cream" spacing="md">
        <Container size="default">
          <div className="max-w-2xl">
            <Eyebrow color="gold" className="mb-4">LIÊN HỆ</Eyebrow>
            <h1 className="font-heading text-headline-lg text-navy leading-tight mt-3">
              Bắt đầu cuộc trò chuyện với NHN&D
            </h1>
            <p className="mt-5 text-body-lg text-navy/75 leading-relaxed text-pretty">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Hãy chia sẻ với chúng tôi
              về tình huống và mục tiêu của doanh nghiệp — chúng tôi sẽ phản hồi trong vòng
              4 giờ làm việc.
            </p>
          </div>
        </Container>
      </Section>

      {/* Form + Info */}
      <Section bg="cream" spacing="md" className="!pt-0">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Form panel — flat, hairline top only */}
            <div className="lg:col-span-7 border-t-hairline border-gold pt-8">
              <h2 className="font-heading text-headline-sm text-navy mb-2">Gửi yêu cầu tư vấn</h2>
              <p className="text-body-md text-navy/70 mb-8">
                Vui lòng cung cấp thông tin để chúng tôi phục vụ tốt nhất.
              </p>
              <ContactForm source="lien-he" />
            </div>

            <aside className="lg:col-span-5 space-y-8">
              <OfficeInfo />

              {/* Booking CTA — flat navy block */}
              <div className="bg-navy text-cream p-6 lg:p-8">
                <Calendar className="size-6 text-gold mb-4" aria-hidden />
                <h3 className="font-heading text-headline-sm text-cream mb-2">Hoặc đặt lịch online</h3>
                <p className="text-body-sm text-cream/80 leading-relaxed mb-6">
                  Chọn slot phù hợp với bạn. Anh Ngọc sẽ confirm và gửi link Zoom/Meet
                  trong 4 giờ.
                </p>
                <Button asChild variant="secondary" fullWidth>
                  <Link href="/dat-lich">
                    Đặt lịch tư vấn miễn phí
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Map */}
      <Section bg="cream" spacing="sm" className="!pt-0">
        <Container size="default">
          <div className="overflow-hidden border-t-hairline border-gold bg-cream-200">
            <iframe
              title="Bản đồ văn phòng NHN&D Tax Advisory"
              src="https://www.openstreetmap.org/export/embed.html?bbox=105.8342%2C21.0285%2C105.8542%2C21.0385&layer=mapnik&marker=21.0335%2C105.8442"
              loading="lazy"
              className="w-full h-[300px] md:h-[400px] border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="narrow">
          <div className="mb-10">
            <Eyebrow color="gold" className="mb-3">CÂU HỎI THƯỜNG GẶP</Eyebrow>
            <h2 className="font-heading text-headline-md text-navy mt-3">
              Trước khi bạn liên hệ
            </h2>
          </div>

          <Accordion.Root type="single" collapsible>
            {FAQ_CONTACT.map((item, idx) => (
              <Accordion.Item
                key={idx}
                value={`faq-${idx}`}
                className="border-b border-cream-300 last:border-b-0"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-start justify-between py-5 text-left group min-h-[44px]">
                    <span className="text-body-md text-navy font-semibold pr-6 group-data-[state=open]:text-gold-700 transition-colors">
                      {item.q}
                    </span>
                    <ChevronDown
                      className="size-5 shrink-0 mt-1 text-gold transition-transform group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="pb-5 text-body-md text-navy/80 leading-relaxed">{item.a}</div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Container>
      </Section>
    </>
  );
}
