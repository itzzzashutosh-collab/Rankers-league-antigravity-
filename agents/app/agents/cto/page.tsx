"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, Terminal, Cpu, Layers, Activity, Award, CheckCircle, AlertTriangle, Key } from "lucide-react";
import { ctoService, EngineeringTelemetry, CtoDeployment } from "@/services/ctoService";

export default function EngineeringCommandPage() {
  const [data, setData] = useState<EngineeringTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await ctoService.getEngineeringTelemetry();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRollback = async (id: string) => {
    setLoading(true);
    await ctoService.triggerRollback(id);
    setMsg("✓ CI/CD deployment rollback triggered successfully. Rerouting traffic.");
    await load();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const HEALTH_COLORS: Record<string, string> = {
    Healthy: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    Degraded: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    Offline: "text-destructive border-destructive/20 bg-destructive/5"
  };

  const BUG_SEVERITIES: Record<string, string> = {
    Critical: "text-destructive border-destructive/20 bg-destructive/5",
    Medium: "text-primary border-primary/20 bg-primary/5",
    Minor: "text-muted-foreground border-border bg-muted/5"
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" /> Engineering Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Real-time platform architecture DevOps control hub. Inspect Core Web Vitals, API gateway speeds, and release builds.
          </p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold">{msg}</div>
      )}

      {data && (
        <>
          {/* Telemetry Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            {[
              { label: "Active Commit Releases", value: data.deployments.length.toString() },
              { label: "Average API Response Time", value: `${data.apiLatencyMs}ms`, color: "text-primary" },
              { label: "Redis Caching Hit Ratio", value: `${data.cachingRatioPercentage}%`, color: "text-emerald-400" },
              { label: "Open Bugs Registered", value: data.bugs.length.toString(), color: data.bugs.length > 0 ? "text-amber-400" : "text-muted-foreground" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* Deployments Vercel Center */}
            <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground">Production Deployment Center</h2>
              <div className="space-y-4">
                {data.deployments.map(dep => (
                  <div key={dep.id} className="p-5 rounded-2xl border border-border bg-background/50 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-mono text-[9px] text-primary uppercase font-black block">Release: {dep.commit_sha} ({dep.environment})</span>
                        <h4 className="font-bold text-[11px] text-foreground leading-relaxed mt-1">{dep.release_notes}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-1.5 py-0.5 rounded-full font-black uppercase">Active</span>
                        <button onClick={() => handleRollback(dep.id)} className="h-8 px-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors text-[10px] font-bold">
                          Trigger Rollback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Infrastructure Health Status */}
            <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border/40 shrink-0">
                <h2 className="font-black text-sm text-foreground">Infrastructure Status Checks</h2>
              </div>
              <div className="divide-y divide-border/40 p-4 space-y-3">
                {data.healthItems.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl border border-border bg-background/45 space-y-3 font-sans">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <span className="font-mono text-[9px] text-muted-foreground">{item.id}</span>
                      </div>
                      <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${HEALTH_COLORS[item.health] || ""}`}>{item.health}</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground border-t border-border/10 pt-2 font-mono">
                      Query response speed: <strong className="text-foreground">{item.latency_ms}ms</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Active Bugs Board */}
          <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-6">
            <h2 className="font-black text-sm text-foreground">Active Bugs Checklist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.bugs.map(bug => (
                <div key={bug.id} className="p-5 rounded-2xl border border-border bg-background/50 flex justify-between items-start">
                  <div className="space-y-2">
                    <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${BUG_SEVERITIES[bug.severity]}`}>{bug.severity} Severity</span>
                    <h4 className="font-bold text-[11px] text-foreground leading-relaxed block">{bug.bug_title}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-black">{bug.status}</span>
                    <span className="text-[9px] text-muted-foreground block mt-2">Assigned: {bug.assigned_to}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
