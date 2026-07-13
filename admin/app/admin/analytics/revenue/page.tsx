"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, RefreshCw } from "lucide-react";
import { financeService } from "@/services/financeService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export default function RevenueAnalytics() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await financeService.getRevenueOverview();
    setSummary(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/analytics/executive" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> Revenue & Financial Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Explore MRR, platform fee shares, lifetime values, and profitability ratios.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          {[
            { label: "Gross Revenue", value: fmt(summary.grossRevenue), color: "text-foreground" },
            { label: "Platform Earnings", value: fmt(summary.platformEarnings), color: "text-primary" },
            { label: "Distributed Prizes", value: fmt(summary.totalPrizePool), color: "text-emerald-400" },
            { label: "Active MRR", value: "₹456,800", color: "text-cyan-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className={`text-2xl font-black block ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {/* Revenue stream breakdown */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Revenue Stream Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Contest Entry Fees", amount: 622752, pct: 64.1 },
              { label: "Subscriptions (MRR)", amount: 261924, pct: 27.0 },
              { label: "Adjustments & Adjusts", amount: 85968, pct: 8.9 },
            ].map(stream => (
              <div key={stream.label} className="space-y-1">
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-foreground">{stream.label}</span>
                  <span className="text-muted-foreground">{fmt(stream.amount)} ({stream.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${stream.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LTV & ARR */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-black text-xs text-foreground uppercase tracking-wider">LTV & Subscription Metrics</h3>
          <div className="space-y-3">
            {[
              ["Average Revenue Per User (ARPU)", "₹850 / mo"],
              ["Customer Lifetime Value (LTV)", "₹12,400"],
              ["ARR Run Rate", "₹5,481,600"],
              ["User Acquisition Cost (CAC)", "₹120"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/10 pb-2.5 last:border-0 last:pb-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-foreground font-black">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
