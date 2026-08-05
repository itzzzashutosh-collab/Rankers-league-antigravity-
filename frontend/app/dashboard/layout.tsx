import React from "react";
import { redirect } from "next/navigation";
import { createClient, DEMO_MOCK_USER, DEMO_MOCK_PROFILE } from "@/utils/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, primary_exam_category, aura_points, national_rank, profile_status")
    .eq("id", user.id)
    .single();

  const profile = profileData || DEMO_MOCK_PROFILE;

  if ((!profile?.username || profile.profile_status !== "complete") && user.id !== DEMO_MOCK_USER.id) {
    redirect("/auth/complete-profile");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
