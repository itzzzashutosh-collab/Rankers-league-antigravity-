"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button, Typography } from "../ui";
import { cn } from "@/lib/utils";

interface ContestEmptyStateProps {
  onReset: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function ContestEmptyState({
  onReset,
  title = "No Championships Found",
  description = "No active competitions match your filter settings. Please adjust your criteria or reset filters to browse all championships.",
  className,
}: ContestEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border/80 rounded-2xl bg-card/25 backdrop-blur-sm max-w-lg mx-auto my-8",
        className
      )}
    >
      <div className="p-3 bg-primary/5 text-primary rounded-full border border-primary/10 mb-4 animate-bounce">
        <AlertCircle className="w-6 h-6" />
      </div>

      <Typography variant="h3" className="font-extrabold text-foreground tracking-tight mb-2">
        {title}
      </Typography>

      <Typography variant="body-medium" className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </Typography>

      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="rounded-lg font-bold text-xs uppercase tracking-wider gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </Button>
    </div>
  );
}
export default ContestEmptyState;
