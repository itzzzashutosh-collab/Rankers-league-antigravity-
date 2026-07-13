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

  // Get current balances, bank accounts and UPI addresses
  const balances = await walletService.getWalletBalances(user.id);
  const bankAccounts = await walletService.getBankAccounts(user.id);
  const upiAccounts = await walletService.getUpiAccounts(user.id);

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
