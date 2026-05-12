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
        <Container size="lg">
          <div className="max-w-2xl">
            <Eyebrow>LIÊN HỆ</Eyebrow>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight text-balance">
              Bắt đầu cuộc trò chuyện với NHN&D
            </h1>
            <p className="mt-5 text-lg text-navy/75 leading-relaxed text-pretty">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Hãy chia sẻ với chúng tôi
              về tình huống và mục tiêu của doanh nghiệp — chúng tôi sẽ phản hồi trong vòng
              4 giờ làm việc.
            </p>
          </div>
        </Container>
      </Section>

      {/* Form + Info */}
      <Section bg="cream" spacing="md" className="!pt-0">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7 rounded-xl bg-white border border-cream-300 p-6 md:p-8 lg:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-navy mb-2">Gửi yêu cầu tư vấn</h2>
              <p className="text-navy/70 mb-6">
                Vui lòng cung cấp thông tin để chúng tôi phục vụ tốt nhất.
              </p>
              <ContactForm source="lien-he" />
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <OfficeInfo />

              {/* Booking CTA */}
              <div className="rounded-lg bg-navy text-cream p-6 lg:p-8">
                <Calendar className="size-8 text-gold mb-4" aria-hidden />
                <h3 className="text-xl font-bold mb-2">Hoặc đặt lịch online</h3>
                <p className="text-cream/80 text-sm leading-relaxed mb-5">
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
        <Container size="lg">
          <div className="rounded-xl overflow-hidden border border-cream-300 bg-cream-200">
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
      <Section bg="cream-100" spacing="md">
        <Container size="md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>CÂU HỎI THƯỜNG GẶP</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-balance">
              Trước khi bạn liên hệ
            </h2>
          </div>

          <Accordion.Root type="single" collapsible className="bg-white rounded-xl border border-cream-300 px-6 md:px-8">
            {FAQ_CONTACT.map((item, idx) => (
              <Accordion.Item
                key={idx}
                value={`faq-${idx}`}
                className="border-b border-cream-200 last:border-b-0"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-start justify-between py-5 text-left font-semibold text-navy hover:text-gold-700 transition group min-h-[44px]">
                    <span className="text-base md:text-lg pr-6">{item.q}</span>
                    <ChevronDown
                      className="size-5 shrink-0 mt-1 transition-transform group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="pb-5 text-navy/80 leading-relaxed">{item.a}</div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Container>
      </Section>
    </>
  );
}
