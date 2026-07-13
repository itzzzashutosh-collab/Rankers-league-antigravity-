"use client";

import * as React from "react";
import { Filter, RotateCcw, DollarSign, Award, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContestFiltersProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  activeDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  activeFeeType: "free" | "paid" | "all";
  onFeeTypeChange: (type: "free" | "paid" | "all") => void;
  activeStatus: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
  className?: string;
}

export function ContestFilters({
  activeCategory,
  onCategoryChange,
  activeDifficulty,
  onDifficultyChange,
  activeFeeType,
  onFeeTypeChange,
  activeStatus,
  onStatusChange,
  onReset,
  className,
}: ContestFiltersProps) {
  const categories = ["All", "Civil Services", "Engineering", "Medical Sciences", "Finance & Accounting", "Law"];
  const difficulties = ["All", "Elite", "Apex", "Prime", "Challenger"];
  const statuses = ["All", "upcoming", "completed"];

  return (
    <div className={cn("bg-card/40 backdrop-blur-md border border-border/40 p-5 rounded-2xl flex flex-col gap-6 shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-border/20 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Filter Arena</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          Exams & Championships
        </span>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-all",
                activeCategory === cat
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" />
          Calibration Difficulty
        </span>
        <div className="flex flex-col gap-1">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={cn(
                "w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-all",
                activeDifficulty === diff
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Fee Toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          Entry Fee Bracket
        </span>
        <div className="grid grid-cols-3 gap-1 bg-secondary/60 p-0.5 rounded-lg border border-border/30">
          {(["all", "free", "paid"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onFeeTypeChange(type)}
              className={cn(
                "text-[10px] uppercase font-bold py-1.5 rounded-md transition-all",
                activeFeeType === type
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Championship Status
        </span>
        <div className="flex flex-col gap-1">
          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => onStatusChange(stat)}
              className={cn(
                "w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-all capitalize",
                activeStatus === stat
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {stat === "All" ? "All Timelines" : stat === "upcoming" ? "Registration Open" : "Completed"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ContestFilters;
