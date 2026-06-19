"use client";

import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { useSiteContent } from "@/components/site/site-content-context";

export function ClientLogos() {
  const { loading, clientLogos } = useSiteContent();

  if (loading) return null;

  if (clientLogos.length > 0) {
    return (
      <Section bg="cream-100" spacing="md" hairlineTop aria-labelledby="clients-heading">
        <Container size="default">
          <div className="mb-12">
            <Eyebrow color="gold" className="mb-3">
              Đồng hành cùng
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
            {clientLogos.map((client) => (
              <li key={client.id}>
                <div className="aspect-[3/2] flex items-center justify-center border-t-hairline border-gold pt-4 px-2">
                  {client.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={client.logo_url}
                      alt={client.name}
                      className="max-h-12 max-w-full object-contain opacity-70"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-heading text-body-sm text-navy/50 text-center leading-tight">
                      {client.name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    );
  }

  return null;
}
