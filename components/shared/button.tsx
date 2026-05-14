import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * DESIGN.md button rules:
 *  - Primary: solid navy + cream text, hover fills GOLD
 *  - Secondary: transparent + 1px navy border, hover fills GOLD (canonical DESIGN secondary)
 *  - Outline: alias of secondary (kept for legacy callsites)
 *  - Ghost: text-only, hover gold text
 *  - Sharp 0px corners (no rounded), strictly flat (no shadow/gradient)
 */
const VARIANT: Record<Variant, string> = {
  primary:
    "bg-navy text-cream border border-navy hover:bg-gold hover:text-navy hover:border-gold focus-visible:outline-gold disabled:opacity-50",
  secondary:
    "bg-transparent text-navy border border-navy hover:bg-gold hover:text-navy hover:border-gold focus-visible:outline-gold disabled:opacity-50",
  outline:
    "bg-transparent text-navy border border-navy hover:bg-gold hover:text-navy hover:border-gold focus-visible:outline-gold disabled:opacity-50",
  ghost:
    "bg-transparent text-navy border border-transparent hover:text-gold-700 focus-visible:outline-gold disabled:opacity-50",
};

const SIZE: Record<Size, string> = {
  sm: "h-10 px-5 text-[13px] gap-2",
  md: "h-12 px-7 text-[14px] gap-2",
  lg: "h-14 px-9 text-[15px] gap-2.5",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, fullWidth, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          // Editorial button: square, label-caps style, no shadow
          "inline-flex items-center justify-center font-semibold uppercase tracking-[0.08em]",
          "transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed",
          "min-h-[44px] [&_svg]:size-4 [&_svg]:shrink-0",
          VARIANT[variant],
          SIZE[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
