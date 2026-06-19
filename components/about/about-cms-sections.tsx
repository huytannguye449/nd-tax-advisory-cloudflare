"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Section } from "@/components/shared/section";
import { splitParagraphs, useSiteContent } from "@/components/site/site-content-context";

export function AboutHero() {
  const { loading, sections } = useSiteContent();
  const section = sections.hero;

  if (loading) {
    return (
      <Section bg="cream" spacing="lg">
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2">
            <div className="space-y-6">
              <div className="h-4 w-32 animate-pulse bg-cream-200" />
              <div className="h-24 w-full max-w-xl animate-pulse bg-cream-200" />
              <div className="h-24 w-full max-w-xl animate-pulse bg-cream-200" />
            </div>
            <div className="aspect-[4/3] animate-pulse bg-cream-200" />
          </div>
        </Container>
      </Section>
    );
  }

  if (!section?.title) return null;

  return (
    <Section bg="cream" spacing="lg">
      <Container size="default">
        <div className="grid items-center gap-[var(--spacing-gutter)] lg:grid-cols-2">
          <div>
            {section.eyebrow && (
              <Eyebrow color="gold" className="mb-4">
                {section.eyebrow}
              </Eyebrow>
            )}
            <h1 className="mb-6 font-heading text-headline-lg leading-tight text-navy">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="text-body-lg leading-relaxed text-navy/70">
                {section.subtitle}
              </p>
            )}
          </div>
          {section.image_url && (
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={section.image_url}
                alt={section.image_alt || section.title}
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function AboutStory() {
  const { loading, sections } = useSiteContent();
  const section = sections.story;
  const paragraphs = splitParagraphs(section?.body);

  if (loading) {
    return (
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="default">
          <div className="space-y-6">
            <div className="h-5 w-28 animate-pulse bg-cream-200" />
            <div className="h-20 w-full max-w-3xl animate-pulse bg-cream-200" />
            <div className="h-40 w-full max-w-5xl animate-pulse bg-cream-200" />
          </div>
        </Container>
      </Section>
    );
  }

  if (!section?.title && paragraphs.length === 0) return null;

  return (
    <Section bg="cream-100" spacing="md" hairlineTop>
      <Container size="default">
        <div>
          {section?.eyebrow && (
            <Eyebrow color="gold" className="mb-3">
              {section.eyebrow}
            </Eyebrow>
          )}
          {section?.title && (
            <h2 className="mt-2 max-w-3xl font-heading text-headline-md text-navy">
              {section.title}
            </h2>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-8 max-w-5xl space-y-5 text-body-lg leading-relaxed text-navy/80">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function AboutFinalCta() {
  const { sections } = useSiteContent();
  const section = sections.final_cta;

  if (!section?.title) return null;

  return (
    <Section bg="navy" spacing="lg">
      <Container size="narrow">
        <div className="text-center">
          {section.eyebrow && (
            <Eyebrow color="cream" className="mb-4">
              {section.eyebrow}
            </Eyebrow>
          )}
          <h2 className="mb-4 font-heading text-headline-md text-cream">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mx-auto mb-10 max-w-xl text-body-lg leading-relaxed text-cream/70">
              {section.subtitle}
            </p>
          )}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {section.cta_label && section.cta_href && (
              <Link
                href={section.cta_href}
                className="inline-flex h-14 min-h-[44px] items-center justify-center border border-cream bg-transparent px-9 text-[15px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {section.cta_label}
              </Link>
            )}
            {section.secondary_cta_label && section.secondary_cta_href && (
              <Link
                href={section.secondary_cta_href}
                className="inline-flex h-14 min-h-[44px] items-center justify-center border border-cream bg-transparent px-9 text-[15px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {section.secondary_cta_label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
