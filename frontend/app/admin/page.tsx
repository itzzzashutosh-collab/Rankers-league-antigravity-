"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  TrendingUp,
  Award,
  Plus,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { adminService, AdminKpiMetrics, ContestAdminItem } from "@/services/adminService";

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = React.useState<AdminKpiMetrics | null>(null);
  const [contests, setContests] = React.useState<ContestAdminItem[]>([]);

  React.useEffect(() => {
    adminService.getKpiMetrics().then(setMetrics);
    setContests(adminService.getContests());
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/20 via-violet-500/10 to-transparent border border-primary/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Private Executive Portal</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black font-heading tracking-tight text-foreground">
            Platform Analytics & Operations
          </h1>
          <p className="text-xs lg:text-sm text-muted-foreground font-medium max-w-xl">
            Real-time management of competitive exam series, live contest fill ratios, prize pool allocations, and student ranks.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            href="/admin/contests"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            <span>New Contest</span>
          </Link>
          <Link
            href="/admin/exams"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-card border border-border/50 hover:bg-card/80 transition-all"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Configure Exams</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Aspirants */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Aspirants</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {metrics?.totalAspirants.toLocaleString() || "12,480"}
            </div>
            <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% active growth this week
            </p>
          </div>
        </div>

        {/* Total Collections */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Collections</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-emerald-400">
              ₹{metrics?.totalCollections.toLocaleString() || "14,25,000"}
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">
              Entry fee revenue across all leagues
            </p>
          </div>
        </div>

        {/* Prize Pool Allocation */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Allocated Prize Pools</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-violet-400">
              ₹{metrics?.prizePoolAllocated.toLocaleString() || "9,97,500"}
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">
              Up To Prize Pool commitments
            </p>
          </div>
        </div>

        {/* Guaranteed Live Contests */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Guaranteed Contests</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Trophy className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-primary flex items-center gap-2">
              <span>{metrics?.guaranteedLiveCount || 14}</span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                🔴 ≥ 70% Filled
              </span>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">
              Confirmed live championship leagues
            </p>
          </div>
        </div>
      </div>

      {/* Live Contests & Fill Ratio Monitoring Table */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black font-heading text-foreground">
              Live Contests & Seat Capacity Monitor
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time seat filling status and 70% threshold verification.
            </p>
          </div>
          <Link
            href="/admin/contests"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>View All Contests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Contest Title</th>
                <th className="pb-3 px-3">Exam Category</th>
                <th className="pb-3 px-3">Entry Fee</th>
                <th className="pb-3 px-3">Up To Prize Pool</th>
                <th className="pb-3 px-3">Seat Filling (70% Rule)</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {contests.map((contest) => {
                const fillRatio = Math.round((contest.filledSeats / contest.maxSeats) * 100);
                const isGuaranteed = fillRatio >= 70;

                return (
                  <tr key={contest.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-3 font-bold text-foreground max-w-xs truncate">
                      {contest.title}
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-mono font-bold text-[11px] bg-secondary/60 border border-border/40 px-2 py-1 rounded-md">
                        {contest.examCategory}
                      </span>
                    </td>
                    <td className="py-4 px-3 font-mono font-bold text-foreground">
                      ₹{contest.entryFee}
                    </td>
                    <td className="py-4 px-3 font-mono font-black text-emerald-400">
                      Up To ₹{contest.prizePool.toLocaleString()}
                    </td>
                    <td className="py-4 px-3 min-w-[200px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-foreground">{contest.filledSeats} / {contest.maxSeats}</span>
                          <span className={isGuaranteed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                            {fillRatio}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isGuaranteed ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${fillRatio}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      {isGuaranteed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          🔴 Guaranteed Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          Pending 70% Fill
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
