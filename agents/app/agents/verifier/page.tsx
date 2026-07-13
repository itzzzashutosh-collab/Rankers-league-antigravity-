"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, CheckCircle, AlertTriangle, Layers, Award, Terminal, Play, FileText, Database } from "lucide-react";
import { verifierService, VerificationReport } from "@/services/verifierService";

export default function VerifierConsolePage() {
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [testContent, setTestContent] = useState("Execute JEE Physics contest calculations validation. Value: 4200.");

  const loadVerification = async () => {
    setLoading(true);
    // Simulate auditing content
    const data = await verifierService.runVerification("rev-mock-01", testContent);
    setReport(data);
    setLoading(false);
  };

  useEffect(() => { loadVerification(); }, []);

  const triggerHallucinationTest = async () => {
    setLoading(true);
    // Passing "invalid" flags a mock hallucination error inside verifierService
    const data = await verifierService.runVerification("rev-mock-01", "Invalid content block containing fabricated data checks.");
    setReport(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> AI Trust & Verification Control
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Audits reviewed outputs against approved system knowledge bases, logic calculations, and database metrics.
          </p>
        </div>
        <div className="flex gap-2 font-sans">
          <button onClick={triggerHallucinationTest} disabled={loading}
            className="h-10 px-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive font-black text-xs hover:bg-destructive/10 transition-colors flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Simulate Hallucination Run
          </button>
          <button onClick={loadVerification} disabled={loading}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Run Trust Verification
          </button>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
          {[
            { label: "Verification ID", value: report.verificationId.slice(0, 10) },
            { label: "Trust Score Index", value: `${(report.overallConfidence * 100).toFixed(0)}%`, color: report.overallConfidence > 0.8 ? "text-emerald-400" : "text-destructive" },
            { label: "Factual Checkpoints", value: `${report.factChecks.filter(f => f.passed).length} of ${report.factChecks.length}` },
            { label: "Audit Verification State", value: report.status, color: report.status === "Verified" ? "text-emerald-400" : "text-amber-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Verification Checkpoints */}
        <section className="lg:col-span-6 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
          <h2 className="font-black text-sm text-foreground">Factual Audits Timeline</h2>
          {report ? (
            <div className="space-y-3">
              {report.factChecks.map(fc => (
                <div key={fc.id} className="p-4 rounded-xl border border-border/60 bg-background/25 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${fc.passed ? "text-emerald-400" : "text-destructive"}`} />
                    <span className="text-[11px] font-bold text-foreground">{fc.fact_description}</span>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground font-bold">Confidence: {(fc.confidence_score * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground/60">Loading verification details...</div>
          )}
        </section>

        {/* Evidence & Proof Listings */}
        <section className="lg:col-span-6 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border/40 shrink-0">
            <h2 className="font-black text-sm text-foreground">Evidence & Proof Ledger</h2>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {report?.evidence.map(ev => (
              <div key={ev.id} className="p-4 rounded-xl border border-border bg-background/50 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black text-primary uppercase flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" />
                    {ev.evidence_type}
                  </span>
                  <span className="font-mono text-muted-foreground">{ev.source_reference}</span>
                </div>
                <div className="bg-black/20 border border-border/40 p-3 rounded-lg font-mono text-[10px] text-foreground/90">
                  {JSON.stringify(ev.payload)}
                </div>
              </div>
            ))}

            {report?.hallucinations && report.hallucinations.length > 0 && (
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive space-y-2 font-mono">
                <h3 className="font-black text-[10px] uppercase flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Hallucination Trigger Warning
                </h3>
                {report.hallucinations.map((h, i) => (
                  <p key={i} className="text-[10px] leading-relaxed">{h}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
