import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentMeta, eventMetaItems } from "@/components/shared/content-meta";

export interface EventCardData {
  title: string;
  href: string;
  excerpt?: string;
  date?: string;
  location?: string;
  format?: string;
  status?: string;
  coverUrl?: string;
}

interface EventCardProps {
  event: EventCardData;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function EventCard({
  event,
  variant = "default",
  className,
}: EventCardProps) {
  if (variant === "featured") {
    return (
      <article
        className={cn(
          "group grid grid-cols-1 overflow-hidden border border-data-row bg-navy lg:grid-cols-2",
          className,
        )}
      >
        <EventImage
          event={event}
          className="aspect-[16/10] lg:aspect-auto lg:min-h-[430px]"
          priority
        />
        <div className="relative flex min-h-[360px] flex-col justify-center bg-navy p-7 text-cream md:p-10 lg:min-h-[430px] lg:p-12">
          <StatusBadge
            status={event.status}
            className="absolute right-8 top-8"
          />
          <ContentMeta
            tone="cream"
            items={eventMetaItems({
              date: event.date,
              location: event.location,
              format: event.format,
              status: null,
            })}
            className="mb-5 pr-20 text-cream/62"
          />
          <h2 className="max-w-xl font-heading text-headline-lg leading-[1.08] text-cream text-balance">
            <Link
              href={event.href}
              className="transition-colors hover:text-gold"
            >
              {event.title}
            </Link>
          </h2>
          {event.excerpt && (
            <p className="mt-4 max-w-xl text-body-md leading-relaxed text-cream/70">
              {event.excerpt}
            </p>
          )}
          <EventAction href={event.href} tone="cream" className="mt-6" />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group border-t border-data-row pt-5", className)}>
        <ContentMeta
          items={eventMetaItems({
            date: event.date,
            location: event.location,
            format: event.format,
            status: null,
          })}
        />
        <h3 className="mt-3 font-heading text-headline-sm leading-snug text-navy">
          <Link
            href={event.href}
            className="transition-colors hover:text-gold-700"
          >
            {event.title}
          </Link>
        </h3>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group grid gap-5 border-t border-data-row py-7 md:grid-cols-[220px_1fr]",
        className,
      )}
    >
      <EventImage event={event} className="aspect-[16/10]" />
      <div className="flex min-w-0 flex-col justify-center">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <StatusBadge status={event.status} />
          <ContentMeta
            items={eventMetaItems({
              date: event.date,
              location: event.location,
              format: event.format,
              status: null,
            })}
          />
        </div>
        <h3 className="font-heading text-headline-sm leading-snug text-navy">
          <Link
            href={event.href}
            className="transition-colors hover:text-gold-700"
          >
            {event.title}
          </Link>
        </h3>
        {event.excerpt && (
          <p className="mt-3 line-clamp-2 max-w-2xl text-body-sm leading-relaxed text-navy/62">
            {event.excerpt}
          </p>
        )}
        <EventAction href={event.href} className="mt-4" />
      </div>
    </article>
  );
}

function EventImage({
  event,
  priority,
  className,
}: {
  event: EventCardData;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={event.href}
      className={cn(
        "relative block w-full overflow-hidden bg-cream-200",
        className,
      )}
      tabIndex={-1}
      aria-hidden="true"
    >
      {event.coverUrl ? (
        <Image
          src={event.coverUrl}
          alt={event.title}
          fill
          priority={priority}
          className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
          <span className="font-heading text-3xl font-bold text-navy/20">
            NHN&amp;D
          </span>
        </div>
      )}
    </Link>
  );
}

function StatusBadge({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  if (!status) return null;
  return (
    <span
      className={cn(
        "inline-flex min-h-[28px] items-center bg-gold px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy",
        className,
      )}
    >
      {status}
    </span>
  );
}

function EventAction({
  href,
  tone = "navy",
  className,
}: {
  href: string;
  tone?: "navy" | "cream";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-[36px] w-fit items-center gap-2 border-b text-label-caps uppercase transition-colors",
        tone === "cream"
          ? "border-gold text-gold hover:border-cream hover:text-cream"
          : "border-gold text-navy hover:text-gold-700",
        className,
      )}
    >
      Chi tiết
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}
