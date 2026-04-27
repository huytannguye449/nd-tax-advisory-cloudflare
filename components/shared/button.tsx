import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-navy text-cream hover:bg-navy-700 active:bg-navy-800 focus-visible:ring-gold disabled:bg-navy-300 shadow-sm",
  secondary:
    "bg-gold text-navy hover:bg-gold-600 active:bg-gold-700 focus-visible:ring-navy disabled:bg-gold-300 shadow-sm",
  outline:
    "border border-navy text-navy bg-transparent hover:bg-navy hover:text-cream focus-visible:ring-gold",
  ghost: "text-navy hover:bg-navy/5 focus-visible:ring-gold",
};

const SIZE: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-base gap-2",
  lg: "h-14 px-8 text-base gap-2 md:text-lg",
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
          "inline-flex items-center justify-center font-semibold rounded-md transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          "disabled:cursor-not-allowed disabled:opacity-60",
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
