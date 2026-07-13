"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Layers, Activity, Database, FileText, BarChart3, Settings, Shield, LayoutGrid, Terminal, DollarSign } from "lucide-react";
import "./globals.css";

export default function AiosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: "Founder Dashboard", path: "/agents/ceo", icon: LayoutGrid },
    { name: "Operations Command", path: "/agents/coo", icon: Layers },
    { name: "Engineering Command", path: "/agents/cto", icon: Terminal },
    { name: "Marketing Command", path: "/agents/cmo", icon: BarChart3 },
    { name: "Financial Command", path: "/agents/cfo", icon: DollarSign },
    { name: "Agent Registry", path: "/agents/registry", icon: Cpu },
    { name: "Workflow Canvas", path: "/agents/workflows", icon: Layers },
    { name: "Runtime Monitor", path: "/agents/runtime", icon: Activity },
    { name: "Trust Verifier", path: "/agents/verifier", icon: Shield },
    { name: "Shared Memory", path: "/agents/memory", icon: Database },
    { name: "Prompt Library", path: "/agents/prompts", icon: FileText },
    { name: "Cost Audits", path: "/agents/reports", icon: BarChart3 },
    { name: "System Rules", path: "/agents/settings", icon: Settings },
  ];

  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-card/45 flex flex-col shrink-0 glass-panel">
            <div className="p-5 border-b border-border/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-black text-xs uppercase tracking-wider text-foreground">AIOS Controller</span>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link key={item.path} href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-xs ${
                      active ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main workspace */}
          <main className="flex-1 overflow-y-auto p-8 relative scrollbar-thin">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
