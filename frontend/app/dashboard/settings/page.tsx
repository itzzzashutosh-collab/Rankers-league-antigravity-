"use client";

import * as React from "react";
import { User, Shield, Laptop, Eye, Check, Sparkles, BookOpen, Phone, Upload, Save, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import ProfileSettingsPage from "@/app/profile/settings/page";
import { EXAM_CATEGORY_LABELS, ACADEMIC_LEVEL_LABELS, ExamCategory, AcademicLevel } from "@/types/auth";

type SettingsTab = "profile" | "notifications" | "sessions" | "security" | "privacy";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");
  const [userId, setUserId] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [msg, setMsg] = React.useState({ text: "", type: "" });

  // Profile editable fields
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [examCategory, setExamCategory] = React.useState<string>("");
  const [academicLevel, setAcademicLevel] = React.useState<string>("");
  const [avatarUrl, setAvatarUrl] = React.useState<string>("");
  const [avatarUploading, setAvatarUploading] = React.useState(false);

  // Notification preferences
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);
  const [resultAlerts, setResultAlerts] = React.useState(true);
  const [prizeAlerts, setPrizeAlerts] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const [profileRes, prefRes, userRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
          supabase.from("users").select("*").eq("id", user.id).maybeSingle(),
        ]);

        const p = userRes.data || profileRes.data || {};
        setFullName(p.full_name || profileRes.data?.full_name || "");
        setUsername(p.username || profileRes.data?.username || "");
        setPhone(p.phone_number || profileRes.data?.phone_number || "");
        setExamCategory(p.primary_exam_category || profileRes.data?.primary_exam_category || "");
        setAcademicLevel(p.academic_level || profileRes.data?.academic_level || "");
        setAvatarUrl(p.avatar_url || profileRes.data?.avatar_url || user.user_metadata?.avatar_url || "");

        if (prefRes.data) {
          setEmailNotifs(prefRes.data.email_notifications ?? true);
          setReminders(prefRes.data.contest_reminders ?? true);
          setResultAlerts(prefRes.data.result_alerts ?? true);
          setPrizeAlerts(prefRes.data.prize_alerts ?? true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      const res = await fetch("/api/auth/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setAvatarUrl(data.url);
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setMsg({ text: "Full Name is required.", type: "error" }); return; }
    setIsSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const supabase = createClient();
      const payload = {
        full_name: fullName.trim(),
        username: username.toLowerCase().trim(),
        primary_exam_category: examCategory,
        academic_level: academicLevel,
        phone_number: phone.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      // Update both profiles and users tables dynamically
      await Promise.all([
        supabase.from("profiles").update(payload).eq("id", userId),
        supabase.from("users").upsert({ id: userId, ...payload }, { onConflict: "id" }),
      ]);

      setMsg({ text: "Your student profile has been updated successfully!", type: "success" });
    } catch (err: any) {
      setMsg({ text: err.message || "Failed to update profile.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const supabase = createClient();
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        email_notifications: emailNotifs,
        contest_reminders: reminders,
        result_alerts: resultAlerts,
        prize_alerts: prizeAlerts,
      }, { onConflict: "user_id" });

      setMsg({ text: "Notification settings updated successfully.", type: "success" });
    } catch {
      setMsg({ text: "Failed to update settings.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "profile", label: "Student Profile", icon: User },
    { key: "notifications", label: "Notifications", icon: Sparkles },
    { key: "sessions", label: "Active Sessions & Devices", icon: Laptop },
    { key: "security", label: "Security & Authentication", icon: Shield },
    { key: "privacy", label: "Data & Privacy", icon: Eye },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Account & Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your student identity, exam prep category, contact info, and preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/30 gap-1 overflow-x-auto pb-px scrollbar-hide">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setMsg({ text: "", type: "" }); }}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all",
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message alert */}
      {msg.text && (
        <div className={cn(
          "p-4 rounded-xl text-xs font-bold border flex items-center gap-2 animate-fade-in",
          msg.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/10 border-destructive/30 text-destructive"
        )}>
          {msg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* ── 1. Student Profile Tab ─────────────────────── */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-border/30 pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Student Profile Identity</h3>
              <p className="text-xs text-muted-foreground">Changes here reflect across your live competition rankcards and dashboard.</p>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-5">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30 shadow-lg shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/20 border border-primary/30 flex items-center justify-center text-2xl font-black text-primary shrink-0 shadow-lg">
                {(fullName || username || "S")[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-foreground mb-1">Profile Photo</p>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/20 text-xs font-bold cursor-pointer hover:bg-muted/40 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {avatarUploading ? "Uploading..." : "Upload New Picture"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Full Student Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ashutosh Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-muted-foreground font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ashutosh_ranker"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Exam Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-primary" /> Target Exam Category
              </label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select Exam Category</option>
                {Object.entries(EXAM_CATEGORY_LABELS).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Academic Level / Class</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select Academic Level</option>
                {Object.entries(ACADEMIC_LEVEL_LABELS).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-primary" /> Registered Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/20 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black rounded-xl text-xs shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving Student Profile..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      )}

      {/* ── 2. Notifications Tab ──────────────────────── */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSaveNotifications} className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-1">Notification Center Preferences</h3>
            <p className="text-xs text-muted-foreground">Customize which contest alerts and scorecard updates you receive.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: "email", label: "Email Summaries", desc: "Receive weekly ranking analysis and performance summaries.", val: emailNotifs, set: setEmailNotifs },
              { id: "reminders", label: "Contest Live Reminders", desc: "Get alerted 15 minutes before your registered contests go live.", val: reminders, set: setReminders },
              { id: "results", label: "Scorecard Alerts", desc: "Immediate notification when contest final ranks and detailed solutions publish.", val: resultAlerts, set: setResultAlerts },
              { id: "prizes", label: "Prize & Wallet Rewards", desc: "Notifications regarding contest winnings credited to your wallet.", val: prizeAlerts, set: setPrizeAlerts },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-muted/10 transition-colors">
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
                  {item.val && <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-border/20 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-primary-foreground font-black rounded-xl text-xs shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      )}

      {/* ── 3. Sessions Tab ────────────────────────────── */}
      {activeTab === "sessions" && (
        <ProfileSettingsPage />
      )}

      {/* ── 4. Security Tab ────────────────────────────── */}
      {activeTab === "security" && (
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-1">Two-Factor & Security</h3>
            <p className="text-xs text-muted-foreground">Manage your account authentication protocols.</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ranker&apos;s League uses secure OTP phone/email code verification. Passwords are disabled by design to eliminate vulnerability vectors.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Phone & OTP Verification Active
            </span>
          </div>
        </div>
      )}

      {/* ── 5. Privacy Tab ─────────────────────────────── */}
      {activeTab === "privacy" && (
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-1">Data & Privacy Control</h3>
            <p className="text-xs text-muted-foreground">Public profile visibility rules.</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only your full name, username, target exam category, and unlocked achievement badges are visible on your public competitor card. Personal contact information remains encrypted and strictly private.
          </p>
        </div>
      )}
    </div>
  );
}
