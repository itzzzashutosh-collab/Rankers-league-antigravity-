"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Play } from "lucide-react";
import { aiosService, CostSummary } from "@/services/aiosService";
import { reviewerService, ReviewScorecard } from "@/services/reviewerService";

export default function ReportsPage() {
  const [costs, setCosts] = useState<CostSummary | null>(null);
  const [scorecard, setScorecard] = useState<ReviewScorecard | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [cData, sData] = await Promise.all([
      aiosService.getCostSummary(),
      reviewerService.auditOutput("t-mock-01", { execution_id: "exec-mock-01", status: "Running" })
    ]);
    setCosts(cData);
    setScorecard(sData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const FINDING_TYPE_COLORS: Record<string, string> = {
    Critical: "text-destructive border-destructive/20 bg-destructive/5",
    Major: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    Medium: "text-primary border-primary/20 bg-primary/5",
    Minor: "text-muted-foreground border-border bg-muted/5",
    Suggestion: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> AI Quality & Cost Control Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Audit executing agent output schema compliance, brand guide tones, and accumulated billing rates.
          </p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Grid: Budget telemetry */}
      {costs && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          {[
            { label: "Total Accrued Cost", value: `$${costs.calculatedCostUsd.toFixed(4)}`, color: "text-primary" },
            { label: "Total Input Context Tokens", value: costs.inputTokens.toLocaleString() },
            { label: "Total Output Completion Tokens", value: costs.outputTokens.toLocaleString() },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Scorecard Widget */}
        <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
          <h2 className="font-black text-sm text-foreground">Scorecard Breakdown</h2>
          {scorecard ? (
            <div className="space-y-6">
              {/* Score summary */}
              <div className="flex items-center gap-6 bg-background/25 border border-border/60 p-5 rounded-2xl">
                <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center text-lg font-black text-foreground">
                  {(scorecard.overallScore * 100).toFixed(0)}%
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Review Status</span>
                  <span className={`text-xs font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    scorecard.status === "Approved" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-amber-400 border border-amber-500/20 bg-amber-500/5"
                  }`}>{scorecard.status}</span>
                </div>
              </div>

              {/* Metrics values list */}
              <div className="space-y-3.5 text-xs font-semibold">
                {[
                  { label: "Completeness Score", val: scorecard.completeness },
                  { label: "Format Conformity", val: scorecard.formatting },
                  { label: "Logical Reasoning Score", val: scorecard.reasoning },
                ].map(({ label, val }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground">{(val * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${val * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground/60">Loading scorecard...</div>
          )}
        </section>

        {/* Findings and suggestions stream */}
        <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border/40 shrink-0">
            <h2 className="font-black text-sm text-foreground">Active QA Audit Findings</h2>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {scorecard?.findings.map(finding => (
              <div key={finding.id} className="p-4 rounded-2xl border border-border bg-background/50 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${FINDING_TYPE_COLORS[finding.finding_type]}`}>{finding.finding_type}</span>
                    <p className="text-[11px] text-foreground font-bold mt-2 leading-relaxed">{finding.message}</p>
                  </div>
                </div>

                {finding.suggested_fix && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-[10px] text-primary flex items-start gap-1.5 leading-relaxed font-sans">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block uppercase font-black text-[9px] tracking-wider mb-0.5 text-primary-foreground/90">Remediation Action</strong>
                      {finding.suggested_fix}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
