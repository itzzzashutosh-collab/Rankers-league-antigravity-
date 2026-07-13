import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { contestsContent } from "@/content/contests";
import { walletService } from "@/services/auth/walletService";
import { contestRegistrationService } from "@/services/auth/contestRegistrationService";
import CheckoutClient from "./CheckoutClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

// Contest checkout layout matching professional simulator portals
export default async function ContestCheckoutPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const contest = contestsContent.find((c) => c.slug === slug);
  if (!contest) return notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/contests/${slug}/checkout`);
  }

  // Check existing registration
  const dbContestId = contest.id === "upsc-elite" ? "upsc-elite-live" : contest.id === "jee-advanced" ? "jee-advanced-live" : `${contest.id}-live`;
  const existingReg = await contestRegistrationService.getRegistration(user.id, dbContestId);
  if (existingReg) {
    redirect(`/contests/${slug}/admit-card`);
  }

  // Fetch wallet balance
  const walletBalance = await walletService.getWalletBalances(user.id);
  const selectedLang = lang || "English";

  return (
    <div className="w-full">
      <CheckoutClient
        contest={contest}
        walletBalance={walletBalance ? walletBalance.available_balance : 0.00}
        selectedLanguage={selectedLang}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
