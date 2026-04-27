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

/**
 * N&D Tax Advisory — official logo per Brand Guidelines 2026.
 * Renders SVG inline. & is gold (#C9A961), N + D + tagline navy (#0F2B46).
 */
export function Logo({ variant = "primary", size = "md", className }: LogoProps) {
  const sizeCls = SIZE_CLASS[size];

  if (variant === "horizontal") {
    return (
      <svg
        viewBox="0 0 220 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="N&D Tax Advisory"
        className={cn(sizeCls, "w-auto", className)}
      >
        <text
          x="0"
          y="30"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="700"
          fontSize="32"
          fill="#0F2B46"
        >
          N
        </text>
        <text
          x="28"
          y="30"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="700"
          fontSize="32"
          fill="#C9A961"
        >
          &amp;
        </text>
        <text
          x="56"
          y="30"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="700"
          fontSize="32"
          fill="#0F2B46"
        >
          D
        </text>
        <text
          x="92"
          y="20"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="600"
          fontSize="11"
          letterSpacing="2"
          fill="#0F2B46"
        >
          TAX
        </text>
        <text
          x="92"
          y="34"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="600"
          fontSize="11"
          letterSpacing="2"
          fill="#0F2B46"
        >
          ADVISORY
        </text>
      </svg>
    );
  }

  // Primary stacked (default), mono, reversed share same shape, only colors differ.
  const isReversed = variant === "reversed";
  const isMono = variant === "mono";

  const colorN = isReversed ? "#FAF7F0" : isMono ? "#0F2B46" : "#0F2B46";
  const colorAmp = isReversed ? "#C9A961" : isMono ? "#0F2B46" : "#C9A961";
  const colorD = isReversed ? "#FAF7F0" : isMono ? "#0F2B46" : "#0F2B46";
  const colorLine = isReversed ? "#C9A961" : isMono ? "#0F2B46" : "#0F2B46";
  const colorTag = isReversed ? "#FAF7F0" : isMono ? "#0F2B46" : "#0F2B46";

  return (
    <svg
      viewBox="0 0 140 90"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="N&D Tax Advisory"
      className={cn(sizeCls, "w-auto", className)}
    >
      {/* N */}
      <text
        x="20"
        y="58"
        fontFamily="Playfair Display, Georgia, serif"
        fontWeight="700"
        fontSize="56"
        fill={colorN}
        textAnchor="middle"
      >
        N
      </text>
      {/* & */}
      <text
        x="70"
        y="58"
        fontFamily="Playfair Display, Georgia, serif"
        fontWeight="700"
        fontSize="56"
        fill={colorAmp}
        textAnchor="middle"
      >
        &amp;
      </text>
      {/* D */}
      <text
        x="120"
        y="58"
        fontFamily="Playfair Display, Georgia, serif"
        fontWeight="700"
        fontSize="56"
        fill={colorD}
        textAnchor="middle"
      >
        D
      </text>
      {/* Underline */}
      <line x1="2" y1="68" x2="138" y2="68" stroke={colorLine} strokeWidth="1.5" />
      {/* TAX ADVISORY tagline */}
      <text
        x="70"
        y="84"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="3.5"
        fill={colorTag}
        textAnchor="middle"
      >
        TAX ADVISORY
      </text>
    </svg>
  );
}
