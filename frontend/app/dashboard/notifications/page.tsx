import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { notificationService } from "@/services/auth/notificationService";
import NotificationsDashboardClient from "./NotificationsDashboardClient";

export default async function PrivateNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/notifications");
  }

  // Fetch private notifications and channel preferences safely
  const rawNotifications = await notificationService.getUserNotifications(user.id);
  const notifications = Array.isArray(rawNotifications) ? rawNotifications : [];

  const rawPreferences = await notificationService.getPreferences(user.id);
  const preferences = rawPreferences || {
    user_id: user.id,
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
    push_enabled: true,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="w-full">
      <NotificationsDashboardClient
        initialNotifications={notifications}
        initialPreferences={preferences}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
