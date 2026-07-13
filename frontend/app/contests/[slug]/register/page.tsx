import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { contestsContent } from "@/content/contests";
import { contestRegistrationService } from "@/services/auth/contestRegistrationService";
import RegisterFormClient from "./RegisterFormClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ContestRegisterPage({ params }: Props) {
  const { slug } = await params;
  const contest = contestsContent.find((c) => c.slug === slug);
  if (!contest) return notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/contests/${slug}/register`);
  }

  // 1. Check if user is already registered
  // Note: in DB we have contest_id as 'upsc-elite-live' etc. so let's match appropriately
  const dbContestId = contest.id === "upsc-elite" ? "upsc-elite-live" : contest.id === "jee-advanced" ? "jee-advanced-live" : `${contest.id}-live`;
  const existingReg = await contestRegistrationService.getRegistration(user.id, dbContestId);
  if (existingReg) {
    redirect(`/contests/${slug}/admit-card`);
  }

  // 2. Fetch seats details
  const seatsDetails = await contestRegistrationService.getSeatsDetails(dbContestId, contest.maxParticipants);

  return (
    <div className="w-full">
      <RegisterFormClient
        contest={contest}
        seatsDetails={seatsDetails}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
