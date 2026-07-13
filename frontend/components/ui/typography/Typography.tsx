"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TypographyVariant =
  | "display-xl"
  | "display-l"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "title"
  | "subtitle"
  | "body-large"
  | "body-medium"
  | "body-small"
  | "caption"
  | "label"
  | "button-text";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  "display-xl": "font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]",
  "display-l": "font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]",
  "h1": "font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  "h2": "font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight",
  "h3": "font-heading text-xl sm:text-2xl md:text-3xl font-semibold",
  "h4": "font-heading text-lg sm:text-xl md:text-2xl font-semibold",
  "title": "font-sans text-lg sm:text-xl font-medium text-foreground",
  "subtitle": "font-sans text-sm sm:text-base text-muted-foreground leading-relaxed",
  "body-large": "font-sans text-base sm:text-lg text-foreground leading-relaxed",
  "body-medium": "font-sans text-sm sm:text-base text-foreground leading-relaxed",
  "body-small": "font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed",
  "caption": "font-sans text-[10px] sm:text-xs text-muted-foreground tracking-wide uppercase",
  "label": "font-sans text-xs sm:text-sm font-semibold text-foreground tracking-wide",
  "button-text": "font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider",
};

const defaultElement: Record<TypographyVariant, React.ElementType> = {
  "display-xl": "h1",
  "display-l": "h1",
  "h1": "h1",
  "h2": "h2",
  "h3": "h3",
  "h4": "h4",
  "title": "h5",
  "subtitle": "p",
  "body-large": "p",
  "body-medium": "p",
  "body-small": "p",
  "caption": "span",
  "label": "label",
  "button-text": "span",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "body-medium", as, className, children, ...props }, ref) => {
    const Component = as || defaultElement[variant];
    return (
      <Component
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";
