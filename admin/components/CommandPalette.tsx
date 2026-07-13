"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Navigation, Settings, Users, LogOut, Moon, Sun, ArrowRight, RotateCcw, Award, Wallet } from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    }
  };

  const commands: CommandItem[] = [
    {
      id: "overview",
      title: "Navigate to Dashboard Overview",
      category: "Navigation",
      icon: Navigation,
      action: () => router.push("/admin/overview")
    },
    {
      id: "contests",
      title: "View Active Contests",
      category: "Operations",
      icon: Terminal,
      action: () => alert("Contest Management is coming soon in future modules!")
    },
    {
      id: "questions",
      title: "Import Question Bank",
      category: "Operations",
      icon: Settings,
      action: () => alert("Question Bank is coming soon in future modules!")
    },
    {
      id: "create_contest",
      title: "Create Contest Arena",
      category: "Operations",
      icon: Terminal,
      action: () => alert("Contest Creation console is coming soon!")
    },
    {
      id: "publish_results",
      title: "Publish Results & Distribute Prizes",
      category: "Operations",
      icon: Award,
      action: () => alert("Results grader console is coming soon!")
    },
    {
      id: "approve_payout",
      title: "Approve Pending Payout / Withdrawal Request",
      category: "Finance",
      icon: Wallet,
      action: () => alert("Payout approver is coming soon!")
    },
    {
      id: "reset_layout",
      title: "Reset Dashboard Panel Layouts",
      category: "Workspace",
      icon: RotateCcw,
      action: () => {
        localStorage.removeItem("dashboard-layout");
        window.location.reload();
      }
    },
    {
      id: "withdrawals",
      title: "Review Pending Withdrawals",
      category: "Finance",
      icon: Users,
      action: () => alert("Wallet/Withdrawal Management is coming soon in future modules!")
    },
    {
      id: "theme",
      title: "Toggle Theme (Light / Dark)",
      category: "System",
      icon: Moon,
      action: () => {
        toggleTheme();
        alert("Theme updated!");
      }
    },
    {
      id: "logout",
      title: "Log out of Administration Panel",
      category: "System",
      icon: LogOut,
      action: () => {
        localStorage.removeItem("admin-token");
        router.push("/admin/login");
      }
    }
  ];

  // Hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            ref={modalRef}
            className="w-full max-w-xl rounded-2xl overflow-hidden glass-panel border border-border bg-card/90 shadow-2xl"
          >
            {/* Input search */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, users, contests or run commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 rounded border border-border/80 bg-muted/40 font-mono text-[8px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* List commands */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filtered.length > 0 ? (
                filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                        isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg border transition-colors ${
                          isSelected ? "border-primary/20 bg-primary/5 text-primary" : "border-border/60 bg-muted/20"
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className={`text-[11px] font-bold block ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {cmd.title}
                          </span>
                          <span className="text-[9px] text-muted-foreground/80 block">
                            {cmd.category}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <ArrowRight className="w-3.5 h-3.5 text-primary animate-pulse" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground/60">
                  No matching admin tasks or configurations found.
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-4 py-2 bg-muted/30 border-t border-border/40 text-[9px] text-muted-foreground flex items-center justify-between">
              <span>Use arrow keys to navigate, Enter to run actions.</span>
              <span>Press <span className="font-bold">Ctrl+K</span> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
