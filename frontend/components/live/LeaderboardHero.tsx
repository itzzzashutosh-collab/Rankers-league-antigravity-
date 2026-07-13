"use client";

import * as React from "react";
import { Badge, Typography } from "../ui";
import { cn } from "@/lib/utils";

interface LeaderboardHeroProps {
  className?: string;
}

export function LeaderboardHero({ className }: LeaderboardHeroProps) {
  return (
    <div className={cn("relative overflow-hidden py-16 sm:py-24 border-b border-border/20 bg-gradient-to-b from-background via-secondary/10 to-background text-center select-none", className)}>
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.01]" />

      <div className="max-w-4xl mx-auto px-6 relative flex flex-col items-center gap-5">
        <Badge variant="featured" className="animate-in fade-in slide-in-from-top duration-300">
          ✨ National Standings Registry
        </Badge>

        <Typography
          variant="display-l"
          className="font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-center leading-none"
        >
          Compete. Climb. Conquer.
        </Typography>

        <Typography
          variant="subtitle"
          className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm sm:text-base font-medium"
        >
          Track the highest-performing competitors across every examination category and compete for the top positions on the national and global leaderboard.
        </Typography>

        {/* Animated Rank Cards Shims */}
        <div className="flex gap-4 mt-6 text-left">
          <div className="hidden sm:flex items-center gap-3 p-3.5 bg-card/45 border border-border/40 rounded-2xl backdrop-blur-md shadow-sm">
            <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/15 flex items-center justify-center font-bold text-xs">
              #1
            </span>
            <div className="text-[10px] leading-none">
              <span className="text-muted-foreground block">Meera Nair</span>
              <strong className="text-foreground block mt-1">720 / 720 (NEET)</strong>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 p-3.5 bg-card/45 border border-border/40 rounded-2xl backdrop-blur-md shadow-sm">
            <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/15 flex items-center justify-center font-bold text-xs">
              #2
            </span>
            <div className="text-[10px] leading-none">
              <span className="text-muted-foreground block">Priyansh Mehta</span>
              <strong className="text-foreground block mt-1">342 / 360 (JEE)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LeaderboardHero;
