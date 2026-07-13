"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Search,
  CheckCircle,
  Archive,
  Trash2,
  Settings,
  AlertTriangle,
  Info,
  Calendar,
  Wallet,
  Trophy,
  Award,
  Shield,
  Clock,
  Sparkles,
  Smartphone,
  MessageSquare,
  MailOpen,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UserNotification, NotificationPreferences } from "@/services/auth/notificationService";

interface NotificationsDashboardClientProps {
  initialNotifications: UserNotification[];
  initialPreferences: NotificationPreferences;
}

export default function NotificationsDashboardClient({
  initialNotifications,
  initialPreferences,
}: NotificationsDashboardClientProps) {
  const [notifications, setNotifications] = React.useState<UserNotification[]>(initialNotifications);
  const [preferences, setPreferences] = React.useState<NotificationPreferences>(initialPreferences);
  const [activeTab, setActiveTab] = React.useState<"inbox" | "preferences">("inbox");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="grid grid-cols-4 gap-6 pt-6">
          <div className="h-40 bg-muted rounded-xl" />
          <div className="col-span-3 space-y-3">
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Group notifications chronologically
  const groupNotifications = (list: UserNotification[]) => {
    const today: UserNotification[] = [];
    const yesterday: UserNotification[] = [];
    const earlierThisWeek: UserNotification[] = [];
    const older: UserNotification[] = [];

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    list.forEach((n) => {
      const createdDate = new Date(n.created_at);
      const diffMs = now.getTime() - createdDate.getTime();

      if (diffMs < oneDay) {
        today.push(n);
      } else if (diffMs < 2 * oneDay) {
        yesterday.push(n);
      } else if (diffMs < 7 * oneDay) {
        earlierThisWeek.push(n);
      } else {
        older.push(n);
      }
    });

    return { today, yesterday, earlierThisWeek, older };
  };

  // Filter & Search calculation
  const getFilteredNotifications = () => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === "unread") return !n.is_read;
      if (filterType === "read") return n.is_read;

      // Type-based category filters
      if (filterType === "contest") {
        return ["contest_registration", "contest_reminder", "contest_starts_soon", "contest_started"].includes(n.type_id);
      }
      if (filterType === "wallet") {
        return ["prize_credited", "withdrawal_update"].includes(n.type_id);
      }
      if (filterType === "results") {
        return ["result_published", "leaderboard_updated", "certificate_available"].includes(n.type_id);
      }
      if (filterType === "achievements") {
        return ["achievement_unlocked", "aura_earned"].includes(n.type_id);
      }
      if (filterType === "announcements") {
        return ["system_announcement", "platform_update", "maintenance_notice"].includes(n.type_id);
      }
      if (filterType === "security") {
        return n.type_id === "security_alert";
      }

      return true;
    });
  };

  const filteredList = getFilteredNotifications();
  const groups = groupNotifications(filteredList);

  // Trigger individual action endpoint
  const handleAction = async (id: string, actionType: "read" | "archive" | "delete") => {
    try {
      const res = await fetch("/api/auth/notifications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: actionType }),
      });

      if (res.ok) {
        if (actionType === "read") {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
          );
        } else if (actionType === "archive" || actionType === "delete") {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/auth/notifications/read-all", {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
        );
      }
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  // Update preferences
  const handlePreferenceChange = async (key: keyof Omit<NotificationPreferences, "user_id" | "updated_at">) => {
    const updatedVal = !preferences[key];
    const newPrefs = { ...preferences, [key]: updatedVal };
    setPreferences(newPrefs);

    try {
      await fetch("/api/auth/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: updatedVal }),
      });
    } catch (err) {
      console.error("Preferences update failed:", err);
    }
  };

  // Icon mapping
  const getIcon = (typeId: string) => {
    switch (typeId) {
      case "prize_credited":
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case "certificate_available":
        return <Award className="w-4 h-4 text-primary" />;
      case "contest_registration":
        return <Trophy className="w-4 h-4 text-sky-400" />;
      case "aura_earned":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "security_alert":
        return <Shield className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityStyle = (priority: string, isRead: boolean) => {
    if (isRead) return "border-border/30 opacity-75";
    switch (priority) {
      case "critical":
        return "border-rose-500/30 bg-rose-500/5 shadow-sm shadow-rose-500/5";
      case "high":
        return "border-amber-500/30 bg-amber-500/5 shadow-sm shadow-amber-500/5";
      case "low":
        return "border-zinc-800 bg-transparent";
      default:
        return "border-border/40 bg-card/25";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-primary" />
            Communication & Notifications Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with your latest simulator results, registrations, earnings, and security alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setActiveTab("inbox")}
            className={cn(
              "px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeTab === "inbox"
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border/40 text-muted-foreground hover:border-border"
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            Notification Inbox ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={cn(
              "px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeTab === "preferences"
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border/40 text-muted-foreground hover:border-border"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
        </div>
      </div>

      {activeTab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/45 border border-border/45 rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="bg-card/20 border border-border/40 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-2 px-1">
                Filter by Category
              </span>
              {[
                { id: "all", label: "All Notifications" },
                { id: "unread", label: "Unread Only" },
                { id: "read", label: "Read" },
                { id: "contest", label: "Contest Leagues" },
                { id: "wallet", label: "Prize Wallet" },
                { id: "results", label: "Grading & Results" },
                { id: "achievements", label: "Achievements & Aura" },
                { id: "announcements", label: "System Announcements" },
                { id: "security", label: "Security & Alerts" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between font-bold",
                    filterType === f.id
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-muted/15"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inbox Feed list */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center border-b border-border/20 pb-3">
              <span className="text-xs font-black text-foreground uppercase tracking-widest">
                Notification Feed ({filteredList.length})
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {filteredList.length === 0 ? (
              <div className="border border-dashed border-border/40 bg-card/10 rounded-2xl p-16 text-center text-xs text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="font-bold text-foreground">No notifications found</p>
                <p className="text-[10px] mt-1">Try resetting filters or adjusting search queries.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {[
                  { title: "Today", items: groups.today },
                  { title: "Yesterday", items: groups.yesterday },
                  { title: "Earlier This Week", items: groups.earlierThisWeek },
                  { title: "Older", items: groups.older },
                ]
                  .filter((group) => group.items.length > 0)
                  .map((group) => (
                    <div key={group.title} className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 px-1">
                        {group.title}
                      </h3>

                      <div className="space-y-2.5">
                        {group.items.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "border rounded-2xl p-4 flex gap-4 backdrop-blur-sm transition-all duration-200",
                              getPriorityStyle(n.priority, n.is_read)
                            )}
                          >
                            {/* Icon bubble */}
                            <div className="w-8 h-8 rounded-xl bg-muted/40 flex items-center justify-center border shrink-0">
                              {getIcon(n.type_id)}
                            </div>

                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className={cn("text-xs font-black text-foreground truncate", !n.is_read && "font-black text-primary")}>
                                  {n.title}
                                </h4>
                                <span className="text-[8px] font-mono text-muted-foreground whitespace-nowrap">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                                {n.description}
                              </p>

                              {/* Action items */}
                              <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-border/10">
                                {n.action_url ? (
                                  <Link href={n.action_url}>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleAction(n.id, "read")}
                                      className="h-7 text-[9px] font-black uppercase text-primary hover:bg-primary/10 px-0 gap-1"
                                    >
                                      {n.action_label || "View action"}
                                      <ArrowUpRight className="w-3 h-3" />
                                    </Button>
                                  </Link>
                                ) : (
                                  <div />
                                )}

                                <div className="flex items-center gap-1">
                                  {!n.is_read && (
                                    <button
                                      onClick={() => handleAction(n.id, "read")}
                                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                      title="Mark as read"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleAction(n.id, "archive")}
                                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="Archive"
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleAction(n.id, "delete")}
                                    className="p-1 rounded-lg hover:bg-muted text-rose-400 hover:text-rose-600 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Panel */}
      {activeTab === "preferences" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card/20 border border-border/40 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-black text-foreground">Notification Preferences</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle categories to optimize your communications feed.</p>
            </div>

            {/* Topics Checkbox List */}
            <div className="divide-y divide-border/20">
              {[
                { key: "contest_reminders", title: "Contest Reminders", desc: "Get notifications for starts limits and registrations closings." },
                { key: "result_notifications", title: "Result Notifications", desc: "Get notified when exam grade cards are compiled." },
                { key: "prize_notifications", title: "Prize & Wallet Alerts", desc: "Receive real-time alerts on contest winnings credits." },
                { key: "achievement_notifications", title: "Achievements & Aura", desc: "Notify when milestones unlock or Aura tiers increase." },
                { key: "platform_updates", title: "Platform Updates", desc: "Stay informed on dashboard tweaks and new simulator versions." },
                { key: "system_alerts", title: "System & Security Alerts", desc: "Crucial server maintenance and authentication alerts." },
              ].map((topic) => (
                <div key={topic.key} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-xs font-black text-foreground cursor-pointer" htmlFor={topic.key}>
                      {topic.title}
                    </label>
                    <p className="text-[10px] text-muted-foreground leading-normal">{topic.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    id={topic.key}
                    checked={preferences[topic.key as keyof NotificationPreferences] as boolean}
                    onChange={() => handlePreferenceChange(topic.key as keyof Omit<NotificationPreferences, "user_id" | "updated_at">)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Channels */}
          <div className="bg-card/20 border border-border/40 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-black text-foreground">Delivery Channels</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Configure target delivery pathways.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "email_enabled", title: "Email Notifications", icon: Mail, enabled: true },
                { key: "push_enabled", title: "Push Notifications", icon: Smartphone, enabled: false, note: "Future integration" },
                { key: "whatsapp_enabled", title: "WhatsApp Notifications", icon: MessageSquare, enabled: false, note: "Future integration" },
                { key: "sms_enabled", title: "SMS Notifications", icon: Smartphone, enabled: false, note: "Future integration" },
              ].map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.key}
                    className={cn(
                      "p-4 border rounded-xl flex items-center justify-between gap-4",
                      channel.enabled ? "bg-muted/15 border-border/40" : "opacity-50 border-dashed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-card border flex items-center justify-center text-muted-foreground">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black block text-foreground">{channel.title}</span>
                        {channel.note && (
                          <span className="text-[8px] text-muted-foreground uppercase font-bold">{channel.note}</span>
                        )}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      disabled={!channel.enabled}
                      checked={preferences[channel.key as keyof NotificationPreferences] as boolean}
                      onChange={() => handlePreferenceChange(channel.key as keyof Omit<NotificationPreferences, "user_id" | "updated_at">)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
