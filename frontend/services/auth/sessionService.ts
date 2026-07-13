import { createAdminClient } from "@/utils/supabase/admin";
import { UserSession } from "@/types/auth";

export const sessionService = {
  // Upsert session record when user logs in
  async upsertSession(params: {
    userId: string;
    sessionToken: string;
    deviceName?: string;
    browser?: string;
    operatingSystem?: string;
    ipAddress?: string;
    expiresAt?: string;
  }): Promise<{ error: string | null }> {
    const admin = createAdminClient();
    const { error } = await admin.from("user_sessions").upsert({
      user_id: params.userId,
      session_token: params.sessionToken,
      device_name: params.deviceName || "Unknown Device",
      browser: params.browser || "Unknown Browser",
      operating_system: params.operatingSystem || "Unknown OS",
      ip_address: params.ipAddress || null,
      status: "active",
      last_active_at: new Date().toISOString(),
      expires_at: params.expiresAt || null,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  // Fetch all active sessions for a user
  async getActiveSessions(userId: string): Promise<UserSession[]> {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("last_active_at", { ascending: false });
    if (error) return [];
    return data as UserSession[];
  },

  // Logout a specific session
  async logoutSession(sessionId: string, userId: string): Promise<{ error: string | null }> {
    const admin = createAdminClient();
    const { error } = await admin
      .from("user_sessions")
      .update({ status: "logged_out" })
      .eq("id", sessionId)
      .eq("user_id", userId);
    if (error) return { error: error.message };
    return { error: null };
  },

  // Logout all sessions for a user
  async logoutAllSessions(userId: string): Promise<{ error: string | null }> {
    const admin = createAdminClient();
    const { error } = await admin
      .from("user_sessions")
      .update({ status: "logged_out" })
      .eq("user_id", userId)
      .eq("status", "active");
    if (error) return { error: error.message };
    return { error: null };
  },

  // Parse user agent string to extract device info
  parseUserAgent(userAgent: string): { browser: string; os: string; device: string } {
    const ua = userAgent.toLowerCase();
    const browser =
      ua.includes("chrome") && !ua.includes("edg") ? "Chrome" :
      ua.includes("firefox") ? "Firefox" :
      ua.includes("safari") && !ua.includes("chrome") ? "Safari" :
      ua.includes("edg") ? "Edge" :
      ua.includes("opera") ? "Opera" : "Unknown Browser";

    const os =
      ua.includes("windows") ? "Windows" :
      ua.includes("mac") ? "macOS" :
      ua.includes("android") ? "Android" :
      ua.includes("iphone") || ua.includes("ipad") ? "iOS" :
      ua.includes("linux") ? "Linux" : "Unknown OS";

    const device =
      ua.includes("mobile") || ua.includes("android") ? "Mobile" :
      ua.includes("tablet") || ua.includes("ipad") ? "Tablet" : "Desktop";

    return { browser, os, device };
  },
};
