"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Award, ShieldCheck, Sparkles, HelpCircle, ArrowRight, IndianRupee, Layers, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { calculatePrizeMatrix, PrizeMatrixResult, PrizeTier } from "@/lib/prizeDistributionAlgorithm";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface PrizeMatrixLadderProps {
  seats?: number;
  entryFee?: number;
  participants?: number;
  className?: string;
}

export function PrizeMatrixLadder({ seats = 100, entryFee = 500, participants = 0, className }: PrizeMatrixLadderProps) {
  const result: PrizeMatrixResult = React.useMemo(() => {
    return calculatePrizeMatrix(seats, entryFee, 30);
  }, [seats, entryFee]);

  const currentParticipants = Math.min(seats, Math.max(participants, Math.round(seats * 0.72))); // Default preview to ~72% if missing
  const fillPercent = Math.min(100, Math.round((currentParticipants / seats) * 100));
  const isThresholdMet = fillPercent >= 70;

  const currentLivePool = Math.round(currentParticipants * entryFee * 0.70);
  const upToMaxPrizePool = result.prizePool;

  return (
    <div className={cn("flex flex-col gap-6 text-left", className)}>
      {/* 1. Collection & Allocation Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center relative overflow-hidden">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Up To Prize Pool</span>
          <motion.p
            key={upToMaxPrizePool}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5"
          >
            ₹{upToMaxPrizePool.toLocaleString("en-IN")}
          </motion.p>
          <p className="text-[9px] text-emerald-400/80 mt-0.5 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Pool: ₹{currentLivePool.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Winner Seats (60% Coverage)</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">{result.totalWinners} Seats</p>
          <p className="text-[9px] text-amber-400/80 mt-0.5">Top 60% participants receive payouts</p>
        </div>

        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest block">Rank 1 Bumper Prize</span>
          <p className="text-xl sm:text-2xl font-black text-primary mt-0.5">₹{result.matrix[0]?.prizePerWinner.toLocaleString("en-IN")}</p>
          <p className="text-[9px] text-primary/80 mt-0.5">Highest Ranker Reward</p>
        </div>
      </div>

      {/* 2. Dynamic 70% Seat Threshold & Auto-Refund Guarantee Banner */}
      <div className={cn(
        "p-5 rounded-2xl border transition-all duration-300 space-y-3",
        isThresholdMet
          ? "bg-gradient-to-r from-emerald-500/12 via-card to-card border-emerald-500/30"
          : "bg-gradient-to-r from-amber-500/12 via-card to-card border-amber-500/30"
      )}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 font-black text-xs",
              isThresholdMet
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/20 border-amber-500/30 text-amber-400 animate-pulse"
            )}>
              {isThresholdMet ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-foreground">
                  70% Seat Filling Confirmation Threshold
                </h4>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                  isThresholdMet
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                )}>
                  {isThresholdMet ? "🔴 Guaranteed Live" : `${fillPercent}% Filled`}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                {isThresholdMet ? (
                  <span>Contest has crossed the <strong>70% seat threshold</strong> and is <strong>100% Guaranteed Live</strong>! Prize pool is locked and ready for distribution.</span>
                ) : (
                  <span>Contests require at least <strong>70% filled seats</strong> by start time to go live. If unconfirmed when time expires, <strong>100% entry fee is automatically refunded</strong> to your wallet instantly.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Animated Seat Fill & Threshold Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-muted-foreground">{currentParticipants} / {seats} seats registered ({fillPercent}%)</span>
            <span className={isThresholdMet ? "text-emerald-400 font-black" : "text-amber-400 font-bold"}>
              70% Threshold Required ({Math.ceil(seats * 0.7)} seats)
            </span>
          </div>
          <div className="relative h-2 bg-muted/40 rounded-full overflow-hidden">
            {/* 70% Threshold Marker */}
            <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-amber-400 z-10 shadow-sm" title="70% Confirmation Line" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full transition-all",
                isThresholdMet ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-amber-400"
              )}
            />
          </div>
        </div>
      </div>

      {/* 3. Full Rank Distribution Ladder Table */}
      <div className="border border-border/40 rounded-2xl overflow-hidden bg-card/40 shadow-xl">
        <div className="bg-muted/20 border-b border-border/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-foreground uppercase tracking-wider">
              Official Rank Distribution Matrix
            </span>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground">
            {result.totalWinners} Total Winning Ranks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/25 bg-muted/10 text-muted-foreground font-black text-[9px] uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Rank Range</th>
                <th className="px-4 py-3 text-right">Prize Per Winner</th>
                <th className="px-4 py-3 text-center">Total Winners</th>
                <th className="px-5 py-3 text-right">Total Allocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {result.matrix.map((tier, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "hover:bg-muted/15 transition-colors",
                    tier.isBumper && "bg-amber-500/8 border-l-4 border-l-amber-400",
                    tier.isRefund && "bg-emerald-500/5"
                  )}
                >
                  <td className="px-5 py-3.5 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-black",
                        idx === 0 && "text-amber-400 text-sm font-black",
                        idx === 1 && "text-slate-300",
                        idx === 2 && "text-amber-600"
                      )}>
                        {tier.rankRange}
                      </span>
                      {tier.isBumper && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          🏆 Bumper Prize
                        </span>
                      )}
                      {tier.isRefund && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[9px] font-bold">
                          Fee Return Guarantee
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-400">
                    ₹{tier.prizePerWinner.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-muted-foreground">
                    {tier.winnerCount} candidate{tier.winnerCount > 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-black text-foreground">
                    ₹{tier.totalAllocation.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default PrizeMatrixLadder;
