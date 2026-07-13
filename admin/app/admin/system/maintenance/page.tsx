"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, RefreshCw, Radio } from "lucide-react";

export default function MaintenanceModePage() {
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState("Platform undergoing scheduled database updates.");
  const [actionMsg, setActionMsg] = useState("");

  const handleToggle = () => {
    const next = !enabled;
    if (!confirm(`Confirm turning ${next ? "ON" : "OFF"} platform maintenance mode?`)) return;
    setEnabled(next);
    setActionMsg(`✓ Maintenance Mode turned ${next ? "ON" : "OFF"}. Change logged.`);
    setTimeout(() => setActionMsg(""), 3000);
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
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Platform Operating Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Control the complete Ranker's League system without altering any source code files.</p>
        </div>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/system/maintenance" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{actionMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toggle */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 flex flex-col items-center justify-center gap-4 text-center">
          <span className="text-[10px] text-muted-foreground uppercase font-black">Maintenance Mode</span>
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full ${enabled ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-xl font-black text-foreground">{enabled ? "ACTIVE (Maintenance)" : "OFFLINE (Live)"}</span>
          </div>
          <button onClick={handleToggle}
            className={`h-10 px-6 rounded-xl font-bold text-xs transition-colors ${
              enabled ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
            }`}>
            {enabled ? "Set Platform Live" : "Enable Maintenance Mode"}
          </button>
        </div>

        {/* Banner config */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-1.5"><Radio className="w-4 h-4 text-primary" /> Custom Banner Notification Message</h3>
          <div className="space-y-3">
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none resize-none" />
            <div className="text-[9px] text-muted-foreground/60 leading-relaxed">
              Whitelisted IPs bypass the maintenance block page immediately. Access is logged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
