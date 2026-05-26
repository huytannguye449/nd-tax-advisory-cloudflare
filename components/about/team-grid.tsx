"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  credentials: string[];
  expertise: string[];
  profile_enabled: boolean;
}

export function TeamGrid() {
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

  const visible = people.filter((person) => person.profile_enabled);

  return (
    <Section
      bg="cream-100"
      spacing="md"
      hairlineTop
      aria-labelledby="team-heading"
    >
      <Container size="default">
        <div className="mb-12">
          <Eyebrow color="gold" className="mb-3">
            ĐỘI NGŨ
          </Eyebrow>
          <h2
            id="team-heading"
            className="mb-4 mt-2 font-heading text-headline-md text-navy"
          >
            Những chuyên gia đứng sau
          </h2>
          <p className="max-w-2xl text-body-md leading-relaxed text-navy/65">
            Đội ngũ chuyên gia được quản lý từ CMS, bao gồm hồ sơ, chuyên môn và
            chứng chỉ nghề nghiệp.
          </p>
        </div>

        {visible.length === 0 ? (
          <div className="border-t-hairline border-gold pt-10 text-body-md text-navy/55">
            Đang tải đội ngũ từ CMS...
          </div>
        ) : (
          <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-3">
            {visible.map((member) => (
              <article
                key={member.id}
                className="flex flex-col border-t-hairline border-gold pt-6"
              >
                <div className="mb-5 size-24 overflow-hidden border border-cream-300 bg-cream-200">
                  {member.avatar_url ? (
                    <Image
                      src={member.avatar_url}
                      alt={`Ảnh đại diện ${member.name}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-heading text-xl text-navy/25">
                      NHN&amp;D
                    </div>
                  )}
                </div>
                <h3 className="mb-1 font-heading text-headline-sm text-navy">
                  {member.name}
                </h3>
                {member.title && (
                  <p className="mb-4 text-label-caps uppercase tracking-[0.1em] text-gold-700">
                    {member.title}
                  </p>
                )}
                {member.credentials.length > 0 && (
                  <ul className="mb-5 space-y-1.5 text-body-sm text-navy/70">
                    {member.credentials.map((cred) => (
                      <li key={cred} className="flex items-start gap-1.5">
                        <span
                          className="mt-0.5 shrink-0 text-gold-700"
                          aria-hidden="true"
                        >
                          -
                        </span>
                        <span>{cred}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {member.bio && (
                  <p className="flex-1 text-body-sm leading-relaxed text-navy/70">
                    {member.bio}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
