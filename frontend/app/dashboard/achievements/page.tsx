import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { achievementsService } from "@/services/auth/achievementsService";
import AchievementsHubClient from "@/components/dashboard/achievements/AchievementsHubClient";

export default async function AchievementsDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/achievements");
  }

  // Fetch all achievements, badges, certificates, streaks and aura milestones
  const achievements = await achievementsService.getUserAchievements(user.id);
  const badges = await achievementsService.getUserBadges(user.id);
  const certificates = await achievementsService.getUserCertificates(user.id);
  const streak = await achievementsService.getUserStreak(user.id);
  const aura = await achievementsService.getAuraProgress(user.id);

  return (
    <div className="w-full">
      <AchievementsHubClient
        userId={user.id}
        initialAchievements={achievements}
        initialBadges={badges}
        initialCertificates={certificates}
        initialStreak={streak}
        initialAura={aura}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
