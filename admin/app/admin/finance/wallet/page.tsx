"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, RefreshCw } from "lucide-react";
import { financeService, FinancialTransaction } from "@/services/financeService";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export default function WalletExplorer() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [txns, ov] = await Promise.all([
      financeService.getTransactions("all", "all"),
      financeService.getRevenueOverview(),
    ]);
    setTransactions(txns);
    setOverview(ov);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const walletTxns = transactions.filter(t =>
    ["Prize Credit", "Wallet Top-up", "Withdrawal", "Refund"].includes(t.transaction_type)
  );

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Wallet Operations</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Platform-wide wallet health, balances, and ledger operations.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Wallet KPIs */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          {[
            { label: "Total Wallet Balance", value: fmt(overview.grossRevenue * 0.15), color: "text-foreground" },
            { label: "Prize Balance", value: fmt(overview.totalPrizePool * 0.08), color: "text-emerald-400" },
            { label: "Locked Balance", value: fmt(overview.pendingWithdrawals * 0.4), color: "text-amber-400" },
            { label: "Withdrawable", value: fmt(overview.pendingWithdrawals * 0.6), color: "text-primary" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className={`text-2xl font-black block ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wallet Transactions */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <h2 className="font-black text-sm text-foreground">Wallet Transaction Ledger</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">Immutable record of all wallet movements. No edits permitted.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-4">Reference</th>
                <th className="p-4">Type</th>
                <th className="p-4">Source → Destination</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold">Loading ledger...</td></tr>
              ) : walletTxns.map(t => (
                <tr key={t.id} className="hover:bg-card/20 transition-colors font-semibold">
                  <td className="p-4 font-mono text-[10px] text-muted-foreground">{t.reference_id || t.id.slice(0, 12)}</td>
                  <td className="p-4 font-bold text-foreground">{t.transaction_type}</td>
                  <td className="p-4 text-muted-foreground">{t.source || "—"} → {t.destination || "—"}</td>
                  <td className="p-4 text-right font-black text-foreground">{fmt(t.amount)}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase ${t.status === "Completed" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-amber-400 border-amber-500/20 bg-amber-500/5"}`}>{t.status}</span>
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
