"use client";

import * as React from "react";
import { Timer, Star, Flame, Trophy, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContestStatus, ContestDifficulty } from "../../types/contests";

interface ContestBadgeProps {
  status?: ContestStatus;
  difficulty?: ContestDifficulty;
  isFeatured?: boolean;
  isTrending?: boolean;
  className?: string;
}

export function ContestBadge({
  status,
  difficulty,
  isFeatured,
  isTrending,
  className,
}: ContestBadgeProps) {
  if (status) {
    const statusConfig = {
      upcoming: {
        text: "Registration Open",
        icon: Timer,
        classes: "bg-primary/5 text-primary border-primary/20",
      },
      active: {
        text: "Live Soon",
        icon: AlertTriangle,
        classes: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
      },
      completed: {
        text: "Completed",
        icon: CheckCircle,
        classes: "bg-muted text-muted-foreground border-border/80",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border font-sans select-none",
          config.classes,
          className
        )}
      >
        <Icon className="w-3 h-3 shrink-0" />
        {config.text}
      </span>
    );
  }

  if (difficulty) {
    const diffConfig = {
      Elite: {
        text: "Elite Tier",
        classes: "bg-red-500/5 text-red-500 border-red-500/20",
      },
      Apex: {
        text: "Apex Tier",
        classes: "bg-violet-500/5 text-violet-500 border-violet-500/20",
      },
      Prime: {
        text: "Prime Tier",
        classes: "bg-blue-500/5 text-blue-500 border-blue-500/20",
      },
      Challenger: {
        text: "Challenger",
        classes: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20",
      },
    };

    const config = diffConfig[difficulty];

    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border select-none",
          config.classes,
          className
        )}
      >
        {config.text}
      </span>
    );
  }

  if (isFeatured) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border select-none gold-gradient text-primary-foreground border-transparent",
          className
        )}
      >
        <Trophy className="w-3 h-3 shrink-0" />
        Featured
      </span>
    );
  }

  if (isTrending) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border select-none bg-orange-500/5 text-orange-500 border-orange-500/20",
          className
        )}
      >
        <Flame className="w-3 h-3 shrink-0" />
        Trending
      </span>
    );
  }

  return null;
}
