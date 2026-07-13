import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export interface WalletBalances {
  wallet_id: string;
  available_balance: number;
  pending_rewards: number;
  processing_rewards: number;
  contest_entry_balance: number;
  lifetime_earnings: number;
  lifetime_withdrawals: number;
  updated_at: string;
}

export type TransactionType =
  | "contest_entry"
  | "contest_refund"
  | "prize_credit"
  | "withdrawal"
  | "withdrawal_reversal"
  | "manual_adjustment"
  | "bonus_reward";

export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type_id: TransactionType;
  status_id: TransactionStatus;
  amount: number;
  reference_number: string;
  contest_id: string | null;
  contest_name: string | null;
  description: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface BankAccount {
  id: string;
  user_id: string;
  account_holder: string;
  account_number: string;
  ifsc: string;
  bank_name: string;
  branch: string;
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpiAccount {
  id: string;
  user_id: string;
  upi_id: string;
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  wallet_id: string;
  amount: number;
  method_id: "upi" | "bank_account";
  status_id: TransactionStatus;
  bank_account_id: string | null;
  upi_account_id: string | null;
  reference_number: string | null;
  estimated_processing_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinancialInsights {
  totalPrizeEarned: number;
  totalEntryFeesPaid: number;
  totalRefunds: number;
  averagePrize: number;
  largestPrize: number;
  monthlyEarnings: { month: string; amount: number }[];
}

export const walletService = {
  // Get wallet balance summary
  async getWalletBalances(userId: string): Promise<WalletBalances> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("wallet_balances")
      .select("*")
      .eq("wallet_id", userId)
      .single();

    if (error || !data) {
      // Return default fallbacks
      return {
        wallet_id: userId,
        available_balance: 0.00,
        pending_rewards: 0.00,
        processing_rewards: 0.00,
        contest_entry_balance: 0.00,
        lifetime_earnings: 0.00,
        lifetime_withdrawals: 0.00,
        updated_at: new Date().toISOString(),
      };
    }

    return {
      wallet_id: data.wallet_id,
      available_balance: Number(data.available_balance),
      pending_rewards: Number(data.pending_rewards),
      processing_rewards: Number(data.processing_rewards),
      contest_entry_balance: Number(data.contest_entry_balance),
      lifetime_earnings: Number(data.lifetime_earnings),
      lifetime_withdrawals: Number(data.lifetime_withdrawals),
      updated_at: data.updated_at,
    };
  },

  // Get filtered transaction history
  async getTransactions(
    userId: string,
    filters: {
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      sortBy?: string;
    } = {}
  ): Promise<WalletTransaction[]> {
    const supabase = await createClient();
    let query = supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", userId);

    if (filters.type && filters.type !== "all") {
      query = query.eq("type_id", filters.type);
    }

    if (filters.status && filters.status !== "all") {
      query = query.eq("status_id", filters.status);
    }

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data) return [];

    let transactions = data as WalletTransaction[];

    // Frontend search filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.reference_number.toLowerCase().includes(term) ||
          (t.contest_name && t.contest_name.toLowerCase().includes(term)) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }

    return transactions;
  },

  // Get specific transaction detail
  async getTransactionDetail(userId: string, transactionId: string): Promise<WalletTransaction | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", userId)
      .eq("id", transactionId)
      .single();

    if (error || !data) return null;
    return data as WalletTransaction;
  },

  // Manage bank accounts
  async getBankAccounts(userId: string): Promise<BankAccount[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", userId)
      .order("is_primary", { ascending: false });

    if (error || !data) return [];
    return data as BankAccount[];
  },

  async addBankAccount(
    userId: string,
    account: Omit<BankAccount, "id" | "user_id" | "is_verified" | "created_at" | "updated_at">
  ): Promise<{ data: BankAccount | null; error: string | null }> {
    const supabase = await createClient();

    // Check if it's the first account, make it primary
    const existing = await this.getBankAccounts(userId);
    const isPrimary = existing.length === 0;

    const { data, error } = await supabase
      .from("bank_accounts")
      .insert({
        user_id: userId,
        account_holder: account.account_holder,
        account_number: account.account_number,
        ifsc: account.ifsc,
        bank_name: account.bank_name,
        branch: account.branch,
        is_primary: isPrimary || account.is_primary,
        is_verified: true, // Auto-verify for premium mockup flow
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    // If marked primary, update others
    if (account.is_primary && existing.length > 0) {
      await supabase
        .from("bank_accounts")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .neq("id", data.id);
    }

    return { data: data as BankAccount, error: null };
  },

  async deleteBankAccount(userId: string, accountId: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("bank_accounts")
      .delete()
      .eq("user_id", userId)
      .eq("id", accountId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  },

  async setPrimaryBankAccount(userId: string, accountId: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient();
    
    // Set all to false first
    await supabase
      .from("bank_accounts")
      .update({ is_primary: false })
      .eq("user_id", userId);

    // Set targeted to true
    const { error } = await supabase
      .from("bank_accounts")
      .update({ is_primary: true })
      .eq("user_id", userId)
      .eq("id", accountId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  },

  // Manage UPI accounts
  async getUpiAccounts(userId: string): Promise<UpiAccount[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("upi_accounts")
      .select("*")
      .eq("user_id", userId)
      .order("is_primary", { ascending: false });

    if (error || !data) return [];
    return data as UpiAccount[];
  },

  async addUpiAccount(userId: string, upiId: string): Promise<{ data: UpiAccount | null; error: string | null }> {
    const supabase = await createClient();
    
    const existing = await this.getUpiAccounts(userId);
    const isPrimary = existing.length === 0;

    const { data, error } = await supabase
      .from("upi_accounts")
      .insert({
        user_id: userId,
        upi_id: upiId,
        is_primary: isPrimary,
        is_verified: true, // Auto-verify for sandbox preview
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as UpiAccount, error: null };
  },

  async deleteUpiAccount(userId: string, upiAccountId: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("upi_accounts")
      .delete()
      .eq("user_id", userId)
      .eq("id", upiAccountId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  },

  async setPrimaryUpiAccount(userId: string, upiAccountId: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient();
    
    await supabase
      .from("upi_accounts")
      .update({ is_primary: false })
      .eq("user_id", userId);

    const { error } = await supabase
      .from("upi_accounts")
      .update({ is_primary: true })
      .eq("user_id", userId)
      .eq("id", upiAccountId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  },

  // Withdrawal Request Flow
  async requestWithdrawal(
    userId: string,
    amount: number,
    method: "upi" | "bank_account",
    accountId: string
  ): Promise<{ success: boolean; error: string | null }> {
    const supabase = createAdminClient();

    // 1. Double submission protection: Check for any processing withdrawal transaction in last 30 seconds
    const thirtySecAgo = new Date(Date.now() - 30000).toISOString();
    const { data: recentTx, error: txCheckError } = await supabase
      .from("wallet_transactions")
      .select("id")
      .eq("wallet_id", userId)
      .eq("type_id", "withdrawal")
      .eq("status_id", "processing")
      .gte("created_at", thirtySecAgo);

    if (txCheckError) return { success: false, error: "System check failed. Please try again." };
    if (recentTx && recentTx.length > 0) {
      return { success: false, error: "A withdrawal request is already processing. Please wait a moment." };
    }

    // 2. Fetch current wallet balance to double check available limits
    const balances = await this.getWalletBalances(userId);
    if (amount < 100) return { success: false, error: "Minimum withdrawal limit is ₹100.00." };
    if (amount > 50000) return { success: false, error: "Maximum withdrawal limit per transaction is ₹50,000.00." };
    if (amount > balances.available_balance) {
      return { success: false, error: "Insufficient funds in Available Balance." };
    }

    // 3. Initiate the payout transaction
    const referenceNumber = "TXN-WDL-" + Math.floor(10000000 + Math.random() * 90000000);
    const description = `Withdrawal payout via ${method === "upi" ? "UPI" : "Bank Transfer"}`;

    const { data: tx, error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: userId,
        type_id: "withdrawal",
        status_id: "processing", // The trigger process_wallet_transaction updates the balances automatically here
        amount: -amount, // Debit amount represented as negative
        reference_number: referenceNumber,
        description,
      })
      .select()
      .single();

    if (txError || !tx) {
      return { success: false, error: txError?.message || "Failed to create withdrawal transaction." };
    }

    // 4. Create matching withdrawal request record
    const { error: wdlError } = await supabase
      .from("withdrawal_requests")
      .insert({
        wallet_id: userId,
        amount,
        method_id: method,
        status_id: "processing",
        bank_account_id: method === "bank_account" ? accountId : null,
        upi_account_id: method === "upi" ? accountId : null,
        reference_number: referenceNumber,
        estimated_processing_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 Hours estimated
      });

    if (wdlError) {
      // Revert transaction state to failed to restore user's balance
      await supabase
        .from("wallet_transactions")
        .update({ status_id: "failed" })
        .eq("id", tx.id);

      return { success: false, error: wdlError.message };
    }

    return { success: true, error: null };
  },

  // Payout history list
  async getPayoutHistory(userId: string): Promise<WithdrawalRequest[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("wallet_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as WithdrawalRequest[];
  },

  // Insights / Metrics calculations
  async getFinancialInsights(userId: string): Promise<FinancialInsights> {
    const transactions = await this.getTransactions(userId, { status: "completed" });

    let totalPrizeEarned = 0;
    let totalEntryFeesPaid = 0;
    let totalRefunds = 0;
    let largestPrize = 0;
    let prizeCount = 0;

    const monthlyMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      const amt = Math.abs(tx.amount);
      const date = new Date(tx.created_at);
      const monthKey = date.toLocaleString("default", { month: "short", year: "numeric" });

      if (tx.type_id === "prize_credit") {
        totalPrizeEarned += amt;
        prizeCount++;
        if (amt > largestPrize) largestPrize = amt;

        // Map monthly earnings
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + amt;
      } else if (tx.type_id === "contest_entry") {
        totalEntryFeesPaid += amt;
      } else if (tx.type_id === "contest_refund") {
        totalRefunds += amt;
      }
    });

    const averagePrize = prizeCount > 0 ? totalPrizeEarned / prizeCount : 0;

    // Convert monthly data map to array
    const monthlyEarnings = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
    }));

    return {
      totalPrizeEarned,
      totalEntryFeesPaid,
      totalRefunds,
      averagePrize,
      largestPrize,
      monthlyEarnings,
    };
  },
};
