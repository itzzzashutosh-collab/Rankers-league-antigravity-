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

  // Retrieve user financial records
  const balances = await walletService.getWalletBalances(user.id);
  const recentTransactions = await walletService.getTransactions(user.id);
  const insights = await walletService.getFinancialInsights(user.id);

  return (
    <div className="w-full">
      <WalletDashboardClient
        userId={user.id}
        initialBalances={balances}
        initialTransactions={recentTransactions.slice(0, 5)} // Show top 5 recent
        initialInsights={insights}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
