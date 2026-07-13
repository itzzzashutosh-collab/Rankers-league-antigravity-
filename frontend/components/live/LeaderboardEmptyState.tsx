"use client";

import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Card } from "../ui";

interface LeaderboardEmptyStateProps {
  onClearFilters: () => void;
}

export function LeaderboardEmptyState({ onClearFilters }: LeaderboardEmptyStateProps) {
  return (
    <Card variant="glass" className="border border-dashed border-border/60 p-8 sm:p-12 rounded-2xl text-center flex flex-col items-center gap-5 bg-card/25 select-none animate-in fade-in duration-300">
      
      <div className="p-4 bg-secondary/80 border border-border/80 text-muted-foreground rounded-full shrink-0">
        <Search className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h4 className="font-extrabold text-sm text-foreground tracking-tight">
          No rankings available
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          No verified competitors match your search filters. Try clearing filters or search parameters.
        </p>
      </div>

      <button
        onClick={onClearFilters}
        className="text-[10px] uppercase tracking-wider font-bold py-2.5 px-5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset Filters
      </button>

    </Card>
  );
}
export default LeaderboardEmptyState;
