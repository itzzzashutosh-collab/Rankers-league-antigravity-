"use client";

import * as React from "react";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface ContestSkeletonProps {
  variant?: "card" | "details" | "grid";
  count?: number;
  className?: string;
}

export function ContestSkeleton({ variant = "card", count = 1, className }: ContestSkeletonProps) {
  const shimmerClasses = "animate-pulse bg-muted-foreground/15 rounded";

  const renderCardSkeleton = (key: number) => (
    <Card key={key} variant="solid" className="border border-border/40 p-0 overflow-hidden flex flex-col h-full bg-card/40">
      {/* Banner */}
      <div className={cn("h-36 w-full", shimmerClasses)} />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Badges/Category */}
        <div className="flex gap-2">
          <div className={cn("h-4 w-16", shimmerClasses)} />
          <div className={cn("h-4 w-20", shimmerClasses)} />
        </div>

        {/* Title */}
        <div className={cn("h-6 w-3/4", shimmerClasses)} />

        {/* Dynamic timer box */}
        <div className={cn("h-10 w-full rounded-xl", shimmerClasses)} />

        {/* Parameters */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className={cn("h-8 w-full", shimmerClasses)} />
          <div className={cn("h-8 w-full", shimmerClasses)} />
          <div className={cn("h-8 w-full", shimmerClasses)} />
          <div className={cn("h-8 w-full", shimmerClasses)} />
        </div>

        {/* Seats fill */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between">
            <div className={cn("h-3.5 w-24", shimmerClasses)} />
            <div className={cn("h-3.5 w-12", shimmerClasses)} />
          </div>
          <div className={cn("h-1.5 w-full rounded-full", shimmerClasses)} />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-border/20 mt-auto">
          <div className="flex flex-col gap-1.5">
            <div className={cn("h-3 w-10", shimmerClasses)} />
            <div className={cn("h-4.5 w-16", shimmerClasses)} />
          </div>
          <div className={cn("h-8 w-24 rounded-lg", shimmerClasses)} />
        </div>
      </div>
    </Card>
  );

  const renderDetailsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left side detail modules */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className={cn("h-4 w-28", shimmerClasses)} />
          <div className={cn("h-10 w-3/4", shimmerClasses)} />
          <div className="flex gap-2">
            <div className={cn("h-5 w-20", shimmerClasses)} />
            <div className={cn("h-5 w-24", shimmerClasses)} />
          </div>
        </div>

        <div className={cn("h-40 w-full rounded-2xl", shimmerClasses)} />
        <div className={cn("h-64 w-full rounded-2xl", shimmerClasses)} />
      </div>

      {/* Right side sidebar modules */}
      <div className="flex flex-col gap-6">
        <div className={cn("h-[450px] w-full rounded-2xl", shimmerClasses)} />
      </div>
    </div>
  );

  if (variant === "details") {
    return <div className={cn("max-w-6xl mx-auto py-12", className)}>{renderDetailsSkeleton()}</div>;
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, idx) => renderCardSkeleton(idx))}
    </div>
  );
}
export default ContestSkeleton;
