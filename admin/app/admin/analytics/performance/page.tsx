"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, RefreshCw } from "lucide-react";
import { analyticsService } from "@/services/analyticsService";

export default function PerformanceAnalytics() {
  const [paperMetrics, setPaperMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await analyticsService.getPaperMetrics();
    setPaperMetrics(data);
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
          <h1 className="text-lg font-black flex items-center gap-2"><Compass className="w-5 h-5 text-primary" /> Exam Assembly & Performance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Track paper quality scores, chapter coverage, and question reuse frequencies.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {paperMetrics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            {[
              { label: "Active Blueprints", value: paperMetrics.totalPapers.toString() },
              { label: "Avg Quality Score", value: `${paperMetrics.avgQualityScore}%`, color: "text-primary" },
              { label: "Chapter Coverage", value: `${paperMetrics.avgChapterCoverage}%`, color: "text-emerald-400" },
              { label: "Question Reuse Rate", value: `${paperMetrics.questionReuseRate}%`, color: "text-amber-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            {/* Subject metrics */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Subject-Wise Performance</h3>
              <div className="space-y-4">
                {[
                  { subject: "Physics", avgAccuracy: 61.2 },
                  { subject: "Chemistry", avgAccuracy: 68.5 },
                  { subject: "Biology", avgAccuracy: 74.2 },
                  { subject: "General Knowledge", avgAccuracy: 58.4 },
                ].map(s => (
                  <div key={s.subject} className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[11px]">
                      <span className="text-foreground">{s.subject}</span>
                      <span className="text-muted-foreground">{s.avgAccuracy}% Accuracy</span>
                    </div>
                    <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${s.avgAccuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exposition summary */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Quality Scorecard Indicators</h3>
              <div className="space-y-3">
                {[
                  ["Syllabus Alignment Score", "94% · Target met"],
                  ["Cognitive Domain Balance", "88% · Bloom Taxonomy alignment"],
                  ["Exposure Risk Control", "Low risk · Item pool rotated"],
                  ["Version Equating Factor", "Equated via anchor items"],
                ].map(([indicator, desc]) => (
                  <div key={indicator} className="flex justify-between items-center border-b border-border/10 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-foreground font-bold">{indicator}</span>
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
