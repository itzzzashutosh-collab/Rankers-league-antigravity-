"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Award, Users, ArrowRight, Timer } from "lucide-react";
import { LiveContest } from "../../types/live";
import { Card, Typography, Button } from "../ui";
import { ContestCountdown } from "../contests/ContestCountdown";
import { cn } from "@/lib/utils";

interface UpcomingContestCardProps {
  contest: LiveContest;
  className?: string;
}

export function UpcomingContestCard({ contest, className }: UpcomingContestCardProps) {
  return (
    <Card
      variant="solid"
      hoverEffect="lift"
      className={cn("border border-border/40 p-5 rounded-2xl bg-card/35 backdrop-blur-md relative", className)}
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-0.5 border border-primary/10 rounded">
            {contest.exam}
          </span>
          <div className="flex items-center gap-1.5 bg-secondary/80 border border-border/60 px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground uppercase">
            <Timer className="w-3 h-3 text-muted-foreground/80 animate-pulse" />
            Scheduled
          </div>
        </div>

        {/* Title */}
        <div>
          <Link href={`/live/${contest.slug}`}>
            <Typography variant="h4" className="font-extrabold text-foreground mb-1 hover:text-primary transition-colors tracking-tight line-clamp-1">
              {contest.title}
            </Typography>
          </Link>
          <span className="text-[10px] text-muted-foreground block font-medium">
            Category: {contest.exam} League
          </span>
        </div>

        {/* Start offset countdown */}
        <div className="bg-secondary/40 border border-border/40 p-2.5 rounded-xl flex items-center justify-between">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Registration Opens In:
          </span>
          <ContestCountdown targetDate={`${contest.date} ${contest.startTime}`} />
        </div>

        {/* Stat summaries */}
        <div className="grid grid-cols-3 gap-2 border-t border-border/20 pt-4 text-xs">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date
            </span>
            <strong className="text-foreground mt-0.5 block truncate">{contest.date}</strong>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" /> Prize Pool
            </span>
            <strong className="text-foreground mt-0.5 block">₹{contest.prizePool.toLocaleString("en-IN")}</strong>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" /> Seats Left
            </span>
            <strong className="text-foreground mt-0.5 block">{contest.seatsAvailable.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-end pt-2 mt-2">
          <Link href={`/live/${contest.slug}`} className="w-full sm:w-auto">
            <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold w-full gap-1 uppercase tracking-wider">
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
export default UpcomingContestCard;
