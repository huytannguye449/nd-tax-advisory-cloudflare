import type { CSSProperties } from "react";
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

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const WORDMARK_STYLE: CSSProperties = {
  fontFamily: "var(--font-playfair), 'Playfair Display', 'Times New Roman', serif",
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const TAGLINE_STYLE: CSSProperties = {
  fontFamily: "var(--font-inter), 'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 500,
  letterSpacing: "0.04em",
};

const NAVY = "#0F2B46";
const GOLD = "#C9A961";
const CREAM = "#FAF7F0";

function PrimarySvg() {
  return (
    <svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <path d="M 150 14 L 160 24 L 178 4" stroke={GOLD} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="0" y="66" fontSize="60" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="0" y="120" fontSize="60" fill={GOLD} style={WORDMARK_STYLE}>&amp;D</text>
      <line x1="172" y1="30" x2="172" y2="116" stroke={GOLD} strokeWidth={1.5} />
      <text x="190" y="68" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Tax</text>
      <text x="190" y="100" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

function HorizontalSvg() {
  return (
    <svg viewBox="0 0 520 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <path d="M 196 14 L 206 24 L 224 4" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="0" y="70" fontSize="58" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="178" y="70" fontSize="58" fill={GOLD} style={WORDMARK_STYLE}>&amp;D</text>
      <line x1="296" y1="20" x2="296" y2="76" stroke={GOLD} strokeWidth={1.5} />
      <text x="314" y="56" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Tax Advisory</text>
    </svg>
  );
}

function MonoSvg() {
  return (
    <svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <path d="M 150 14 L 160 24 L 178 4" stroke={NAVY} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="0" y="66" fontSize="60" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="0" y="120" fontSize="60" fill={NAVY} style={WORDMARK_STYLE}>&amp;D</text>
      <line x1="172" y1="30" x2="172" y2="116" stroke={NAVY} strokeWidth={1.5} />
      <text x="190" y="68" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Tax</text>
      <text x="190" y="100" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

function ReversedSvg() {
  return (
    <svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <rect width="380" height="130" fill={NAVY} />
      <path d="M 168 28 L 178 38 L 196 18" stroke={GOLD} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="18" y="70" fontSize="60" fill={CREAM} style={WORDMARK_STYLE}>NHN</text>
      <text x="18" y="124" fontSize="60" fill={GOLD} style={WORDMARK_STYLE}>&amp;D</text>
      <line x1="190" y1="34" x2="190" y2="120" stroke={GOLD} strokeWidth={1.5} />
      <text x="208" y="72" fontSize="22" fill={CREAM} style={TAGLINE_STYLE}>Tax</text>
      <text x="208" y="104" fontSize="22" fill={CREAM} style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

const VARIANTS: Record<LogoVariant, () => React.JSX.Element> = {
  primary: PrimarySvg,
  horizontal: HorizontalSvg,
  mono: MonoSvg,
  reversed: ReversedSvg,
};

export function Logo({ variant = "primary", size = "md", className }: LogoProps) {
  const Svg = VARIANTS[variant];
  return (
    <span className={cn("inline-flex w-auto items-center", SIZE_CLASS[size], className)}>
      <Svg />
    </span>
  );
}
