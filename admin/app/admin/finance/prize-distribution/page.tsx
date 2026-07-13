"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, RefreshCw, CheckCircle2, Clock, AlertOctagon } from "lucide-react";
import { financeService, ContestCollection } from "@/services/financeService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export default function PrizeDistribution() {
  const [collections, setCollections] = useState<ContestCollection[]>([]);
  const [selected, setSelected] = useState<ContestCollection | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await financeService.getContestCollections();
    setCollections(data);
    if (data.length > 0) setSelected(data[0]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const PRIZE_MATRIX = [
    { rank: "Rank 1", pct: 30 },
    { rank: "Rank 2", pct: 20 },
    { rank: "Rank 3", pct: 15 },
    { rank: "Rank 4–10", pct: 20 },
    { rank: "Rank 11–50", pct: 15 },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Prize Distribution</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Monitor prize pool allocation, payout status, and winner distributions per contest.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Contest list */}
        <aside className="col-span-4 space-y-2 overflow-y-auto max-h-[60vh] pr-1">
          {collections.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all text-xs font-semibold ${selected?.id === c.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"}`}>
              <div className="font-bold text-foreground leading-tight">{c.contest_title}</div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{c.total_participants?.toLocaleString()} participants</span>
                <span className="text-primary font-bold">{fmt(c.prize_pool)}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Prize breakdown */}
        <section className="col-span-8 space-y-5">
          {selected ? (
            <>
              <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
                <h2 className="font-black text-sm text-foreground">{selected.contest_title}</h2>
                <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
                  {[
                    { label: "Gross Collection", value: fmt(selected.gross_collection), color: "text-foreground" },
                    { label: "Prize Pool", value: fmt(selected.prize_pool), color: "text-primary" },
                    { label: "Platform Fee", value: fmt(selected.platform_fee_amount), color: "text-amber-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-4 rounded-2xl bg-background/50 border border-border/60 text-center">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block">{label}</span>
                      <span className={`font-black text-base mt-1 block ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
                <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Prize Matrix Breakdown</h3>
                <div className="space-y-3">
                  {PRIZE_MATRIX.map(({ rank, pct }) => {
                    const amount = (selected.prize_pool * pct) / 100;
                    return (
                      <div key={rank} className="flex items-center gap-4 p-3 rounded-xl border border-border/60 bg-background/25 text-xs font-semibold">
                        <div className="w-28 font-bold text-foreground">{rank}</div>
                        <div className="flex-1 h-2 rounded-full bg-border/40 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-10 text-center text-muted-foreground">{pct}%</div>
                        <div className="w-28 text-right font-bold text-primary">{fmt(amount)}</div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs">Select a contest to view prize distribution</div>
          )}
        </section>
      </div>
    </div>
  );
}
