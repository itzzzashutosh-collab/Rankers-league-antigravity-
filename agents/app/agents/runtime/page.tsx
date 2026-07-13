"use client";

import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, Layers, ShieldAlert, Cpu, Terminal, Play, CheckCircle } from "lucide-react";
import { executionService, ExecutionProgress } from "@/services/executionService";

export default function RuntimeMonitorPage() {
  const [progress, setProgress] = useState<ExecutionProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    { time: "14:31:02", type: "info", text: "Task plan validated successfully. Plan version: v1.0.0" },
    { time: "14:31:03", type: "info", text: "Permission check passed. Agent: AGENT_MKT, Action: call_discord_webhook" },
    { time: "14:31:04", type: "info", text: "Acquired tool: discord_webhook. Endpoint resolved." },
    { time: "14:31:05", type: "warn", text: "Connection latency: 240ms. Attempting delivery retry..." },
    { time: "14:31:06", type: "info", text: "Output validated. Schema check: PASSED. Confidence: 0.95" }
  ]);

  const handleStartRun = async () => {
    setLoading(true);
    const data = await executionService.startExecution("plan-mock-01", "AGENT_MKT");
    setProgress(data);
    setLoading(false);
  };

  const LOG_TYPE_COLORS: Record<string, string> = {
    info: "text-primary",
    warn: "text-amber-400",
    error: "text-destructive"
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> AIOS Execution Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Real-time pipeline engine auditing active step runners, tool resolutions, and stdout logs.
          </p>
        </div>
        <button onClick={handleStartRun} disabled={loading}
          className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center gap-2 font-sans">
          <Play className="w-3.5 h-3.5" /> Start Test Step Execution
        </button>
      </div>

      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
          {[
            { label: "Execution ID", value: progress.executionId.slice(0, 10) },
            { label: "Active Nodes Index", value: `${progress.currentStepIndex + 1} of ${progress.steps.length}` },
            { label: "Token Consumption", value: `${progress.tokens_used.toLocaleString()} units` },
            { label: "Estimated Billing", value: `$${progress.cost_usd.toFixed(4)}`, color: "text-emerald-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Step Runner Progress */}
        <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
          <h2 className="font-black text-sm text-foreground">Running Steps Timeline</h2>
          {progress ? (
            <div className="relative border-l border-border/40 pl-6 ml-3 space-y-5">
              {progress.steps.map((step, idx) => (
                <div key={step.step_id} className="relative bg-background/25 border border-border/60 p-4 rounded-xl flex items-center justify-between">
                  <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 p-0.5 bg-background border border-border rounded-full">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      step.status === "Completed" ? "bg-emerald-400" :
                      step.status === "Running" ? "bg-primary animate-pulse" : "bg-border"
                    }`} />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-black block">Step {idx + 1}</span>
                    <span className="font-bold text-foreground text-[11px] block">{step.label}</span>
                  </div>
                  <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    step.status === "Completed" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                    step.status === "Running" ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground border-border"
                  }`}>{step.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground/50">Click 'Start Test Step Execution' to trigger steps loop</div>
          )}
        </section>

        {/* Real-time Logs Console */}
        <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col h-[320px]">
          <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center shrink-0">
            <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Terminal className="w-4 h-4 text-primary" /> Live Console Stream</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-2.5 bg-black/35 select-text">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 leading-relaxed">
                <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                <span className={`${LOG_TYPE_COLORS[log.type]} font-black uppercase shrink-0`}>[{log.type}]</span>
                <span className="text-foreground/90 font-medium">{log.text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
