"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── PAGE WRAPPER ───
interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col min-h-screen bg-background", className)} {...props}>
        {children}
      </div>
    );
  }
);
Page.displayName = "Page";

// ─── SECTION CONTAINER ───
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  radialGlow?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, radialGlow = false, children, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("py-24 relative overflow-hidden", className)} {...props}>
        {radialGlow && <div className="absolute inset-0 radial-glow pointer-events-none" />}
        <div className="max-w-7xl mx-auto px-6 relative z-10">{children}</div>
      </section>
    );
  }
);
Section.displayName = "Section";

// ─── GRID LAYOUT ───
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 2 | 3 | 4 | 6 | 8 | 10 | 12;
  children: React.ReactNode;
}

const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

const gapClasses = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = 6, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("grid", colClasses[cols], gapClasses[gap], className)} {...props}>
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

// ─── FLEX LAYOUT ───
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: "wrap" | "nowrap";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  children: React.ReactNode;
}

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const dirClasses = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
};

const gapFlexClasses = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, align = "center", justify = "start", direction = "row", wrap = "nowrap", gap, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          alignClasses[align],
          justifyClasses[justify],
          dirClasses[direction],
          wrap === "wrap" ? "flex-wrap" : "flex-nowrap",
          gap && gapFlexClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Flex.displayName = "Flex";

// ─── STACK LAYOUT (VERTICAL VERTEX) ───
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  children: React.ReactNode;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = 4, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col", gapFlexClasses[gap], className)} {...props}>
        {children}
      </div>
    );
  }
);
Stack.displayName = "Stack";

// ─── GENERAL MAX-WIDTH WRAPPER ───
export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("max-w-7xl mx-auto px-6 w-full", className)} {...props}>
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";
