"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SpacingSize = 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 80 | 96 | 120 | 160;

interface SpacingProps {
  size: SpacingSize;
  horizontal?: boolean;
  className?: string;
}

const spacingClasses: Record<SpacingSize, string> = {
  4: "h-1 w-1",
  8: "h-2 w-2",
  12: "h-3 w-3",
  16: "h-4 w-4",
  20: "h-5 w-5",
  24: "h-6 w-6",
  32: "h-8 w-8",
  40: "h-10 w-10",
  48: "h-12 w-12",
  56: "h-14 w-14",
  64: "h-16 w-16",
  80: "h-20 w-20",
  96: "h-24 w-24",
  120: "h-30 w-30",
  160: "h-40 w-40",
};

export const Spacing: React.FC<SpacingProps> = ({ size, horizontal = false, className }) => {
  return (
    <div
      className={cn(
        horizontal ? "inline-block" : "block",
        horizontal ? `w-${size / 4}` : `h-${size / 4}`,
        spacingClasses[size],
        className
      )}
      aria-hidden="true"
    />
  );
};
