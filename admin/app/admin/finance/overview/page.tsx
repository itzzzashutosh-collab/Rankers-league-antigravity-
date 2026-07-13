"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, Wallet, DollarSign, CreditCard, ArrowDownToLine,
  Users, RefreshCw, ChevronRight, Trophy, AlertCircle, CircleDot,
  BadgeIndianRupee, BarChart2
} from "lucide-react";
import { financeService } from "@/services/financeService";

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function KpiCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub?: string; icon: any; accent: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/20 p-5 space-y-3 hover:border-${accent}-500/30 transition-all group`}>
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl bg-${accent}-500/10 border border-${accent}-500/20`}>
          <Icon className={`w-4 h-4 text-${accent}-400`} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Live</span>
      </div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-xl font-black text-foreground mt-0.5">{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function FinanceOverview() {
  const [overview, setOverview] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [ov, coll] = await Promise.all([
      financeService.getRevenueOverview(),
      financeService.getContestCollections(),
    ]);
    setOverview(ov);
    setCollections(coll);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const navLinks = [
    { label: "Transactions", href: "/admin/finance/transactions", icon: BarChart2 },
    { label: "Withdrawals", href: "/admin/finance/withdrawals", icon: ArrowDownToLine },
    { label: "Prize Distribution", href: "/admin/finance/prize-distribution", icon: Trophy },
    { label: "Refunds", href: "/admin/finance/refunds", icon: AlertCircle },
    { label: "Wallet", href: "/admin/finance/wallet", icon: Wallet },
    { label: "Subscriptions", href: "/admin/finance/subscriptions", icon: CreditCard },
    { label: "Platform Fees", href: "/admin/finance/platform-fees", icon: BadgeIndianRupee },
    { label: "Reports", href: "/admin/finance/reports", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Financial Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time financial operations — revenue, payouts, withdrawals, subscriptions.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {navLinks.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-border/60 bg-card/10 hover:bg-primary/5 hover:border-primary/20 transition-all text-center group">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
          </Link>
        ))}
      </div>

      {/* KPI Grid */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Gross Revenue" value={formatINR(overview.grossRevenue)} sub="All-time" icon={TrendingUp} accent="emerald" />
          <KpiCard label="Platform Earnings" value={formatINR(overview.platformEarnings)} sub="Net after prize pool" icon={DollarSign} accent="primary" />
          <KpiCard label="Total Prize Pool" value={formatINR(overview.totalPrizePool)} sub="Distributed to winners" icon={Trophy} accent="amber" />
          <KpiCard label="Pending Withdrawals" value={formatINR(overview.pendingWithdrawals)} sub="Awaiting approval" icon={ArrowDownToLine} accent="destructive" />
          <KpiCard label="Active Subscriptions" value={overview.activeSubscriptions.toLocaleString()} sub="Paid plans" icon={CreditCard} accent="cyan" />
          <KpiCard label="Today Revenue" value={formatINR(overview.todayRevenue)} sub="Platform fees collected" icon={CircleDot} accent="violet" />
          <KpiCard label="Month Revenue" value={formatINR(overview.monthRevenue)} sub="Current month gross" icon={BarChart2} accent="emerald" />
          <KpiCard label="Net Revenue" value={formatINR(overview.netRevenue)} sub="After prize distribution" icon={Wallet} accent="primary" />
        </div>
      )}

      {/* Contest Revenue Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border/40">
          <h2 className="font-black text-sm text-foreground">Contest Revenue Breakdown</h2>
          <Link href="/admin/finance/transactions" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-4">Contest</th>
                <th className="p-4 text-right">Participants</th>
                <th className="p-4 text-right">Entry Fee</th>
                <th className="p-4 text-right">Gross</th>
                <th className="p-4 text-right">Platform Fee</th>
                <th className="p-4 text-right">Prize Pool</th>
                <th className="p-4 text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-card/20 transition-colors font-semibold">
                  <td className="p-4">
                    <div className="font-bold text-foreground max-w-xs truncate">{c.contest_title}</div>
                    <div className="text-[9px] text-muted-foreground">{c.id?.slice(0, 8)}...</div>
                  </td>
                  <td className="p-4 text-right text-muted-foreground">{c.total_participants?.toLocaleString()}</td>
                  <td className="p-4 text-right text-muted-foreground">{formatINR(c.entry_fee)}</td>
                  <td className="p-4 text-right font-bold text-foreground">{formatINR(c.gross_collection)}</td>
                  <td className="p-4 text-right text-amber-400">{formatINR(c.platform_fee_amount)} <span className="text-muted-foreground font-normal">({c.platform_fee_pct}%)</span></td>
                  <td className="p-4 text-right text-primary">{formatINR(c.prize_pool)}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">{formatINR(c.net_profit)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/20 font-black text-xs border-t border-border/60">
                <td className="p-4 text-foreground">Total</td>
                <td className="p-4 text-right text-muted-foreground">{collections.reduce((s, c) => s + (c.total_participants || 0), 0).toLocaleString()}</td>
                <td className="p-4" />
                <td className="p-4 text-right text-foreground">{formatINR(collections.reduce((s, c) => s + c.gross_collection, 0))}</td>
                <td className="p-4 text-right text-amber-400">{formatINR(collections.reduce((s, c) => s + c.platform_fee_amount, 0))}</td>
                <td className="p-4 text-right text-primary">{formatINR(collections.reduce((s, c) => s + c.prize_pool, 0))}</td>
                <td className="p-4 text-right text-emerald-400">{formatINR(collections.reduce((s, c) => s + c.net_profit, 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
