"use client";

import * as React from "react";
import { AlertCircle, Timer, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveContestStatus } from "../../types/live";

interface ContestStatusBadgeProps {
  status: LiveContestStatus;
  className?: string;
}

export function ContestStatusBadge({ status, className }: ContestStatusBadgeProps) {
  const configs: Record<string, { text: string; icon: any; classes: string }> = {
    live: {
      text: "Currently Live",
      icon: AlertCircle,
      classes: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
    },
    starting_soon: {
      text: "Starting Soon",
      icon: Timer,
      classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    upcoming: {
      text: "Upcoming",
      icon: Calendar,
      classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    completed: {
      text: "Completed",
      icon: CheckCircle,
      classes: "bg-muted text-muted-foreground border-border/80",
    },
  };

  const fallback = {
    text: String(status || "upcoming").replace(/_/g, " "),
    icon: Calendar,
    classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const config = configs[status] || fallback;
  const Icon = config.icon || Calendar;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border font-sans select-none",
        config.classes || "bg-blue-500/10 text-blue-500 border-blue-500/20",
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {config.text}
    </span>
  );
}
export default ContestStatusBadge;
