"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, RefreshCw, Send, AlertCircle, XCircle } from "lucide-react";
import { communicationService, QueueItem } from "@/services/communicationService";

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  Processing: "text-primary border-primary/20 bg-primary/5",
  Delivered: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Failed: "text-destructive border-destructive/20 bg-destructive/5",
  Cancelled: "text-muted-foreground border-border bg-muted/5",
};

export default function QueueMonitorPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await communicationService.getQueue(statusFilter);
    setQueue(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleRetry = async (id: string) => {
    await communicationService.retryMessage(id);
    setMsg("✓ Message status reset to Pending. Dispatch trigger sent.");
    setTimeout(() => setMsg(""), 3000);
    await load();
  };

  const handleCancel = async (id: string) => {
    await communicationService.cancelMessage(id);
    setMsg("✓ Message delivery cancelled.");
    setTimeout(() => setMsg(""), 3000);
    await load();
  };

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
            <Bell className="w-5 h-5 text-primary" /> Message Queue Monitor
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">Real-time status of outgoing emails, SMS, WhatsApp triggers, and API delivery retries.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold font-sans">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/communication/queue" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold font-sans">{msg}</div>
      )}

      {/* Filters */}
      <div className="flex gap-2 text-xs font-bold font-sans">
        {["all", "Pending", "Processing", "Delivered", "Failed", "Cancelled"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`h-8 px-3 rounded-xl border transition-all capitalize ${statusFilter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="overflow-x-auto text-[10px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60 font-sans">
                <th className="p-3">Address</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Message Body</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Retry</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold font-sans">Loading Queue Log...</td></tr>
              ) : queue.map(q => (
                <tr key={q.id} className="hover:bg-card/25 transition-colors font-semibold">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">{q.recipient_address}</span>
                    <span className="text-[8px] text-muted-foreground font-mono block">{q.id.slice(0, 12)}</span>
                  </td>
                  <td className="p-3 text-foreground font-bold font-sans">{q.channel}</td>
                  <td className="p-3 text-muted-foreground max-w-sm truncate">{q.body}</td>
                  <td className="p-3 text-center">
                    <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[q.status] || ""}`}>{q.status}</span>
                  </td>
                  <td className="p-3 text-center text-muted-foreground">{q.retry_count}</td>
                  <td className="p-3 text-center font-sans">
                    {q.status === "Failed" && (
                      <button onClick={() => handleRetry(q.id)}
                        className="p-1 rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary/20 transition-colors" title="Retry">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {q.status === "Pending" && (
                      <button onClick={() => handleCancel(q.id)}
                        className="p-1 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/15 transition-colors" title="Cancel">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
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
