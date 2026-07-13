import { createClient } from "@/utils/supabase/server";

export interface UserNotification {
  id: string;
  user_id: string;
  type_id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "normal" | "low";
  action_url: string | null;
  action_label: string | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationPreferences {
  user_id: string;
  contest_reminders: boolean;
  result_notifications: boolean;
  prize_notifications: boolean;
  achievement_notifications: boolean;
  marketing_emails: boolean;
  platform_updates: boolean;
  system_alerts: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  push_enabled: boolean;
  updated_at: string;
}

export interface Announcement {
  id: string;
  category_id: string;
  title: string;
  content: string;
  priority: "critical" | "high" | "normal" | "low";
  publish_date: string;
  expires_at: string | null;
  created_at: string;
}

export const notificationService = {
  // Fetch user notifications with unread grouping helper
  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as UserNotification[];
  },

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("user_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .eq("is_archived", false);

    if (error || count === null) return 0;
    return count;
  },

  // Mark as read
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  },

  // Mark all as read
  async markAllAsRead(userId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_read", false);

    return !error;
  },

  // Archive notification
  async archiveNotification(userId: string, notificationId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_notifications")
      .update({ is_archived: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  },

  // Delete notification
  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  },

  // Get preferences
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return {
        user_id: userId,
        contest_reminders: true,
        result_notifications: true,
        prize_notifications: true,
        achievement_notifications: true,
        marketing_emails: false,
        platform_updates: true,
        system_alerts: true,
        email_enabled: true,
        sms_enabled: false,
        whatsapp_enabled: false,
        push_enabled: false,
        updated_at: new Date().toISOString(),
      };
    }

    return data as NotificationPreferences;
  },

  // Update preferences
  async updatePreferences(
    userId: string,
    prefs: Partial<Omit<NotificationPreferences, "user_id" | "updated_at">>
  ): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("notification_preferences")
      .update({ ...prefs, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return !error;
  },

  // Get announcements (public)
  async getAnnouncements(): Promise<Announcement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("publish_date", { ascending: false });

    if (error || !data) return [];
    return data as Announcement[];
  },
};
