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
    <svg viewBox="0 0 400 144" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <path d="M 6 26 L 6 8 L 24 8" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 170 8 L 188 8 L 188 26" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 6 118 L 6 136 L 24 136" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 170 136 L 188 136 L 188 118" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 142 22 L 152 32 L 170 12" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="18" y="68" fontSize="56" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="18" y="124" fontSize="56" fill={GOLD}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="2">D</tspan>
      </text>
      <line x1="188" y1="34" x2="188" y2="110" stroke={GOLD} strokeWidth={1.5} />
      <text x="206" y="78" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Tax</text>
      <text x="206" y="104" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

function HorizontalSvg() {
  return (
    <svg viewBox="0 0 560 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <path d="M 6 24 L 6 10 L 20 10" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 318 10 L 332 10 L 332 24" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 6 76 L 6 90 L 20 90" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 318 90 L 332 90 L 332 76" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 246 18 L 256 28 L 274 8" stroke={GOLD} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="20" y="72" fontSize="58" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="208" y="72" fontSize="58" fill={GOLD}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="2">D</tspan>
      </text>
      <line x1="332" y1="32" x2="332" y2="68" stroke={GOLD} strokeWidth={1.5} />
      <text x="350" y="58" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Tax Advisory</text>
    </svg>
  );
}

function MonoSvg() {
  return (
    <svg viewBox="0 0 400 144" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <path d="M 6 26 L 6 8 L 24 8" stroke={NAVY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 170 8 L 188 8 L 188 26" stroke={NAVY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 6 118 L 6 136 L 24 136" stroke={NAVY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 170 136 L 188 136 L 188 118" stroke={NAVY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 142 22 L 152 32 L 170 12" stroke={NAVY} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="18" y="68" fontSize="56" fill={NAVY} style={WORDMARK_STYLE}>NHN</text>
      <text x="18" y="124" fontSize="56" fill={NAVY}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="2">D</tspan>
      </text>
      <line x1="188" y1="34" x2="188" y2="110" stroke={NAVY} strokeWidth={1.5} />
      <text x="206" y="78" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Tax</text>
      <text x="206" y="104" fontSize="22" fill={NAVY} style={TAGLINE_STYLE}>Advisory</text>
    </svg>
  );
}

function ReversedSvg() {
  return (
    <svg viewBox="0 0 400 144" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHN&D Tax Advisory" className="h-full w-auto">
      <rect width="400" height="144" fill={NAVY} />
      <path d="M 18 38 L 18 20 L 36 20" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 182 20 L 200 20 L 200 38" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 18 106 L 18 124 L 36 124" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 182 124 L 200 124 L 200 106" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 154 34 L 164 44 L 182 24" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="30" y="76" fontSize="56" fill={CREAM} style={WORDMARK_STYLE}>NHN</text>
      <text x="30" y="116" fontSize="56" fill={GOLD}>
        <tspan style={WORDMARK_ITALIC_STYLE}>&amp;</tspan>
        <tspan style={WORDMARK_STYLE} dx="2">D</tspan>
      </text>
      <line x1="200" y1="46" x2="200" y2="98" stroke={GOLD} strokeWidth={1.5} />
      <text x="218" y="80" fontSize="22" fill={CREAM} style={TAGLINE_STYLE}>Tax</text>
      <text x="218" y="106" fontSize="22" fill={CREAM} style={TAGLINE_STYLE}>Advisory</text>
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
