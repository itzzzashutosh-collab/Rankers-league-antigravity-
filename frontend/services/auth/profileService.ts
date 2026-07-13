import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { UserProfile } from "@/types/auth";

export const profileService = {
  // Get profile by user ID — server side
  async getProfileById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data as UserProfile;
  },

  // Get public profile by username — server side (no auth required)
  async getPublicProfileByUsername(username: string): Promise<UserProfile | null> {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("profiles")
      .select(
        "id, full_name, username, primary_exam_category, academic_level, avatar_url, aura_points, national_rank, total_contests_joined, joined_at, profile_status"
      )
      .eq("username", username)
      .eq("profile_status", "complete")
      .single();
    if (error) return null;
    return data as UserProfile;
  },

  // Upsert profile — used by complete-profile step
  async upsertProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) return { error: error.message };
    return { error: null };
  },

  // Mark profile as complete
  async markProfileComplete(userId: string): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ profile_status: "complete", updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) return { error: error.message };
    return { error: null };
  },
};
