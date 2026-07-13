"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, HelpCircle, ArrowLeft, Trash2 } from "lucide-react";

export default function DuplicatesDashboard() {
  const [reports, setReports] = useState([
    { id: "rep-1", q1Title: "Coulombs Law force calculations", q1Text: "Find electrostatic force magnitude between protons", q2Title: "Electrostatic force Coulomb magnitude", q2Text: "What is the force magnitude between positive charges", score: 85 },
    { id: "rep-2", q1Title: "Chemical order reaction kinetics", q1Text: "First-order kinetics reaction fraction decays", q2Title: "First order half lives reactant", q2Text: "What fraction of a reactant remains in a first-order chemical reaction", score: 71 }
  ]);

  const handleResolve = (id: string, action: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    alert(`Duplicate alert resolved: "${action}" successfully executed.`);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/question-bank"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Duplication Solver Center
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Live similarity alerts flagged by Jaccard index parsing algorithms.
            </p>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4 text-xs font-semibold">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-300 space-y-4"
            >
              <div className="flex justify-between items-center flex-wrap gap-2 border-b border-amber-500/10 pb-2">
                <span className="text-[10px] font-black uppercase bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">
                  {rep.score}% Match Severity
                </span>
                <span className="text-[10px] text-muted-foreground/80">Alert reference ID: {rep.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/90">
                <div className="p-3.5 rounded-xl border border-border/60 bg-background/25 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Question A</span>
                  <span className="font-bold text-xs text-foreground block">{rep.q1Title}</span>
                  <p className="text-muted-foreground text-[10px] italic leading-normal">{rep.q1Text}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border/60 bg-background/25 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Question B</span>
                  <span className="font-bold text-xs text-foreground block">{rep.q2Title}</span>
                  <p className="text-muted-foreground text-[10px] italic leading-normal">{rep.q2Text}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button
                  onClick={() => handleResolve(rep.id, "Merge & De-duplicate")}
                  className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-primary-foreground transition-colors"
                >
                  Merge Questions
                </button>
                <button
                  onClick={() => handleResolve(rep.id, "Ignore Alert")}
                  className="h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/40 text-xs font-bold text-foreground transition-colors"
                >
                  Ignore Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-2">
          <ShieldCheck className="w-12 h-12 text-emerald-400/40 mx-auto" />
          <span className="text-xs font-bold block text-foreground">Duplication Checks Verified</span>
          <span className="text-[10px] text-muted-foreground">All question strings within database are 100% unique.</span>
        </div>
      )}
    </div>
  );
}
