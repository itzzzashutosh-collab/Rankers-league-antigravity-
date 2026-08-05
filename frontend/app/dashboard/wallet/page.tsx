import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { walletService } from "@/services/auth/walletService";
import WalletDashboardClient from "@/components/dashboard/wallet/WalletDashboardClient";

export default async function WalletDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/wallet");
  }

  // Retrieve user financial records with robust fallbacks
  const rawBalances = await walletService.getWalletBalances(user.id);
  const balances = rawBalances || {
    wallet_id: user.id,
    available_balance: 0,
    pending_rewards: 0,
    processing_rewards: 0,
    contest_entry_balance: 0,
    lifetime_earnings: 0,
    lifetime_withdrawals: 0,
    updated_at: new Date().toISOString(),
  };

  const rawTransactions = await walletService.getTransactions(user.id);
  const recentTransactions = Array.isArray(rawTransactions) ? rawTransactions : [];

  const rawInsights = await walletService.getFinancialInsights(user.id);
  const insights = rawInsights || {
    totalPrizeEarned: 0,
    totalEntryFeesPaid: 0,
    totalRefunds: 0,
    averagePrize: 0,
    largestPrize: 0,
    monthlyEarnings: [],
  };

  return (
    <div className="w-full">
      <WalletDashboardClient
        userId={user.id}
        initialBalances={balances}
        initialTransactions={recentTransactions.slice(0, 5)}
        initialInsights={insights}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
