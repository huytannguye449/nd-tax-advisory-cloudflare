import { CLIENTS } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

export function ClientLogos() {
  return (
    <section className="bg-cream-100 py-16 md:py-24" aria-labelledby="clients-heading">
      <Container size="xl">
        <div className="text-center mb-12">
          <Eyebrow color="gold" className="mb-3">
            ĐỒNG HÀNH CÙNG
          </Eyebrow>
          <h2
            id="clients-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2"
          >
            Những doanh nghiệp đã tin tưởng NHN&amp;D
          </h2>
        </div>

        <ul
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4"
          aria-label="Danh sách khách hàng"
        >
          {CLIENTS.map((name) => (
            <li key={name}>
              <div className="aspect-[3/2] flex items-center justify-center border border-cream-300 rounded-lg p-4 hover:border-gold transition-colors bg-white">
                <span className="font-heading text-base lg:text-lg font-bold text-navy/50 text-center leading-tight">
                  {name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
