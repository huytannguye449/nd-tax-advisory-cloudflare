import Image from "next/image";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type MetaTone = "muted" | "gold" | "cream";

interface ContentMetaItem {
  key: string;
  label?: string | null;
  value?: string | number | null;
  dateTime?: string;
  icon?: "calendar" | "clock" | "location" | "user";
  avatarUrl?: string | null;
}

interface ContentMetaProps {
  items: ContentMetaItem[];
  tone?: MetaTone;
  className?: string;
}

const ICONS = {
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  user: User,
};

const TONE: Record<MetaTone, string> = {
  muted: "text-navy/50",
  gold: "text-gold-700",
  cream: "text-cream/70",
};

export function ContentMeta({ items, tone = "muted", className }: ContentMetaProps) {
  const visible = items.filter((item) => item.value || item.label);
  if (visible.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm",
        TONE[tone],
        className,
      )}
    >
      {visible.map((item) => {
        const Icon = item.icon ? ICONS[item.icon] : null;
        const content =
          item.dateTime && item.value ? (
            <time dateTime={item.dateTime}>
              {typeof item.value === "string" ? item.value : item.value.toString()}
            </time>
          ) : (
            <span>{item.value ?? item.label}</span>
          );

        return (
          <span key={item.key} className="inline-flex items-center gap-1.5">
            {item.avatarUrl ? (
              <Image
                src={item.avatarUrl}
                alt={String(item.value ?? item.label ?? "")}
                width={22}
                height={22}
                className="object-cover"
              />
            ) : Icon ? (
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            ) : null}
            {content}
          </span>
        );
      })}
    </div>
  );
}

export function publicationMetaItems(args: {
  category?: string | null;
  publishedAt?: string | null;
  author?: string | null;
  authorAvatarUrl?: string | null;
  readingTime?: number | null;
}) {
  return [
    {
      key: "category",
      value: args.category,
    },
    {
      key: "date",
      value: args.publishedAt ? formatDate(args.publishedAt) : null,
      dateTime: args.publishedAt ?? undefined,
      icon: "calendar" as const,
    },
    {
      key: "author",
      value: args.author,
      avatarUrl: args.authorAvatarUrl,
      icon: "user" as const,
    },
    {
      key: "reading",
      value: args.readingTime ? `${args.readingTime} phút đọc` : null,
      icon: "clock" as const,
    },
  ];
}

export function eventMetaItems(args: {
  date?: string | null;
  location?: string | null;
  format?: string | null;
  status?: string | null;
}) {
  return [
    {
      key: "date",
      value: args.date,
      icon: "calendar" as const,
    },
    {
      key: "location",
      value: args.location,
      icon: "location" as const,
    },
    {
      key: "format",
      value: args.format,
    },
    {
      key: "status",
      value: args.status,
    },
  ];
}
