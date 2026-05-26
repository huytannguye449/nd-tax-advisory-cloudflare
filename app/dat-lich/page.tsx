import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { BookingForm } from "@/components/contact/booking-form";

export const metadata: Metadata = {
  title: "Đặt lịch tư vấn",
  description:
    "Đặt lịch tư vấn chuyên sâu với NHN&D Tax Advisory.",
};

export default function BookingPage() {
  return (
    <Section bg="cream" spacing="md">
      <Container size="default">
        <div className="mx-auto mb-12 max-w-[800px] text-center md:mb-16">
          <h1 className="font-heading text-display-mobile text-navy md:text-display-lg">
            Đặt lịch tư vấn chuyên sâu
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-body-lg leading-relaxed text-navy/70">
            Khởi đầu cho lộ trình tài chính và thuế tối ưu. Đội ngũ chuyên gia
            của chúng tôi sẵn sàng lắng nghe và giải quyết những thách thức
            phức tạp nhất của doanh nghiệp bạn với sự chuẩn xác và bảo mật
            tuyệt đối.
          </p>
        </div>

        <div className="mx-auto max-w-[800px]">
          <BookingForm />
        </div>
      </Container>
    </Section>
  );
}
