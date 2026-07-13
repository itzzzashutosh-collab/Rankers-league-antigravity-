"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        solid: "bg-card border border-border/80 text-card-foreground",
        outlined: "border border-border/100 bg-background text-foreground",
        glass: "glass-effect text-foreground shadow-sm",
        "gradient-border": "bg-card border border-primary/20 text-card-foreground",
      },
      hoverEffect: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-lg hover:border-primary/25",
        glow: "hover:border-primary/30 glow-subtle hover:shadow-xl",
        "lift-glow": "hover:-translate-y-1 hover:border-primary/30 glow-subtle hover:shadow-xl",
      },
      padding: {
        none: "p-0",
        sm: "p-4 sm:p-5",
        md: "p-6 sm:p-8",
        lg: "p-8 sm:p-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      hoverEffect: "none",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverEffect, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hoverEffect, padding, className }))}
        {...props}
      >
        {variant === "gradient-border" && (
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-50 transition-all duration-500" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
