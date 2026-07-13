"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, Play, Pause, RefreshCw, Terminal, CheckCircle2, 
  AlertOctagon, Cpu, Layers, ArrowRight, ShieldCheck, Database
} from "lucide-react";
import { evaluationService, EvaluationJob, WorkerStatus, QueueStatus } from "@/services/evaluationService";

export default function EvaluationControlCenter() {
  const [jobs, setJobs] = useState<EvaluationJob[]>([]);
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);
  const [queues, setQueues] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [fetchedJobs, fetchedWorkers, fetchedQueues] = await Promise.all([
      evaluationService.getEvaluationJobs(),
      evaluationService.getWorkers(),
      evaluationService.getQueues()
    ]);
    setJobs(fetchedJobs);
    setWorkers(fetchedWorkers);
    setQueues(fetchedQueues);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Simulate live progress updates for grading JEE challenge
  useEffect(() => {
    const timer = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status === "Processing" && job.processed_count < job.participants_count) {
          const delta = Math.floor(Math.random() * 450) + 150;
          const nextCount = Math.min(job.participants_count, job.processed_count + delta);
          const nextStage = nextCount === job.participants_count ? "Completed" : job.current_stage;
          return {
            ...job,
            processed_count: nextCount,
            status: nextCount === job.participants_count ? "Completed" : "Processing",
            current_stage: nextCount === job.participants_count ? "Leaderboard Update" : "Tie Breaking"
          };
        }
        return job;
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = async (id: string) => {
    const success = await evaluationService.retryJob(id);
    if (success) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "Processing", current_stage: "Answer Validation", error_message: undefined } : j));
      alert("Evaluation job re-queued in processing queue.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Processing": return "text-primary border-primary/20 bg-primary/5 animate-pulse";
      case "Failed": return "text-destructive border-destructive/20 bg-destructive/5";
      default: return "text-muted-foreground border-border/80 bg-muted/10";
    }
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Evaluation Pipeline cockpit
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor real-time grading threads, validation pipelines, and tie-breaking algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/evaluation/live"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Logs Timeline
          </Link>
          <Link
            href="/admin/evaluation/jobs"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Jobs Ledger
          </Link>
          <Link
            href="/admin/results"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Results Publishing
          </Link>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-foreground transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Pipeline Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Jobs Progress List */}
          <section className="rounded-3xl border border-border bg-card/15 p-6 md:p-8 space-y-6">
            <h2 className="text-sm font-black text-foreground">Pipeline grading queues</h2>

            <div className="space-y-4 text-xs font-semibold">
              {jobs.map((job) => {
                const percent = Math.round((job.processed_count / job.participants_count) * 100);
                return (
                  <div key={job.id} className="p-5 rounded-2xl border border-border/60 bg-background/25 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-foreground block">{job.contest_name}</span>
                        <span className="text-[10px] text-muted-foreground block">Job: #{job.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Stage: <strong className="text-foreground">{job.current_stage}</strong></span>
                        <span>{job.processed_count.toLocaleString()} / {job.participants_count.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    {job.error_message && (
                      <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive space-y-2 leading-relaxed">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                          <AlertOctagon className="w-4 h-4 shrink-0" />
                          Pipeline grade failure logs
                        </div>
                        <p className="text-[10px] text-muted-foreground">{job.error_message}</p>
                        <button
                          onClick={() => handleRetry(job.id)}
                          className="h-7 px-3 rounded bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 text-destructive text-[9px] font-black uppercase transition-all"
                        >
                          Retry Processing
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Workers Thread Dashboard */}
          <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              AWS Grader workers Pool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              {workers.map((w) => (
                <div key={w.id} className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-between h-28">
                  <div>
                    <span className="font-bold text-foreground block">{w.name}</span>
                    <span className="text-[9px] text-muted-foreground block font-mono mt-0.5">ID: {w.id.slice(0,8)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-2">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${
                      w.status === "Active" ? "text-primary" : w.status === "Idle" ? "text-emerald-400" : "text-muted-foreground"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${w.status === "Active" ? "animate-pulse" : ""}`} />
                      {w.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{w.average_speed_ms}ms/scr</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Queues Monitor sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-3xl border border-border bg-card/25 p-6 space-y-4 text-xs font-semibold">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20 pb-2">
              Background queue manager
            </h3>

            {queues ? (
              <div className="space-y-4">
                {[
                  { name: "Evaluation queue", count: queues.evaluation, details: "Contest evaluation grader pipelines" },
                  { name: "Prize matrix queue", count: queues.prize, details: "Curve allocations release" },
                  { name: "Certificates queue", count: queues.certificate, details: "Verification certificates generator queue" },
                  { name: "Wallet credit queue", count: queues.wallet, details: "Released payouts awaiting publish signature" },
                  { name: "Notification queue", count: queues.notification, details: "E-mail broadcast schedules" }
                ].map((q, i) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block">{q.name}</span>
                      <span className="text-[9px] text-muted-foreground block leading-tight">{q.details}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-muted border border-border font-bold font-mono text-[10px]">
                      {q.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground/60 italic text-center p-4">
                Loading queue indices...
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
