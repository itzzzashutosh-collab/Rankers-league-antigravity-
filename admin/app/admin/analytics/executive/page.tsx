"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, BarChart3, Users, DollarSign, Target, MapPin,
  RefreshCw, Layers, ArrowUpRight, Award, Compass, Zap
} from "lucide-react";
import { analyticsService, ExecutiveSummary, FunnelStep } from "@/services/analyticsService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export default function ExecutiveCommandCenter() {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [geo, setGeo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [sum, fnl, ge] = await Promise.all([
      analyticsService.getExecutiveSummary(),
      analyticsService.getFunnelAnalytics(),
      analyticsService.getGeographicDistribution(),
    ]);
    setSummary(sum);
    setFunnel(fnl);
    setGeo(ge);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const subroutes = [
    { label: "Contest Metrics", href: "/admin/analytics/contests", icon: Award },
    { label: "User Dynamics", href: "/admin/analytics/participants", icon: Users },
    { label: "Revenue Margins", href: "/admin/analytics/revenue", icon: DollarSign },
    { label: "Question Health", href: "/admin/analytics/questions", icon: Target },
    { label: "Performance Profile", href: "/admin/analytics/performance", icon: Compass },
    { label: "Report Desk", href: "/admin/analytics/reports", icon: Layers },
    { label: "Export Hub", href: "/admin/analytics/exports", icon: ArrowUpRight },
    { label: "Projections", href: "/admin/analytics/forecasting", icon: Zap },
  ];

  return (
    <div className="space-y-8 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Executive Intelligence Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Foundational KPIs, regional activity map, conversion funnels, and plan distributions.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Sub-navigation items */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {subroutes.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-border/60 bg-card/10 hover:bg-primary/5 hover:border-primary/20 transition-all text-center group">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
          </Link>
        ))}
      </div>

      {/* KPI summaries */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Gross revenue", value: fmt(summary.grossRevenue), change: `+${summary.revenueGrowth}%` },
            { label: "Net Revenue", value: fmt(summary.netRevenue), change: "+12.4%" },
            { label: "Active Users", value: summary.activeUsers.toLocaleString(), change: `+${summary.userGrowth}%` },
            { label: "Conversion Rate", value: `${summary.conversionRate}%`, change: "+0.4%" },
          ].map(({ label, value, change }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className="text-2xl font-black block">{value}</span>
              <span className="text-[10px] text-emerald-400 font-bold block">{change} vs last month</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Geographic list (Bloomberg style) */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-black text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Regional Geographic Spread
          </h3>
          <div className="space-y-3 text-xs font-semibold">
            {geo.map(({ state, users, revenue }) => (
              <div key={state} className="flex justify-between items-center border-b border-border/15 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <span className="text-foreground font-bold">{state}</span>
                  <span className="text-[10px] text-muted-foreground block">{users.toLocaleString()} users</span>
                </div>
                <span className="text-foreground font-bold">{fmt(revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel visual steps */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Acquisition & Conversion Funnel</h3>
          <div className="space-y-2">
            {funnel.map((step, idx) => (
              <div key={step.label} className="relative flex items-center gap-4 p-3 rounded-xl border border-border/60 bg-background/25 text-xs font-semibold">
                <div className="w-40 font-bold text-foreground truncate">{step.label}</div>
                <div className="flex-1 h-3 rounded-full bg-border/40 overflow-hidden relative">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${step.percentage}%` }} />
                </div>
                <div className="w-14 text-right text-muted-foreground text-[10px]">{step.percentage}%</div>
                <div className="w-20 text-right font-black text-foreground">{step.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
