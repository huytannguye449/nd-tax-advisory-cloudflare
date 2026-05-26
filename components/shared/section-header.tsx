import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
  align?: "left" | "center";
  split?: boolean;
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  split = false,
  headingLevel = "h2",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  const Heading = headingLevel;

  return (
    <div
      className={cn(
        split && !centered
          ? "flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          : "flex flex-col gap-4",
        centered && "items-center text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", centered && "items-center")}>
        {eyebrow && <Eyebrow color="gold">{eyebrow}</Eyebrow>}
        <div className="flex flex-col gap-4">
          <Heading className="font-heading text-headline-lg text-navy text-balance">
            {title}
          </Heading>
          {description && (
            <p
              className={cn(
                "text-body-md text-navy/60 leading-relaxed",
                centered ? "max-w-2xl" : "max-w-xl",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 text-label-caps uppercase text-gold-700 transition-colors hover:text-gold"
        >
          {action.label}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
