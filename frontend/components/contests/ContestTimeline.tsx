"use client";

import * as React from "react";
import { CheckCircle, Play, AlertCircle } from "lucide-react";
import { ScheduleStep } from "../../types/contests";
import { cn } from "@/lib/utils";

interface ContestTimelineProps {
  steps: ScheduleStep[];
  className?: string;
}

export function ContestTimeline({ steps, className }: ContestTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No schedule timeline details configured for this championship.
      </div>
    );
  }

  return (
    <div className={cn("relative pl-6 border-l border-border/80 flex flex-col gap-8", className)}>
      {steps.map((step, idx) => {
        const isCompleted = step.status === "completed";
        const isActive = step.status === "active";

        return (
          <div key={idx} className="relative group">
            {/* Step node indicator icon */}
            <span
              className={cn(
                "absolute -left-[35px] top-0.5 p-1 rounded-full border bg-background transition-colors duration-300",
                isCompleted
                  ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
                  : isActive
                  ? "text-primary border-primary bg-primary/10 animate-pulse"
                  : "text-muted-foreground/60 border-border/80"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : isActive ? (
                <Play className="w-3.5 h-3.5 fill-current" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
            </span>

            {/* Time Stamp */}
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase block mb-1">
              {step.time}
            </span>

            {/* Title & Description */}
            <h4
              className={cn(
                "text-sm font-bold tracking-tight transition-colors duration-300",
                isActive ? "text-primary" : "text-foreground"
              )}
            >
              {step.step}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
export default ContestTimeline;
