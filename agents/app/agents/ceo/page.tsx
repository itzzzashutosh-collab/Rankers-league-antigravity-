"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, LayoutGrid, Radio, Check, X, AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";
import { ceoService, FounderTelemetry, CeoApprovalItem } from "@/services/ceoService";

export default function FounderDashboardPage() {
  const [data, setData] = useState<FounderTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await ceoService.getFounderDashboardData();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id: string, status: "Approved" | "Rejected") => {
    setLoading(true);
    await ceoService.handleFounderApproval(id, status);
    setMsg(`✓ Action decision: ${status} for queue item.`);
    await load();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const DEPT_COLORS: Record<string, string> = {
    Healthy: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    Degraded: "text-amber-400 bg-amber-500/5 border-amber-500/10",
    Critical: "text-destructive bg-destructive/5 border-destructive/10"
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" /> Private Founder Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Executive control panel for running an autonomous AI organization.
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
          {/* Main indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            {[
              { label: "Company Health Score", value: `${data.healthScore}%`, color: "text-primary" },
              { label: "Total Revenue (INR)", value: `₹${data.revenueInr.toLocaleString()}`, color: "text-emerald-400" },
              { label: "Active Candidates", value: `+${data.growthUsers} users` },
              { label: "AIOS Token Expenses", value: `$${data.aiCostUsd.toFixed(4)}` },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2 shadow-sm">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* Approvals Vault */}
            <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground">Founder Approval Center</h2>
              <div className="space-y-4">
                {data.approvals.filter(a => a.status === "Pending").map(app => (
                  <div key={app.id} className="p-5 rounded-2xl border border-border bg-background/50 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] text-primary uppercase font-black block">Requested by: {app.requested_by}</span>
                        <h4 className="font-bold text-[11px] text-foreground leading-relaxed mt-1">{app.action}</h4>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleAction(app.id, "Rejected")} className="p-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAction(app.id, "Approved")} className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {data.approvals.filter(a => a.status === "Pending").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground/60">✓ All actions queue lists cleared.</div>
                )}
              </div>
            </section>

            {/* Department Hub health status */}
            <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border/40 shrink-0">
                <h2 className="font-black text-sm text-foreground">Department Board Health</h2>
              </div>
              <div className="divide-y divide-border/40 p-4 space-y-3.5">
                {data.departments.map(dept => (
                  <div key={dept.id} className={`p-4 rounded-2xl border flex items-center justify-between ${DEPT_COLORS[dept.health]}`}>
                    <div>
                      <h3 className="font-bold text-foreground">{dept.name}</h3>
                      <span className="text-[9px] text-muted-foreground font-bold">{dept.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black block">{dept.health}</span>
                      <span className="text-[9px] text-muted-foreground block">{dept.tasks_count} tasks queued</span>
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
