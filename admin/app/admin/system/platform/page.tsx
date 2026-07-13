"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, Save } from "lucide-react";
import { systemService, PlatformConfig } from "@/services/systemService";

export default function PlatformRulesPage() {
  const [configs, setConfigs] = useState<PlatformConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await systemService.getPlatformConfigurations();
    setConfigs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChangeValue = (id: string, val: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, config_value: val } : c));
  };

  const handleSave = async (id: string, val: string) => {
    await systemService.updatePlatformConfiguration(id, val);
    setMsg(`✓ Rule config "${id}" updated in database.`);
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
              href === "/admin/system/platform" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      {/* Editor list */}
      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-5">
        <h2 className="font-black text-sm text-foreground">Rule Parameters Configuration</h2>
        <div className="space-y-4">
          {configs.map(c => (
            <div key={c.id} className="p-4 rounded-2xl border border-border/60 bg-background/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 md:max-w-md">
                <span className="font-mono text-xs font-bold text-foreground block">{c.id}</span>
                <span className="text-[10px] text-muted-foreground block">{c.description}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <input value={c.config_value} onChange={e => handleChangeValue(c.id, e.target.value)}
                  className="h-9 px-3 w-28 text-center text-xs rounded-xl border border-border bg-background focus:outline-none font-bold" />
                <button onClick={() => handleSave(c.id, c.config_value)}
                  className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] hover:opacity-90 transition-opacity flex items-center gap-1">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
