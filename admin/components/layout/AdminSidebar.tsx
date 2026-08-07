"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpenCheck,
  Trophy,
  HelpCircle,
  Users,
  Wallet,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Exam Categories", href: "/exams", icon: BookOpenCheck },
  { label: "Contests & Leagues", href: "/contests", icon: Trophy },
  { label: "Question Bank", href: "/question-bank", icon: HelpCircle },
  { label: "Aspirants & Users", href: "/users", icon: Users },
  { label: "Wallet & Financials", href: "/wallet", icon: Wallet },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-card/60 backdrop-blur-xl border-r border-border/40 min-h-screen flex flex-col justify-between p-4 z-30">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 p-0.5 shadow-md shadow-primary/20">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-foreground font-heading">
              Ranker's League
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-black scale-[1.01]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-border/30 px-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Platform Engine
          </span>
          <span className="text-emerald-400 font-mono font-bold">v2.0 Live</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-[10px] text-emerald-400 font-medium">
          <div className="flex items-center gap-1 font-bold mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            70% Threshold Active
          </div>
          Auto-Refund trigger calibrated
        </div>
      </div>
    </aside>
  );
}
