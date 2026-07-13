"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, RefreshCw, TrendingUp } from "lucide-react";
import { financeService, SubscriptionRevenue } from "@/services/financeService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const PLAN_COLORS: Record<string, string> = {
  Elite: "text-amber-300 border-amber-500/20 bg-amber-500/5",
  Pro: "text-primary border-primary/20 bg-primary/5",
  Basic: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  Free: "text-muted-foreground border-border bg-muted/5",
};

const PLAN_PRICES: Record<string, number> = { Elite: 4999, Pro: 999, Basic: 599, Free: 0 };

export default function SubscriptionsPage() {
  const [revenue, setRevenue] = useState<SubscriptionRevenue[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await financeService.getSubscriptionRevenue();
    setRevenue(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Aggregate latest month per plan
  const latestByPlan: Record<string, SubscriptionRevenue> = {};
  revenue.forEach(r => {
    if (!latestByPlan[r.plan] || r.period_month > latestByPlan[r.plan].period_month) {
      latestByPlan[r.plan] = r;
    }
  });
  const plans = Object.values(latestByPlan);
  const totalMRR = plans.reduce((s, p) => s + p.mrr, 0);
  const totalARR = plans.reduce((s, p) => s + p.arr, 0);
  const totalSubs = plans.reduce((s, p) => s + p.active_subscribers, 0);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Subscription Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">MRR, ARR, subscriber counts, and plan-level metrics.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Global MRR/ARR KPIs */}
      <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Monthly Recurring Revenue</span>
          <span className="text-2xl font-black text-primary">{fmt(totalMRR)}</span>
        </div>
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Annual Recurring Revenue</span>
          <span className="text-2xl font-black text-emerald-400">{fmt(totalARR)}</span>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Total Active Subscribers</span>
          <span className="text-2xl font-black text-foreground">{totalSubs.toLocaleString()}</span>
        </div>
      </div>

      {/* Plan Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading subscription data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.sort((a, b) => b.mrr - a.mrr).map(plan => (
            <div key={plan.plan} className={`rounded-3xl border p-6 space-y-4 ${PLAN_COLORS[plan.plan] || "border-border bg-card/15"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full ${PLAN_COLORS[plan.plan] || ""}`}>{plan.plan}</span>
                  <div className="text-xl font-black text-foreground mt-2">{fmt(PLAN_PRICES[plan.plan] || 0)}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                </div>
                <TrendingUp className="w-5 h-5 text-muted-foreground/40" />
              </div>

              <div className="space-y-2.5 text-[11px] border-t border-border/20 pt-4">
                {[
                  ["Active Subscribers", plan.active_subscribers.toLocaleString()],
                  ["New This Month", `+${plan.new_subscribers}`],
                  ["Churned", `-${plan.churned_subscribers}`],
                  ["MRR", fmt(plan.mrr)],
                  ["ARR", fmt(plan.arr)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between font-semibold border-b border-border/10 pb-1.5 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
