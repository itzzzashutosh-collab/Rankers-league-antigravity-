"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, RefreshCw, Sparkles } from "lucide-react";

export default function ForecastingPage() {
  const [metric, setMetric] = useState("revenue");
  const [loading, setLoading] = useState(false);

  const triggerForecast = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/analytics/executive" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Demand Projections & Forecasting</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Explore trend analysis extrapolations and future growth modeling simulations.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
        <h2 className="font-black text-sm text-foreground">Configure Trend Projection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Target Metric Model</label>
            <select value={metric} onChange={e => setMetric(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
              <option value="revenue">Gross Revenue Expansion</option>
              <option value="users">Participant Count Exponential</option>
              <option value="subscriptions">MRR Growth Extrapolation</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Simulation Model</label>
            <select className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
              <option>Linear Regression Baseline</option>
              <option>Autoregressive Exponential Smoothing</option>
              <option>Moving Average Trend Equating</option>
            </select>
          </div>
        </div>
        <button onClick={triggerForecast}
          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generate Extrapolation Snapshot
        </button>
      </div>

      {/* Model indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
        {[
          { label: "Target Projection (Q4)", value: metric === "revenue" ? "₹1,240,000" : "19,840 users" },
          { label: "Model Confidence Margin", value: "94.2% R-Squared" },
          { label: "Growth Momentum Factor", value: "+14.8% compound" },
        ].map(({ label, value }) => (
          <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
            <span className="text-xl font-black text-foreground block">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
