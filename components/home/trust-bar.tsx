"use client";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useSiteContent } from "@/components/site/site-content-context";

export function TrustBar() {
  const { loading, clientLogos, homeClientLogos } = useSiteContent();

  if (loading) return null;

  const logos =
    homeClientLogos.length > 0 ? homeClientLogos : clientLogos.slice(0, 8);

  if (logos.length > 0) {
    return (
      <Section bg="cream" spacing="sm" hairlineTop>
        <Container size="default">
          <div className="flex flex-col items-center gap-6">
            <Eyebrow color="gold">Đối tác tin cậy</Eyebrow>
            <ul
              className="grid w-full grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-8"
              aria-label="Danh sách khách hàng nổi bật"
            >
              {logos.map((client) => (
                <li key={client.id}>
                  <div className="flex aspect-[3/2] items-center justify-center border-t-hairline border-gold px-3 pt-4">
                    {client.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={client.logo_url}
                        alt={client.name}
                        className="max-h-12 max-w-full object-contain opacity-75 transition-opacity duration-200 hover:opacity-100"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-center font-heading text-body-sm font-bold leading-tight text-navy/40 transition-colors duration-200 hover:text-navy/70">
                        {client.name}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
        <div
          className="mt-[var(--spacing-section-sm)] border-b-hairline border-gold"
          aria-hidden="true"
        />
      </Section>
    );
  }

  return null;
}
