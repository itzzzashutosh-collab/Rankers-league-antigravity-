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
    const statusConfig: Record<string, { text: string; icon: any; classes: string }> = {
      upcoming: {
        text: "Registration Open",
        icon: Timer,
        classes: "bg-primary/10 text-primary border-primary/20",
      },
      registered: {
        text: "Registered",
        icon: Timer,
        classes: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      },
      active: {
        text: "Live Soon",
        icon: AlertTriangle,
        classes: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
      },
      live: {
        text: "Live Now",
        icon: AlertTriangle,
        classes: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
      },
      in_progress: {
        text: "In Progress",
        icon: Timer,
        classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      },
      completed: {
        text: "Completed",
        icon: CheckCircle,
        classes: "bg-muted text-muted-foreground border-border/80",
      },
      ended: {
        text: "Ended",
        icon: CheckCircle,
        classes: "bg-muted text-muted-foreground border-border/80",
      },
    };

    const fallbackStatus = {
      text: String(status).replace(/_/g, " "),
      icon: Timer,
      classes: "bg-primary/10 text-primary border-primary/20",
    };

    const config = statusConfig[status] || fallbackStatus;
    const Icon = config.icon || Timer;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border font-sans select-none",
          config.classes || "bg-primary/10 text-primary border-primary/20",
          className
        )}
      >
        <Icon className="w-3 h-3 shrink-0" />
        {config.text}
      </span>
    );
  }

  if (difficulty) {
    const diffConfig: Record<string, { text: string; classes: string }> = {
      Elite: {
        text: "Elite Tier",
        classes: "bg-red-500/10 text-red-500 border-red-500/20",
      },
      Apex: {
        text: "Apex Tier",
        classes: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      },
      Prime: {
        text: "Prime Tier",
        classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      },
      Challenger: {
        text: "Challenger",
        classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      },
      Easy: {
        text: "Easy",
        classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      },
      Medium: {
        text: "Medium",
        classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      },
      Hard: {
        text: "Hard",
        classes: "bg-red-500/10 text-red-500 border-red-500/20",
      },
      Expert: {
        text: "Expert",
        classes: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      },
    };

    const fallbackDiff = {
      text: String(difficulty),
      classes: "bg-primary/10 text-primary border-primary/20",
    };

    const config = diffConfig[difficulty] || fallbackDiff;

    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border select-none",
          config.classes || "bg-primary/10 text-primary border-primary/20",
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
