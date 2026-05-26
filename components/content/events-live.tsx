"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { EventCard, type EventCardData } from "@/components/content/event-card";

interface EventRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  event_date: string | null;
  location: string | null;
  format: string | null;
  status: string;
}

export function EventsLive() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/events", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.ok) setError(json.error || "Không tải được sự kiện");
        else setEvents(json.events ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Không tải được sự kiện");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <EventsSkeleton />;

  if (error || events.length === 0) {
    return (
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="narrow">
          <p className="border-y border-data-row py-16 text-center text-body-lg text-navy/55">
            {error || "Chưa có sự kiện published."}
          </p>
        </Container>
      </Section>
    );
  }

  const [featured, ...rest] = events.map(eventFromRow);

  return (
    <>
      <Section bg="cream" spacing="sm" className="py-10 md:py-12">
        <Container size="wide">
          <EventCard event={featured} variant="featured" />
        </Container>
      </Section>

      <Section
        bg="cream-100"
        spacing="md"
        hairlineTop
        className="py-14 md:py-16"
      >
        <Container size="wide">
          <SectionHeader
            eyebrow="LỊCH SẮP TỚI"
            title="Chương trình chuyên đề"
            description="Cập nhật các chương trình chuyên đề, workshop và phiên trao đổi dành cho doanh nghiệp."
            split
            className="mb-10 border-l-4 border-gold pl-6"
          />
          {rest.length > 0 ? (
            <div className="grid gap-x-12 lg:grid-cols-2">
              {rest.map((event) => (
                <EventCard key={event.href} event={event} variant="default" />
              ))}
            </div>
          ) : (
            <p className="border-y border-data-row py-12 text-body-md text-navy/55">
              Chưa có thêm sự kiện nào.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}

function EventsSkeleton() {
  return (
    <>
      <Section bg="cream" spacing="sm">
        <Container size="wide">
          <div className="grid grid-cols-1 overflow-hidden border border-data-row lg:grid-cols-2">
            <div className="h-[420px] animate-pulse bg-cream-200 lg:h-[520px]" />
            <div className="h-[420px] animate-pulse bg-navy/20 lg:h-[520px]" />
          </div>
        </Container>
      </Section>
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="grid gap-5 md:grid-cols-[220px_1fr]">
                <div className="aspect-[16/10] animate-pulse bg-cream-200" />
                <div>
                  <div className="h-4 w-40 animate-pulse bg-cream-200" />
                  <div className="mt-6 h-8 w-full animate-pulse bg-cream-200" />
                  <div className="mt-4 h-4 w-2/3 animate-pulse bg-cream-200" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

function eventFromRow(row: EventRow): EventCardData {
  return {
    title: row.title,
    href: `/su-kien#${row.slug}`,
    excerpt: row.excerpt ?? undefined,
    date: row.event_date
      ? new Date(row.event_date).toLocaleDateString("vi-VN", {
          month: "long",
          year: "numeric",
        })
      : undefined,
    location: row.location ?? undefined,
    format: row.format ?? undefined,
    status: eventStatusLabel(row.status),
    coverUrl: row.cover_url ?? undefined,
  };
}

function eventStatusLabel(status: string) {
  if (status === "published" || status === "upcoming") return "Đang mở";
  if (status === "past") return "Đã kết thúc";
  return status || undefined;
}
