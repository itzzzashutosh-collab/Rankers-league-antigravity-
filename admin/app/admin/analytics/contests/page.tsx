"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Award, RefreshCw } from "lucide-react";
import { financeService } from "@/services/financeService";

export default function ContestAnalytics() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const colls = await financeService.getContestCollections();
    setCollections(colls);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/analytics/executive" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Contest Dynamics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Track contest fill rates, completion ratios, and profit margins.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
        {[
          { label: "Total Contests", value: collections.length.toString() },
          { label: "Average Fill Rate", value: "86.4%", color: "text-primary" },
          { label: "Completion Rate", value: "98.2%", color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
            <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <h2 className="font-black text-sm text-foreground">Operational Success Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-4">Contest</th>
                <th className="p-4 text-right">Fill Rate</th>
                <th className="p-4 text-right">Avg Score</th>
                <th className="p-4 text-right">Avg Duration</th>
                <th className="p-4 text-right">Success Pct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {collections.map(c => (
                <tr key={c.id} className="hover:bg-card/20 transition-colors font-semibold">
                  <td className="p-4 font-bold text-foreground">{c.contest_title}</td>
                  <td className="p-4 text-right text-muted-foreground">88.5%</td>
                  <td className="p-4 text-right text-muted-foreground">72.4 pts</td>
                  <td className="p-4 text-right text-muted-foreground">42.5 min</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">98.5%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
