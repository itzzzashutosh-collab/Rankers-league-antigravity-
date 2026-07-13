import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, Target, Users, Calendar, Star, ArrowLeft, ShieldCheck, Award, FileText } from "lucide-react";
import { profileService } from "@/services/auth/profileService";
import { achievementsService } from "@/services/auth/achievementsService";
import { EXAM_CATEGORY_LABELS, ACADEMIC_LEVEL_LABELS } from "@/types/auth";
import { createAdminClient } from "@/utils/supabase/admin";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await profileService.getPublicProfileByUsername(username);
  if (!profile) {
    return { title: "Profile Not Found — Ranker's League" };
  }
  return {
    title: `${profile.full_name} (@${profile.username}) — Ranker's League`,
    description: `${profile.full_name} is a top ranker on Ranker's League. Check out their competitive exam profile, rankings and achievements.`,
    openGraph: {
      title: `${profile.full_name} on Ranker's League`,
      description: `Competing in ${profile.primary_exam_category ? EXAM_CATEGORY_LABELS[profile.primary_exam_category] : "multiple exams"}`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await profileService.getPublicProfileByUsername(username);
  if (!profile) return notFound();

  // Fetch participant identity
  const admin = createAdminClient();
  const { data: identity } = await admin
    .from("participant_identity")
    .select("participant_id, created_at")
    .eq("user_id", profile.id)
    .single();

  // Fetch achievements, badges, certificates and aura tier progression details
  const achievements = await achievementsService.getUserAchievements(profile.id);
  const badges = await achievementsService.getUserBadges(profile.id);
  const certificates = await achievementsService.getUserCertificates(profile.id);
  const aura = await achievementsService.getAuraProgress(profile.id);

  const joinedDate = new Date(profile.joined_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });

  const examLabel = profile.primary_exam_category
    ? EXAM_CATEGORY_LABELS[profile.primary_exam_category]
    : null;

  const levelLabel = profile.academic_level
    ? ACADEMIC_LEVEL_LABELS[profile.academic_level]
    : null;

  // Filter top unlocked badges (up to 3)
  const topBadges = badges.filter((b) => b.unlocked).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-500/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 space-y-6">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Ranker&apos;s League
        </Link>

        {/* Profile Card */}
        <div className="bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
          {/* Cover Banner */}
          <div className="h-28 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/10 relative">
            <div className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <div className="px-6 pb-8">
            {/* Avatar */}
            <div className="relative -mt-12 mb-5 flex items-end justify-between">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || username}
                    className="w-20 h-20 rounded-2xl border-4 border-card object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-card bg-primary/10 flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-black text-primary">
                      {(profile.full_name || username)[0].toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Verified dot */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              </div>

              {identity?.participant_id && (
                <div className="mb-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <p className="text-[10px] font-mono font-black text-primary">{identity.participant_id}</p>
                </div>
              )}
            </div>

            {/* Name, username & Aura Tier Badge */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black tracking-tight">{profile.full_name}</h1>
                <p className="text-sm text-muted-foreground font-medium">@{profile.username}</p>
              </div>

              {/* Aura Tier Indicator */}
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black self-start sm:self-center",
                aura.tierInfo.color
              )}>
                <ShieldCheck className="w-4 h-4" />
                {aura.tierInfo.currentTier}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Trophy, label: "National Rank", value: profile.national_rank ? `#${profile.national_rank}` : "—" },
                { icon: Users, label: "Contests Completed", value: profile.total_contests_joined.toString() },
                { icon: Star, label: "Aura Points", value: profile.aura_points.toLocaleString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-muted/20 rounded-xl p-4 text-center border border-border/30">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <p className="text-lg font-black text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">{label}</p>
                </div>
              ))}
            </div>

            {/* Info tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {examLabel && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold text-primary">{examLabel}</span>
                </div>
              )}
              {levelLabel && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 border border-border/40 rounded-full">
                  <span className="text-xs font-semibold text-muted-foreground">{levelLabel}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 border border-border/40 rounded-full">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">Joined {joinedDate}</span>
              </div>
            </div>

            {/* Showcase items layout splits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/30">
              {/* Top Badges */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-primary" />
                  Top Badges Showcase
                </h3>
                
                {topBadges.length === 0 ? (
                  <p className="text-xs text-muted-foreground bg-muted/10 p-4 border border-border/30 rounded-xl">No badges unlocked yet.</p>
                ) : (
                  <div className="space-y-2">
                    {topBadges.map((badge) => (
                      <div
                        key={badge.key}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/40 text-xs"
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <div className="min-w-0 flex-grow">
                          <p className="font-bold text-foreground">{badge.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements Completion Stats */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Trophy className="w-4.5 h-4.5 text-primary" />
                  Achievements Progress
                </h3>

                <div className="p-4 rounded-xl border border-border/40 bg-card/40 space-y-3 text-xs font-bold">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Unlocked milestones:</span>
                    <span className="text-foreground">{achievements.totalUnlocked} / {achievements.catalog.length}</span>
                  </div>
                  <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${achievements.completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground/80 leading-normal">
                    Scale rankings, streaks and section scores to reach 100% completion status.
                  </p>
                </div>
              </div>
            </div>

            {/* Certifications showcase */}
            <div className="pt-6 mt-6 border-t border-border/30 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-primary" />
                Recent Verified Credentials
              </h3>

              {certificates.length === 0 ? (
                <p className="text-xs text-muted-foreground bg-muted/10 p-4 border border-border/30 rounded-xl">No digital certificates verified.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.slice(0, 2).map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-xl border border-border/40 bg-card/40 text-xs font-medium space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-bold text-foreground truncate">{cert.contest_name}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">ID: {cert.certificate_number}</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-border/20">
                        <span className="text-muted-foreground">Placement: {cert.rank ? `#${cert.rank}` : "Participant"}</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wide text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 rounded">Verifiable</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
