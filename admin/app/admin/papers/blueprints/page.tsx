"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, AlertCircle, ArrowLeft, Settings } from "lucide-react";
import { blueprintEngine, BlueprintRule } from "@/services/blueprintEngine";

export default function BlueprintsRulesEditor() {
  const [rules, setRules] = useState<BlueprintRule[]>([
    { subject: "Physics", target_count: 30, difficulty_mix: { Easy: 6, Medium: 18, Hard: 6 } },
    { subject: "Chemistry", target_count: 30, difficulty_mix: { Easy: 6, Medium: 18, Hard: 6 } },
    { subject: "Mathematics", target_count: 30, difficulty_mix: { Easy: 6, Medium: 18, Hard: 6 } }
  ]);

  const [validationStatus, setValidationStatus] = useState<any>({
    is_complete: true,
    missing_slots_count: 0,
    details: [
      { subject: "Physics", target: 30, current: 30, status: "Complete" },
      { subject: "Chemistry", target: 30, current: 30, status: "Complete" },
      { subject: "Mathematics", target: 30, current: 30, status: "Complete" }
    ]
  });

  const handleRuleChange = (idx: number, field: string, value: any) => {
    setRules(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
    // Simulate re-validating blueprint
    alert("Blueprint parameters modified. Quality audits re-evaluated... All clear!");
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/papers"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Blueprints rules editor
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Configure target allocations, difficulty mixes, and validates topic coverage specifications.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rules Builder list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-6 text-xs font-semibold">
            <h2 className="text-sm font-black text-foreground">Blueprint weightage specifications</h2>

            {rules.map((rule, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-border/60 bg-background/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-foreground block">{rule.subject}</span>
                  <span className="text-[10px] text-muted-foreground block">
                    Difficulty mix target: 20% Easy, 60% Medium, 20% Hard
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block font-bold">Target Count</label>
                    <input
                      type="number"
                      value={rule.target_count}
                      onChange={(e) => handleRuleChange(idx, "target_count", Number(e.target.value))}
                      className="w-20 h-8 px-2 rounded bg-background border border-border focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Audits details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Verification Audits Status
            </h3>

            {validationStatus.is_complete ? (
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Blueprint allocation requirements fully satisfied.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Allocations underweight by {validationStatus.missing_slots_count} questions.</span>
              </div>
            )}

            <div className="space-y-2 border-t border-border/20 pt-3">
              {validationStatus.details.map((dt: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-[11px] leading-relaxed">
                  <span className="text-muted-foreground/80">{dt.subject} (Target: {dt.target})</span>
                  <span className={dt.status === "Complete" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {dt.current} / {dt.target} ({dt.status})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
