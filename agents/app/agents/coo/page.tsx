"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, LayoutGrid, Radio, Check, X, AlertTriangle, Layers, Calendar, Cpu } from "lucide-react";
import { cooService, OperationsTelemetry, CooIncident } from "@/services/cooService";

export default function OperationsCommandPage() {
  const [data, setData] = useState<OperationsTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await cooService.getOperationsTelemetry();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleResolveIncident = async (id: string) => {
    setLoading(true);
    await cooService.resolveIncident(id);
    setMsg("✓ Operations incident resolved successfully.");
    await load();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const INCIDENT_COLORS: Record<string, string> = {
    Critical: "text-destructive border-destructive/20 bg-destructive/5",
    Major: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    Infrastructure: "text-primary border-primary/20 bg-primary/5",
    Minor: "text-muted-foreground border-border bg-muted/5",
  };

  const AGENT_WORKLOAD_COLORS: Record<string, string> = {
    Idle: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    Busy: "text-primary border-primary/20 bg-primary/5",
    Overloaded: "text-destructive border-destructive/20 bg-destructive/5 animate-pulse",
    Sleeping: "text-muted-foreground border-border bg-muted/5"
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Operations Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            NASA Mission Control for autonomous AI company operations. Monitor active workloads, SLA breachers, and live incidents.
          </p>
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold">{msg}</div>
      )}

      {data && (
        <>
          {/* Metrics summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            {[
              { label: "Active Project Operations", value: data.projects.length.toString() },
              { label: "Live SLA Metrics Monitor", value: "Sufficient", color: "text-emerald-400" },
              { label: "Active Incidents Logged", value: data.incidents.filter(i => i.status !== "Resolved").length.toString(), color: data.incidents.length > 0 ? "text-amber-400" : "text-muted-foreground" },
              { label: "AI Workload Balancer Index", value: "84.2% Occupied" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* SLA Monitor */}
            <section className="lg:col-span-4 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground">SLA Breach Monitor</h2>
              <div className="space-y-4 text-xs font-semibold">
                {data.slaItems.map(sla => (
                  <div key={sla.id} className="p-4 rounded-xl border border-border bg-background/25 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-foreground font-mono">{sla.service_name}</span>
                      <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        sla.status === "Sufficient" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-destructive border-destructive/20 bg-destructive/5"
                      }`}>{sla.status}</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground">Threshold Target Bound: <strong className="text-foreground">{sla.threshold_minutes} minutes</strong></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agent Workload Balancer */}
            <section className="lg:col-span-8 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border/40 shrink-0">
                <h2 className="font-black text-sm text-foreground">Agent Workload occupancy balancer</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.workloads.map(wl => (
                  <div key={wl.agent_id} className={`p-4 rounded-2xl border flex items-center justify-between ${AGENT_WORKLOAD_COLORS[wl.status]}`}>
                    <div className="space-y-1">
                      <Cpu className="w-4 h-4 text-foreground/80" />
                      <h4 className="font-bold text-foreground text-[10px]">@{wl.agent_id}</h4>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider">{wl.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* Projects timeline */}
            <section className="lg:col-span-6 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Active Project Gantt Timelines</h2>
              <div className="space-y-4">
                {data.projects.map(proj => (
                  <div key={proj.id} className="p-4 rounded-xl border border-border bg-background/25 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-foreground text-[11px]">{proj.title}</h4>
                      <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-black">{proj.status}</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground font-mono">Deadline: <strong className="text-foreground">{proj.deadline.slice(0, 10)}</strong></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Incidents Control Center */}
            <section className="lg:col-span-6 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground">Incidents Control Workspace</h2>
              <div className="space-y-4">
                {data.incidents.map(inc => (
                  <div key={inc.id} className="p-4 rounded-xl border border-border bg-background/50 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${INCIDENT_COLORS[inc.incident_type] || ""}`}>{inc.incident_type} Incident</span>
                        <h4 className="font-bold text-[11px] text-foreground leading-relaxed mt-2">{inc.title}</h4>
                      </div>
                      {inc.status !== "Resolved" && (
                        <button onClick={() => handleResolveIncident(inc.id)} className="h-8 px-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-colors font-sans text-[10px] font-bold">
                          Mitigated resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
