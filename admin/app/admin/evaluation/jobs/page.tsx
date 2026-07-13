"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Database, AlertOctagon, CheckCircle2, ArrowLeft } from "lucide-react";
import { evaluationService, EvaluationJob } from "@/services/evaluationService";

export default function JobsLedger() {
  const [jobs, setJobs] = useState<EvaluationJob[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await evaluationService.getEvaluationJobs();
      setJobs(data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Failed": return "text-destructive border-destructive/20 bg-destructive/5";
      default: return "text-primary border-primary/20 bg-primary/5 animate-pulse";
    }
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/evaluation"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Evaluation Jobs Ledger
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Historical logs of all finished, processing, and failed grading queues.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
          Loading Jobs Ledger...
        </div>
      ) : (
        <div className="space-y-4 text-xs font-semibold">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl border border-border/60 bg-card/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-foreground">{job.contest_name}</h3>
                <span className="text-[10px] text-muted-foreground/60 block font-mono">Job ID: {job.id}</span>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Processed: {job.processed_count.toLocaleString()} / {job.participants_count.toLocaleString()} submissions
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 font-bold">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusStyle(job.status)}`}>
                  {job.status}
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">
                  {new Date(job.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
