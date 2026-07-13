"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Shield, Cpu, Users, Award, BookOpen, FileText,
  DollarSign, Wallet, Star, CheckSquare, Trophy, BarChart2, Bell,
  Settings, Activity, Database, LogOut, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Layers, Terminal
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  subItems?: Array<{ name: string; path: string }>;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const sidebarCategories: SidebarCategory[] = [
    {
      title: "Workspace",
      items: [
        { name: "Overview", path: "/admin/overview", icon: LayoutDashboard },
        { name: "AI OS Hub", path: "/admin/agents", icon: Cpu }
      ]
    },
    {
      title: "Contest",
      items: [
        {
          name: "Contests List",
          path: "/admin/contests",
          icon: Award,
          subItems: [
            { name: "All Contests", path: "/admin/contests" },
            { name: "Contest Calendar", path: "/admin/contests/calendar" },
            { name: "Templates & Presets", path: "/admin/contests/templates" },
            { name: "Create Arena", path: "/admin/contests/create" },
          ]
        },
        {
          name: "Paper Builder",
          path: "/admin/papers",
          icon: FileText,
          subItems: [
            { name: "All Blueprints", path: "/admin/papers" },
            { name: "Blueprint Creator", path: "/admin/papers/create" },
            { name: "Paper Templates", path: "/admin/papers/templates" },
          ]
        }
      ]
    },
    {
      title: "Questions",
      items: [
        {
          name: "Question Bank",
          path: "/admin/question-bank",
          icon: BookOpen,
          subItems: [
            { name: "All Questions", path: "/admin/question-bank" },
            { name: "Review Queue", path: "/admin/question-bank/review" },
            { name: "Import Bank", path: "/admin/question-bank/import" },
          ]
        }
      ]
    },
    {
      title: "Students",
      items: [
        { name: "Users Directory", path: "/admin/participants", icon: Users }
      ]
    },
    {
      title: "Finance",
      items: [
        {
          name: "Finance Panel",
          path: "/admin/finance/overview",
          icon: DollarSign,
          subItems: [
            { name: "Command Center", path: "/admin/finance/overview" },
            { name: "Withdrawals Desk", path: "/admin/finance/withdrawals" },
            { name: "Winner Payouts", path: "/admin/finance/prize-distribution" },
            { name: "Refund Desk", path: "/admin/finance/refunds" },
            { name: "Wallet Explorer", path: "/admin/finance/wallet" },
          ]
        }
      ]
    },
    {
      title: "Marketing",
      items: [
        {
          name: "Outreach Desk",
          path: "/admin/communication/automation",
          icon: Bell,
          subItems: [
            { name: "Outreach Desk", path: "/admin/communication/automation" },
            { name: "Campaign Dispatcher", path: "/admin/communication/campaigns" },
            { name: "Workflow Canvas", path: "/admin/communication/workflows" },
          ]
        }
      ]
    },
    {
      title: "AI & System",
      items: [
        {
          name: "System Settings",
          path: "/admin/system/general",
          icon: Settings,
          subItems: [
            { name: "General Brand", path: "/admin/system/general" },
            { name: "Platform Rules", path: "/admin/system/platform" },
            { name: "Anomalies Monitor", path: "/admin/system/security" },
          ]
        }
      ]
    },
    {
      title: "Analytics",
      items: [
        { name: "Metrics Dashboard", path: "/admin/analytics", icon: BarChart2 }
      ]
    },
    {
      title: "Engineering",
      items: [
        { name: "Evaluation Desk", path: "/admin/evaluation", icon: CheckSquare },
        { name: "Results & Rankings", path: "/admin/results", icon: Trophy }
      ]
    },
    {
      title: "Founder Control",
      items: [
        { name: "Audit Trail", path: "/admin/audit-logs", icon: Activity },
        { name: "System Status", path: "/admin/status", icon: Database }
      ]
    }
  ];

  // Auto-expand active sub-menus
  useEffect(() => {
    sidebarCategories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.subItems) {
          const isSubActive = item.subItems.some(sub => pathname === sub.path);
          if (isSubActive) {
            setExpanded(prev => ({ ...prev, [item.name]: true }));
          }
        }
      });
    });
  }, [pathname]);

  const toggleGroup = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-60 border-r border-border bg-card/15 flex flex-col h-full shrink-0 overflow-y-auto font-sans">
      {/* Brand logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border/40 shrink-0 justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-black text-xs tracking-tight text-foreground uppercase">
            Ranker's League
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-4 scrollbar-thin">
        {sidebarCategories.map((category) => (
          <div key={category.title} className="space-y-1">
            <h3 className="text-[8px] font-black tracking-widest text-muted-foreground/60 uppercase px-2 mb-1.5">
              {category.title}
            </h3>

            <div className="space-y-0.5">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isParentActive = pathname.startsWith(item.path);
                const hasSubs = !!item.subItems;
                const isGroupOpen = !!expanded[item.name];

                return (
                  <div key={item.path} className="space-y-0.5">
                    <div className="flex items-center justify-between w-full">
                      <Link
                        href={item.path}
                        className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors relative text-xs ${
                          isParentActive ? "text-foreground bg-muted/65 font-bold" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                        <span className="text-[11px] font-medium tracking-tight whitespace-nowrap overflow-hidden text-left flex-1">
                          {item.name}
                        </span>
                      </Link>

                      {hasSubs && (
                        <button
                          onClick={(e) => toggleGroup(item.name, e)}
                          className="p-1 mr-1 rounded hover:bg-muted/40 text-muted-foreground transition-colors shrink-0"
                        >
                          {isGroupOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* Sub items dropdown */}
                    <AnimatePresence>
                      {hasSubs && isGroupOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          className="overflow-hidden pl-5 space-y-0.5 border-l border-border/20 ml-4"
                        >
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.path;
                            return (
                              <Link
                                key={sub.path}
                                href={sub.path}
                                className={`w-full flex items-center py-1 px-2.5 rounded-md text-[10px] tracking-tight transition-colors ${
                                  isSubActive ? "text-primary font-bold bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout profile action */}
      <div className="p-3 border-t border-border/40 shrink-0">
        <Link
          href="/admin/login"
          onClick={() => localStorage.removeItem("admin-token")}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-xs"
        >
          <LogOut className="w-3.5 h-3.5 text-destructive shrink-0" />
          <span className="text-[11px] font-medium tracking-tight text-left">Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
