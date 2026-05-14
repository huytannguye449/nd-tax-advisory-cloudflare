import { CLIENTS } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

export function ClientLogos() {
  return (
    <Section bg="cream-100" spacing="md" hairlineTop aria-labelledby="clients-heading">
      <Container size="default">
        <div className="mb-12">
          <Eyebrow color="gold" className="mb-3">
            ĐỒNG HÀNH CÙNG
          </Eyebrow>
          <h2
            id="clients-heading"
            className="font-heading text-headline-md text-navy mt-2"
          >
            Những doanh nghiệp đã tin tưởng NHN&amp;D
          </h2>
        </div>

        <ul
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-[var(--spacing-gutter)]"
          aria-label="Danh sách khách hàng"
        >
          {CLIENTS.map((name) => (
            <li key={name}>
              <div className="aspect-[3/2] flex items-center justify-center border-t-hairline border-gold pt-4 px-2">
                <span className="font-heading text-body-sm text-navy/50 text-center leading-tight">
                  {name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
