import { createClient } from "@/utils/supabase/server";
import { dashboardService } from "@/services/auth/dashboardService";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/dashboard");

  // Parallel data fetching
  const [
    { stats, enrollments, achievements },
    profileResult,
    userResult,
    walletResult,
  ] = await Promise.all([
    dashboardService.getOverviewData(user.id),
    supabase
      .from("profiles")
      .select("id, full_name, username, national_rank, primary_exam_category, avatar_url, created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("users")
      .select("id, full_name, username, primary_exam_category, avatar_url, phone_number, academic_level")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("wallet_balances")
      .select("available_balance")
      .eq("wallet_id", user.id)
      .maybeSingle(),
  ]);

  // Merge profile data prioritize users table values if present
  const profile = {
    id: user.id,
    ...profileResult.data,
    ...(userResult.data || {}),
    // Ensure critical fields fallback gracefully
    full_name: userResult.data?.full_name || profileResult.data?.full_name,
    username: userResult.data?.username || profileResult.data?.username,
    primary_exam_category: userResult.data?.primary_exam_category || profileResult.data?.primary_exam_category,
    avatar_url: userResult.data?.avatar_url || profileResult.data?.avatar_url,
    national_rank: profileResult.data?.national_rank ?? null,
    created_at: profileResult.data?.created_at ?? null,
  };

  const walletBalance = walletResult.data?.available_balance ?? 0;

  const safeEnrollments  = Array.isArray(enrollments)  ? enrollments  : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];

  const totalPrizeWon = safeEnrollments.reduce((sum, e) => sum + (Number(e.prize_won) || 0), 0);

  const examCat = profile?.primary_exam_category || "";
  const isNEET  = examCat.toLowerCase().includes("neet");
  const acc     = stats?.accuracy_percentage || 0;
  const streak  = stats?.current_streak || 0;

  // Radar subjects per exam type
  const radarSubjects = isNEET
    ? [
        { subject: "Physics",     accuracy: acc,                          rank1Accuracy: 90 },
        { subject: "Chemistry",   accuracy: Math.max(0, acc - 8),         rank1Accuracy: 88 },
        { subject: "Biology",     accuracy: Math.max(0, acc + 5),         rank1Accuracy: 92 },
        { subject: "Speed",       accuracy: Math.min(100, acc * 0.8),     rank1Accuracy: 85 },
        { subject: "Consistency", accuracy: Math.min(100, streak * 8),    rank1Accuracy: 88 },
      ]
    : [
        { subject: "Physics",     accuracy: acc,                          rank1Accuracy: 90 },
        { subject: "Chemistry",   accuracy: Math.max(0, acc - 8),         rank1Accuracy: 88 },
        { subject: "Maths",       accuracy: Math.max(0, acc + 4),         rank1Accuracy: 92 },
        { subject: "Speed",       accuracy: Math.min(100, acc * 0.8),     rank1Accuracy: 85 },
        { subject: "Consistency", accuracy: Math.min(100, streak * 8),    rank1Accuracy: 91 },
      ];

  // Heatmap data from contest dates
  const heatmapData = safeEnrollments
    .filter(e => e.contest_date)
    .map(e => ({
      date:        e.contest_date.split("T")[0],
      count:       1,
      score:       e.final_score || 0,
      contestName: e.contest_name,
    }));

  return (
    <DashboardClient
      profile={profile}
      stats={stats}
      enrollments={safeEnrollments}
      achievements={safeAchievements}
      heatmapData={heatmapData}
      radarSubjects={radarSubjects}
      totalPrizeWon={totalPrizeWon}
      walletBalance={walletBalance}
      examCategory={profile?.primary_exam_category}
    />
  );
}
