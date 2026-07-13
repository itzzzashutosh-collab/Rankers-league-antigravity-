"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Award, Clock, Users, ArrowRight, ShieldAlert } from "lucide-react";
import { LiveContest } from "../../types/live";
import { ContestStatusBadge } from "./ContestStatusBadge";
import { ContestCountdown } from "../contests/ContestCountdown";
import { Card, Typography, Button } from "../ui";
import { cn } from "@/lib/utils";

interface LiveContestCardProps {
  contest: LiveContest;
  className?: string;
}

export function LiveContestCard({ contest, className }: LiveContestCardProps) {
  const [enrollActive, setEnrollActive] = React.useState(false);
  const [buttonText, setButtonText] = React.useState("");

  // Determine start timestamp
  const startTimestamp = React.useMemo(() => {
    return new Date(`${contest.date} ${contest.startTime}`).getTime();
  }, [contest.date, contest.startTime]);

  React.useEffect(() => {
    const checkEnrollmentState = () => {
      const now = Date.now();
      const diffMs = startTimestamp - now;
      const minutesBefore = diffMs / (1000 * 60);

      if (contest.status === "completed") {
        setEnrollActive(false);
        setButtonText("Arena Concluded");
        return;
      }

      // If contest starts in less than 30 minutes OR has already started (is live)
      if (minutesBefore <= 30) {
        setEnrollActive(true);
        setButtonText("Enroll & Enter Arena");
      } else {
        setEnrollActive(false);
        setButtonText("Opens 30 Min Before Start");
      }
    };

    checkEnrollmentState();
    const interval = setInterval(checkEnrollmentState, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp, contest.status]);

  const fillPercent = Math.min(
    100,
    Math.round((contest.participants / contest.maxParticipants) * 100)
  );

  return (
    <Card
      variant="glass"
      hoverEffect="lift-glow"
      padding="none"
      className={cn("flex flex-col h-full border border-border/40 relative group", className)}
    >
      {/* Contest Banner header */}
      <div className={cn("h-32 relative overflow-hidden bg-gradient-to-r", contest.bannerGradient)}>
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="text-[9px] font-bold text-foreground bg-background/80 backdrop-blur-md px-2 py-0.5 rounded border border-border/40 uppercase tracking-widest">
            {contest.exam}
          </span>
          <ContestStatusBadge status={contest.status} />
        </div>

        {/* Live Indicator overlay if live */}
        {contest.status === "live" && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-red-500/10 backdrop-blur-md px-2.5 py-0.5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-md animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Arena In Progress
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
          National Level Championship
        </span>
        <Link href={`/live/${contest.slug}`}>
          <Typography variant="h4" className="font-extrabold text-foreground mb-3 tracking-tight line-clamp-1 hover:text-primary transition-colors">
            {contest.title}
          </Typography>
        </Link>

        {/* Live Countdown widget */}
        {contest.status !== "completed" && (
          <div className="mb-4 bg-destructive/5 border border-destructive/10 rounded-xl p-2.5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-destructive/80 uppercase tracking-widest">
              Commences In:
            </span>
            <ContestCountdown targetDate={`${contest.date} ${contest.startTime}`} />
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4 pb-4 border-b border-border/25">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">{contest.date}</span>
              <span className="text-[10px]">{contest.startTime} IST</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">₹{contest.prizePool.toLocaleString("en-IN")}</span>
              <span className="text-[10px]">Reward Pool</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">{contest.duration}</span>
              <span className="text-[10px]">Championship duration</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">{contest.languages.join(", ")}</span>
              <span className="text-[10px]">Languages supported</span>
            </div>
          </div>
        </div>

        {/* Vacant seats bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
            <span className="font-semibold text-foreground">
              {contest.participants.toLocaleString("en-IN")} Enrolled
            </span>
            <span>
              {contest.seatsAvailable === 0 ? "Championship full" : `${contest.seatsAvailable.toLocaleString("en-IN")} left`}
            </span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/20 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Entry Fee</span>
            <span className="text-xs font-extrabold text-foreground">
              {contest.entryFee === 0 ? <span className="text-emerald-500">FREE</span> : `₹${contest.entryFee}`}
            </span>
          </div>

          {enrollActive ? (
            <Link href={`/live/${contest.slug}/access`}>
              <Button size="sm" className="rounded-lg text-xs font-bold gap-1 uppercase tracking-wider">
                {buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="rounded-lg text-xs font-bold border-border/80 text-muted-foreground cursor-not-allowed bg-secondary/20 hover:bg-secondary/20 flex gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
export default LiveContestCard;
