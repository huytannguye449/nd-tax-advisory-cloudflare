import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CLIENTS } from "@/lib/data";

export function TrustBar() {
  // Duplicate the array so the marquee loop is seamless
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <Section bg="cream" spacing="sm" hairlineTop>
      <Container size="default">
        <div className="flex flex-col items-center gap-6">
          <Eyebrow color="gold">Đối tác tin cậy</Eyebrow>

          {/* Desktop — marquee */}
          <div
            className="relative hidden w-full overflow-hidden md:block"
            aria-label="Danh sách khách hàng"
          >
            {/* Fade edges — cream bg */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent"
              aria-hidden="true"
            />

            <div className="flex w-max animate-marquee gap-12 py-2">
              {doubled.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="whitespace-nowrap font-heading text-headline-sm font-bold text-navy/30 transition-colors duration-200 hover:text-navy/70"
                  aria-hidden={i >= CLIENTS.length ? true : undefined}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile — grid */}
          <div
            className="grid grid-cols-3 gap-x-6 gap-y-4 md:hidden"
            aria-label="Danh sách khách hàng"
          >
            {CLIENTS.map((name) => (
              <span
                key={name}
                className="text-center font-heading text-headline-sm font-bold text-navy/35 transition-colors duration-200"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* Hairline bottom */}
      <div className="border-b-hairline border-gold mt-[var(--spacing-section-sm)]" aria-hidden="true" />
    </Section>
  );
}
