"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeIndianRupee, History, RefreshCw } from "lucide-react";
import { financeService } from "@/services/financeService";

export default function PlatformFeesPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [newFee, setNewFee] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await financeService.getPlatformFeeHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const currentFee = history[0]?.fee_percentage ?? 18;

  const handleUpdate = async () => {
    const fee = parseFloat(newFee);
    if (!fee || fee < 1 || fee > 50) { setMsg("❌ Fee must be between 1% and 50%."); return; }
    if (!reason.trim()) { setMsg("❌ Reason is required."); return; }
    if (!confirm(`Update platform fee to ${fee}%? This will apply to ALL future contests. Historical data is unaffected.`)) return;

    await financeService.updatePlatformFee(fee, reason);
    setMsg(`✓ Platform fee updated to ${fee}%. Change logged in audit trail.`);
    setNewFee("");
    setReason("");
    await load();
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><BadgeIndianRupee className="w-5 h-5 text-primary" /> Platform Fee Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Configure global platform fee. Every change is immutably logged.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current fee display */}
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 flex flex-col items-center justify-center gap-3 text-center">
          <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Current Platform Fee</span>
          <span className="text-6xl font-black text-primary">{currentFee}%</span>
          <span className="text-[10px] text-muted-foreground">Effective from: {history[0]?.effective_from || "—"}</span>
          <div className="text-[10px] text-muted-foreground/60 mt-2 border border-amber-500/20 bg-amber-500/5 px-4 py-2 rounded-xl text-amber-400 font-bold">
            Changes apply only to future contests
          </div>
        </div>

        {/* Update panel */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h2 className="font-black text-sm text-foreground">Update Platform Fee</h2>
          {msg && (
            <div className={`p-3 rounded-xl border text-[10px] font-bold ${msg.startsWith("✓") ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-destructive/20 bg-destructive/5 text-destructive"}`}>
              {msg}
            </div>
          )}
          <div className="space-y-3 text-xs font-semibold">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">New Fee Percentage (%)</label>
              <input type="number" min="1" max="50" step="0.5" value={newFee} onChange={e => setNewFee(e.target.value)}
                placeholder="e.g. 18" className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:border-primary text-sm font-bold" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Reason (Required)</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                placeholder="Explain the reason for this fee change..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:border-primary resize-none text-xs" />
            </div>
            <button onClick={handleUpdate}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black hover:opacity-90 transition-opacity text-xs">
              Apply New Fee Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Fee change history */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-black text-sm text-foreground">Fee Change History</h2>
          <span className="text-[9px] text-muted-foreground ml-1">(Immutable Audit Log)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-4">Fee %</th>
                <th className="p-4">Effective From</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-right">Logged At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {history.map((h, i) => (
                <tr key={h.id} className={`hover:bg-card/20 transition-colors font-semibold ${i === 0 ? "bg-primary/5" : ""}`}>
                  <td className="p-4">
                    <span className="font-black text-foreground text-base">{h.fee_percentage}%</span>
                    {i === 0 && <span className="ml-2 text-[8px] text-primary border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded-full font-black uppercase">Current</span>}
                  </td>
                  <td className="p-4 text-muted-foreground font-bold">{h.effective_from}</td>
                  <td className="p-4 text-muted-foreground max-w-xs truncate">{h.reason}</td>
                  <td className="p-4 text-right text-muted-foreground">{new Date(h.created_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
