"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownToLine, RefreshCw, CheckCircle2, XCircle, PauseCircle } from "lucide-react";
import { withdrawalService, WithdrawalRequest } from "@/services/withdrawalService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  "Under Review": "text-primary border-primary/20 bg-primary/5",
  Approved: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Processing: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  Completed: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Rejected: "text-destructive border-destructive/20 bg-destructive/5",
  "On Hold": "text-orange-400 border-orange-500/20 bg-orange-500/5",
};

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await withdrawalService.getWithdrawals(statusFilter);
    setWithdrawals(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleAction = async (id: string, action: "approve" | "reject" | "hold") => {
    const w = withdrawals.find(x => x.id === id);
    if (!w) return;
    if (!confirm(`${action.toUpperCase()} withdrawal of ${fmt(w.amount)} for @${w.participant_username}?`)) return;

    if (action === "approve") {
      await withdrawalService.approveWithdrawal(id);
      setWithdrawals(prev => prev.map(x => x.id === id ? { ...x, status: "Approved" as any } : x));
    } else if (action === "reject") {
      const reason = prompt("Enter rejection reason:") || "Admin review";
      await withdrawalService.rejectWithdrawal(id, reason);
      setWithdrawals(prev => prev.map(x => x.id === id ? { ...x, status: "Rejected" as any } : x));
    } else {
      await withdrawalService.holdWithdrawal(id);
      setWithdrawals(prev => prev.map(x => x.id === id ? { ...x, status: "On Hold" as any } : x));
    }
    setActionMsg(`✓ Action executed and audit logged.`);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const pendingCount = withdrawals.filter(w => w.status === "Pending" || w.status === "Under Review").length;
  const pendingTotal = withdrawals.filter(w => w.status === "Pending" || w.status === "Under Review").reduce((s, w) => s + w.amount, 0);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><ArrowDownToLine className="w-5 h-5 text-primary" /> Withdrawal Operations</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Review and process participant withdrawal requests.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-1">
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Pending Review</span>
          <span className="text-xl font-black text-amber-400">{pendingCount}</span>
          <span className="text-[10px] text-muted-foreground block">Total: {fmt(pendingTotal)}</span>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Approved Today</span>
          <span className="text-xl font-black text-emerald-400">{withdrawals.filter(w => w.status === "Approved").length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card/10 space-y-1">
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Total Requests</span>
          <span className="text-xl font-black text-foreground">{withdrawals.length}</span>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{actionMsg}</div>
      )}

      {/* Filter */}
      <div className="flex gap-2 text-xs font-bold">
        {["all", "Pending", "Under Review", "Approved", "Rejected", "On Hold"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`h-8 px-3 rounded-xl border transition-all capitalize ${statusFilter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Withdrawal Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-4">Participant</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Submitted</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold">Loading...</td></tr>
              ) : withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-card/20 transition-colors font-semibold">
                  <td className="p-4">
                    <span className="font-bold text-foreground">@{w.participant_username}</span>
                    <span className="text-[9px] text-muted-foreground block font-mono">{w.id.slice(0, 12)}</span>
                  </td>
                  <td className="p-4 text-right font-black text-foreground">{fmt(w.amount)}</td>
                  <td className="p-4 text-muted-foreground">{w.method}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[w.status] || ""}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-[10px]">{new Date(w.submitted_at).toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    {(w.status === "Pending" || w.status === "Under Review") && (
                      <div className="flex gap-1.5 justify-center">
                        <button onClick={() => handleAction(w.id, "approve")}
                          className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Approve">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleAction(w.id, "hold")}
                          className="p-1.5 rounded-lg border border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/20 transition-colors" title="Hold">
                          <PauseCircle className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleAction(w.id, "reject")}
                          className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/15 transition-colors" title="Reject">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
