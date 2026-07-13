"use client";

import * as React from "react";
import Link from "next/link";
import { User, Trophy, Star, Target, Calendar, Globe, ExternalLink, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { EXAM_CATEGORY_LABELS, ACADEMIC_LEVEL_LABELS } from "@/types/auth";
import { getTierInfo } from "@/components/dashboard/AuraHub";
import SkeletonCard from "@/components/dashboard/SkeletonCard";

interface UserProfileInfo {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  primary_exam_category: string | null;
  academic_level: string | null;
  joined_at: string;
  aura_points: number;
  national_rank: number | null;
}

interface ParticipantIdentityInfo {
  participant_id: string;
  public_profile_url: string;
}

interface AchievementInfo {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<UserProfileInfo | null>(null);
  const [identity, setIdentity] = React.useState<ParticipantIdentityInfo | null>(null);
  const [achievements, setAchievements] = React.useState<AchievementInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, identityRes, achRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("participant_identity").select("participant_id, public_profile_url").eq("user_id", user.id).single(),
        supabase.from("user_achievements").select("*").eq("user_id", user.id).limit(4),
      ]);

      setProfile(profileRes.data as UserProfileInfo);
      setIdentity(identityRes.data as ParticipantIdentityInfo);
      setAchievements((achRes.data || []) as AchievementInfo[]);
      setIsLoading(false);

    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  const examLabel = profile?.primary_exam_category
    ? EXAM_CATEGORY_LABELS[profile.primary_exam_category as keyof typeof EXAM_CATEGORY_LABELS]
    : "Competitor";

  const levelLabel = profile?.academic_level
    ? ACADEMIC_LEVEL_LABELS[profile.academic_level as keyof typeof ACADEMIC_LEVEL_LABELS]
    : null;

  const currentTier = profile ? getTierInfo(profile.aura_points) : null;

  const joinedDate = profile
    ? new Date(profile.joined_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">My Profile Identity</h1>
        <p className="text-sm text-muted-foreground mt-1">Review your public metrics, badges and rankings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar Card */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
          <div className="relative mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-24 h-24 rounded-2xl object-cover border-2 border-border/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <span className="text-4xl font-black text-primary">
                  {(profile?.full_name || "?")[0].toUpperCase()}
                </span>
              </div>
            )}
            {currentTier && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
              </div>
            )}
          </div>

          <h2 className="text-lg font-black text-foreground">{profile?.full_name}</h2>
          <p className="text-xs text-muted-foreground">@{profile?.username}</p>

          {identity?.participant_id && (
            <span className="mt-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-mono font-black text-primary">
              ID: {identity.participant_id}
            </span>
          )}

          <div className="w-full border-t border-border/20 mt-6 pt-6 space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Exam Target
              </span>
              <span className="font-bold text-foreground">{examLabel}</span>
            </div>
            {levelLabel && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Level
                </span>
                <span className="font-bold text-foreground">{levelLabel}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Joined Since
              </span>
              <span className="font-bold text-foreground">{joinedDate}</span>
            </div>
          </div>

          {identity?.public_profile_url && (
            <div className="w-full mt-6 pt-4 border-t border-border/20">
              <Link href={identity.public_profile_url} target="_blank">
                <Button variant="outline" className="w-full gap-2 rounded-xl text-xs font-bold border-border/50 hover:bg-muted/30">
                  View Public Profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Performance Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6">
              League Standings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-muted/20 border border-border/30 rounded-xl p-4 text-center">
                <Trophy className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-xl font-black text-foreground">
                  {profile?.national_rank ? `#${profile.national_rank}` : "—"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">National Rank</p>
              </div>

              <div className="bg-muted/20 border border-border/30 rounded-xl p-4 text-center">
                <Star className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-xl font-black text-foreground">
                  {profile?.aura_points?.toLocaleString() || 0}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Total Aura</p>
              </div>

              <div className="bg-muted/20 border border-border/30 rounded-xl p-4 text-center">
                <Globe className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-xl font-black text-foreground">
                  {currentTier?.name || "Bronze"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">League Division</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-foreground">Need to modify your personal details?</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Update targets, preferred language and onboarding preferences.</p>
              </div>
              <Link href="/auth/complete-profile">
                <Button className="rounded-xl text-xs font-bold gap-2">
                  Edit Personal Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Unlocked badges list */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-4">
              Latest Unlocked Badges
            </h3>

            {achievements.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No achievements unlocked yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-2.5 p-3 border border-border/30 bg-muted/10 rounded-xl">
                    <span className="text-xl shrink-0">{ach.icon || "🏆"}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{ach.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
