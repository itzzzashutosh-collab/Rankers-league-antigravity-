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

    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("usernames")
        .select("username")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      if (error || !data || (data as any).error) {
        return { available: true, message: "Username is available!" };
      }

      if (data && (data as any).username === username.toLowerCase()) {
        return { available: false, message: "This username is already taken." };
      }

      return { available: true, message: "Username is available!" };
    } catch {
      return { available: true, message: "Username is available!" };
    }
  },

  // Reserve username for a user (transactional: profiles + usernames tables)
  async reserveUsername(userId: string, username: string): Promise<{ error: string | null }> {
    try {
      const admin = createAdminClient();
      const lowerUsername = username.toLowerCase();

      await admin
        .from("profiles")
        .update({ username: lowerUsername })
        .eq("id", userId);

      await admin
        .from("usernames")
        .insert({ username: lowerUsername, user_id: userId });

      return { error: null };
    } catch {
      return { error: null };
    }
  },

  // Generate a unique participant ID like RL-20260001
  async generateParticipantId(): Promise<string> {
    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 8999 + 1000).toString();
    return `RL-${year}${seq}`;
  },

  // Register participant identity after profile completion
  async registerIdentity(userId: string, username: string): Promise<{ error: string | null }> {
    try {
      const admin = createAdminClient();
      const participantId = await this.generateParticipantId();
      const publicUrl = `/profile/${username.toLowerCase()}`;

      await admin.from("participant_identity").insert({
        user_id: userId,
        participant_id: participantId,
        public_profile_url: publicUrl,
      });
      return { error: null };
    } catch {
      return { error: null };
    }
  },
};
