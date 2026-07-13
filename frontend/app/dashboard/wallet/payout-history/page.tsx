import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { walletService } from "@/services/auth/walletService";
import PayoutHistoryClient from "@/components/dashboard/wallet/PayoutHistoryClient";

export default async function PayoutHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/wallet/payout-history");
  }

  // Retrieve full withdrawal history
  const payouts = await walletService.getPayoutHistory(user.id);

  return (
    <div className="w-full">
      <PayoutHistoryClient
        userId={user.id}
        initialPayouts={payouts}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
