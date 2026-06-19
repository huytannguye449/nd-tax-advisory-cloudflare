"use client";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { splitParagraphs, useSiteContent } from "@/components/site/site-content-context";

export function BrandStory() {
  const { loading, sections } = useSiteContent();
  const story = sections.brand_story;
  const paragraphs = splitParagraphs(story?.body);

  if (loading) {
    return (
      <Section bg="cream" spacing="md" hairlineTop>
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="h-4 w-28 bg-navy/10" />
              <div className="h-20 bg-navy/10" />
            </div>
            <div className="space-y-4 lg:col-span-7">
              <div className="h-24 bg-navy/10" />
              <div className="h-20 bg-navy/10" />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (story?.title) {
    return (
      <Section bg="cream" spacing="md" hairlineTop>
        <Container size="default">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              {story.eyebrow && <Eyebrow color="gold">{story.eyebrow}</Eyebrow>}
              <h2 className="font-heading text-headline-lg text-navy text-balance">
                {story.title}
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-0">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "text-body-lg text-navy/70 pb-8 border-b-hairline border-gold"
                      : "text-body-lg text-navy/70 pt-8"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return null;
}
