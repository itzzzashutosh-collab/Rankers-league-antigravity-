"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, RefreshCw, FileText } from "lucide-react";
import { reportingService, SavedReport } from "@/services/reportingService";

export default function ReportsDesk() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("financial");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await reportingService.getSavedReports();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!title.trim()) { setMsg("❌ Report title is required."); return; }
    setLoading(true);
    await reportingService.generateReport(title, reportType, {});
    setMsg("✓ Immutable report snapshot created successfully.");
    setTitle("");
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/analytics/executive" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Layers className="w-5 h-5 text-primary" /> Report Desk</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Generate and review immutable operational and financial report snapshots.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creator */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold h-fit">
          <h2 className="font-black text-sm text-foreground">Create Snapshot</h2>
          {msg && (
            <div className={`p-3 rounded-xl border text-[10px] font-bold ${msg.startsWith("✓") ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-destructive/20 bg-destructive/5 text-destructive"}`}>
              {msg}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Report Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Q2 Performance Overview"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
                <option value="financial">Financial Audit</option>
                <option value="contests">Contest Summary</option>
                <option value="participants">User Metrics</option>
                <option value="questions">Item Statistics</option>
              </select>
            </div>
            <button onClick={handleGenerate}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity">
              Generate Report
            </button>
          </div>
        </div>

        {/* Ledger */}
        <div className="md:col-span-2 rounded-3xl border border-border bg-card/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-black text-sm text-foreground">Immutable Reports Archive</h2>
          </div>
          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="p-4">Report</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Generated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-card/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground">{r.title}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">{r.id.slice(0, 12)}...</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full border border-border bg-background/50 text-[10px] capitalize">{r.report_type}</span>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
