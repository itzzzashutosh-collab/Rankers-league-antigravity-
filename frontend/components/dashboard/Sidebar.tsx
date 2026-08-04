"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Trophy, BarChart3, Star, User, Settings,
  LogOut, HelpCircle, ChevronLeft, ChevronRight, Shield, X, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile, EXAM_CATEGORY_LABELS } from "@/types/auth";
import { createClient } from "@/utils/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/dashboard/my-contests", icon: Trophy, label: "My Contests" },
  { href: "/dashboard/performance", icon: TrendingUp, label: "Performance" },
  { href: "/dashboard/achievements", icon: Star, label: "Achievements" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  profile: UserProfile;
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

export function Sidebar({ profile, collapsed, onToggle, mobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const examLabel = profile.primary_exam_category
    ? EXAM_CATEGORY_LABELS[profile.primary_exam_category]
    : "Ranker";

  return (
    <motion.aside
      initial={false}
      animate={{ width: mobile ? 260 : collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex flex-col h-screen bg-card/80 backdrop-blur-xl border-r border-border/40 overflow-hidden",
        mobile && "fixed left-0 top-0 z-50 shadow-2xl"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-border/30 shrink-0",
        collapsed && !mobile ? "justify-center py-4 px-3" : "gap-3 px-4 py-4"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {(!collapsed || mobile) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-black text-sm tracking-tight whitespace-nowrap overflow-hidden"
            >
              Ranker&apos;s <span className="text-primary">League</span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Mobile close */}
        {mobile && (
          <button onClick={onToggle} className="ml-auto p-1 hover:bg-muted/30 rounded-lg text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-1 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={mobile ? onToggle : undefined}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200", !active && "group-hover:scale-110")} />
              <AnimatePresence>
                {(!collapsed || mobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip on collapsed */}
              {collapsed && !mobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border/50 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border/30 p-2 space-y-1 shrink-0">
        {/* Support */}
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors group"
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {(!collapsed || mobile) && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Support
              </motion.span>
            )}
          </AnimatePresence>
          {collapsed && !mobile && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border/50 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Support
            </div>
          )}
        </Link>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {(!collapsed || mobile) && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User card */}
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl bg-muted/20 border border-border/30">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-primary">
                  {(profile.full_name || "?")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{profile.full_name?.split(" ")[0]}</p>
              <p className="text-[10px] text-muted-foreground truncate">{examLabel}</p>
            </div>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        {!mobile && (
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </motion.aside>
  );
}
export default Sidebar;
