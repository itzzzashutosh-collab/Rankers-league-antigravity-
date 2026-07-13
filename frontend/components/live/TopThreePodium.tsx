"use client";

import * as React from "react";
import { LeaderboardEntry } from "@/content/leaderboard/leaderboard-data";
import { Card } from "../ui";
import { Trophy, TrendingUp, TrendingDown, Minus, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopThreePodiumProps {
  entries: LeaderboardEntry[];
  categoryName: string;
}

export function TopThreePodium({ entries, categoryName }: TopThreePodiumProps) {
  // Extract ranks 1, 2, 3
  const rank1 = entries.find((e) => e.rank === 1);
  const rank2 = entries.find((e) => e.rank === 2);
  const rank3 = entries.find((e) => e.rank === 3);

  // Podium layout renders Rank 2 (Left), Rank 1 (Center, taller), Rank 3 (Right)
  const renderPodiumCard = (entry: LeaderboardEntry | undefined, position: 1 | 2 | 3) => {
    if (!entry) {
      return (
        <Card variant="glass" className={cn(
          "flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/40 bg-card/15 min-h-[220px]",
          position === 1 && "sm:min-h-[260px] relative -translate-y-2 z-10"
        )}>
          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
            No Rank {position}
          </span>
        </Card>
      );
    }

    const themeColors = {
      1: {
        border: "border-amber-500/30 hover:border-amber-500/50 shadow-amber-500/5 bg-amber-500/5",
        text: "text-amber-500",
        badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        podiumH: "sm:min-h-[280px]"
      },
      2: {
        border: "border-slate-400/30 hover:border-slate-400/50 shadow-slate-400/5 bg-slate-400/5",
        text: "text-slate-400",
        badge: "bg-slate-400/10 text-slate-400 border-slate-400/20",
        podiumH: "sm:min-h-[240px]"
      },
      3: {
        border: "border-amber-700/30 hover:border-amber-700/50 shadow-amber-700/5 bg-amber-700/5",
        text: "text-amber-700",
        badge: "bg-amber-700/10 text-amber-700 border-amber-700/20",
        podiumH: "sm:min-h-[240px]"
      }
    }[position];

    return (
      <Card
        variant="glass"
        className={cn(
          "flex flex-col items-center p-6 border shadow-lg transition-all duration-300 relative select-none",
          themeColors.border,
          themeColors.podiumH,
          position === 1 && "sm:-translate-y-4 sm:scale-105 z-10 border-amber-500/40"
        )}
      >
        {/* Large Rank Indicator */}
        <div className={cn("w-12 h-12 rounded-full border flex items-center justify-center font-extrabold text-lg shadow-sm mb-4 shrink-0", themeColors.badge)}>
          {position}
        </div>

        {/* Flag + Name */}
        <div className="flex items-center gap-1.5 justify-center">
          <span className="text-sm shrink-0" title={entry.country}>
            {entry.countryFlag}
          </span>
          <h4 className="font-extrabold text-sm text-foreground tracking-tight truncate max-w-[140px] text-center">
            {entry.name}
          </h4>
        </div>

        <span className="text-[9px] text-muted-foreground font-semibold mt-1 text-center truncate max-w-[150px]">
          {entry.institution}
        </span>

        {/* Category Label */}
        <span className="text-[8px] font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-widest mt-2.5">
          {entry.category.replace("-", " ")}
        </span>

        {/* Score Ratio */}
        <strong className="text-base text-foreground font-extrabold tracking-tight mt-4 select-all">
          {entry.score} <span className="text-[10px] text-muted-foreground font-normal">/ {entry.maxScore}</span>
        </strong>

        {/* Aura points */}
        <div className="mt-2.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-extrabold flex items-center gap-1 cursor-help" title="Competition points normalized for standings">
          <span>✨ {entry.auraPoints.toLocaleString()}</span>
          <span className="text-[8px] font-medium text-primary/70 uppercase">Aura</span>
        </div>

        {/* Trend Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold">
          {entry.trend === "up" && (
            <span title="Rank Climbed">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </span>
          )}
          {entry.trend === "down" && (
            <span title="Rank Dropped">
              <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
            </span>
          )}
          {entry.trend === "stable" && (
            <span title="Rank Stable">
              <Minus className="w-3.5 h-3.5 text-muted-foreground" />
            </span>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1 select-none">
        <h3 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
          Top Performers — {categoryName}
        </h3>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
          <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Podium standings
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-4 pb-2">
        {/* Render Order: 2nd, 1st, 3rd */}
        <div className="order-2 sm:order-1">{renderPodiumCard(rank2, 2)}</div>
        <div className="order-1 sm:order-2">{renderPodiumCard(rank1, 1)}</div>
        <div className="order-3 sm:order-3">{renderPodiumCard(rank3, 3)}</div>
      </div>
    </div>
  );
}
export default TopThreePodium;
