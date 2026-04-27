import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";

export function BrandStory() {
  return (
    <Section bg="cream" spacing="md">
      <Container size="sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <Eyebrow color="gold">Về N&amp;D</Eyebrow>
          <h2 className="text-3xl font-bold leading-tight text-navy md:text-4xl">
            Đối tác cố vấn cho doanh nghiệp Việt
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-navy/70 md:text-lg">
            <p>
              N&amp;D Tax Advisory ra đời từ một nhận định đơn giản: rủi ro thuế là rào cản lớn nhất
              khiến nhiều doanh nghiệp Việt không dám mở rộng. Sau 20 năm trong ngành — từ Big4 đến
              vai trò CFO tại các tập đoàn lớn — chúng tôi tin rằng tư vấn thuế tốt không chỉ là
              tránh sai sót, mà là chiến lược tài chính giúp chủ doanh nghiệp ra quyết định nhanh,
              đúng, và an tâm.
            </p>
            <p>
              Mỗi khách hàng của N&amp;D nhận được không chỉ một đối tác kế toán, mà một cố vấn đồng
              hành dài hạn — am hiểu luật, sắc bén với thị trường, và tận tâm với từng chi tiết.
            </p>
          </div>

          {/* Gold accent divider */}
          <div className="h-px w-16 bg-gold mt-2" aria-hidden="true" />
        </div>
      </Container>
    </Section>
  );
}
