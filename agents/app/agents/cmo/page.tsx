"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, BarChart3, TrendingUp, Check, Calendar, ArrowUpRight, Search } from "lucide-react";
import { cmoService, MarketingTelemetry } from "@/services/cmoService";

export default function MarketingCommandPage() {
  const [data, setData] = useState<MarketingTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await cmoService.getMarketingTelemetry();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpdateStatus = async (id: string, status: "Draft" | "Reviewed" | "Verified" | "Published") => {
    setLoading(true);
    await cmoService.updateContentStatus(id, status);
    setMsg(`✓ Content item marked as: ${status}.`);
    await load();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const STATUS_STYLING: Record<string, string> = {
    Draft: "text-muted-foreground bg-muted/5 border-border",
    Reviewed: "text-primary bg-primary/5 border-primary/20",
    Verified: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20",
    Published: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Autonomous Marketing Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Autonomous growth operating system. Supervise keyword research, UTM campaign performance, and content calendars.
          </p>
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold">{msg}</div>
      )}

      {data && (
        <>
          {/* Main indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            {[
              { label: "Organic Visitors (Monthly)", value: data.totalVisitors.toLocaleString() },
              { label: "Active Student Referrals", value: `+${data.totalReferrals} signups`, color: "text-emerald-400" },
              { label: "Cost Per Acquisition (CAC)", value: `$${data.cacUsd.toFixed(2)}`, color: "text-primary" },
              { label: "Active Campaigns Budget", value: `$${data.marketingBudgetSpentUsd.toFixed(2)}` },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* Content operations calendar */}
            <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Content Calendar Queue</h2>
              <div className="space-y-4">
                {data.contentItems.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border border-border bg-background/50 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase font-black block">{item.content_type} — Publish Date: {item.publish_date.slice(0, 10)}</span>
                        <h4 className="font-bold text-[11px] text-foreground leading-relaxed mt-1">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${STATUS_STYLING[item.status]}`}>{item.status}</span>
                        {item.status === "Draft" && (
                          <button onClick={() => handleUpdateStatus(item.id, "Reviewed")} className="p-1 text-primary hover:bg-primary/5 rounded border border-primary/10 transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {item.status === "Reviewed" && (
                          <button onClick={() => handleUpdateStatus(item.id, "Verified")} className="p-1 text-emerald-400 hover:bg-emerald-500/5 rounded border border-emerald-500/10 transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO Keyword Rankings */}
            <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border/40 shrink-0">
                <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Search className="w-4 h-4 text-primary" /> SEO Search Visibility</h2>
              </div>
              <div className="p-4 space-y-3">
                {data.seoMetrics.map(seo => (
                  <div key={seo.id} className="p-4 rounded-xl border border-border bg-background/50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-foreground text-[11px]">{seo.keyword}</h4>
                      <span className="text-[9px] text-muted-foreground font-mono">Vol: {seo.search_volume.toLocaleString()} searches/mo</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] font-black text-emerald-400 block">Pos: #{seo.ranking_position}</span>
                      <span className="text-[8px] text-muted-foreground uppercase font-black">Top 10 Rank</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Marketing Campaigns */}
          <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-6">
            <h2 className="font-black text-sm text-foreground">Active Marketing Campaigns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.campaigns.map(cam => (
                <div key={cam.id} className="p-5 rounded-2xl border border-border bg-background/50 flex justify-between items-start font-sans">
                  <div className="space-y-1">
                    <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-black font-mono">UTM Campaign</span>
                    <h4 className="font-bold text-foreground text-[11px] mt-2 block">{cam.title}</h4>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-[11px] font-black text-emerald-400 block">${cam.budget_usd.toFixed(2)} allocated</span>
                    <span className="text-[9px] text-muted-foreground block mt-1">Status: {cam.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
