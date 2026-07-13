"use client";

import * as React from "react";
import { Award, Trophy, ShieldCheck, BadgePercent } from "lucide-react";
import { RewardTier } from "../../types/contests";
import { Card, Typography } from "../ui";
import { cn } from "@/lib/utils";

interface ContestRewardCardProps {
  reward: RewardTier;
  className?: string;
}

export function ContestRewardCard({ reward, className }: ContestRewardCardProps) {
  const isRank1 = reward.rank === "Rank 1";
  const isTopRank = reward.rank.includes("Rank 2") || reward.rank.includes("Rank 3") || reward.rank.includes("Rank 4") || reward.rank.includes("Rank 5");

  return (
    <Card
      variant={isRank1 ? "gradient-border" : "solid"}
      hoverEffect="lift"
      className={cn(
        "border border-border/40 relative overflow-hidden transition-all duration-300",
        isRank1 ? "bg-amber-500/5 border-amber-500/20" : "bg-card/60",
        className
      )}
    >
      {/* Decorative background glow for top rank */}
      {isRank1 && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="flex items-start gap-4">
        {/* Left Side Icon */}
        <div
          className={cn(
            "p-3 rounded-xl border shrink-0",
            isRank1
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : isTopRank
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-muted text-muted-foreground border-border/80"
          )}
        >
          {isRank1 ? (
            <Trophy className="w-5 h-5" />
          ) : reward.rank.includes("Percentile") ? (
            <BadgePercent className="w-5 h-5" />
          ) : (
            <Award className="w-5 h-5" />
          )}
        </div>

        {/* Details Column */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
            {reward.rank}
          </span>
          <Typography variant="h4" className="font-extrabold text-foreground mb-1 tracking-tight">
            {reward.prize}
          </Typography>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {reward.recognition}
          </p>

          {/* Achievement badge details */}
          {reward.achievementBadge && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide border bg-secondary/80 border-border/60 text-muted-foreground select-none">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Badge: {reward.achievementBadge}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
export default ContestRewardCard;
