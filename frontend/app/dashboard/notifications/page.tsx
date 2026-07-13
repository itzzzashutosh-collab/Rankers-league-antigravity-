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

  // Fetch private notifications and channel preferences
  const notifications = await notificationService.getUserNotifications(user.id);
  const preferences = await notificationService.getPreferences(user.id);

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
