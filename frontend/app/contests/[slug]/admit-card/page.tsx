import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { contestsContent } from "@/content/contests";
import { contestRegistrationService } from "@/services/auth/contestRegistrationService";
import AdmitCardClient from "./AdmitCardClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ContestAdmitCardPage({ params }: Props) {
  const { slug } = await params;
  const contest = contestsContent.find((c) => c.slug === slug);
  if (!contest) return notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/contests/${slug}/admit-card`);
  }

  // 1. Fetch registration details
  const dbContestId = contest.id === "upsc-elite" ? "upsc-elite-live" : contest.id === "jee-advanced" ? "jee-advanced-live" : `${contest.id}-live`;
  const admitCardData = await contestRegistrationService.getAdmitCard(user.id, dbContestId, contest);
  if (!admitCardData) {
    redirect(`/contests/${slug}/register`);
  }

  return (
    <div className="w-full">
      <AdmitCardClient
        contestSlug={slug}
        dbContestId={dbContestId}
        admitCard={admitCardData}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
