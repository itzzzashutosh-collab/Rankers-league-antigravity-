"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Trophy, Calendar, Users, Target, ShieldCheck, Activity, 
  ArrowLeft, Cpu, Trash2, Edit3, Award, Clock
} from "lucide-react";
import { contestService, ContestListItem } from "@/services/contestService";

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.contestId as string;

  const [contest, setContest] = useState<ContestListItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await contestService.getContests();
      const found = all.find(c => c.id === contestId);
      if (found) {
        setContest(found);
      } else {
        // Fallback for mock IDs
        setContest({
          id: contestId,
          name: "UPSC Prelims Elite Arena (GS-01)",
          slug: "upsc-elite-league",
          category_name: "Civil Services",
          exam_name: "UPSC CSE Prelims",
          difficulty: "Hard",
          status: "Live",
          entry_fee: 499,
          max_participants: 50000,
          platform_fee_percentage: 20,
          winner_percentage: 50,
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          prize_pool: 19960000
        });
      }
      setLoading(false);
    }
    load();
  }, [contestId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!contest) return;
    const success = await contestService.updateStatus(contest.id, newStatus);
    if (success) {
      setContest(prev => prev ? { ...prev, status: newStatus } : null);
      alert(`Contest status transitioned to ${newStatus}`);
    }
  };

  const handleArchive = () => {
    alert("Contest archived successfully.");
    router.push("/admin/contests");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
        Loading Contest Workspace...
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground/60">
        Contest record not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/contests"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              {contest.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Contest Workspace: #{contest.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => handleStatusChange("Evaluation")}
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground transition-colors"
          >
            Trigger Evaluation
          </button>
          <button
            onClick={handleArchive}
            className="h-9 px-3 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive font-bold transition-all"
            title="Archive Contest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left main info */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-3xl border border-border bg-card/25 p-6 md:p-8 space-y-6">
            <h2 className="text-sm font-black text-foreground">Specifications & Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
              <div className="p-4 rounded-2xl border border-border/60 bg-background/25">
                <span className="text-[10px] text-muted-foreground font-bold block mb-1">Target Exam</span>
                <span className="text-foreground">{contest.exam_name}</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/60 bg-background/25">
                <span className="text-[10px] text-muted-foreground font-bold block mb-1">Difficulty level</span>
                <span className="text-foreground">{contest.difficulty}</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/60 bg-background/25">
                <span className="text-[10px] text-muted-foreground font-bold block mb-1">Total Seats</span>
                <span className="text-foreground">{contest.max_participants.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/60 bg-background/25">
                <span className="text-[10px] text-muted-foreground font-bold block mb-1">Entry Fee</span>
                <span className="text-foreground">{formatCurrency(contest.entry_fee)}</span>
              </div>
            </div>
          </section>

          {/* Status Timeline History */}
          <section className="rounded-3xl border border-border bg-card/25 p-6 md:p-8 space-y-4">
            <h2 className="text-sm font-black text-foreground">Lifecycle Status History</h2>
            <div className="space-y-4 text-xs font-semibold">
              {[
                { time: "Just now", from: "Scheduled", to: contest.status, actor: "system_scheduler" },
                { time: "1h ago", from: "Draft", to: "Scheduled", actor: "ashutosh_admin" },
                { time: "2h ago", from: "None", to: "Draft", actor: "ashutosh_admin" }
              ].map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-foreground">Transitioned status to {h.to}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      From {h.from} • Triggered by @{h.actor} • {h.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right side telemetry widgets */}
        <div className="lg:col-span-4 space-y-6 text-xs font-semibold">
          <section className="rounded-3xl border border-border bg-card/25 p-6 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Financial Summary
            </h3>
            <div className="space-y-2 border-b border-border/20 pb-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground/80">Platform Margin ({contest.platform_fee_percentage}%)</span>
                <span className="text-foreground font-black">
                  {formatCurrency((contest.entry_fee * contest.max_participants) * (contest.platform_fee_percentage / 100))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/80">Winners Bracket Ratio</span>
                <span className="text-foreground font-black">{contest.winner_percentage}% of seats</span>
              </div>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Prize Pool</span>
              <span className="font-black">{formatCurrency(contest.prize_pool)}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
