"use client";

import * as React from "react";
import { calculateQuestionGap } from "@/utils/backend/services/calculateQuestionGap";
import { Card } from "../ui";
import { AlertCircle, HelpCircle, ArrowUpRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface GapAnalysisCardProps {
  contest: {
    entryFee: number;
    filledSeats: number;
    totalQuestions: number;
    maxScore: number;
  };
  userRank: number;
  userScore: number;
  winningCutoffScore: number;
  winningCutoffRank: number;
}

export function GapAnalysisCard({
  contest,
  userRank,
  userScore,
  winningCutoffScore,
  winningCutoffRank,
}: GapAnalysisCardProps) {
  const gap = calculateQuestionGap(
    contest,
    userRank,
    userScore,
    winningCutoffScore,
    winningCutoffRank
  );

  return (
    <Card variant="glass" className="border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6 rounded-2xl text-left flex flex-col gap-4 select-none">
      
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="min-w-0">
          <h4 className="font-extrabold text-sm text-foreground tracking-tight">
            Better Luck Next Time.
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {gap.message}
          </p>
        </div>
      </div>

      {/* Numerical gaps progress columns */}
      <div className="grid grid-cols-3 gap-4 border-t border-border/20 pt-4 text-xs">
        <div className="bg-card/35 border border-border/30 rounded-xl p-3">
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
            Rank Deficit
          </span>
          <strong className="text-sm font-extrabold text-foreground mt-1 block">
            +{gap.ranksNeeded} ranks
          </strong>
        </div>

        <div className="bg-card/35 border border-border/30 rounded-xl p-3">
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
            Score Margin
          </span>
          <strong className="text-sm font-extrabold text-foreground mt-1 block">
            +{gap.marksNeeded} marks
          </strong>
        </div>

        <div className="bg-card/35 border border-border/30 rounded-xl p-3">
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
            Answers Gap
          </span>
          <strong className="text-sm font-extrabold text-foreground mt-1 block">
            +{gap.correctAnswersNeeded} correct
          </strong>
        </div>
      </div>

      <div className="text-[9px] text-muted-foreground flex items-center gap-1.5 leading-relaxed bg-card/25 border border-border/25 rounded-lg p-2.5">
        <HelpCircle className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>Gap analysis parameters:</strong> Question deficits are computed by dividing score gaps by marks per question ratios for {contest.maxScore} marks.
        </span>
      </div>

    </Card>
  );
}
export default GapAnalysisCard;
