"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, Save, ToggleLeft, ToggleRight, ArrowLeft } from "lucide-react";
import { systemService, GeneralSettings, FeatureFlag } from "@/services/systemService";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const [sett, flg] = await Promise.all([
      systemService.getGeneralSettings(),
      systemService.getFeatureFlags(),
    ]);
    setSettings(sett);
    setFlags(flg);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    await systemService.updateGeneralSettings(settings);
    setMsg("✓ Settings saved and audit logged.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleToggleFlag = async (id: string, current: boolean) => {
    await systemService.toggleFeatureFlag(id, !current);
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !current } : f));
    setMsg(`✓ Flag "${id}" updated successfully.`);
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
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
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
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 text-xs font-bold">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/system/general" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      {settings && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* General Metadata form */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
            <h2 className="font-black text-sm text-foreground">General settings</h2>
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Platform Name</label>
                <input value={settings.platform_name} onChange={e => setSettings({ ...settings, platform_name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Platform Description</label>
                <textarea value={settings.platform_description} onChange={e => setSettings({ ...settings, platform_description: e.target.value })} rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Support Email</label>
                  <input value={settings.support_email} onChange={e => setSettings({ ...settings, support_email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Support Phone</label>
                  <input value={settings.support_phone} onChange={e => setSettings({ ...settings, support_phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
                </div>
              </div>
            </div>
            <button onClick={handleSaveSettings}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-black hover:opacity-90 transition-opacity flex items-center gap-1.5 mt-2">
              <Save className="w-4 h-4" /> Save Brand Details
            </button>
          </div>

          {/* Feature flags */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h2 className="font-black text-sm text-foreground">Feature Flags</h2>
            <p className="text-[10px] text-muted-foreground">Toggle platform modules dynamically without any deployments.</p>
            <div className="space-y-3">
              {flags.map(flag => (
                <div key={flag.id} className="flex justify-between items-center p-3.5 rounded-2xl border border-border/60 bg-background/25 text-xs font-semibold">
                  <div>
                    <span className="font-bold text-foreground block">{flag.name}</span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">{flag.description}</span>
                  </div>
                  <button onClick={() => handleToggleFlag(flag.id, flag.enabled)}
                    className={`p-1 rounded-full transition-colors ${flag.enabled ? "text-primary" : "text-muted-foreground"}`}>
                    {flag.enabled ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
