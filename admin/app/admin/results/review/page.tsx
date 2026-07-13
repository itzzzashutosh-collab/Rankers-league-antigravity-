"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Award, CheckSquare } from "lucide-react";

export default function ReviewRanksAudit() {
  const [submissions] = useState([
    { username: "amit_sharma_98", score: 345, duration: "1h 45m", rank: 1, prize: "₹50,000", aura: 150 },
    { username: "priya_k_reddy", score: 340, duration: "1h 50m", rank: 2, prize: "₹30,000", aura: 120 },
    { username: "rohan_verma_delhi", score: 335, duration: "1h 52m", rank: 3, prize: "₹15,000", aura: 100 }
  ]);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/results"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Ranker's League Results Auditor
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Audit top rank holders list, tie-breaking criteria logic, and payout recovery values.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Top candidate submissions ledger
        </h2>

        <div className="overflow-x-auto border border-border/60 rounded-xl bg-background/25 text-xs font-semibold">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted/40 border-b border-border/80 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Candidate</th>
                <th className="p-3 text-center">Score Marks</th>
                <th className="p-3 text-center">Time Taken</th>
                <th className="p-3 text-center">Rank</th>
                <th className="p-3 text-center">Aura Earned</th>
                <th className="p-3 text-right">Prize Allocated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[11px]">
              {submissions.map((sub, i) => (
                <tr key={i} className="hover:bg-card/10 transition-colors">
                  <td className="p-3 text-foreground font-bold">@{sub.username}</td>
                  <td className="p-3 text-center text-muted-foreground font-mono">{sub.score}</td>
                  <td className="p-3 text-center text-muted-foreground">{sub.duration}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                      Rank #{sub.rank}
                    </span>
                  </td>
                  <td className="p-3 text-center text-emerald-400 font-bold">+{sub.aura} Aura</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">{sub.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
