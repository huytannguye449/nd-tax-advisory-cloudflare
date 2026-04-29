import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "horizontal" | "mono" | "reversed";
type LogoSize = "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CLASS: Record<LogoSize, string> = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
  "2xl": "h-32",
};

const LOGO_SRC: Record<LogoVariant, string> = {
  primary: "/logo/logo-primary.png",
  horizontal: "/logo/logo-horizontal.png",
  mono: "/logo/logo-mono.png",
  reversed: "/logo/logo-reversed.png",
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

export function Logo({ variant = "primary", size = "md", className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC[variant]}
      alt="N&D Tax Advisory"
      className={cn("w-auto", SIZE_CLASS[size], className)}
    />
  );
}
