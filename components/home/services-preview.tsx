"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { ServiceWithPeople } from "@/lib/supabase/types";

const SERVICE_NUMBERS = ["01", "02", "03", "04"];

export function ServicesPreview() {
  const [services, setServices] = useState<ServiceWithPeople[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.ok) setServices(json.services ?? []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section bg="cream-100" spacing="md" hairlineTop>
      <Container size="default">
        <div className="mb-16 flex flex-col items-start gap-4">
          <Eyebrow color="gold">Dịch vụ</Eyebrow>
          <h2 className="font-heading text-headline-lg text-navy text-balance">
            Các lĩnh vực chuyên sâu
          </h2>
        </div>

        {services.length === 0 ? (
          <div className="border-t-hairline border-gold pt-10 text-body-md text-navy/55">
            Đang tải dịch vụ từ CMS...
          </div>
        ) : (
          <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((service, index) => (
              <article
                key={service.id}
                className="group flex flex-col gap-6 border-t-hairline border-gold pt-6"
              >
                <Eyebrow color="gold">
                  {SERVICE_NUMBERS[index] ?? `0${index + 1}`}
                </Eyebrow>
                <h3 className="flex-1 font-heading text-headline-md leading-snug text-navy">
                  {service.title}
                </h3>
                {service.short_description && (
                  <p className="text-body-md leading-relaxed text-navy/65">
                    {service.short_description}
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="self-start px-0"
                >
                  <Link
                    href={`/dich-vu#${service.slug}`}
                    aria-label={`Xem chi tiết về ${service.title}`}
                  >
                    Xem chi tiết →
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
