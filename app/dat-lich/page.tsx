import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { BookingForm } from "@/components/contact/booking-form";

export const metadata: Metadata = {
  title: "Đặt lịch tư vấn",
  description:
    "Đặt lịch tư vấn miễn phí 45 phút với NHN&D Tax Advisory. Chọn slot phù hợp — chúng tôi sẽ confirm trong 4 giờ.",
};

export default function BookingPage() {
  return (
    <Section bg="cream" spacing="md">
      <Container size="narrow">
        <div className="mb-12">
          <Eyebrow color="gold" className="mb-4">ĐẶT LỊCH TƯ VẤN</Eyebrow>
          <h1 className="font-heading text-headline-lg text-navy mt-3">
            Buổi tư vấn đầu tiên hoàn toàn miễn phí
          </h1>
          <p className="mt-5 text-body-lg text-navy/75 leading-relaxed text-pretty">
            Chọn dịch vụ, thời gian phù hợp với bạn. Anh Ngọc sẽ trực tiếp tư vấn 30 phút và gửi
            link Zoom/Meet (nếu chọn online) qua email.
          </p>
        </div>
        <BookingForm />
      </Container>
    </Section>
  );
}
