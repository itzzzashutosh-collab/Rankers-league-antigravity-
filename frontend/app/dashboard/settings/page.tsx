"use client";

import * as React from "react";
import { User, Shield, Globe, Sun, KeyRound, Eye, Laptop } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import ProfileSettingsPage from "@/app/profile/settings/page";

type SettingsTab = "general" | "security" | "sessions" | "privacy";

interface UserSettingsProfile {
  id: string;
  username: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("general");
  const [profile, setProfile] = React.useState<UserSettingsProfile | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState({ text: "", type: "" });


  // Notifications preferences states
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);
  const [resultAlerts, setResultAlerts] = React.useState(true);
  const [prizeAlerts, setPrizeAlerts] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, prefRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
      ]);

      setProfile(profileRes.data as UserSettingsProfile);

      if (prefRes.data) {
        setEmailNotifs(prefRes.data.email_notifications);
        setReminders(prefRes.data.contest_reminders);
        setResultAlerts(prefRes.data.result_alerts);
        setPrizeAlerts(prefRes.data.prize_alerts);
      }
    };
    load();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update preferences
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        email_notifications: emailNotifs,
        contest_reminders: reminders,
        result_alerts: resultAlerts,
        prize_alerts: prizeAlerts,
      });

      setMsg({ text: "Settings saved successfully.", type: "success" });
    } catch {
      setMsg({ text: "Failed to update settings.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "general", label: "General & Notifications", icon: User },
    { key: "sessions", label: "Active Sessions & Devices", icon: Laptop },
    { key: "security", label: "Security & MFA", icon: Shield },
    { key: "privacy", label: "Privacy Policies", icon: Eye },
  ];


  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Settings Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your personal preferences, notifications and login sessions.</p>
      </div>

      <div className="flex border-b border-border/30 gap-1 overflow-x-auto pb-px">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {msg.text && (
        <div className={cn(
          "p-4 rounded-xl text-xs font-bold border",
          msg.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/10 border-destructive/30 text-destructive"
        )}>
          {msg.text}
        </div>
      )}

      {/* Tab contents */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-2">Notification Center Preferences</h3>
            <p className="text-xs text-muted-foreground">Select which notifications you would like to receive.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: "email", label: "Email Notifications", desc: "Receive weekly ranking updates and league round summaries.", val: emailNotifs, set: setEmailNotifs },
              { id: "reminders", label: "Contest Reminders", desc: "Receive alerts when a registered mock contest is about to start.", val: reminders, set: setReminders },
              { id: "results", label: "Result Announcements", desc: "Get notified as soon as official scorecard answers are published.", val: resultAlerts, set: setResultAlerts },
              { id: "prizes", label: "Prize Alerts", desc: "Receive notifications regarding wallet rewards and winning ranks.", val: prizeAlerts, set: setPrizeAlerts },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={item.val}
                  onChange={(e) => item.set(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200",
                  item.val ? "bg-primary border-primary" : "border-border/50 group-hover:border-primary/50"
                )}>
                  {item.val && (
                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-border/20">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSaving ? "Saving Settings..." : "Save Preferences"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "sessions" && (
        <ProfileSettingsPage />
      )}

      {activeTab === "security" && (
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-2">Two-Factor Authentication</h3>
            <p className="text-xs text-muted-foreground">Secure your account with Multi-Factor authentication rules.</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Ranker&apos;s League relies on secure mobile OTP login codes for identity. Password authentication is disabled by design.
          </p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-bold text-primary">
              🔐 Phone OTP Verification Active
            </span>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-2">Data & Privacy</h3>
            <p className="text-xs text-muted-foreground">Manage your credentials, logs and profile visibility settings.</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            By default, only your display name, username, target exam and unlocked badges are visible on your public profile link. Ranks, scores and aura histories are private.
          </p>
        </div>
      )}
    </div>
  );
}
