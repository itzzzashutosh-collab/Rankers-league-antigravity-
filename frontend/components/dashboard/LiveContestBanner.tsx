"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveContest {
  id: string;
  contest_name: string;
  contest_slug: string;
  contest_date: string;
}

interface LiveContestBannerProps {
  contest: LiveContest | null;
}

export function LiveContestBanner({ contest }: LiveContestBannerProps) {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    if (!contest) return;

    const target = new Date(contest.contest_date).getTime() + (3 * 60 * 60 * 1000); // Assume 3 hours duration

    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      const parts = [
        String(hrs).padStart(2, "0"),
        String(mins).padStart(2, "0"),
        String(secs).padStart(2, "0")
      ];
      setTimeLeft(parts.join(":"));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  if (!contest) {
    return (
      <div className="bg-card/40 border border-border/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground">No active live contests at the moment.</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Check upcoming contests tab to register.</p>
          </div>
        </div>
        <Link href="/dashboard/my-contests">
          <Button variant="ghost" className="text-xs font-semibold px-4 hover:bg-muted/40">
            View My Enrollments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-card border-2 border-primary/40 rounded-2xl p-6 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(var(--primary),0.05),transparent)] pointer-events-none" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 animate-pulse">
          <Zap className="w-6 h-6 fill-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded-full text-[9px] font-black text-primary uppercase tracking-wider animate-pulse">
              LIVE NOW
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Timer: {timeLeft}</span>
          </div>
          <h3 className="text-lg font-black text-foreground mt-1.5">{contest.contest_name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your official examination workspace is open.</p>
        </div>
      </div>

      <Link href={`/live/${contest.contest_slug}`}>
        <Button className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/35 hover:shadow-primary/40 hover:bg-primary/90 px-6 py-5 rounded-xl flex items-center gap-2 text-xs uppercase tracking-wider active:scale-[0.98] transition-all">
          <Play className="w-3.5 h-3.5 fill-primary-foreground" />
          Continue Exam
        </Button>
      </Link>
    </div>
  );
}
export default LiveContestBanner;
