"use client";

import * as React from "react";
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, CheckCircle2, DollarSign } from "lucide-react";

interface TransactionItem {
  id: string;
  aspirantName: string;
  type: "deposit" | "prize_payout" | "entry_fee" | "refund";
  amount: number;
  currency: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

export default function FinancialWalletPage() {
  const [transactions] = React.useState<TransactionItem[]>([
    {
      id: "tx1",
      aspirantName: "Aarav Sharma",
      type: "prize_payout",
      amount: 21437,
      currency: "INR",
      timestamp: new Date().toISOString(),
      status: "success",
    },
    {
      id: "tx2",
      aspirantName: "Diya Patel",
      type: "deposit",
      amount: 500,
      currency: "INR",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "success",
    },
    {
      id: "tx3",
      aspirantName: "Rohan Verma",
      type: "entry_fee",
      amount: 149,
      currency: "INR",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "success",
    },
    {
      id: "tx4",
      aspirantName: "Priya Nair",
      type: "refund",
      amount: 99,
      currency: "INR",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: "success",
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>Financial & Wallet Master Ledger</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Audit deposit transactions, prize payout allocations, and auto-refund ledgers across all contest leagues.
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gross Deposits</span>
          <div className="text-2xl font-black font-mono text-emerald-400">₹14,25,000</div>
          <span className="text-[11px] text-muted-foreground">Total student wallet deposits</span>
        </div>
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Payouts Distributed</span>
          <div className="text-2xl font-black font-mono text-violet-400">₹9,97,500</div>
          <span className="text-[11px] text-muted-foreground">Prizes credited to student wallets</span>
        </div>
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform Net Revenue</span>
          <div className="text-2xl font-black font-mono text-primary">₹4,27,500</div>
          <span className="text-[11px] text-muted-foreground">30% platform margin retained</span>
        </div>
      </div>

      {/* Transactions Audit Ledger */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black font-heading">Real-Time Transaction Audit Trail</h2>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Ledger Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Transaction ID</th>
                <th className="pb-3 px-3">Aspirant</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-foreground">
                    {tx.id}
                  </td>
                  <td className="py-4 px-3 font-bold text-foreground">
                    {tx.aspirantName}
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-md border ${
                        tx.type === "prize_payout"
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : tx.type === "deposit"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : tx.type === "refund"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-secondary text-muted-foreground border-border/30"
                      }`}
                    >
                      {tx.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-3 font-mono font-black text-foreground">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-3 text-muted-foreground font-mono text-[11px]">
                    {new Date(tx.timestamp).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Settled
                    </span>
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
