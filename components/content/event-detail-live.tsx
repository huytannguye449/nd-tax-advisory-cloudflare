"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, MapPin, Tag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SITE } from "@/lib/utils";

type EventDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  cover_url: string | null;
  event_date: string | null;
  location: string | null;
  format: string | null;
  status: string;
  agenda_items: string[] | null;
  audience_items: string[] | null;
  cta_label: string | null;
  cta_href: string | null;
};

type EventResponse = {
  ok: boolean;
  error?: string;
  event?: EventDetail;
};

export function EventDetailLive({ initialSlug }: { initialSlug: string }) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          `/api/public/event?slug=${encodeURIComponent(initialSlug)}`,
          { cache: "no-store" },
        );
        const json = (await response.json()) as EventResponse;
        if (cancelled) return;

        if (!response.ok || !json.ok || !json.event) {
          setError(json.error || "Không tìm thấy sự kiện");
          return;
        }

        setEvent(json.event);
        document.title = `${json.event.title} · Sự kiện · ${SITE.name}`;
      } catch {
        if (!cancelled) setError("Không tải được sự kiện");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [initialSlug]);

  if (loading) return <EventDetailLoading />;
  if (error || !event) {
    return <EventDetailNotFound message={error || "Không tìm thấy sự kiện"} />;
  }

  const eventDate = formatEventDate(event.event_date);
  const bodyText = event.description || event.excerpt;

  return (
    <main className="bg-cream text-navy">
      <Section bg="cream" spacing="sm" className="pt-8 md:pt-12">
        <Container size="lg">
          <Link
            href="/su-kien"
            className="inline-flex items-center gap-2 text-label-caps uppercase text-navy/55 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại sự kiện
          </Link>
        </Container>
      </Section>

      <article>
        <Section bg="cream" spacing="sm" className="pb-8 md:pb-10">
          <Container size="lg">
            <h1 className="font-heading text-headline-lg leading-tight text-balance text-navy">
              {event.title}
            </h1>

            <div className="mt-6">
              <Badge>{readableEventStatusLabel(event.status)}</Badge>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-data-row py-4 text-body-sm text-navy/60">
              {eventDate && (
                <MetaItem icon={<Calendar className="size-4" />} text={eventDate} />
              )}
              {event.location && (
                <MetaItem icon={<MapPin className="size-4" />} text={event.location} />
              )}
              {event.format && (
                <MetaItem icon={<Tag className="size-4" />} text={event.format} />
              )}
            </div>
          </Container>
        </Section>

        <Container size="lg" className="pb-8">
          <div className="relative aspect-[16/9] overflow-hidden bg-cream-200 md:aspect-[16/8]">
            {event.cover_url ? (
              <Image
                src={event.cover_url}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1152px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-navy">
                <span className="font-heading text-5xl font-bold text-cream/30">
                  NHN&amp;D
                </span>
              </div>
            )}
          </div>
        </Container>

        {bodyText && (
          <Container size="lg" className="pb-12 md:pb-16">
            <p className="whitespace-pre-line text-body-lg leading-relaxed text-navy/80 text-pretty">
              {bodyText}
            </p>
          </Container>
        )}

        {(event.agenda_items?.length || event.audience_items?.length) && (
          <Section bg="cream" spacing="md" hairlineTop className="py-12 md:py-16">
            <Container size="lg">
              <div className="grid gap-10 lg:grid-cols-2">
                {event.agenda_items?.length ? (
                  <DetailList title="Nội dung chương trình" items={event.agenda_items} />
                ) : null}
                {event.audience_items?.length ? (
                  <DetailList title="Đối tượng phù hợp" items={event.audience_items} />
                ) : null}
              </div>
            </Container>
          </Section>
        )}

        {event.cta_href && (
          <Section bg="navy" spacing="md" className="py-14 md:py-16">
            <Container size="lg">
              <div className="flex flex-col items-start gap-5 text-cream md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-label-caps uppercase text-cream/65">Tư vấn</p>
                  <h2 className="mt-3 font-heading text-headline-md text-cream">
                    Cần trao đổi thêm về sự kiện này?
                  </h2>
                </div>
                <Link
                  href={event.cta_href}
                  className="inline-flex min-h-[48px] items-center gap-2 border border-gold bg-gold px-5 py-3 text-label-caps uppercase text-navy transition-colors hover:bg-cream hover:text-navy"
                >
                  {event.cta_label || "Liên hệ"}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Container>
          </Section>
        )}
      </article>
    </main>
  );
}

function EventDetailLoading() {
  return (
    <main className="bg-cream text-navy">
      <Container size="lg" className="py-16 md:py-20">
        <div className="h-4 w-28 animate-pulse bg-cream-200" />
        <div className="mt-8 h-16 w-4/5 animate-pulse bg-cream-200" />
        <div className="mt-8 h-12 w-full animate-pulse bg-cream-200" />
        <div className="mt-8 aspect-[16/8] animate-pulse bg-cream-200" />
      </Container>
    </main>
  );
}

function EventDetailNotFound({ message }: { message: string }) {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="lg">
        <div className="border-t-hairline border-gold pt-10 text-center">
          <h1 className="font-heading text-headline-md text-navy">
            Không tìm thấy sự kiện
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-md text-navy/60">
            {message}
          </p>
          <Link
            href="/su-kien"
            className="mt-8 inline-flex min-h-[44px] items-center border border-navy px-5 py-3 text-label-caps uppercase text-navy transition-colors hover:border-gold hover:text-gold-700"
          >
            Quay lại sự kiện
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function formatEventDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readableEventStatusLabel(status: string) {
  if (status === "published" || status === "upcoming") return "Đang mở";
  if (status === "past") return "Đã kết thúc";
  return status || "Sự kiện";
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-h-[28px] items-center bg-gold px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy">
      {children}
    </span>
  );
}

function MetaItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {text}
    </span>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="font-heading text-headline-sm text-navy">{title}</h2>
      <ul className="mt-5 space-y-3 border-t border-data-row pt-5">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 text-body-lg text-navy/80"
          >
            <Tag className="mt-1 size-4 shrink-0 text-gold-700" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
