import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { walletService } from "@/services/auth/walletService";
import WithdrawWinningsClient from "@/components/dashboard/wallet/WithdrawWinningsClient";

export default async function WithdrawWinningsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/wallet/withdraw");
  }

  // Get current balances, bank accounts and UPI addresses safely
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

  const rawBank = await walletService.getBankAccounts(user.id);
  const bankAccounts = Array.isArray(rawBank) ? rawBank : [];

  const rawUpi = await walletService.getUpiAccounts(user.id);
  const upiAccounts = Array.isArray(rawUpi) ? rawUpi : [];

  return (
    <div className="w-full">
      <WithdrawWinningsClient
        userId={user.id}
        initialBalances={balances}
        bankAccounts={bankAccounts}
        upiAccounts={upiAccounts}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
