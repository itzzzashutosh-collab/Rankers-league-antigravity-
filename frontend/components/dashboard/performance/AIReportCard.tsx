"use client";

import React from "react";
import { motion } from "framer-motion";
import { PerformanceReport } from "@/services/auth/performanceService";
import { Sparkles, BrainCircuit, ArrowUpRight, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface AIReportCardProps {
  report: PerformanceReport | null;
}

export function AIReportCard({ report }: AIReportCardProps) {
  if (!report) {
    return (
      <div className="p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-xl text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 animate-pulse">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-foreground">Generating Performance Intelligence...</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Complete your first mock contests to trigger natural language AI analytics and targeted rank projection models.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Main Summary Card (Col Span 2) */}
      <div className="lg:col-span-2 p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col justify-between">
        {/* Background gradient decorative circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-primary">AI Report Analytics</span>
          </div>

          <h3 className="text-lg font-black tracking-tight text-foreground">
            Competition Intelligence Summary
          </h3>
          
          <p className="text-sm text-foreground/90 mt-3 leading-relaxed">
            &ldquo;{report.overall_summary}&rdquo;
          </p>
        </div>

        {/* Smart Insights List */}
        <div className="mt-6 pt-6 border-t border-border/30">
          <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Key Insights
          </h4>
          <ul className="space-y-2.5">
            {report.smart_insights.map((insight, idx) => (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="flex items-start gap-2.5 text-xs text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Right Column (Strengths, Weaknesses, Projected jumps) */}
      <div className="flex flex-col gap-6">
        {/* Strengths & Weaknesses Panel */}
        <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-xl">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <BrainCircuit className="w-4.5 h-4.5 text-primary" />
            Focus Map
          </h3>

          <div className="space-y-4">
            {/* Strongest Subject */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Strongest Subject</span>
                <span className="text-xs font-black text-foreground truncate block">{report.strongest_subject}</span>
                <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">{report.strongest_topic} ({report.strongest_chapter})</span>
              </div>
            </div>

            {/* Weakest Subject */}
            <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Needs Revision</span>
                <span className="text-xs font-black text-foreground truncate block">{report.weakest_subject}</span>
                <span className="text-[10px] text-rose-400 block font-medium mt-0.5">{report.weakest_topic} ({report.weakest_chapter})</span>
              </div>
            </div>

            {/* Immediate Action */}
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Immediate Action</span>
                <span className="text-xs font-black text-foreground truncate block">{report.needs_immediate_attention}</span>
                <span className="text-[10px] text-muted-foreground block font-medium mt-0.5">Most improved subject: {report.most_improved_subject}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projected Rank Jump Opportunities */}
        <div className="p-6 rounded-3xl border border-border/40 bg-primary/5 hover:bg-primary/10 transition-colors shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ArrowUpRight className="w-4.5 h-4.5 text-primary" />
              Projected Rank Jumps
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              AI simulated growth opportunities based on immediate margin gains.
            </p>
          </div>

          <div className="space-y-3.5">
            {report.improvement_opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="p-3 bg-card/40 border border-border/20 rounded-xl flex flex-col gap-1.5"
              >
                <p className="text-[11px] text-foreground font-semibold leading-relaxed">
                  {opp.description}
                </p>
                <div className="text-[10px] text-primary font-black uppercase tracking-wider">
                  Target: {opp.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AIReportCard;
