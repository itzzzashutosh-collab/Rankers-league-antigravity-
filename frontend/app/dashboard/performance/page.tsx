import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { performanceService } from "@/services/auth/performanceService";
import PerformanceDashboardClient from "@/components/dashboard/performance/PerformanceDashboardClient";

export default async function PerformancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/performance");
  }

  // Retrieve dashboard and analytics intelligence models
  const dashboardData = await performanceService.getPerformanceDashboardData(user.id);

  return (
    <div className="w-full">
      <PerformanceDashboardClient initialData={dashboardData} />
    </div>
  );
}
export const dynamic = "force-dynamic";
