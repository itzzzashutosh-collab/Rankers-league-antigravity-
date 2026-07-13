"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, RefreshCw, ArrowLeft, Radio } from "lucide-react";

export default function LiveEvaluationLogs() {
  const [logs, setLogs] = useState<string[]>([
    "[10:45:00] [INFO] Answers locked. Initiating validations audits...",
    "[10:45:02] [INFO] Dropped questions checked. Dropping Question #12: Correct marks distributed to all candidates.",
    "[10:45:05] [INFO] Question verification clean. Initializing marks calculator threads...",
    "[10:45:09] [INFO] Thread pool active. Processing 12,400 scripts...",
    "[10:45:15] [INFO] Marks calculation 50% complete. Average speed: 15ms/script.",
    "[10:45:20] [INFO] Marks calculation 100% complete. Launching tie-breaker resolver..."
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString("en-IN");
      const messages = [
        `[${timestamp}] [INFO] Evaluated candidate script: ${Math.random().toString(36).slice(2, 8)}_jee`,
        `[${timestamp}] [INFO] Tie-breaker applied on score bracket 280: resolved with time-taken metric.`,
        `[${timestamp}] [INFO] Released certificates credentials for rank slot #${Math.floor(Math.random() * 50) + 1}`,
        `[${timestamp}] [INFO] Queue size: wallet credit queued payload items updated.`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [randomMsg, ...prev.slice(0, 15)]);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

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
              <Terminal className="w-5 h-5 text-primary" />
              Live Evaluation Logs
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                <Radio className="w-2.5 h-2.5 text-primary animate-pulse" />
                Realtime Stream
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Timeline logs for active grading loops and tie breaking results.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
        <div className="bg-background/80 border border-border/80 rounded-2xl p-5 font-mono text-[11px] leading-relaxed text-emerald-400 min-h-[380px] max-h-[460px] overflow-y-auto space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap hover:bg-muted/5 py-0.5 px-1 rounded transition-colors">
              {log}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
