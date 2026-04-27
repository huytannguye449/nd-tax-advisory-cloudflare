import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  color?: "navy" | "gold" | "cream";
}

export function Eyebrow({ children, className, color = "gold" }: EyebrowProps) {
  const colorClass =
    color === "gold" ? "text-gold-700" : color === "cream" ? "text-cream" : "text-navy/70";
  return (
    <span
      className={cn(
        "inline-block text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em]",
        colorClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
