import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "horizontal" | "executive" | "reversed";
type LogoSize = "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CLASS: Record<LogoSize, string> = {
  sm: "h-10",
  md: "h-16",
  lg: "h-32",
  xl: "h-44",
  "2xl": "h-52",
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

// Primary/horizontal/executive use the new PNG lockup (transparent bg).
// Reversed kept as SVG (designed for navy footer bg — cream text).
const VARIANT_EXT: Record<LogoVariant, "png" | "svg"> = {
  primary: "png",
  horizontal: "png",
  executive: "png",
  reversed: "svg",
};

export function Logo({ variant = "primary", size = "md", className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logo/logo-${variant}.${VARIANT_EXT[variant]}`}
      alt="NHN&D Tax Advisory"
      className={cn("inline-block w-auto", SIZE_CLASS[size], className)}
    />
  );
}
