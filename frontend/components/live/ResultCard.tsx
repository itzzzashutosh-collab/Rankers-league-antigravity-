"use client";

import * as React from "react";
import { CompletedContest } from "@/content/results/results";
import { Card, Badge, Typography } from "../ui";
import { Award, Calendar, Users, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  contest: CompletedContest;
}

export function ResultCard({ contest }: ResultCardProps) {
  const isWon = contest.prizeStatus !== "no_prize";

  const statusBadgeStyle = {
    published: "bg-emerald-500/10 border-emerald-500/25 text-emerald-500",
    under_verification: "bg-amber-500/10 border-amber-500/25 text-amber-500",
    final: "bg-indigo-500/10 border-indigo-500/25 text-indigo-500"
  }[contest.resultStatus];

  return (
    <Card variant="glass" className="border border-border/60 hover:border-primary/20 hover:shadow-lg transition-all duration-300 p-5 rounded-2xl flex flex-col justify-between gap-5 bg-card/25 select-none text-left">
      
      {/* 1. Header Banner & Status Info */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 border border-primary/10 rounded uppercase tracking-wider">
            {contest.category}
          </span>
          <span className={cn("text-[9px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider", statusBadgeStyle)}>
            {contest.resultStatus.replace("_", " ")}
          </span>
        </div>

        <h4 className="font-extrabold text-sm text-foreground tracking-tight leading-snug hover:text-primary transition-colors cursor-pointer min-h-[40px]">
          {contest.title}
        </h4>

        {/* Date & Participants info */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {contest.date}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 shrink-0" />
            {contest.participants.toLocaleString()} joined
          </span>
        </div>
      </div>

      {/* 2. Candidate specific results overview */}
      <div className="bg-secondary/45 border border-border/45 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
          <span className="text-muted-foreground font-semibold">Your Rank:</span>
          <strong className="text-foreground font-extrabold">Rank {contest.userRank}</strong>
        </div>
        <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
          <span className="text-muted-foreground font-semibold">Score:</span>
          <strong className="text-foreground font-mono font-bold">
            {contest.userScore} <span className="text-[10px] text-muted-foreground font-sans">/ {contest.maxScore}</span>
          </strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-semibold">Prize Earned:</span>
          {isWon ? (
            <span className="text-emerald-500 font-extrabold flex items-center gap-1">
              <Award className="w-4 h-4 shrink-0" />
              {contest.id === "neet-prime-live" ? "₹10,500" : "₹2,400"}
            </span>
          ) : (
            <span className="text-muted-foreground font-bold">--</span>
          )}
        </div>
      </div>

      {/* 3. Action Trigger button */}
      <Link href={`/results/${contest.id}`} className="w-full">
        <button className="w-full py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm">
          View Official Result
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>

    </Card>
  );
}
export default ResultCard;
