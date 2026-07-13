"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { financeService } from "@/services/financeService";

const REPORT_TYPES = [
  { value: "daily", label: "Daily Summary" },
  { value: "weekly", label: "Weekly Report" },
  { value: "monthly", label: "Monthly Report" },
  { value: "quarterly", label: "Quarterly Report" },
  { value: "yearly", label: "Annual Report" },
  { value: "contest-wise", label: "Contest-Wise Revenue" },
  { value: "subscription-wise", label: "Subscription Revenue" },
  { value: "prize-wise", label: "Prize Distribution" },
  { value: "withdrawal-wise", label: "Withdrawal Report" },
];

export default function ReportsPage() {
  const [type, setType] = useState("monthly");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const handleGenerate = async () => {
    if (!periodStart || !periodEnd) { setMsg("❌ Please select start and end dates."); return; }
    setGenerating(true);
    setMsg("");
    const [ov, coll, subs] = await Promise.all([
      financeService.getRevenueOverview(),
      financeService.getContestCollections(),
      financeService.getSubscriptionRevenue(),
    ]);
    const report = {
      type,
      period: `${periodStart} to ${periodEnd}`,
      generatedAt: new Date().toISOString(),
      summary: ov,
      contestCollections: coll,
      subscriptions: subs,
    };
    setResult(report);
    setGenerating(false);
    setMsg("✓ Report generated successfully.");
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/finance/overview" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Financial Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Generate financial reports by type and period.</p>
        </div>
      </div>

      {/* Builder */}
      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
        <h2 className="font-black text-sm text-foreground">Report Builder</h2>
        {msg && (
          <div className={`p-3 rounded-xl border text-[10px] font-bold ${msg.startsWith("✓") ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-destructive/20 bg-destructive/5 text-destructive"}`}>
            {msg}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Report Type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
              {REPORT_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Period Start</label>
            <input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Period End</label>
            <input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-black hover:opacity-90 transition-opacity text-xs disabled:opacity-50">
          {generating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Report Output */}
      {result && (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-black text-sm text-foreground">
                {REPORT_TYPES.find(r => r.value === result.type)?.label}
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Period: {result.period} · Generated: {new Date(result.generatedAt).toLocaleString("en-IN")}</p>
            </div>
            <button className="h-9 px-4 rounded-xl border border-border bg-card/50 hover:bg-muted/40 text-xs font-bold flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            {[
              { label: "Gross Revenue", value: fmt(result.summary.grossRevenue) },
              { label: "Platform Earnings", value: fmt(result.summary.platformEarnings) },
              { label: "Prize Pool", value: fmt(result.summary.totalPrizePool) },
              { label: "Pending Withdrawals", value: fmt(result.summary.pendingWithdrawals) },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-background/50 border border-border/60 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold block">{label}</span>
                <span className="font-black text-sm text-foreground mt-0.5 block">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="p-3">Contest</th>
                  <th className="p-3 text-right">Participants</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {result.contestCollections.map((c: any) => (
                  <tr key={c.id} className="font-semibold hover:bg-card/20 transition-colors">
                    <td className="p-3 font-bold text-foreground max-w-xs truncate">{c.contest_title}</td>
                    <td className="p-3 text-right text-muted-foreground">{c.total_participants?.toLocaleString()}</td>
                    <td className="p-3 text-right text-foreground">{fmt(c.gross_collection)}</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{fmt(c.net_profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
