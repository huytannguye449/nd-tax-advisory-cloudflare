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
 *
 * Section 02 nguyên tắc:
 * "Đường kẻ ngang và cụm chữ TAX ADVISORY phải vừa khít đúng bằng chiều ngang
 *  của biểu tượng N&D. Không được để phần tagline ngắn hơn hoặc dài hơn monogram."
 *
 * Tỉ lệ: N (navy serif) + & (gold italic, smaller) + D (navy serif)
 *        Underline = full monogram width
 *        TAX ADVISORY centered below, letter-spacing wide
 */
export function Logo({ variant = "primary", size = "md", className }: LogoProps) {
  const sizeCls = SIZE_CLASS[size];

  if (variant === "horizontal") {
    return (
      <svg
        viewBox="0 0 280 64"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="N&D Tax Advisory"
        className={cn(sizeCls, "w-auto", className)}
      >
        {/* N */}
        <text
          x="6"
          y="48"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize="56"
          fill="#0F2B46"
        >
          N
        </text>
        {/* & — italic, gold, slightly smaller */}
        <text
          x="55"
          y="48"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontStyle="italic"
          fontSize="50"
          fill="#C9A961"
        >
          &amp;
        </text>
        {/* D */}
        <text
          x="92"
          y="48"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize="56"
          fill="#0F2B46"
        >
          D
        </text>
        {/* Vertical separator */}
        <line x1="148" y1="14" x2="148" y2="50" stroke="#0F2B46" strokeWidth="1" opacity="0.25" />
        {/* TAX */}
        <text
          x="160"
          y="28"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="600"
          fontSize="13"
          letterSpacing="3.5"
          fill="#0F2B46"
        >
          TAX
        </text>
        {/* ADVISORY */}
        <text
          x="160"
          y="46"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="600"
          fontSize="13"
          letterSpacing="3.5"
          fill="#0F2B46"
        >
          ADVISORY
        </text>
      </svg>
    );
  }

  // Primary stacked / mono / reversed share same shape, only colors differ.
  const isReversed = variant === "reversed";
  const isMono = variant === "mono";

  const colorN = isReversed ? "#FAF7F0" : "#0F2B46";
  const colorAmp = isMono ? "#0F2B46" : "#C9A961";
  const colorD = isReversed ? "#FAF7F0" : "#0F2B46";
  const colorLine = isReversed ? "#C9A961" : "#0F2B46";
  const colorTag = isReversed ? "#FAF7F0" : "#0F2B46";

  return (
    <svg
      viewBox="0 0 240 130"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="N&D Tax Advisory"
      className={cn(sizeCls, "w-auto", className)}
    >
      {/* N — left */}
      <text
        x="35"
        y="86"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontSize="100"
        fill={colorN}
        textAnchor="middle"
      >
        N
      </text>
      {/* & — center, italic, gold, slightly smaller */}
      <text
        x="120"
        y="86"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="92"
        fill={colorAmp}
        textAnchor="middle"
      >
        &amp;
      </text>
      {/* D — right */}
      <text
        x="205"
        y="86"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontSize="100"
        fill={colorD}
        textAnchor="middle"
      >
        D
      </text>
      {/* Underline — vừa khít chiều ngang monogram */}
      <line x1="10" y1="98" x2="230" y2="98" stroke={colorLine} strokeWidth="2" />
      {/* TAX ADVISORY — centered, wide letter-spacing */}
      <text
        x="120"
        y="120"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="14"
        letterSpacing="9"
        fill={colorTag}
        textAnchor="middle"
      >
        TAX ADVISORY
      </text>
    </svg>
  );
}
