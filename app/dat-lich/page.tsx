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
      <Container size="md">
        <div className="text-center mb-10">
          <Eyebrow>ĐẶT LỊCH TƯ VẤN</Eyebrow>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold text-balance">
            Buổi tư vấn đầu tiên hoàn toàn miễn phí
          </h1>
          <p className="mt-5 text-lg text-navy/75 max-w-2xl mx-auto leading-relaxed text-pretty">
            Chọn dịch vụ, thời gian phù hợp với bạn. Anh Ngọc sẽ trực tiếp tư vấn 30 phút và gửi
            link Zoom/Meet (nếu chọn online) qua email.
          </p>
        </div>
        <BookingForm />
      </Container>
    </Section>
  );
}
