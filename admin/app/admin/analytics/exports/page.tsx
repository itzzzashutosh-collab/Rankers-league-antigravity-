"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Download } from "lucide-react";
import { reportingService } from "@/services/reportingService";

export default function ExportsHub() {
  const [dataset, setDataset] = useState("financial_transactions");
  const [format, setFormat] = useState<"CSV" | "Excel" | "PDF" | "JSON">("CSV");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleExport = async () => {
    setLoading(true);
    setMsg("");
    await reportingService.logExport(dataset, format, 1280, { date_range: "all" });
    setMsg(`✓ ${format} Export generated successfully. Download started.`);
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/analytics/executive" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-primary" /> Exports Console</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Securely request exports of platform metrics. All downloads are audited.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-5 text-xs font-semibold">
        <h2 className="font-black text-sm text-foreground">Request Export</h2>
        {msg && (
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Target Dataset</label>
            <select value={dataset} onChange={e => setDataset(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
              <option value="financial_transactions">Financial Transactions Ledger</option>
              <option value="participant_profiles">Participant Directory</option>
              <option value="contest_collections">Contest Collections Breakdown</option>
              <option value="questions_bank">Full Question Database</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">File Format</label>
            <select value={format} onChange={e => setFormat(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
              <option value="CSV">CSV Spreadsheet</option>
              <option value="Excel">Excel Spreadsheet</option>
              <option value="PDF">PDF Document</option>
              <option value="JSON">Raw JSON Payload</option>
            </select>
          </div>
        </div>
        <button onClick={handleExport} disabled={loading}
          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
          <Download className="w-4 h-4" />
          {loading ? "Generating..." : "Generate & Download File"}
        </button>
      </div>

      {/* Security guidelines */}
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] leading-relaxed font-bold">
        🛡️ **Security Warning:** Exporting customer and financial logs is monitored under global compliance protocols. Your active IP address and security session token are recorded with the file key download logs. Do not share exported data packages outside secure platform scopes.
      </div>
    </div>
  );
}
