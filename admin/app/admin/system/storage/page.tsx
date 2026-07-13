"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, HardDrive } from "lucide-react";
import { devopsService } from "@/services/devopsService";

export default function StoragePage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await devopsService.getStorageUsage();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

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
              href === "/admin/system/storage" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Storage volumes */}
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h2 className="font-black text-sm text-foreground flex items-center gap-2"><HardDrive className="w-4 h-4 text-primary" /> Storage Capacity Volumes</h2>
            <div className="space-y-3">
              {[
                ["Database Size", metrics.databaseSize],
                ["Media Bucket Volume", metrics.mediaBucket],
                ["Snapshot Backups Volume", metrics.backupVolume],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border/10 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-black">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Utilization bar */}
          <div className="rounded-3xl border border-border bg-card/15 p-6 flex flex-col justify-center gap-3">
            <span className="text-[10px] text-muted-foreground uppercase font-black">Storage space utilization</span>
            <div className="text-3xl font-black text-foreground">{metrics.utilizationPercentage}%</div>
            <div className="h-3 rounded-full bg-border/40 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${metrics.utilizationPercentage}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground/60">Adequate disk volume available on core Postgres clusters.</p>
          </div>
        </div>
      )}
    </div>
  );
}
