import { cn } from "@/lib/utils";
import * as React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  bg?: "cream" | "cream-100" | "cream-200" | "navy" | "white" | "gold";
  spacing?: "sm" | "md" | "lg";
}

const BG = {
  cream: "bg-cream",
  "cream-100": "bg-cream-100",
  "cream-200": "bg-cream-200",
  navy: "bg-navy text-cream",
  white: "bg-white",
  gold: "bg-gold text-navy",
};

const SPACING = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
};

export function Section({
  as: Component = "section",
  bg = "cream",
  spacing = "md",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component className={cn(BG[bg], SPACING[spacing], className)} {...props}>
      {children}
    </Component>
  );
}
