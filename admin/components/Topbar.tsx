"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Search, ShieldCheck, Cpu } from "lucide-react";

export default function Topbar() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card/5 px-6 flex items-center justify-between shrink-0 font-sans">
      {/* Current Workspace Info */}
      <div className="flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-bold text-foreground">
          Ranker's League Workspace
        </span>
      </div>

      {/* Global Command Palette search shortcut */}
      <button
        onClick={() => {
          const event = new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          });
          window.dispatchEvent(event);
        }}
        className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-lg border border-border bg-background/50 hover:bg-muted/40 transition-colors text-muted-foreground text-[10px] w-64 text-left justify-between"
      >
        <span className="flex items-center gap-1.5">
          <Search className="w-3 h-3 text-muted-foreground/60" />
          Search shortcuts...
        </span>
        <kbd className="px-1.5 py-0.5 rounded border border-border/80 bg-muted/40 font-mono text-[8px] text-muted-foreground">
          Ctrl K
        </kbd>
      </button>

      {/* Profile & Theme */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted/40 text-foreground transition-colors"
          title="Toggle system theme colors"
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2 border-l border-border/40 pl-3">
          <div className="w-6.5 h-6.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-black text-primary">A</span>
          </div>
          <div className="hidden sm:block text-left text-[10px]">
            <span className="font-bold text-foreground block">Ashutosh Admin</span>
            <span className="text-[8px] text-primary font-bold block">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
