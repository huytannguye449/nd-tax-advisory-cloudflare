import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  color?: "navy" | "gold" | "cream";
}

/**
 * Label-caps eyebrow per DESIGN.md typography:
 *   12px / line 1.0 / tracking 0.1em / Inter 600 uppercase
 * Used as section header / metadata / "rhythmic interruption" in editorial flow.
 */
export function Eyebrow({ children, className, color = "gold" }: EyebrowProps) {
  const colorClass =
    color === "gold" ? "text-gold-700" : color === "cream" ? "text-cream" : "text-navy";
  return (
    <span
      className={cn(
        "inline-block text-label-caps uppercase",
        colorClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
