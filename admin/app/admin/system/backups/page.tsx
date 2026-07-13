"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, FolderDown, Download, CheckCircle2 } from "lucide-react";
import { devopsService, BackupItem } from "@/services/devopsService";

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await devopsService.getBackupHistory();
    setBackups(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { setMsg("❌ Backup label is required."); return; }
    setLoading(true);
    const res = await devopsService.createBackupSnapshot(name);
    setBackups(prev => [res, ...prev]);
    setMsg("✓ Manual SQL backup checkpoint created successfully.");
    setName("");
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

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
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Platform Operating Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">Control the complete Ranker's League system without altering any source code files.</p>
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
              href === "/admin/system/backups" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold font-sans">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Backup Creator */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><FolderDown className="w-4 h-4 text-primary" /> Create Backup Point</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Backup Identifier Label</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. PRE_MIGRATION_24"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <button onClick={handleCreate}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity">
              Trigger SQL Backup Snapshot
            </button>
          </div>
        </div>

        {/* Backup list history */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2 font-sans">
            <h2 className="font-black text-sm text-foreground">Backup Snapshot History</h2>
          </div>
          <div className="overflow-x-auto text-[10px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="p-3">File Snapshot</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {backups.map(b => (
                  <tr key={b.id} className="hover:bg-card/25 transition-colors">
                    <td className="p-3 font-bold text-foreground truncate max-w-xs">{b.backup_name}</td>
                    <td className="p-3 text-muted-foreground">{fmtBytes(b.backup_size_bytes)}</td>
                    <td className="p-3">
                      <span className="text-[8px] font-black border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{b.status}</span>
                    </td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(b.created_at).toLocaleTimeString("en-IN")}</td>
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
