"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, Terminal, Search } from "lucide-react";
import { devopsService, SystemLog } from "@/services/devopsService";

const LEVEL_COLORS: Record<string, string> = {
  INFO: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  WARN: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  ERROR: "text-destructive border-destructive/20 bg-destructive/5",
};

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [catFilter, setCatFilter] = useState("all");
  const [lvlFilter, setLvlFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await devopsService.getSystemLogs(catFilter, lvlFilter, search);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [catFilter, lvlFilter]);

  const navLinks = [
    { label: "General", href: "/admin/system/general" },
    { label: "Platform Rules", href: "/admin/system/platform" },
    { label: "Security", href: "/admin/system/security" },
    { label: "Role Builder", href: "/admin/system/roles" },
    { label: "Permission Matrix", href: "/admin/system/permissions" },
    { label: "Storage", href: "/admin/system/storage" },
    { label: "Background Workers", href: "/admin/system/jobs" },
    { label: "Logs Console", href: "/admin/system/logs" },
    { label: "Backup Control", href: "/admin/system/backups" },
    { label: "Env Context", href: "/admin/system/environment" },
    { label: "Maintenance", href: "/admin/system/maintenance" },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Platform Operating Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Control the complete Ranker's League system without altering any source code files.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/system/logs" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()}
            placeholder="Search logs message..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-border bg-background/50 focus:outline-none" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="h-9 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
          <option value="all">All Categories</option>
          {["Auth", "Contest", "Wallet", "System", "API"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={lvlFilter} onChange={e => setLvlFilter(e.target.value)}
          className="h-9 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
          <option value="all">All Levels</option>
          {["INFO", "WARN", "ERROR"].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-black text-sm text-foreground">Console Log Output</h2>
        </div>
        <div className="overflow-x-auto font-mono text-[10px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="p-3">Level</th>
                <th className="p-3">Category</th>
                <th className="p-3">Message</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={4} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold">Querying Log Streams...</td></tr>
              ) : logs.map(l => (
                <tr key={l.id} className="hover:bg-card/25 transition-colors font-semibold">
                  <td className="p-3">
                    <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase ${LEVEL_COLORS[l.log_level] || ""}`}>{l.log_level}</span>
                  </td>
                  <td className="p-3 text-foreground font-bold">{l.category}</td>
                  <td className="p-3 text-muted-foreground leading-relaxed max-w-lg truncate">{l.message}</td>
                  <td className="p-3 text-right text-muted-foreground">{new Date(l.created_at).toLocaleTimeString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
