import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { walletService } from "@/services/auth/walletService";
import TransactionsListClient from "@/components/dashboard/wallet/TransactionsListClient";

export default async function TransactionsHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/wallet/transactions");
  }

  // Fetch all transactions to deliver to client filter controller
  const transactions = await walletService.getTransactions(user.id);

  return (
    <div className="w-full">
      <TransactionsListClient
        userId={user.id}
        initialTransactions={transactions}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
