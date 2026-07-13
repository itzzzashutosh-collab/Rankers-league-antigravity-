"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, DollarSign, Wallet, Cpu, AlertTriangle, TrendingUp, BarChart2 } from "lucide-react";
import { cfoService, FinancialTelemetry } from "@/services/cfoService";

export default function FinancialCommandPage() {
  const [data, setData] = useState<FinancialTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await cfoService.getFinancialTelemetry();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleResolveAlert = async (id: string) => {
    setLoading(true);
    await cfoService.resolveAlert(id);
    setMsg("✓ Financial alert resolved successfully.");
    await load();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" /> Autonomous Financial Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Bloomberg-inspired executive finance intelligence. Track gross margins, runway forecasts, and AI token usages.
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
          {/* Telemetry metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            {[
              { label: "Cash Position (INR)", value: `₹${data.cashPositionInr.toLocaleString()}`, color: "text-emerald-400" },
              { label: "Total Runway Estimate", value: `${data.runwayMonths} months`, color: "text-primary" },
              { label: "AI Model Spending (USD)", value: `$${data.aiCosts.reduce((acc, curr) => acc + curr.cost_usd, 0).toFixed(4)}` },
              { label: "Dynamic Burn Rate (USD)", value: `$${data.burnRateUsd.toFixed(2)}/mo` },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* AI Cost Intelligence */}
            <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Cpu className="w-4 h-4 text-primary" /> AI Cost Intelligence</h2>
              <div className="space-y-4">
                {data.aiCosts.map(cost => (
                  <div key={cost.id} className="p-4 rounded-xl border border-border bg-background/50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-foreground text-[11px]">{cost.model_name} ({cost.provider})</h4>
                      <span className="text-[9px] text-muted-foreground font-mono">{cost.tokens_count.toLocaleString()} tokens consumed</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400 font-mono">${cost.cost_usd.toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Department budgets */}
            <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-6">
              <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><BarChart2 className="w-4 h-4 text-primary" /> Department Budget Limits</h2>
              <div className="space-y-4">
                {data.budgets.map(budget => {
                  const pct = Math.min(100, (budget.spent_usd / budget.monthly_limit_usd) * 100);
                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-foreground font-mono">{budget.department_id}</span>
                        <span className="text-muted-foreground">${budget.spent_usd.toFixed(2)} / ${budget.monthly_limit_usd.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-destructive animate-pulse" : "bg-primary"}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Financial Alerts */}
          <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-6">
            <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-400" /> Financial Risks & Alerts</h2>
            <div className="space-y-4">
              {data.alerts.filter(a => !a.resolved).map(alert => (
                <div key={alert.id} className="p-4 rounded-xl border border-border bg-background/50 flex justify-between items-center font-sans">
                  <div>
                    <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase font-black font-mono">Budget Warning</span>
                    <p className="text-[11px] font-bold text-foreground mt-2">{alert.message}</p>
                  </div>
                  <button onClick={() => handleResolveAlert(alert.id)} className="h-8 px-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-[10px] font-bold shrink-0">
                    Acknowledge resolve
                  </button>
                </div>
              ))}
              {data.alerts.filter(a => !a.resolved).length === 0 && (
                <div className="text-center py-6 text-muted-foreground/60 font-sans">✓ No financial risk alerts detected. Margins stable.</div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
