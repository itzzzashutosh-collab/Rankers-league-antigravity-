import { createClient } from "@/utils/supabase/server";
import { dashboardService } from "@/services/auth/dashboardService";
import OverviewCards from "@/components/dashboard/OverviewCards";
import LiveContestBanner from "@/components/dashboard/LiveContestBanner";
import ContestCard from "@/components/dashboard/ContestCard";
import ResultCard from "@/components/dashboard/ResultCard";
import AuraHub from "@/components/dashboard/AuraHub";
import AchievementCard from "@/components/dashboard/AchievementCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import Link from "next/link";
import { ArrowRight, Trophy, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch all dashboard data
  const { stats, enrollments, achievements, activity, auraHistory } = 
    await dashboardService.getOverviewData(user.id);

  // Fetch profile for rank & total aura
  const { data: profile } = await supabase
    .from("profiles")
    .select("national_rank, aura_points, primary_exam_category")
    .eq("id", user.id)
    .single();

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const safeActivity = Array.isArray(activity) ? activity : [];
  const safeAuraHistory = Array.isArray(auraHistory) ? auraHistory : [];

  const liveContest = safeEnrollments.find(e => e.status === "live") || null;
  const upcomingEnrollments = safeEnrollments
    .filter(e => e.status === "registered")
    .slice(0, 2);
  const completedEnrollments = safeEnrollments
    .filter(e => e.status === "completed")
    .slice(0, 2);

  const latestResult = safeEnrollments
    .filter(e => e.status === "completed")
    .sort((a, b) => new Date(b.contest_date).getTime() - new Date(a.contest_date).getTime())[0] || null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            My Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status of your competitive league journey.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Ranker
          </span>
        </div>
      </div>

      {/* Live Contest Banner */}
      <LiveContestBanner contest={liveContest} />

      {/* Statistics Grid */}
      <OverviewCards stats={stats} nationalRank={profile?.national_rank || null} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contests, Aura */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Registered Contests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                My Enrolled Upcomings
              </h3>
              <Link href="/dashboard/my-contests">
                <Button variant="ghost" className="text-xs font-bold gap-1 text-primary hover:bg-transparent">
                  View All Contests
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            {upcomingEnrollments.length === 0 ? (
              <div className="p-6 border border-dashed border-border/50 rounded-2xl text-center text-xs text-muted-foreground bg-card/20">
                You haven&apos;t enrolled in any upcoming contests.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEnrollments.map((enr) => (
                  <ContestCard key={enr.id} enrollment={enr} variant="upcoming" />
                ))}
              </div>
            )}
          </div>

          {/* Latest Result Summary */}
          {latestResult && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                Latest Result Summary
              </h3>
              <ResultCard result={latestResult} />
            </div>
          )}

          {/* Aura Tiers & History Hub */}
          <AuraHub
            currentAura={profile?.aura_points || 0}
            monthlyAura={stats?.monthly_aura_earned || 0}
            history={safeAuraHistory}
          />
        </div>

        {/* Right Column: Achievements, Activity */}
        <div className="space-y-8">
          {/* Achievements Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                Latest Achievements
              </h3>
              <Link href="/dashboard/achievements">
                <Button variant="ghost" className="text-xs font-bold gap-1 text-primary hover:bg-transparent">
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            {safeAchievements.length === 0 ? (
              <div className="p-6 border border-dashed border-border/50 rounded-2xl text-center text-xs text-muted-foreground bg-card/20">
                No achievements unlocked yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {safeAchievements.slice(0, 3).map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            )}
          </div>

          {/* Timeline Feed */}
          <ActivityTimeline activities={safeActivity} />
        </div>

      </div>
    </div>
  );
}
