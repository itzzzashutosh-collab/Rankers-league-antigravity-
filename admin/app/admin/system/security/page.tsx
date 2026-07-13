"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, Shield, AlertOctagon, Terminal } from "lucide-react";
import { securityCenterService, AdminSession, SecurityAlert, ApiKey } from "@/services/securityCenterService";

export default function SecurityCenterPage() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const [sess, alrt, ky] = await Promise.all([
      securityCenterService.getAdminSessions(),
      securityCenterService.getSecurityAlerts(),
      securityCenterService.getApiKeys(),
    ]);
    setSessions(sess);
    setAlerts(alrt);
    setKeys(ky);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleTerminate = async (id: string) => {
    if (!confirm("Terminate session? User will be logged out instantly.")) return;
    await securityCenterService.terminateSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    setMsg("✓ Admin session terminated.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleRotate = async (id: string) => {
    if (!confirm("Rotate this API key? Systems relying on the old token will fail immediately.")) return;
    await securityCenterService.rotateApiKey(id);
    setMsg("✓ API Key rotated successfully. Check audit ledger.");
    setTimeout(() => setMsg(""), 3000);
    await load();
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
              href === "/admin/system/security" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Admin Sessions */}
        <div className="lg:col-span-6 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary" /> Active Admin Sessions</h2>
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="p-3.5 rounded-2xl border border-border/60 bg-background/25 flex justify-between items-center text-[10px]">
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground">@{s.admin_username}</span>
                  <span className="text-muted-foreground block">{s.ip_address} · {s.os} ({s.browser})</span>
                </div>
                <button onClick={() => handleTerminate(s.id)}
                  className="h-7 px-3 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive font-bold">
                  Terminate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="lg:col-span-6 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><AlertOctagon className="w-4 h-4 text-destructive" /> Threat Center Anomalies</h2>
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className="p-3.5 rounded-2xl border border-destructive/20 bg-destructive/5 flex items-center gap-3 text-[10px]">
                <AlertOctagon className="w-5 h-5 text-destructive shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <span className="font-bold text-foreground block">{a.alert_type}</span>
                  <span className="text-muted-foreground block">IP: {a.ip_address} · Level: {a.severity}</span>
                </div>
                <span className="text-muted-foreground">{new Date(a.created_at).toLocaleTimeString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal API Keys */}
      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
        <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Terminal className="w-4 h-4 text-primary" /> API Key Integration Registry</h2>
        <div className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="p-4 rounded-2xl border border-border/60 bg-background/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground block">{k.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground block">{k.masked_key}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground">Expires: Never</span>
                <button onClick={() => handleRotate(k.id)}
                  className="h-8 px-4 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-[10px]">
                  Rotate Key
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
