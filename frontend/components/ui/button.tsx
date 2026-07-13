"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-semibold tracking-wide transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-secondary/40",
        outline: "border border-border bg-background hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/20",
        ghost: "hover:bg-muted/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/20",
        gradient: "gold-gradient text-primary-foreground hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/40 shadow-sm",
        glass: "glass-effect text-foreground hover:bg-background/80 focus-visible:ring-2 focus-visible:ring-primary/10",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-destructive/40",
        success: "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/40",
      },
      size: {
        xs: "h-7 gap-1 px-2.5 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8.5 gap-1.5 px-3.5 text-xs rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 gap-2 px-5 text-sm rounded-xl",
        lg: "h-11.5 gap-2 px-6 text-sm rounded-xl",
        xl: "h-13 gap-2.5 px-8 text-base rounded-2xl",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8.5 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11.5 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, disabled, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0 mr-1.5" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0 mr-1.5">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0 ml-1.5">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export { buttonVariants };
