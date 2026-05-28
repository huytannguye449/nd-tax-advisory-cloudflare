type SocialLinks = Record<string, string> | null | undefined;

const LABELS: Record<string, string> = {
  email: "Email",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  website: "Website",
  x: "X",
  youtube: "YouTube",
};

function linkLabel(key: string) {
  const normalized = key.trim().toLowerCase();
  return LABELS[normalized] ?? key.replace(/[_-]+/g, " ");
}

function linkHref(key: string, value: string) {
  const trimmed = value.trim();
  const normalizedKey = key.trim().toLowerCase();

  if (
    normalizedKey === "email" ||
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && !trimmed.includes("://"))
  ) {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function PersonSocialLinks({
  links,
  className,
}: {
  links: SocialLinks;
  className?: string;
}) {
  const entries = Object.entries(links ?? {})
    .map(([key, value]) => [key.trim(), value.trim()] as const)
    .filter(([key, value]) => key && value);

  if (entries.length === 0) return null;

  return (
    <div
      className={[
        "flex flex-wrap gap-x-4 gap-y-2 text-label-caps uppercase text-navy/55",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Social links"
    >
      {entries.map(([key, value]) => {
        const href = linkHref(key, value);
        const isExternal = !href.startsWith("mailto:") && !href.startsWith("tel:");
        return (
          <a
            key={`${key}-${value}`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-700"
          >
            {linkLabel(key)}
          </a>
        );
      })}
    </div>
  );
}
