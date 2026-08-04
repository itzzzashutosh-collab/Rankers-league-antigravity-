"use client";

import * as React from "react";
import { Coins, Trophy, Shield, Sparkles, PieChart, Users, ArrowRight } from "lucide-react";
import { Container, Card, Typography, Button } from "@/components/ui";

export const EXAM_TIERS = [
  {
    level: 1,
    name: "Abhyas (अभ्यास)",
    hindi: "अभ्यास",
    tagline: "Foundation & Practice Tier",
    seats: "1,500",
    entryFee: 99,
    credits: "🟡 99",
    collection: "₹1,48,500",
    prizePool: "₹1,03,950",
    prizePoolPercent: "70%",
    margin: "₹44,550",
    marginPercent: "30%",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    glowColor: "hover:border-amber-500/40",
  },
  {
    level: 2,
    name: "Manthan (मंथन)",
    hindi: "मंथन",
    tagline: "Intermediate & Deep Analysis Tier",
    seats: "5,000",
    entryFee: 89,
    credits: "🟡 89",
    collection: "₹4,45,000",
    prizePool: "₹3,11,500",
    prizePoolPercent: "70%",
    margin: "₹1,33,500",
    marginPercent: "30%",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    glowColor: "hover:border-blue-500/40",
  },
  {
    level: 3,
    name: "Shastrarth (शास्त्रार्थ)",
    hindi: "शास्त्रार्थ",
    tagline: "Championship & Advanced Debate Tier",
    seats: "10,000",
    entryFee: 79,
    credits: "🟡 79",
    collection: "₹7,90,000",
    prizePool: "₹5,53,000",
    prizePoolPercent: "70%",
    margin: "₹2,37,000",
    marginPercent: "30%",
    badgeColor: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    glowColor: "hover:border-violet-500/40",
  },
  {
    level: 4,
    name: "Sarvagya (सर्वज्ञ)",
    hindi: "सर्वज्ञ",
    tagline: "All-India Apex Championship",
    seats: "25,000",
    entryFee: 59,
    credits: "🟡 59",
    collection: "₹14,75,000",
    prizePool: "₹10,32,500",
    prizePoolPercent: "70%",
    margin: "₹4,42,500",
    marginPercent: "30%",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    glowColor: "hover:border-emerald-500/40",
  },
  {
    level: 5,
    name: "Mahaleague (महालीग)",
    hindi: "महालीग",
    tagline: "Grand National Apex Arena",
    seats: "50,000",
    entryFee: 49,
    credits: "🟡 49",
    collection: "₹24,50,000",
    prizePool: "₹17,15,000",
    prizePoolPercent: "70%",
    margin: "₹7,35,000",
    marginPercent: "30%",
    badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    glowColor: "hover:border-rose-500/40",
  },
];

export function ExamTierMatrix() {
  return (
    <div className="w-full my-8 flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl p-5 rounded-2xl border border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <PieChart className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground tracking-tight flex items-center gap-2">
              Official Exam Tier Matrix & Financial Breakdown
              <span className="text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase">
                Audited 70/30 Split
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranker's League operates a 100% transparent economics matrix: <strong>70% Prize Pool</strong> returned to winning contenders, <strong>30% Platform Margin</strong> for security & proctoring.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop & Mobile Responsive Financial Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/30 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              <th className="py-4 px-5">Level & Contest Name</th>
              <th className="py-4 px-4 text-center">Total Seats</th>
              <th className="py-4 px-4 text-center">Entry Fee</th>
              <th className="py-4 px-4 text-right">Total Collection</th>
              <th className="py-4 px-4 text-right text-emerald-500 font-black">Prize Pool (70%)</th>
              <th className="py-4 px-5 text-right text-amber-500 font-black">Platform Margin (30%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {EXAM_TIERS.map((tier) => (
              <tr
                key={tier.level}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-black text-[11px] flex items-center justify-center shrink-0">
                      L{tier.level}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors">
                          {tier.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                          {tier.hindi}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        {tier.tagline}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-center font-bold text-foreground">
                  <div className="inline-flex items-center gap-1 bg-muted/40 border border-border/40 px-2.5 py-1 rounded-lg text-xs">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    {tier.seats}
                  </div>
                </td>

                <td className="py-4 px-4 text-center">
                  <span className="font-extrabold text-foreground text-sm">
                    ₹{tier.entryFee}{" "}
                    <span className="text-[11px] font-normal text-muted-foreground">({tier.credits})</span>
                  </span>
                </td>

                <td className="py-4 px-4 text-right font-bold text-foreground">
                  {tier.collection}
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-black text-emerald-500 text-sm">
                      {tier.prizePool}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      {tier.prizePoolPercent} Allocation
                    </span>
                  </div>
                </td>

                <td className="py-4 px-5 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-black text-amber-500 text-sm">
                      {tier.margin}
                    </span>
                    <span className="text-[9px] font-bold text-amber-500/80 bg-amber-500/10 px-1.5 py-0.2 rounded">
                      {tier.marginPercent} Margin
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ExamTierMatrix;
