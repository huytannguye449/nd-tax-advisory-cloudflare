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

const WORDMARK_ITALIC_STYLE: CSSProperties = {
  fontFamily: "var(--font-playfair), 'Playfair Display', 'Times New Roman', serif",
  fontWeight: 700,
  fontStyle: "italic",
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
    <svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      {/* Stacked wordmark: NHN (navy) / &D (gold) — Playfair Display */}
      <text x="14" y="52" fontSize="47" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="14" y="97" fontSize="47" fill={GOLD}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="1">D</tspan>
      </text>
      {/* Vertical gold divider */}
      <line x1="140" y1="18" x2="140" y2="97" stroke={GOLD} strokeWidth={2} />
      {/* Tagline: Tax / Advisory — Inter medium */}
      <text x="155" y="57" fontSize="24" fill="#1A1A1A" style={TAGLINE_STYLE}>Tax</text>
      <text x="155" y="86" fontSize="24" fill="#1A1A1A" style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

function HorizontalSvg() {
  return (
    <svg viewBox="0 0 600 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      {/* Inline wordmark: NHN (Inter bold, navy) */}
      <text x="10" y="67" fontSize="56" fill={NAVY} style={{ fontFamily: "var(--font-inter), 'Inter', 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}>NHN</text>
      {/* & (Playfair italic, gold) + D (Inter bold, navy) */}
      <text x="156" y="67" fontSize="64" fill={GOLD} style={WORDMARK_ITALIC_STYLE}>&amp;</text>
      <text x="196" y="67" fontSize="56" fill={NAVY} style={{ fontFamily: "var(--font-inter), 'Inter', 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}>D</text>
      {/* TAX ADVISORY — Inter medium small-caps below */}
      <text x="10" y="88" fontSize="11" fill={NAVY} style={TAGLINE_STYLE} letterSpacing="1">TAX ADVISORY</text>
    </svg>
  );
}

function MonoSvg() {
  return (
    <svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      {/* All navy — same layout as PrimarySvg */}
      <text x="14" y="52" fontSize="47" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="14" y="97" fontSize="47" fill={NAVY}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="1">D</tspan>
      </text>
      <line x1="140" y1="18" x2="140" y2="97" stroke={NAVY} strokeWidth={2} />
      <text x="155" y="57" fontSize="24" fill={NAVY} style={TAGLINE_STYLE}>Tax</text>
      <text x="155" y="86" fontSize="24" fill={NAVY} style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

function ReversedSvg() {
  return (
    <svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      {/* Navy background, cream NHN, gold &D, cream tagline */}
      <rect width="300" height="120" fill={NAVY} />
      <text x="14" y="52" fontSize="47" fill={CREAM} style={WORDMARK_STYLE}>NHN</text>
      <text x="14" y="97" fontSize="47" fill={GOLD}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="1">D</tspan>
      </text>
      <line x1="140" y1="18" x2="140" y2="97" stroke={GOLD} strokeWidth={2} />
      <text x="155" y="57" fontSize="24" fill={CREAM} style={TAGLINE_STYLE}>Tax</text>
      <text x="155" y="86" fontSize="24" fill={CREAM} style={TAGLINE_STYLE}>Advisory</text>
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
