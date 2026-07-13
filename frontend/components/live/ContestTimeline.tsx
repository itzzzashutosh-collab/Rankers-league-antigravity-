"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Award, ArrowRight } from "lucide-react";
import { LiveContest } from "../../types/live";
import { Card, Typography } from "../ui";
import { cn } from "@/lib/utils";

interface ContestTimelineProps {
  contests: LiveContest[];
  className?: string;
}

export function ContestTimeline({ contests, className }: ContestTimelineProps) {
  if (!contests || contests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
        No scheduled live timelines are currently registered.
      </div>
    );
  }

  return (
    <div className={cn("relative pl-8 border-l border-border/80 flex flex-col gap-10", className)}>
      {contests.map((item, idx) => (
        <div key={item.id} className="relative group text-left">
          {/* Timeline node */}
          <span className="absolute -left-[45px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full border border-border/60 bg-card text-primary text-xs font-bold shadow-sm select-none">
            {String(idx + 1).padStart(2, "0")}
          </span>

          <Card variant="solid" className="bg-card/45 hover:border-primary/20 transition-all p-5 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                {/* Date tag */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date} • {item.startTime} IST
                </div>
                
                {/* Title */}
                <Typography variant="h4" className="font-extrabold text-foreground tracking-tight">
                  {item.title}
                </Typography>
                <p className="text-xs text-muted-foreground max-w-xl">
                  Subject parameters are calibrated to the {item.exam} syllabus criteria. Access code verification is generated on enrollment.
                </p>
              </div>

              {/* Reward Pool & Actions */}
              <div className="flex flex-col md:items-end gap-3 shrink-0">
                <div className="flex flex-col md:items-end">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-primary" /> Reward Pool
                  </span>
                  <strong className="text-sm font-extrabold text-foreground mt-0.5">
                    ₹{item.prizePool.toLocaleString("en-IN")}
                  </strong>
                </div>

                <Link href={`/live/${item.slug}`}>
                  <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1 select-none">
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
export default ContestTimeline;
