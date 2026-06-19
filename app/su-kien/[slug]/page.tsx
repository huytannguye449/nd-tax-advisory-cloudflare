import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ArrowLeft, Calendar, ExternalLink, MapPin, Tag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

export const dynamic = "force-static";
export const dynamicParams = false;

type EventDetailRow = {
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

const PUBLIC_STATUSES = ["published", "upcoming", "past"] as const;
const DETAIL_SELECT =
  "id, slug, title, excerpt, description, cover_url, event_date, location, format, status, agenda_items, audience_items, cta_label, cta_href";
const LEGACY_SELECT =
  "id, slug, title, excerpt, cover_url, event_date, location, format, status";

export async function generateStaticParams() {
  try {
    const supabase = createBuildClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("events")
      .select("slug")
      .in("status", PUBLIC_STATUSES);

    return (data ?? []).map((event) => ({ slug: event.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Sự kiện",
      description: "Sự kiện của NHN&D Tax Advisory.",
    };
  }

  const title = `${event.title} | Sự kiện | NHN&D Tax Advisory`;
  const description =
    event.excerpt ?? event.description ?? "Sự kiện của NHN&D Tax Advisory.";

  return {
    title,
    description,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const eventDate = formatEventDate(event.event_date);
  const statusLabel = eventStatusLabel(event.status);

  return (
    <main className="bg-cream text-navy">
      <Section bg="cream" spacing="sm" className="pt-8 md:pt-12">
        <Container size="wide">
          <Link
            href="/su-kien"
            className="inline-flex items-center gap-2 text-label-caps uppercase text-navy/55 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại sự kiện
          </Link>
        </Container>
      </Section>

      <Section bg="cream" spacing="sm" className="pb-12 md:pb-16">
        <Container size="wide">
          <article className="grid gap-8 border border-data-row bg-cream lg:grid-cols-2 lg:gap-0">
            <div className="relative min-h-[320px] overflow-hidden bg-cream-200 lg:min-h-[560px]">
              {event.cover_url ? (
                <Image
                  src={event.cover_url}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-navy">
                  <span className="font-heading text-5xl font-bold text-cream/30">
                    NHN&amp;D
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center bg-navy p-7 text-cream md:p-10 lg:min-h-[560px] lg:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="gold">{statusLabel}</Badge>
                {event.format && <Badge tone="cream">{event.format}</Badge>}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-body-sm text-cream/68">
                {eventDate && (
                  <MetaItem icon={<Calendar className="size-4" />} text={eventDate} />
                )}
                {event.location && (
                  <MetaItem icon={<MapPin className="size-4" />} text={event.location} />
                )}
              </div>

              <h1 className="mt-5 max-w-2xl font-heading text-headline-lg leading-[1.05] text-balance text-cream">
                {event.title}
              </h1>

              {(event.excerpt || event.description) && (
                <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-cream/75">
                  {event.description ?? event.excerpt}
                </p>
              )}

              {event.cta_href && (
                <Link
                  href={event.cta_href}
                  className="mt-8 inline-flex w-fit min-h-[48px] items-center gap-2 border border-gold px-5 py-3 text-label-caps uppercase text-gold transition-colors hover:bg-gold hover:text-navy"
                >
                  {event.cta_label ?? "Xem chi tiết"}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </article>
        </Container>
      </Section>

      {(event.agenda_items?.length || event.audience_items?.length) && (
        <Section bg="cream" spacing="md" hairlineTop className="py-12 md:py-16">
          <Container size="article">
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
          <Container size="article">
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
                {event.cta_label ?? "Liên hệ"}
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}

async function getEvent(slug: string) {
  const supabase = createBuildClient();
  if (!supabase) return null;

  const detail = await supabase
    .from("events")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .in("status", PUBLIC_STATUSES)
    .maybeSingle();

  if (!detail.error && detail.data) return normalizeEvent(detail.data);

  const legacy = await supabase
    .from("events")
    .select(LEGACY_SELECT)
    .eq("slug", slug)
    .in("status", PUBLIC_STATUSES)
    .maybeSingle();

  if (legacy.error || !legacy.data) return null;

  return normalizeEvent(legacy.data);
}

function createBuildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });
}

function normalizeEvent(row: Record<string, unknown>): EventDetailRow {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: typeof row.excerpt === "string" ? row.excerpt : null,
    description: typeof row.description === "string" ? row.description : null,
    cover_url: typeof row.cover_url === "string" ? row.cover_url : null,
    event_date: typeof row.event_date === "string" ? row.event_date : null,
    location: typeof row.location === "string" ? row.location : null,
    format: typeof row.format === "string" ? row.format : null,
    status: String(row.status ?? ""),
    agenda_items: Array.isArray(row.agenda_items)
      ? row.agenda_items.filter((item): item is string => typeof item === "string")
      : [],
    audience_items: Array.isArray(row.audience_items)
      ? row.audience_items.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    cta_label: typeof row.cta_label === "string" ? row.cta_label : null,
    cta_href: typeof row.cta_href === "string" ? row.cta_href : null,
  };
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

function eventStatusLabel(status: string) {
  if (status === "published" || status === "upcoming") return "Đang mở";
  if (status === "past") return "Đã kết thúc";
  return status || "Sự kiện";
}

function Badge({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "cream";
}) {
  return (
    <span
      className={
        tone === "gold"
          ? "inline-flex min-h-[28px] items-center bg-gold px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy"
          : "inline-flex min-h-[28px] items-center border border-cream/30 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-cream"
      }
    >
      {children}
    </span>
  );
}

function MetaItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
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
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-body-lg text-navy/80">
            <Tag className="mt-1 size-4 shrink-0 text-gold-700" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
