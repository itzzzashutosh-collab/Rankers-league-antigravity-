"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  Trophy,
  Flame,
  CheckCircle2,
  Calendar,
  Lock,
  Download,
  Share2,
  Printer,
  ChevronRight,
  TrendingUp,
  BookOpen,
  QrCode,
  X,
  FileText,
  Star,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  AchievementCatalogItem,
  BadgeCatalogItem,
  UserCertificate,
  UserStreak,
  AuraTierInfo,
  AuraHistoryEvent,
} from "@/services/auth/achievementsService";

interface AchievementsHubClientProps {
  userId: string;
  initialAchievements: {
    catalog: AchievementCatalogItem[];
    completionPercentage: number;
    totalUnlocked: number;
    totalLocked: number;
    latestAchievement: AchievementCatalogItem | null;
    nextAchievement: AchievementCatalogItem | null;
  };
  initialBadges: BadgeCatalogItem[];
  initialCertificates: UserCertificate[];
  initialStreak: UserStreak;
  initialAura: {
    tierInfo: AuraTierInfo;
    history: AuraHistoryEvent[];
  };
}

export default function AchievementsHubClient({
  userId,
  initialAchievements,
  initialBadges,
  initialCertificates,
  initialStreak,
  initialAura,
}: AchievementsHubClientProps) {
  const [activeTab, setActiveTab] = React.useState<"aura" | "badges" | "achievements" | "certificates">("aura");
  
  // Data states
  const [achievements] = React.useState(initialAchievements);
  const [badges] = React.useState<BadgeCatalogItem[]>(initialBadges);
  const [certificates] = React.useState<UserCertificate[]>(initialCertificates);
  const [streak] = React.useState<UserStreak>(initialStreak);
  const [aura] = React.useState(initialAura);

  // Selected Certificate for Viewer Modal
  const [selectedCert, setSelectedCert] = React.useState<UserCertificate | null>(null);

  // Filters
  const [badgeFilter, setBadgeFilter] = React.useState<string>("all");
  const [achievementFilter, setAchievementFilter] = React.useState<string>("all");

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="grid grid-cols-3 gap-6 pt-6">
          <div className="h-28 bg-muted rounded-xl col-span-2" />
          <div className="h-28 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  // Share handler
  const handleShareCertificate = (cert: UserCertificate) => {
    const url = `${window.location.origin}/profile/certificate/${cert.verification_id}`;
    navigator.clipboard.writeText(url);
    alert("Verification URL copied to clipboard: " + url);
  };

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case "mythic":
        return {
          border: "border-red-500/30",
          bg: "bg-red-950/10",
          text: "text-red-400",
          glow: "shadow-red-500/5",
        };
      case "legendary":
        return {
          border: "border-amber-500/30",
          bg: "bg-amber-950/10",
          text: "text-amber-400",
          glow: "shadow-amber-500/5",
        };
      case "epic":
        return {
          border: "border-purple-500/30",
          bg: "bg-purple-950/10",
          text: "text-purple-400",
          glow: "shadow-purple-500/5",
        };
      case "rare":
        return {
          border: "border-indigo-500/30",
          bg: "bg-indigo-950/10",
          text: "text-indigo-400",
          glow: "shadow-indigo-500/5",
        };
      case "uncommon":
        return {
          border: "border-sky-500/30",
          bg: "bg-sky-950/10",
          text: "text-sky-400",
          glow: "shadow-sky-500/5",
        };
      default:
        return {
          border: "border-zinc-700/40",
          bg: "bg-zinc-950/20",
          text: "text-zinc-400",
          glow: "shadow-black/5",
        };
    }
  };

  // Date parsing
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Streak Activity Checkbox Grid
  const getWeekDays = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const mask = streak.weekly_activity_mask;
    return days.map((day, idx) => {
      // mask is a binary bitmask representation where day indices set flag
      const isActive = (mask & (1 << idx)) !== 0;
      return { day, active: isActive };
    });
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-primary" />
            Aura & Achievement Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build your competitive record, unlock prestigious badges, and download certificates of merit.
          </p>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="border-b border-border/40 pb-px flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: "aura", label: "Aura & Streak Hub", icon: Sparkles },
          { id: "badges", label: "Badges Collection", icon: Award },
          { id: "achievements", label: "Achievements Catalog", icon: Trophy },
          { id: "certificates", label: "Digital Certificates", icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as "aura" | "badges" | "achievements" | "certificates")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px",
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Aura & Streak Hub ── */}
      {activeTab === "aura" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns: Tier Card & Milestones */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tier progression block */}
            <div className={cn(
              "rounded-2xl border p-6 backdrop-blur-md relative overflow-hidden shadow-xl",
              aura.tierInfo.color
            )}>
              <div className="absolute right-6 top-6 opacity-10">
                <Sparkles className="w-24 h-24" />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black opacity-80">Competitive Player Tier</span>
                  <h2 className="text-3xl font-black mt-1">{aura.tierInfo.currentTier}</h2>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-foreground">
                    <span>{initialAura.history.length > 0 ? "Tier Progress" : "Start competing to earn Aura"}</span>
                    {aura.tierInfo.nextTier ? (
                      <span>{aura.tierInfo.remainingAura.toLocaleString()} pts to {aura.tierInfo.nextTier}</span>
                    ) : (
                      <span>Max Tier Reached 🏆</span>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden border border-border/10">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${aura.tierInfo.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>{aura.tierInfo.minAura} Aura</span>
                    <span>{aura.tierInfo.maxAura.toLocaleString()} Aura</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak & Activity Tracker */}
            <div className="bg-card/40 border border-border/40 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Activity & Streaks</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Maintain competitive consistency to secure streak multipliers.</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black">
                  <Flame className="w-4 h-4 animate-bounce" />
                  <span>{streak.current_streak} Day Streak</span>
                </div>
              </div>

              {/* Stats blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/15 border border-border/30 rounded-xl">
                  <span className="text-[9px] text-muted-foreground uppercase font-black">Current Streak</span>
                  <p className="text-base font-black text-foreground mt-0.5">{streak.current_streak} Days</p>
                </div>
                <div className="p-3 bg-muted/15 border border-border/30 rounded-xl">
                  <span className="text-[9px] text-muted-foreground uppercase font-black">Longest Streak</span>
                  <p className="text-base font-black text-foreground mt-0.5">{streak.longest_streak} Days</p>
                </div>
                <div className="p-3 bg-muted/15 border border-border/30 rounded-xl">
                  <span className="text-[9px] text-muted-foreground uppercase font-black">Today status</span>
                  <p className="text-base font-black text-emerald-400 mt-0.5">Active</p>
                </div>
                <div className="p-3 bg-muted/15 border border-border/30 rounded-xl">
                  <span className="text-[9px] text-muted-foreground uppercase font-black">Streak Bonus</span>
                  <p className="text-base font-black text-primary mt-0.5">+10% Aura</p>
                </div>
              </div>

              {/* Weekly mask */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Weekly Activity Logs</p>
                <div className="grid grid-cols-7 gap-2.5">
                  {getWeekDays().map((dayObj) => (
                    <div
                      key={dayObj.day}
                      className={cn(
                        "rounded-xl border p-2.5 text-center transition-all",
                        dayObj.active
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-muted/10 border-border/40 text-muted-foreground"
                      )}
                    >
                      <span className="text-[9px] block font-black">{dayObj.day}</span>
                      <CheckCircle2 className={cn("w-4 h-4 mx-auto mt-1.5", dayObj.active ? "opacity-100" : "opacity-25")} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones Engine */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Next Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "m1", title: "Complete 10 contests", current: streak.current_streak, target: 10, reward: "+300 Aura" },
                  { key: "m2", title: "Complete 25 contests", current: streak.current_streak, target: 25, reward: "+750 Aura" },
                ].map((m) => {
                  const percent = Math.min(100, Math.max(0, Math.round((m.current / m.target) * 100)));
                  return (
                    <div key={m.key} className="p-4 bg-card/30 border border-border/40 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-foreground">{m.title}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Milestone Reward: {m.reward}</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary">{percent}%</span>
                      </div>
                      <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 1 Column: Aura history logs */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Aura History</h3>

            {aura.history.length === 0 ? (
              <div className="p-10 border border-dashed border-border/40 bg-card/10 rounded-2xl text-center text-xs text-muted-foreground">
                No Aura transaction ledger recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {aura.history.slice(0, 7).map((h) => (
                  <div
                    key={h.id}
                    className="p-4 bg-card/20 border border-border/40 rounded-xl flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-bold text-foreground">{h.description}</p>
                      {h.contest_name && (
                        <p className="text-[9px] text-muted-foreground mt-0.5">{h.contest_name}</p>
                      )}
                      <span className="text-[9px] text-muted-foreground block mt-1">{formatDate(h.created_at)}</span>
                    </div>
                    <span className={cn(
                      "font-black text-sm",
                      h.points >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {h.points >= 0 ? "+" : ""}{h.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Badges Collection ── */}
      {activeTab === "badges" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-border/20 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Badges Cabinet</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Review your unlocked digital trophy credentials.</p>
            </div>

            {/* Filter selectors */}
            <div className="flex gap-1.5">
              {[
                { id: "all", label: "All Badges" },
                { id: "unlocked", label: "Unlocked Only" },
                { id: "locked", label: "Locked" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setBadgeFilter(f.id)}
                  className={cn(
                    "px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all",
                    badgeFilter === f.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {badges
              .filter((b) => {
                if (badgeFilter === "unlocked") return b.unlocked;
                if (badgeFilter === "locked") return !b.unlocked;
                return true;
              })
              .map((b) => {
                const config = getRarityStyle(b.rarity);
                const percent = Math.min(100, Math.round((b.current_progress / b.target_value) * 100));

                return (
                  <div
                    key={b.key}
                    className={cn(
                      "rounded-2xl border p-5 bg-card/30 backdrop-blur-sm space-y-4 shadow-xl transition-all duration-200 hover:-translate-y-1 relative",
                      b.unlocked ? config.border : "border-border/40 grayscale opacity-60",
                      config.glow
                    )}
                  >
                    <div className="flex justify-between items-start">
                      {/* Visual Icon circle */}
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border",
                        b.unlocked ? config.bg + " " + config.border : "bg-muted/40 border-border/40"
                      )}>
                        {b.unlocked ? b.icon : <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>

                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-wider",
                        b.unlocked ? config.border + " " + config.text : "border-border/40 text-muted-foreground"
                      )}>
                        {b.rarity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-foreground">{b.title}</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">{b.description}</p>
                    </div>

                    {/* Requirement detail / progress */}
                    <div className="pt-3 border-t border-border/20 space-y-1.5 text-[9px] font-bold">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Requirements: {b.requirements}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {b.unlocked && b.earned_at && (
                        <p className="text-[8px] text-emerald-400 font-bold block pt-1">
                          Unlocked: {formatDate(b.earned_at)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── TAB 3: Achievements Catalog ── */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Achievements Registry</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Completed {achievements.totalUnlocked} of {achievements.catalog.length} milestones. ({achievements.completionPercentage}% completion)
              </p>
            </div>

            {/* Filter selectors */}
            <div className="flex gap-1.5">
              {[
                { id: "all", label: "All Items" },
                { id: "unlocked", label: "Unlocked Only" },
                { id: "locked", label: "Locked Only" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAchievementFilter(f.id)}
                  className={cn(
                    "px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all",
                    achievementFilter === f.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Completion Progress Banner */}
          <div className="p-4 bg-muted/20 border border-border/40 rounded-xl flex items-center justify-between text-xs font-bold">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase font-black block">Completion Progress</span>
              <p className="text-base font-black text-foreground mt-0.5">{achievements.totalUnlocked} Unlocked • {achievements.totalLocked} Locked</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">Aura Earned from Badges</span>
              <p className="text-base font-black text-emerald-400 mt-0.5">
                +{achievements.catalog.filter(a => a.unlocked).reduce((s, a) => s + a.aura_reward, 0)} Aura
              </p>
            </div>
          </div>

          {/* Grid list of achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.catalog
              .filter((item) => {
                if (achievementFilter === "unlocked") return item.unlocked;
                if (achievementFilter === "locked") return !item.unlocked;
                return true;
              })
              .map((item) => {
                const config = getRarityStyle(item.rarity);
                return (
                  <div
                    key={item.key}
                    className={cn(
                      "flex items-center gap-3.5 p-4 border rounded-xl bg-card/20 transition-all shadow-md relative overflow-hidden",
                      item.unlocked ? config.border : "border-border/40 grayscale opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg border shrink-0",
                      item.unlocked ? config.bg + " " + config.border : "bg-muted/30 border-border/40"
                    )}>
                      {item.unlocked ? item.icon : <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-xs font-black text-foreground truncate">{item.title}</p>
                        <span className={cn("text-[7px] font-black uppercase border rounded px-1 tracking-wider shrink-0", item.unlocked ? config.border + " " + config.text : "border-border/40 text-muted-foreground")}>
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{item.description}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                          +{item.aura_reward} Aura
                        </span>
                        {item.unlocked && item.earned_at && (
                          <span className="text-[8px] text-muted-foreground">{formatDate(item.earned_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── TAB 4: Digital Certificates ── */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Verifiable Digital Credentials</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Certificates of merit are generated automatically upon tournament results validation.</p>
          </div>

          {certificates.length === 0 ? (
            <div className="border border-dashed border-border/60 bg-card/10 rounded-2xl p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-foreground">No certificates earned yet</p>
              <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed">
                Rank high or complete national league simulation cups to unlock authenticated credentials.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-2xl border border-border/40 bg-gradient-to-br from-card to-card/30 p-5 space-y-4 hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verifiable
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-foreground">{cert.contest_name}</h4>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">ID: {cert.certificate_number}</p>
                  </div>

                  <div className="space-y-1.5 text-[10px] border-t border-border/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Candidate</span>
                      <span className="font-bold text-foreground">{cert.participant_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ranking Position</span>
                      <span className="font-bold text-foreground">{cert.rank ? `#${cert.rank}` : "N/A (Participant)"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score Secured</span>
                      <span className="font-bold text-foreground">{cert.score || "—"} Marks</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <Button
                      onClick={() => setSelectedCert(cert)}
                      variant="ghost"
                      size="sm"
                      className="text-[10px] font-bold gap-1 text-primary hover:bg-primary/10 px-0"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      View Certificate
                    </Button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShareCertificate(cert)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedCert(null)} />
          
          <div className="relative w-full max-w-2xl bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-primary" />
                Certificate Viewer
              </h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Certificate Frame */}
            <div
              className="border-8 border-double border-primary/30 bg-muted/10 rounded-xl p-8 relative overflow-hidden flex flex-col items-center text-center space-y-6 select-none shadow-inner"
              id="printable-certificate"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.05) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            >
              {/* Graphic watermark background */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/5 rounded-full flex items-center justify-center opacity-5 pointer-events-none">
                <Trophy className="w-24 h-24 text-primary" />
              </div>

              <div className="space-y-1 text-center">
                <h4 className="text-[10px] tracking-widest font-black uppercase text-primary">Ranker&apos;s League</h4>
                <p className="text-[9px] text-muted-foreground font-semibold">National Tournament Arena</p>
              </div>

              <div className="space-y-4 max-w-lg">
                <h2 className="text-xl font-serif font-bold text-foreground">Certificate of Achievement</h2>
                
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This digital credential is proudly awarded to
                </p>
                <h3 className="text-lg font-black text-foreground tracking-tight underline decoration-primary/45 underline-offset-4">
                  {selectedCert.participant_name}
                </h3>
                
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  for competing in the <strong className="text-foreground">{selectedCert.contest_name}</strong> and securing a verified placement of
                </p>

                <div className="inline-block px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-center">
                  <p className="text-xs font-black text-primary">
                    {selectedCert.rank ? `Rank #${selectedCert.rank} Nationally` : "Verified Competitor"}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Score: {selectedCert.score || "—"} Marks</p>
                </div>
              </div>

              {/* Verification & ID */}
              <div className="w-full flex items-end justify-between pt-6 border-t border-border/20 text-left text-[9px] text-muted-foreground font-semibold">
                <div className="space-y-1">
                  <p>Certificate ID: <span className="font-mono text-foreground font-bold">{selectedCert.certificate_number}</span></p>
                  <p>Verification Link: <span className="font-mono text-foreground font-bold">{selectedCert.verification_id}</span></p>
                  <p>Date Issued: {formatDate(selectedCert.created_at)}</p>
                </div>
                
                {/* QR Placeholder */}
                <div className="border border-border bg-card p-1.5 rounded-lg flex items-center gap-1.5">
                  <QrCode className="w-9 h-9 text-foreground" />
                  <div className="text-[7px] leading-tight max-w-[50px] font-bold">
                    Scan to Verify
                  </div>
                </div>
              </div>
            </div>

            {/* Utility actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-grow text-xs font-bold gap-1.5 border-border/60 hover:bg-muted/40"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </Button>
              <Button
                className="flex-grow text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setSelectedCert(null)}
              >
                Close Certificate
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
