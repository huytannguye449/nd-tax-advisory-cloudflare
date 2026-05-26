"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TIMELINE } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

interface Person {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_featured: boolean;
  credentials: string[];
}

export function FounderSection() {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/people", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.ok) setPeople(json.people ?? []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const founder = useMemo(
    () =>
      people.find((person) => person.is_featured) ??
      people.find((person) => person.slug === "anh-ngoc") ??
      null,
    [people],
  );
  const bioParagraphs = (founder?.bio ?? "").split("\n\n").filter(Boolean);

  return (
    <Section
      bg="cream"
      spacing="md"
      hairlineTop
      aria-labelledby="founder-heading"
    >
      <Container size="default">
        <div className="flex flex-col gap-[var(--spacing-gutter)] lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="relative lg:sticky lg:top-32">
            <div className="mx-auto aspect-square max-w-md overflow-hidden bg-cream-200 lg:mx-0">
              {founder?.avatar_url ? (
                <Image
                  src={founder.avatar_url}
                  alt={founder.name}
                  width={900}
                  height={900}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-heading text-4xl text-navy/20">
                  NHN&amp;D
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 hidden bg-navy px-5 py-4 text-cream lg:flex">
              <div className="text-center">
                <p className="font-heading text-headline-sm text-gold">20+</p>
                <p className="mt-0.5 text-body-sm text-cream/80">
                  năm kinh nghiệm
                </p>
              </div>
            </div>
          </div>

          <div>
            <Eyebrow color="gold" className="mb-4">
              FOUNDER &amp; CEO
            </Eyebrow>
            <h2
              id="founder-heading"
              className="mb-2 font-heading text-headline-md text-navy"
            >
              {founder?.name ?? "Founder"}
            </h2>
            {founder?.title && (
              <p className="mb-6 text-body-md font-semibold text-gold-700">
                {founder.title}
              </p>
            )}

            <div className="mb-12 space-y-4 text-body-md leading-relaxed text-navy/80">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((para) => <p key={para}>{para}</p>)
              ) : (
                <p>Hồ sơ founder đang được tải từ CMS.</p>
              )}
            </div>

            <div className="border-t-hairline border-gold pt-8">
              <Eyebrow color="gold" className="mb-4">
                HÀNH TRÌNH SỰ NGHIỆP
              </Eyebrow>
              <h3 className="mb-2 font-heading text-headline-sm text-navy">
                Các mốc nghề nghiệp chính của founder.
              </h3>
              <div className="relative mt-6">
                <div
                  className="absolute bottom-2 left-3.5 top-2 w-px bg-cream-300"
                  aria-hidden="true"
                />
                <ol className="space-y-6">
                  {TIMELINE.map((item, i) => (
                    <li key={i} className="relative flex items-start gap-4">
                      <span
                        className="relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center bg-navy"
                        aria-hidden="true"
                      >
                        <span className="size-2.5 bg-gold" />
                      </span>
                      <div className="flex-1">
                        <span className="text-label-caps uppercase tracking-[0.1em] text-gold-700">
                          {item.period}
                        </span>
                        <p className="mt-1 text-body-md font-semibold text-navy">
                          {item.title}
                        </p>
                        <p className="text-body-sm text-navy/60">{item.org}</p>
                        <p className="mt-1.5 text-body-sm leading-relaxed text-navy/70">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
