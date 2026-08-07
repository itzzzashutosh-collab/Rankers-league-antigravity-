"use client";

import * as React from "react";
import { Search, Bell, Shield, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 shrink-0 border-b border-border/40 bg-card/40 backdrop-blur-xl px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search exams, contests, aspirants..."
          className="w-full bg-background/50 border border-border/40 rounded-xl pl-10 pr-4 py-2 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Master Auth</span>
        </div>

        <button className="w-9 h-9 rounded-xl border border-border/40 bg-background/50 hover:bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-primary absolute top-2 right-2" />
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border/30">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight">Admin Director</span>
            <span className="text-[10px] text-muted-foreground leading-tight">admin@rankersleague.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}
