"use client";

import * as React from "react";
import { Loader2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── SKELETON LOADER ───
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = "rectangular", className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/60",
        variant === "text" && "h-4 w-full rounded",
        variant === "rectangular" && "rounded-xl",
        variant === "circular" && "rounded-full",
        className
      )}
      {...props}
    />
  );
};

// ─── CIRCULAR SPINNER ───
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const spinnerSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className, ...props }) => {
  return (
    <div className={cn("flex justify-center items-center", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary shrink-0", spinnerSizes[size])} />
    </div>
  );
};

// ─── LINEAR PROGRESS BAR ───
interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = "bg-primary", className, ...props }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  return (
    <div className={cn("w-full h-2 bg-muted rounded-full overflow-hidden", className)} {...props}>
      <div
        className={cn("h-full rounded-full transition-all duration-300", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ─── PAGE LOADER (LOGO SCREEN) ───
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Brand Shield */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Ranker&apos;s League
          </h2>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            Connecting to Arena
          </span>
        </div>
        <Spinner size="sm" className="mt-2" />
      </div>
    </div>
  );
};
