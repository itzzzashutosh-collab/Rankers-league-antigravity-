import { createClient } from "@/utils/supabase/server";

export const dashboardService = {
  // Get all data for dashboard overview page
  async getOverviewData(userId: string) {
    const supabase = await createClient();

    // 1. Get stats
    const { data: stats } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    // 2. Get enrollments
    const { data: enrollments } = await supabase
      .from("contest_enrollments")
      .select("*")
      .eq("user_id", userId);

    // 3. Get achievements
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    // 4. Get recent activity
    const { data: activity } = await supabase
      .from("user_activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6);

    // 5. Get recent aura history
    const { data: auraHistory } = await supabase
      .from("aura_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8);

    const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

    // Calculate default stats fallback if no db record yet
    const statsFallback = stats || {
      total_contests_joined: safeEnrollments.length,
      total_contests_completed: safeEnrollments.filter(e => e.status === "completed").length,
      total_contests_won: safeEnrollments.filter(e => Number(e.prize_won) > 0).length,
      best_rank: null,
      average_score: 0,
      total_aura_earned: 0,
      monthly_aura_earned: 0,
      current_streak: 0,
      longest_streak: 0,
      accuracy_percentage: 0,
    };

    return {
      stats: statsFallback,
      enrollments: safeEnrollments,
      achievements: Array.isArray(achievements) ? achievements : [],
      activity: Array.isArray(activity) ? activity : [],
      auraHistory: Array.isArray(auraHistory) ? auraHistory : [],
    };
  },

  // Get active live contest if any
  async getLiveContest(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("contest_enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "live")
      .single();
    return data;
  },

  // Update settings preferences
  async updatePreferences(userId: string, preferences: any) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("dashboard_preferences")
      .update(preferences)
      .eq("user_id", userId);
    return { error: error?.message || null };
  },
};
