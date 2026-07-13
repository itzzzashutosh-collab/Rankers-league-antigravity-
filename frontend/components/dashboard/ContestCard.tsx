"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, Trophy, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContestEnrollment {
  id: string;
  contest_slug: string;
  contest_name: string;
  exam_category: string;
  contest_date: string;
  status: string;
  final_rank?: number | null;
  final_score?: number | null;
  aura_earned?: number;
  prize_won?: number;
}

interface ContestCardProps {
  enrollment: ContestEnrollment;
  variant: "upcoming" | "live" | "completed" | "cancelled";
}

export function ContestCard({ enrollment, variant }: ContestCardProps) {
  const [countdown, setCountdown] = React.useState("");

  React.useEffect(() => {
    if (variant !== "upcoming") return;

    const target = new Date(enrollment.contest_date).getTime();
    
    const updateCountdown = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown("Starting Now");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setCountdown(`${days}d ${hrs}h left`);
      } else {
        setCountdown(`${hrs}h ${mins}m left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [enrollment.contest_date, variant]);

  const formattedDate = new Date(enrollment.contest_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(enrollment.contest_date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className={cn(
      "relative bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-5 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col justify-between min-h-[160px]",
      variant === "live" && "border-primary/40 bg-gradient-to-r from-primary/5 to-transparent"
    )}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="px-2.5 py-0.5 bg-muted/40 border border-border/55 rounded-full text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            {enrollment.exam_category.replace("_", " ")}
          </span>
          {variant === "upcoming" && (
            <span className="text-[10px] font-mono font-bold text-primary">{countdown}</span>
          )}
          {variant === "live" && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-primary animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              LIVE
            </span>
          )}
          {variant === "completed" && (
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
          {variant === "cancelled" && (
            <span className="text-[10px] font-semibold text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-full">
              Cancelled
            </span>
          )}
        </div>

        <h4 className="text-sm font-black text-foreground tracking-tight line-clamp-1">{enrollment.contest_name}</h4>

        {/* Date/Time or Performance summary */}
        {variant !== "completed" ? (
          <div className="flex items-center gap-4 mt-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-[10px] font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-3 bg-muted/20 border border-border/30 rounded-xl p-2.5">
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground font-semibold uppercase">Rank</p>
              <p className="text-xs font-black text-foreground mt-0.5">#{enrollment.final_rank || "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground font-semibold uppercase">Score</p>
              <p className="text-xs font-black text-foreground mt-0.5">{enrollment.final_score ?? "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground font-semibold uppercase">Aura</p>
              <p className="text-xs font-black text-primary mt-0.5">+{enrollment.aura_earned || 0}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-border/20 mt-4 flex items-center justify-between">
        {variant === "completed" && enrollment.prize_won ? (
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
            <Award className="w-3.5 h-3.5 fill-emerald-500/10" />
            Won ₹{Number(enrollment.prize_won).toLocaleString()}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground font-medium">
            {variant === "upcoming" ? "Enrollment Active" : variant === "live" ? "Compete now to rank" : "Processed"}
          </span>
        )}

        {variant === "upcoming" && (
          <Link href={`/contests/${enrollment.contest_slug}`}>
            <Button variant="ghost" className="text-xs font-bold gap-1 p-0 hover:bg-transparent text-primary hover:text-primary/80">
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}

        {variant === "live" && (
          <Link href={`/live/${enrollment.contest_slug}`}>
            <Button className="bg-primary text-primary-foreground text-[10px] font-black rounded-lg h-8 px-4 active:scale-95 shadow-md shadow-primary/20">
              Enter Workspace
            </Button>
          </Link>
        )}

        {variant === "completed" && (
          <Link href={`/results/${enrollment.contest_slug}`}>
            <Button variant="outline" className="text-[10px] font-bold border-border/50 hover:bg-muted/30 rounded-lg h-8 px-4 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-primary" />
              View Result
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
export default ContestCard;
