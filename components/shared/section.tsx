import { cn } from "@/lib/utils";
import * as React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  /** DESIGN.md: only two true elevations (cream base + navy callout).
   *  cream-100 is a subtle within-cream variant for sectional rhythm. */
  bg?: "cream" | "cream-100" | "navy";
  spacing?: "sm" | "md" | "lg";
  /** Add 0.5pt gold hairline at top — DESIGN.md "critical component" */
  hairlineTop?: boolean;
}

const BG = {
  cream: "bg-cream text-navy",
  "cream-100": "bg-cream-100 text-navy",
  navy: "bg-navy text-cream",
};

const SPACING = {
  sm: "py-[var(--spacing-section-sm)]",
  md: "py-[var(--spacing-section-md)]",
  lg: "py-[var(--spacing-section-lg)]",
};

export function Section({
  as: Component = "section",
  bg = "cream",
  spacing = "md",
  hairlineTop = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        BG[bg],
        SPACING[spacing],
        hairlineTop && "border-t-hairline border-gold",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
