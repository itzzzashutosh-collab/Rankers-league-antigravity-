"use client";

import React from "react";
import Link from "next/link";
import { Settings, ShieldCheck } from "lucide-react";

export default function StagingEnvironmentPage() {
  const envVars = [
    { key: "DATABASE_URL", val: "postgresql://postgres:••••••••••••••••@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" },
    { key: "NEXT_PUBLIC_SUPABASE_URL", val: "https://v••••••••••••••••u.supabase.co" },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", val: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9••••••••••••••••" },
    { key: "JWT_SECRET", val: "d9••••••••••••••••c2" },
  ];

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
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold font-sans">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/system/environment" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Version summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold font-sans">
        {[
          { label: "Active Context", value: "Production/Live" },
          { label: "Platform Version", value: "v2.6.4-release" },
          { label: "Last Deployment", value: "2026-07-09 23:45" },
          { label: "Active Build Number", value: "build_8450_prod" },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-2xl border border-border bg-card/15 space-y-1">
            <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
            <span className="text-sm font-bold text-foreground block">{value}</span>
          </div>
        ))}
      </div>

      {/* Environment Config variables */}
      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
        <h2 className="font-black text-sm text-foreground flex items-center gap-1.5 font-sans"><ShieldCheck className="w-4 h-4 text-primary" /> Environment Context Parameters (Masked)</h2>
        <div className="space-y-3.5">
          {envVars.map(v => (
            <div key={v.key} className="p-3.5 rounded-2xl border border-border/60 bg-background/25 flex flex-col gap-1">
              <span className="text-[9px] text-primary uppercase font-black block font-sans">{v.key}</span>
              <span className="text-[11px] text-muted-foreground break-all select-all font-mono">{v.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
