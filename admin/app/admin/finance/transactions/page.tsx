"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, RefreshCw } from "lucide-react";
import { financeService, FinancialTransaction } from "@/services/financeService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const STATUS_COLORS: Record<string, string> = {
  Completed: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Pending: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  Processing: "text-primary border-primary/20 bg-primary/5",
  Failed: "text-destructive border-destructive/20 bg-destructive/5",
  Reversed: "text-muted-foreground border-border bg-muted/5",
};

const TYPE_COLORS: Record<string, string> = {
  "Prize Credit": "text-emerald-400",
  "Contest Entry": "text-primary",
  "Withdrawal": "text-amber-400",
  "Subscription": "text-cyan-400",
  "Refund": "text-destructive",
  "Manual Adjustment": "text-violet-400",
};

export default function TransactionExplorer() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await financeService.getTransactions(typeFilter, statusFilter, search);
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [typeFilter, statusFilter]);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black">Transaction Explorer</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Unified ledger of all financial movements across the platform.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 text-xs font-semibold">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()}
            placeholder="Search reference ID..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-border bg-background/50 focus:outline-none" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="h-9 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
          <option value="all">All Types</option>
          {["Contest Entry","Prize Credit","Wallet Top-up","Withdrawal","Refund","Subscription","Manual Adjustment"].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
          <option value="all">All Status</option>
          {["Pending","Processing","Completed","Failed","Reversed"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={load} className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors flex items-center gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-4">Reference</th>
                <th className="p-4">Type</th>
                <th className="p-4">Source</th>
                <th className="p-4">Destination</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={7} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold">Loading Transactions...</td></tr>
              ) : transactions.map(t => (
                <tr key={t.id} className="hover:bg-card/20 transition-colors font-semibold">
                  <td className="p-4">
                    <span className="font-bold text-foreground font-mono text-[10px]">{t.reference_id || t.id.slice(0, 12)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${TYPE_COLORS[t.transaction_type] || "text-foreground"}`}>{t.transaction_type}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{t.source || "—"}</td>
                  <td className="p-4 text-muted-foreground">{t.destination || "—"}</td>
                  <td className="p-4 text-right font-bold text-foreground">{fmt(t.amount)}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[t.status] || "text-muted-foreground border-border"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-muted-foreground">{new Date(t.created_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
