import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { walletService } from "@/services/auth/walletService";
import PaymentMethodsClient from "@/components/dashboard/wallet/PaymentMethodsClient";

export default async function PaymentMethodsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/wallet/payment-methods");
  }

  // Retrieve current active accounts
  const bankAccounts = await walletService.getBankAccounts(user.id);
  const upiAccounts = await walletService.getUpiAccounts(user.id);

  return (
    <div className="w-full">
      <PaymentMethodsClient
        userId={user.id}
        initialBankAccounts={bankAccounts}
        initialUpiAccounts={upiAccounts}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
