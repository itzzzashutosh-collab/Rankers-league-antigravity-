"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Award, Trophy, User, ArrowLeft, Clock, Medal, Sparkles } from "lucide-react";

interface RankedCandidate {
  username: string;
  score: number;
  time_taken: string;
  overall_rank: number;
  regional_rank: number;
  category_rank: number;
  prize_payout: string;
  aura_earned: number;
}

export default function RankingsWorkspace() {
  const [contests] = useState([
    { id: "cc001", name: "JEE Advanced Physics Grandmaster Challenge", participants: 1248, prizePool: "₹5,10,656" },
    { id: "cc002", name: "NEET Biology Sprint — Season 4", participants: 876, prizePool: "₹2,14,777" },
  ]);

  const [selectedContest, setSelectedContest] = useState<string | null>(null);

  // Mocked contestant ranked list for the selected contest
  const rankedSubmissions: Record<string, RankedCandidate[]> = {
    cc001: [
      { username: "amit_sharma_98", score: 294, time_taken: "42 min 12s", overall_rank: 1, regional_rank: 1, category_rank: 1, prize_payout: "₹50,000", aura_earned: 150 },
      { username: "priya_k_reddy", score: 288, time_taken: "44 min 35s", overall_rank: 2, regional_rank: 1, category_rank: 2, prize_payout: "₹30,000", aura_earned: 120 },
      { username: "rohan_verma_delhi", score: 288, time_taken: "46 min 10s", overall_rank: 3, regional_rank: 2, category_rank: 3, prize_payout: "₹15,000", aura_earned: 100 },
      { username: "deepika_roy", score: 275, time_taken: "48 min 22s", overall_rank: 4, regional_rank: 3, category_rank: 4, prize_payout: "₹5,000", aura_earned: 80 },
    ],
    cc002: [
      { username: "ananya_das", score: 384, time_taken: "31 min 15s", overall_rank: 1, regional_rank: 1, category_rank: 1, prize_payout: "₹30,000", aura_earned: 150 },
      { username: "vikram_rathore", score: 376, time_taken: "33 min 40s", overall_rank: 2, regional_rank: 1, category_rank: 2, prize_payout: "₹20,000", aura_earned: 120 },
    ]
  };

  const activeRanked = selectedContest ? (rankedSubmissions[selectedContest] || []) : [];
  const currentContest = contests.find(c => c.id === selectedContest);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          {selectedContest && (
            <button
              onClick={() => setSelectedContest(null)}
              className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Contest Rankings & Leaderboards
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Verify participant rankings, tie-breakers, regional distributions, and reward payout distributions.
            </p>
          </div>
        </div>
      </div>

      {!selectedContest ? (
        // Step 1: Contest list selector
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contests.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedContest(c.id)}
              className="rounded-3xl border border-border bg-card/15 p-6 flex flex-col justify-between h-48 text-left hover:border-primary/40 hover:bg-card/25 transition-all shadow-sm group"
            >
              <div className="space-y-2 w-full">
                <span className="text-[10px] text-muted-foreground/80 font-bold block">
                  {c.participants.toLocaleString()} Active Competitors
                </span>
                <h3 className="font-black text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
              </div>

              <div className="w-full flex justify-between items-center border-t border-border/10 pt-4 mt-4">
                <div>
                  <span className="text-[9px] text-muted-foreground block">PRIZE BUDGET</span>
                  <span className="text-sm font-black text-primary">{c.prizePool}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                  <span>View Leaderboard</span>
                  <Medal className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Step 2: Selected contest leaderboard ranking list
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-2">
            <span className="text-[9px] text-primary font-mono uppercase tracking-wider block">Currently Inspecting Leaderboard</span>
            <h2 className="text-base font-black text-foreground">{currentContest?.name}</h2>
            <div className="flex gap-4 text-[10px] text-muted-foreground">
              <span>Total Seats: <strong className="text-foreground">{currentContest?.participants}</strong></span>
              <span>Prize Budget: <strong className="text-primary">{currentContest?.prizePool}</strong></span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center">
              <h3 className="font-black text-sm text-foreground">Official Ranks & Payouts Matrix</h3>
              <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tie-Breakers Applied</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4">Participant</th>
                    <th className="p-4 text-right">Score</th>
                    <th className="p-4 text-right">Time Taken</th>
                    <th className="p-4 text-center">Regional / Category Ranks</th>
                    <th className="p-4 text-center">Aura Reward</th>
                    <th className="p-4 text-right">Seat Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {activeRanked.map((cand) => (
                    <tr key={cand.username} className="hover:bg-card/20 transition-colors font-semibold">
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                          cand.overall_rank === 1 ? "bg-amber-400/10 text-amber-400 border border-amber-500/20" :
                          cand.overall_rank === 2 ? "bg-slate-300/10 text-slate-300 border border-slate-400/20" :
                          cand.overall_rank === 3 ? "bg-amber-700/10 text-amber-700 border border-amber-800/20" :
                          "bg-muted/30 text-muted-foreground border border-border/40"
                        }`}>
                          #{cand.overall_rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold text-foreground">@{cand.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-foreground font-bold">{cand.score} pts</td>
                      <td className="p-4 text-right text-muted-foreground">{cand.time_taken}</td>
                      <td className="p-4 text-center text-muted-foreground text-[10px]">
                        Reg: <strong className="text-foreground">#{cand.regional_rank}</strong> · Cat: <strong className="text-foreground">#{cand.category_rank}</strong>
                      </td>
                      <td className="p-4 text-center text-emerald-400 font-bold">+{cand.aura_earned} Aura</td>
                      <td className="p-4 text-right text-emerald-400 font-black text-sm">{cand.prize_payout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
