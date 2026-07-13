"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone, Tablet, LogOut, ShieldOff, Clock, Wifi } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { UserProfile, UserSession } from "@/types/auth";
import { cn } from "@/lib/utils";

function DeviceIcon({ os }: { os: string | null }) {
  if (!os) return <Monitor className="w-5 h-5" />;
  const lower = os.toLowerCase();
  if (lower.includes("android") || lower.includes("ios")) return <Smartphone className="w-5 h-5" />;
  if (lower.includes("tablet") || lower.includes("ipad")) return <Tablet className="w-5 h-5" />;
  return <Monitor className="w-5 h-5" />;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [sessions, setSessions] = React.useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [logoutingId, setLogoutingId] = React.useState<string | null>(null);
  const [isLoggingOutAll, setIsLoggingOutAll] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");

  React.useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }

      const [profileRes, sessionsRes] = await Promise.all([
        fetch("/api/auth/profile"),
        fetch("/api/auth/sessions"),
      ]);

      if (profileRes.ok) {
        const { profile } = await profileRes.json();
        setProfile(profile);
      }
      if (sessionsRes.ok) {
        const { sessions } = await sessionsRes.json();
        setSessions(sessions || []);
      }
      setIsLoading(false);
    };
    load();
  }, [router]);

  const handleLogoutSession = async (sessionId: string) => {
    setLogoutingId(sessionId);
    await fetch(`/api/auth/sessions?id=${sessionId}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setLogoutingId(null);
    setSuccessMsg("Session removed successfully.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    await fetch("/api/auth/sessions?all=true", { method: "DELETE" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-primary/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile and active sessions</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {successMsg}
          </div>
        )}

        {/* Profile summary */}
        {profile && (
          <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || ""}
                  className="w-14 h-14 rounded-xl border-2 border-border/30 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-black text-primary">
                    {(profile.full_name || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg truncate">{profile.full_name}</p>
                <p className="text-sm text-muted-foreground font-medium">@{profile.username}</p>
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold",
                profile.profile_status === "complete"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              )}>
                {profile.profile_status === "complete" ? "✓ Complete" : "⚠ Incomplete"}
              </div>
            </div>
          </div>
        )}

        {/* Active Sessions */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
            <div>
              <h2 className="font-black text-sm">Active Sessions</h2>
              <p className="text-xs text-muted-foreground">{sessions.length} device{sessions.length !== 1 ? "s" : ""} signed in</p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleLogoutAll}
                disabled={isLoggingOutAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-xs font-bold hover:bg-destructive/20 transition-colors disabled:opacity-50"
              >
                <ShieldOff className="w-3 h-3" />
                Sign out all
              </button>
            )}
          </div>

          <div className="divide-y divide-border/20">
            {sessions.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No active sessions found.
              </div>
            ) : sessions.map((session) => (
              <div key={session.id} className="px-6 py-4 flex items-center gap-4 hover:bg-muted/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <DeviceIcon os={session.operating_system} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{session.device_name || "Unknown Device"}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {session.browser && (
                      <span className="text-[10px] text-muted-foreground">{session.browser}</span>
                    )}
                    {session.operating_system && (
                      <span className="text-[10px] text-muted-foreground">· {session.operating_system}</span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-2.5 h-2.5" />
                      {timeAgo(session.last_active_at)}
                    </span>
                    {session.ip_address && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Wifi className="w-2.5 h-2.5" />
                        {session.ip_address}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleLogoutSession(session.id)}
                  disabled={logoutingId === session.id}
                  className="shrink-0 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Sign out this session"
                >
                  {logoutingId === session.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card/30 backdrop-blur-sm border border-destructive/20 rounded-2xl p-5">
          <h3 className="text-sm font-black text-destructive mb-1">Sign Out</h3>
          <p className="text-xs text-muted-foreground mb-4">Sign out from this device only.</p>
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push("/auth/login");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-bold hover:bg-destructive/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
