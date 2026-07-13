"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { refundService, RefundRequest } from "@/services/refundService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  "Under Review": "text-primary border-primary/20 bg-primary/5",
  Approved: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Rejected: "text-destructive border-destructive/20 bg-destructive/5",
  Completed: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
};

const PRIORITY_COLORS: Record<string, string> = {
  "Critical": "text-destructive border-destructive/20 bg-destructive/5",
  "High": "text-amber-400 border-amber-500/20 bg-amber-500/5",
  "Normal": "text-muted-foreground border-border/60",
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await refundService.getRefunds();
    setRefunds(data);
    if (data.length > 0) setSelected(data[0]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const r = refunds.find(x => x.id === id);
    if (!r) return;
    if (!confirm(`${action.toUpperCase()} refund of ${fmt(r.amount)} for @${r.participant_username}?`)) return;

    if (action === "approve") {
      await refundService.approveRefund(id);
      setRefunds(prev => prev.map(x => x.id === id ? { ...x, status: "Approved" as any } : x));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: "Approved" as any } : null);
    } else {
      const reason = prompt("Enter rejection reason:") || "Admin decision";
      await refundService.rejectRefund(id, reason);
      setRefunds(prev => prev.map(x => x.id === id ? { ...x, status: "Rejected" as any } : x));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: "Rejected" as any } : null);
    }
    setActionMsg("✓ Action executed and audit logged.");
    setTimeout(() => setActionMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><AlertCircle className="w-5 h-5 text-primary" /> Refund Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Review and process participant refund requests.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{actionMsg}</div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* List */}
        <aside className="col-span-5 space-y-2 overflow-y-auto max-h-[70vh] pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground animate-pulse font-bold">Loading Refunds...</div>
          ) : refunds.map(r => (
            <button key={r.id} onClick={() => setSelected(r)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all text-xs font-semibold ${selected?.id === r.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"}`}>
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-foreground truncate flex-1">@{r.participant_username}</span>
                <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase ${STATUS_COLORS[r.status] || ""}`}>{r.status}</span>
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{r.contest_title}</div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{new Date(r.submitted_at).toLocaleDateString("en-IN")}</span>
                <span className="font-black text-foreground">{fmt(r.amount)}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Detail panel */}
        <section className="col-span-7">
          {selected ? (
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-6 h-full text-xs font-semibold">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="font-black text-base text-foreground">Refund Request</h2>
                  <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[selected.status] || ""}`}>{selected.status}</span>
                </div>
                <span className="text-xl font-black text-foreground">{fmt(selected.amount)}</span>
              </div>

              <div className="space-y-3 border-t border-border/20 pt-4">
                {[
                  ["Participant", `@${selected.participant_username}`],
                  ["Contest", selected.contest_title],
                  ["Reason", selected.reason],
                  ["Submitted", new Date(selected.submitted_at).toLocaleString("en-IN")],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-border/10 pb-2 last:border-0">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="text-foreground font-bold text-right">{value}</span>
                  </div>
                ))}
              </div>

              {(selected.status === "Pending" || selected.status === "Under Review") && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleAction(selected.id, "approve")}
                    className="flex-1 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 font-bold transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve Refund
                  </button>
                  <button onClick={() => handleAction(selected.id, "reject")}
                    className="flex-1 h-10 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive font-bold transition-all flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs rounded-3xl border border-dashed border-border">Select a refund to review</div>
          )}
        </section>
      </div>
    </div>
  );
}
