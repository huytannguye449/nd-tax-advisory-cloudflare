import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";

export function BrandStory() {
  return (
    <Section bg="cream" spacing="md" hairlineTop>
      <Container size="default">
        {/* Asymmetric 12-col grid: eyebrow + headline left, body right */}
        <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-12 lg:items-start">
          {/* Left column — eyebrow + headline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Eyebrow color="gold">Về NHN&amp;D</Eyebrow>
            <h2 className="font-heading text-headline-lg text-navy text-balance">
              Đối tác cố vấn cho doanh nghiệp Việt
            </h2>
          </div>

          {/* Right column — body paragraphs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-0">
            <p className="text-body-lg text-navy/70 pb-8 border-b-hairline border-gold">
              NHN&amp;D Tax Advisory ra đời từ một nhận định đơn giản: rủi ro thuế là rào cản lớn nhất
              khiến nhiều doanh nghiệp Việt không dám mở rộng. Sau 20 năm trong ngành — từ Big4 đến
              vai trò CFO tại các tập đoàn lớn — chúng tôi tin rằng tư vấn thuế tốt không chỉ là
              tránh sai sót, mà là chiến lược tài chính giúp chủ doanh nghiệp ra quyết định nhanh,
              đúng, và an tâm.
            </p>
            <p className="text-body-lg text-navy/70 pt-8">
              Mỗi khách hàng của NHN&amp;D nhận được không chỉ một đối tác kế toán, mà một cố vấn đồng
              hành dài hạn — am hiểu luật, sắc bén với thị trường, và tận tâm với từng chi tiết.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
