"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, RefreshCw, Layers } from "lucide-react";
import { communicationService, DeliveryLog } from "@/services/communicationService";

export default function HistoryPage() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await communicationService.getDeliveryLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const navLinks = [
    { label: "Overview", href: "/admin/communication/automation" },
    { label: "Templates", href: "/admin/communication/templates" },
    { label: "Campaigns", href: "/admin/communication/campaigns" },
    { label: "Workflows", href: "/admin/communication/workflows" },
    { label: "Queue", href: "/admin/communication/queue" },
    { label: "History", href: "/admin/communication/history" },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Delivery History Ledger
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">Audit index of all successfully dispatched transaction notifications.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors font-sans">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold font-sans">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/communication/history" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="overflow-x-auto text-[10px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60 font-sans">
                <th className="p-3">Recipient</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Template ID</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={5} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold font-sans">Querying delivery history...</td></tr>
              ) : logs.map(l => (
                <tr key={l.id} className="hover:bg-card/25 transition-colors">
                  <td className="p-3 font-bold text-foreground font-sans">@{l.recipient_username}</td>
                  <td className="p-3 text-foreground font-bold font-sans">{l.channel}</td>
                  <td className="p-3 text-muted-foreground font-mono text-[9px]">{l.template_id || "Campaign"}</td>
                  <td className="p-3">
                    <span className="text-[8px] font-black border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{l.status}</span>
                  </td>
                  <td className="p-3 text-right text-muted-foreground">{new Date(l.delivered_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
