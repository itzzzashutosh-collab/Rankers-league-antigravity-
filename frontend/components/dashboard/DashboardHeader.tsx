"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Sun, Moon, Menu, Zap, Trophy, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile, EXAM_CATEGORY_LABELS } from "@/types/auth";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  { id: "1", type: "result", title: "Result Published", body: "JEE Main Sprint #002 official result is live!", time: "2h ago", read: false },
  { id: "2", type: "contest", title: "Contest Starting Soon", body: "JEE Main Sprint #003 starts in 2 days.", time: "1d ago", read: false },
  { id: "3", type: "achievement", title: "Achievement Unlocked", body: "Gold Tier Achiever — 2500+ Aura Points!", time: "1d ago", read: true },
  { id: "4", type: "aura", title: "Aura Earned", body: "You earned 320 Aura Points for Gold Tier!", time: "2d ago", read: true },
];

interface DashboardHeaderProps {
  profile: UserProfile;
  onMobileSidebarOpen: () => void;
}

export function DashboardHeader({ profile, onMobileSidebarOpen }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const safeNotifList = Array.isArray(MOCK_NOTIFICATIONS) ? MOCK_NOTIFICATIONS : [];
  const unreadCount = safeNotifList.filter((n) => !n.read).length;
  const examLabel = profile.primary_exam_category
    ? EXAM_CATEGORY_LABELS[profile.primary_exam_category]
    : "Competitor";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const notifIconColor = (type: string) =>
    type === "result" ? "text-emerald-500" :
    type === "contest" ? "text-primary" :
    type === "achievement" ? "text-amber-500" : "text-violet-500";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-border/30">
      {/* Mobile menu button */}
      <button
        onClick={onMobileSidebarOpen}
        className="lg:hidden p-2 rounded-xl hover:bg-muted/30 text-muted-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Welcome text */}
      <div className="hidden sm:block min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{greeting},</p>
        <h2 className="text-sm font-black truncate leading-tight">
          {profile.full_name?.split(" ")[0] || profile.username}
          <span className="ml-1.5 text-xs font-medium text-primary/70">· {examLabel}</span>
        </h2>
      </div>

      {/* Stats pills */}
      <div className="hidden md:flex items-center gap-2 ml-auto">
        {[
          { icon: Trophy, label: `#${profile.national_rank || "—"}`, title: "Rank" },
          { icon: Zap, label: (profile.aura_points || 0).toLocaleString(), title: "Aura" },
          { icon: TrendingUp, label: `${profile.total_contests_joined || 0}`, title: "Contests" },
        ].map(({ icon: Icon, label, title }) => (
          <div key={title} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/20 border border-border/30 rounded-xl">
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-black text-foreground">{label}</span>
            <span className="text-[10px] text-muted-foreground">{title}</span>
          </div>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-xl hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                  <p className="text-sm font-black">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-border/20 max-h-80 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={cn("px-4 py-3 hover:bg-muted/10 transition-colors", !n.read && "bg-primary/3")}>
                      <div className="flex items-start gap-2.5">
                        <div className={cn("mt-0.5 w-2 h-2 rounded-full shrink-0", !n.read ? "bg-primary" : "bg-muted-foreground/30")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{n.body}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border/30 text-center">
                  <p className="text-[10px] text-muted-foreground">UI Preview — Live notifications coming soon</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => router.push("/dashboard/profile")}
          className="shrink-0"
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-xl object-cover border border-border/30" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-xs font-black text-primary">
                {(profile.full_name || "?")[0].toUpperCase()}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search contests, results, achievements..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:block text-[10px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded border border-border/30">ESC</kbd>
              </div>
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">Start typing to search your dashboard</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {["My Contests", "Latest Results", "Achievements", "Profile", "Settings"].map((q) => (
                    <button key={q} className="px-3 py-1.5 bg-muted/20 border border-border/30 rounded-lg text-xs font-medium hover:bg-muted/30 transition-colors text-muted-foreground">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export default DashboardHeader;
