"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { ServiceBlock } from "@/components/services/service-block";
import type { ServiceWithPeople } from "@/lib/supabase/types";

interface ServicesResponse {
  ok: boolean;
  error?: string;
  services?: ServiceWithPeople[];
}

export function ServicesLive() {
  const [services, setServices] = useState<ServiceWithPeople[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: ServicesResponse) => {
        if (cancelled) return;
        if (!json.ok) setError(json.error || "Không tải được dịch vụ");
        else setServices(json.services ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Không tải được dịch vụ");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <ServicesSkeleton />;

  if (error || services.length === 0) {
    return (
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="narrow">
          <p className="border-y border-data-row py-16 text-center text-body-lg text-navy/55">
            {error || "Chưa có dịch vụ published."}
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-data-row bg-cream-100/95">
        <Container size="wide">
          <nav
            aria-label="Danh mục dịch vụ"
            className="flex items-center gap-6 overflow-x-auto py-3 md:gap-8"
          >
            {services.map((item) => (
              <a
                key={item.id}
                href={`#${item.slug}`}
                className="flex min-h-[40px] items-center whitespace-nowrap border-b border-transparent px-1 text-label-caps text-navy/62 transition-colors hover:border-gold hover:text-navy focus-visible:border-gold focus-visible:outline-none"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {services.map((service, idx) => (
        <ServiceBlock key={service.id} service={service} idx={idx} />
      ))}
    </>
  );
}

function ServicesSkeleton() {
  return (
    <Section bg="cream-100" spacing="md" hairlineTop>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="h-4 w-24 animate-pulse bg-cream-200" />
            <div className="mt-8 h-14 w-3/4 animate-pulse bg-cream-200" />
            <div className="mt-5 h-5 w-2/3 animate-pulse bg-cream-200" />
            <div className="mt-10 aspect-[16/9] animate-pulse bg-cream-200" />
          </div>
          <div className="hidden lg:col-span-4 lg:block">
            <div className="h-32 animate-pulse border border-data-row bg-cream" />
            <div className="mt-5 h-32 animate-pulse border border-data-row bg-cream" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
