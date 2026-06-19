"use client";

import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useSiteContent } from "@/components/site/site-content-context";

export function FinalCta() {
  const { loading, sections } = useSiteContent();
  const cta = sections.final_cta;

  if (loading) {
    return (
      <Section bg="navy" spacing="lg">
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <div className="h-4 w-32 bg-cream/10" />
              <div className="h-24 max-w-md bg-cream/10" />
              <div className="h-12 max-w-sm bg-cream/10" />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (cta?.title) {
    return (
      <Section bg="navy" spacing="lg">
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              {cta.eyebrow && <Eyebrow color="gold">{cta.eyebrow}</Eyebrow>}
              <h2 className="font-heading text-display text-cream text-balance">
                {cta.title}
              </h2>
              {cta.subtitle && (
                <p className="text-body-lg text-cream/70 max-w-md">
                  {cta.subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end">
              {cta.cta_label && cta.cta_href && (
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="border-cream/40 text-cream hover:bg-gold hover:text-navy hover:border-gold"
                >
                  <Link href={cta.cta_href}>{cta.cta_label}</Link>
                </Button>
              )}
              {cta.secondary_cta_label && cta.secondary_cta_href && (
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="border-cream/40 text-cream hover:bg-gold hover:text-navy hover:border-gold"
                >
                  <Link href={cta.secondary_cta_href}>{cta.secondary_cta_label}</Link>
                </Button>
              )}
            </div>
          </div>
          <hr className="hr-gold mt-16" aria-hidden="true" />
        </Container>
      </Section>
    );
  }

  return null;
}
