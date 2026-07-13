import { createAdminClient } from "@/utils/supabase/admin";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export const usernameService = {
  // Validate username format
  validateFormat(username: string): { valid: boolean; message: string } {
    if (username.length < 3) return { valid: false, message: "Username must be at least 3 characters." };
    if (username.length > 20) return { valid: false, message: "Username cannot exceed 20 characters." };
    if (!USERNAME_REGEX.test(username)) {
      return { valid: false, message: "Only lowercase letters, numbers and underscores allowed." };
    }
    return { valid: true, message: "Username looks good!" };
  },

  // Check username availability — uses admin to bypass RLS
  async checkAvailability(username: string): Promise<{ available: boolean; message: string }> {
    const format = this.validateFormat(username);
    if (!format.valid) return { available: false, message: format.message };

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("usernames")
      .select("username")
      .eq("username", username.toLowerCase())
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 = no rows found — username is available
        return { available: true, message: "Username is available!" };
      }
      return { available: false, message: `DB Error [${error.code}]: ${error.message}` };
    }
    if (data) return { available: false, message: "This username is already taken." };
    return { available: false, message: "Unable to verify availability. Try again." };

  },

  // Reserve username for a user (transactional: profiles + usernames tables)
  async reserveUsername(userId: string, username: string): Promise<{ error: string | null }> {
    const admin = createAdminClient();
    const lowerUsername = username.toLowerCase();

    // Update profile username
    const { error: profileError } = await admin
      .from("profiles")
      .update({ username: lowerUsername })
      .eq("id", userId);
    if (profileError) return { error: profileError.message };

    // Insert into username registry
    const { error: usernameError } = await admin
      .from("usernames")
      .insert({ username: lowerUsername, user_id: userId });
    if (usernameError) {
      // Rollback profile username if registry insert fails
      await admin.from("profiles").update({ username: null }).eq("id", userId);
      return { error: "Username is already taken. Please choose another." };
    }

    return { error: null };
  },

  // Generate a unique participant ID like RL-20260001
  async generateParticipantId(): Promise<string> {
    const admin = createAdminClient();
    const year = new Date().getFullYear();
    const { count } = await admin
      .from("participant_identity")
      .select("*", { count: "exact", head: true });
    const seq = ((count || 0) + 1).toString().padStart(4, "0");
    return `RL-${year}${seq}`;
  },

  // Register participant identity after profile completion
  async registerIdentity(userId: string, username: string): Promise<{ error: string | null }> {
    const admin = createAdminClient();
    const participantId = await this.generateParticipantId();
    const publicUrl = `/profile/${username.toLowerCase()}`;

    const { error } = await admin.from("participant_identity").insert({
      user_id: userId,
      participant_id: participantId,
      public_profile_url: publicUrl,
    });
    if (error) return { error: error.message };
    return { error: null };
  },
};
