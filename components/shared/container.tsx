import { cn } from "@/lib/utils";
import * as React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "narrow" | "default" | "wide";
}

/**
 * DESIGN.md container-default = 1280px (xl).
 * sm/md/lg are sub-widths for narrower content (article, form, prose).
 * Padding: mobile 20px, desktop 64px (DESIGN.md margins).
 */
const SIZE = {
  // Canonical names (preferred for new code)
  narrow: "max-w-[var(--container-prose)]", // 65ch — long-form prose
  default: "max-w-[var(--container-default)]", // 1280px — DESIGN canonical
  wide: "max-w-[1440px]", // edge-to-edge editorial spread

  // Legacy aliases (kept for backward compat — refactor consumers in Phase B-D)
  sm: "max-w-3xl",   // 768px
  md: "max-w-5xl",   // 1024px
  lg: "max-w-6xl",   // 1152px
  xl: "max-w-[var(--container-default)]", // 1280px = default
};

export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]",
        SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
