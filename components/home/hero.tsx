"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useSiteContent } from "@/components/site/site-content-context";

export function Hero() {
  const { loading, sections } = useSiteContent();
  const hero = sections.hero;

  if (loading) {
    return (
      <Section bg="cream" spacing="lg">
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="h-4 w-40 bg-navy/10" />
              <div className="h-28 max-w-xl bg-navy/10" />
              <div className="h-16 max-w-lg bg-navy/10" />
            </div>
            <div className="aspect-[4/3] bg-navy/10 lg:h-[560px]" />
          </div>
        </Container>
      </Section>
    );
  }

  if (hero?.title) {
    return (
      <Section bg="cream" spacing="lg">
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-10">
              {hero.eyebrow && <Eyebrow color="gold">{hero.eyebrow}</Eyebrow>}
              <div className="flex flex-col gap-6">
                <h1 className="text-display font-heading text-navy text-balance">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-body-lg font-body text-navy/70 text-pretty max-w-xl">
                    {hero.subtitle}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {hero.cta_label && hero.cta_href && (
                  <Button variant="primary" size="lg" asChild>
                    <Link href={hero.cta_href}>{hero.cta_label}</Link>
                  </Button>
                )}
                {hero.secondary_cta_label && hero.secondary_cta_href && (
                  <Button variant="secondary" size="lg" asChild>
                    <Link href={hero.secondary_cta_href}>{hero.secondary_cta_label}</Link>
                  </Button>
                )}
              </div>
              {hero.body && (
                <div className="flex items-center gap-4">
                  <hr className="hr-gold w-8" aria-hidden="true" />
                  <span className="text-label-caps text-navy/60 uppercase tracking-[0.1em]">
                    {hero.body}
                  </span>
                </div>
              )}
            </div>

            {hero.image_url && (
              <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[560px] border-t-hairline border-gold">
                <Image
                  src={hero.image_url}
                  alt={hero.image_alt || hero.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-navy/10" aria-hidden="true" />
              </div>
            )}
          </div>

          <hr className="hr-gold mt-16" aria-hidden="true" />
        </Container>
      </Section>
    );
  }

  return null;
}
