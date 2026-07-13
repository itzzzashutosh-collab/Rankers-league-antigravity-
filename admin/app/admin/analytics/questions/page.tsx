"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, RefreshCw } from "lucide-react";
import { analyticsService } from "@/services/analyticsService";

export default function QuestionAnalytics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await analyticsService.getQuestionMetrics();
    setMetrics(data);
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
          <h1 className="text-lg font-black flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Question Bank Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Difficulty counts, approval rates, accuracy trends, and exposure risks.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {metrics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            {[
              { label: "Questions Approved", value: metrics.approved.toLocaleString() },
              { label: "Pending Review", value: metrics.pending.toLocaleString(), color: "text-amber-400" },
              { label: "Rejected Questions", value: metrics.rejected.toLocaleString(), color: "text-destructive" },
              { label: "Global Accuracy", value: `${metrics.averageAccuracy}%`, color: "text-emerald-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            {/* Difficulty mix */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Difficulty Distribution</h3>
              <div className="space-y-4">
                {Object.entries(metrics.difficultyDistribution).map(([diff, count]: any) => {
                  const pct = ((count / metrics.totalQuestions) * 100).toFixed(1);
                  return (
                    <div key={diff} className="space-y-1.5">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span className="text-foreground">{diff}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance lists */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Question Exposure Risk</h3>
              <div className="space-y-3">
                {[
                  ["Electrostatics Advanced Theory", "14 attempts · High accuracy"],
                  ["Organic Carbonyl Conversions", "9 attempts · Medium accuracy"],
                  ["Calculus Area Under Curve", "21 attempts · Hard accuracy"],
                  ["Kingdom Animalia Taxonomy", "32 attempts · Easy accuracy"],
                ].map(([topic, desc]) => (
                  <div key={topic} className="flex justify-between items-center border-b border-border/10 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-foreground font-bold">{topic}</span>
                    <span className="text-muted-foreground text-[10px]">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
