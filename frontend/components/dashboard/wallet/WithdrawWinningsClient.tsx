"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Building2,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  WalletBalances,
  BankAccount,
  UpiAccount,
} from "@/services/auth/walletService";

interface WithdrawWinningsClientProps {
  userId: string;
  initialBalances: WalletBalances;
  bankAccounts: BankAccount[];
  upiAccounts: UpiAccount[];
}

export default function WithdrawWinningsClient({
  userId,
  initialBalances,
  bankAccounts,
  upiAccounts,
}: WithdrawWinningsClientProps) {
  const router = useRouter();
  const [balances, setBalances] = React.useState<WalletBalances>(initialBalances);
  const [step, setStep] = React.useState(0); // 0: Amount, 1: Method, 2: Review, 3: Success

  // Form states
  const [amount, setAmount] = React.useState("");
  const [selectedMethod, setSelectedMethod] = React.useState<"upi" | "bank_account">("upi");
  const [selectedAccountId, setSelectedAccountId] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const MIN_WITHDRAWAL = 100;
  const MAX_WITHDRAWAL = 50000;

  // Formatting utility
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is ${formatCurrency(MIN_WITHDRAWAL)}.`);
      return;
    }

    if (numAmount > MAX_WITHDRAWAL) {
      setError(`Maximum withdrawal limit per transaction is ${formatCurrency(MAX_WITHDRAWAL)}.`);
      return;
    }

    if (numAmount > balances.available_balance) {
      setError("Entered amount exceeds your Available Balance.");
      return;
    }

    // Auto-select primary account if available
    if (selectedMethod === "upi" && upiAccounts.length > 0) {
      const primary = upiAccounts.find((u) => u.is_primary) || upiAccounts[0];
      setSelectedAccountId(primary.id);
    } else if (selectedMethod === "bank_account" && bankAccounts.length > 0) {
      const primary = bankAccounts.find((b) => b.is_primary) || bankAccounts[0];
      setSelectedAccountId(primary.id);
    }

    setStep(1);
  };

  const handleMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAccountId) {
      setError("Please select a payout destination account.");
      return;
    }

    setStep(2);
  };

  const handleWithdrawalExecution = async () => {
    setError("");
    setIsLoading(true);

    try {
      const numAmount = Number(amount);
      const response = await fetch("/api/auth/wallet/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          method: selectedMethod,
          accountId: selectedAccountId,
        }),
      });

      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to submit withdrawal request.");
        setIsLoading(false);
      } else {
        // Update local balance state
        const nextBal = balances.available_balance - numAmount;
        setBalances((prev) => ({
          ...prev,
          available_balance: nextBal,
          processing_rewards: prev.processing_rewards + numAmount,
        }));
        window.dispatchEvent(new CustomEvent("wallet-update", { detail: { balance: nextBal } }));
        setStep(3);
      }
    } catch {
      setError("An unexpected system error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Helper selectors
  const getSelectedAccountLabel = () => {
    if (selectedMethod === "upi") {
      const act = upiAccounts.find((u) => u.id === selectedAccountId);
      return act ? act.upi_id : "Select UPI ID";
    } else {
      const act = bankAccounts.find((b) => b.id === selectedAccountId);
      return act ? `${act.bank_name} (${act.account_number})` : "Select Bank Account";
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto animate-fade-in">
      {/* Back button */}
      {step < 3 && (
        <div>
          <button
            onClick={() => {
              if (step === 0) router.push("/dashboard/wallet");
              else setStep((prev) => prev - 1);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Back to Wallet" : "Previous Step"}
          </button>
        </div>
      )}

      {/* Progress visualizer */}
      {step < 3 && (
        <div className="bg-card/30 border border-border/30 rounded-xl p-4 flex justify-between items-center text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border",
              step >= 0 ? "bg-primary border-primary text-primary-foreground" : "border-border/40 text-muted-foreground"
            )}>1</span>
            <span className={step === 0 ? "text-foreground" : "text-muted-foreground"}>Amount</span>
          </div>
          <ChevronRight className="w-4 h-4 text-border/40" />
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border",
              step >= 1 ? "bg-primary border-primary text-primary-foreground" : "border-border/40 text-muted-foreground"
            )}>2</span>
            <span className={step === 1 ? "text-foreground" : "text-muted-foreground"}>Destination</span>
          </div>
          <ChevronRight className="w-4 h-4 text-border/40" />
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border",
              step >= 2 ? "bg-primary border-primary text-primary-foreground" : "border-border/40 text-muted-foreground"
            )}>3</span>
            <span className={step === 2 ? "text-foreground" : "text-muted-foreground"}>Review</span>
          </div>
        </div>
      )}

      {/* Notification Errors */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Core card blocks */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl shadow-black/20">

        {/* ── STEP 0: Enter Amount ── */}
        {step === 0 && (
          <form onSubmit={handleAmountSubmit} className="space-y-6">
            <div className="text-center space-y-1 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-2">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-black">Withdraw Winnings</h2>
              <p className="text-xs text-muted-foreground">Select amount to payout from available prize rewards</p>
            </div>

            {/* Balances summary display */}
            <div className="p-4 bg-muted/20 border border-border/40 rounded-xl flex justify-between items-center text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Available Balance</p>
                <p className="text-lg font-black text-foreground mt-0.5">{formatCurrency(balances.available_balance)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-black">Minimum Withdrawal</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{formatCurrency(MIN_WITHDRAWAL)}</p>
              </div>
            </div>

            {/* Input field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Withdrawal Amount (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={MIN_WITHDRAWAL}
                  max={MAX_WITHDRAWAL}
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 border-border/50 bg-card/30 text-lg font-black text-foreground outline-none focus:border-primary transition-all"
                />
              </div>
              <span className="text-[9px] text-muted-foreground leading-normal block">
                Verify you do not exceed withdrawal caps. Withdrawals exclude pending rewards.
              </span>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* ── STEP 1: Select Method ── */}
        {step === 1 && (
          <form onSubmit={handleMethodSubmit} className="space-y-6">
            <div className="text-center space-y-1 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-2">
                <CreditCard className="w-6 h-6 text-violet-500" />
              </div>
              <h2 className="text-lg font-black">Payout Destination</h2>
              <p className="text-xs text-muted-foreground">Select where you would like to route the funds</p>
            </div>

            {/* Method selection tabs */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod("upi");
                  setSelectedAccountId(upiAccounts[0]?.id || "");
                }}
                className={cn(
                  "py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                  selectedMethod === "upi" ? "bg-primary/10 border-primary text-primary" : "border-border/40 text-muted-foreground hover:border-border"
                )}
              >
                UPI Account ID
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod("bank_account");
                  setSelectedAccountId(bankAccounts[0]?.id || "");
                }}
                className={cn(
                  "py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                  selectedMethod === "bank_account" ? "bg-primary/10 border-primary text-primary" : "border-border/40 text-muted-foreground hover:border-border"
                )}
              >
                Bank Account (NEFT)
              </button>
            </div>

            {/* Link list options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Select Destination Address *</label>

              {selectedMethod === "upi" && (
                upiAccounts.length === 0 ? (
                  <div className="p-6 border border-dashed border-border/60 bg-card/10 rounded-xl text-center space-y-2">
                    <p className="text-[11px] text-muted-foreground">No UPI accounts linked.</p>
                    <Link href="/dashboard/wallet/payment-methods" className="text-xs text-primary font-bold hover:underline block">
                      Link UPI ID now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upiAccounts.map((u) => (
                      <label
                        key={u.id}
                        className={cn(
                          "flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:border-border/80 transition-all",
                          selectedAccountId === u.id ? "border-primary bg-primary/5" : "border-border/40 bg-card/20"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="upi_option"
                            checked={selectedAccountId === u.id}
                            onChange={() => setSelectedAccountId(u.id)}
                            className="accent-primary"
                          />
                          <span className="text-xs font-bold text-foreground">{u.upi_id}</span>
                        </div>
                        {u.is_primary && (
                          <span className="text-[8px] uppercase tracking-widest font-black text-primary bg-primary/10 px-1 py-0.5 rounded">Primary</span>
                        )}
                      </label>
                    ))}
                  </div>
                )
              )}

              {selectedMethod === "bank_account" && (
                bankAccounts.length === 0 ? (
                  <div className="p-6 border border-dashed border-border/60 bg-card/10 rounded-xl text-center space-y-2">
                    <p className="text-[11px] text-muted-foreground">No bank accounts linked.</p>
                    <Link href="/dashboard/wallet/payment-methods" className="text-xs text-primary font-bold hover:underline block">
                      Link bank account now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bankAccounts.map((b) => (
                      <label
                        key={b.id}
                        className={cn(
                          "flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:border-border/80 transition-all",
                          selectedAccountId === b.id ? "border-primary bg-primary/5" : "border-border/40 bg-card/20"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="bank_option"
                            checked={selectedAccountId === b.id}
                            onChange={() => setSelectedAccountId(b.id)}
                            className="accent-primary"
                          />
                          <div>
                            <span className="text-xs font-bold text-foreground block">{b.bank_name}</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">{b.account_number}</span>
                          </div>
                        </div>
                        {b.is_primary && (
                          <span className="text-[8px] uppercase tracking-widest font-black text-primary bg-primary/10 px-1 py-0.5 rounded">Primary</span>
                        )}
                      </label>
                    ))}
                  </div>
                )
              )}
            </div>

            <Button
              type="submit"
              disabled={!selectedAccountId}
              className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
            >
              Continue to Review
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* ── STEP 2: Review & Confirm ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-lg font-black">Review Request</h2>
              <p className="text-xs text-muted-foreground">Double check withdrawal configuration before execution</p>
            </div>

            {/* Review matrix */}
            <div className="space-y-3.5 p-4 bg-muted/20 border border-border/40 rounded-2xl text-xs font-medium">
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Requested Amount</span>
                <span className="font-black text-foreground">{formatCurrency(Number(amount))}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Payout Method</span>
                <span className="font-bold text-foreground uppercase">{selectedMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Destination Account</span>
                <span className="font-bold text-foreground">{getSelectedAccountLabel()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Withdrawal Fee</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Estimated Processing</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  ~24 Hours
                </span>
              </div>
            </div>

            {/* Compliance verification notice */}
            <div className="p-3 bg-card border border-border/60 rounded-xl text-[10px] text-muted-foreground leading-normal flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                By executing this transfer, you agree to comply with platform terms of service. Funds are settled on T+1 banking schedules.
              </span>
            </div>

            <Button
              onClick={handleWithdrawalExecution}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60 flex justify-center items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Processing Withdrawal...
                </>
              ) : (
                "Confirm & Execute Transfer"
              )}
            </Button>
          </div>
        )}

        {/* ── STEP 3: Success Completed ── */}
        {step === 3 && (
          <div className="text-center space-y-6 py-4 animate-scale-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-foreground">Withdrawal Initiated!</h2>
              <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                Your transfer request for <strong className="text-foreground">{formatCurrency(Number(amount))}</strong> has been submitted.
              </p>
            </div>

            {/* Audit references */}
            <div className="p-4 bg-muted/20 border border-border/40 rounded-xl inline-block text-[11px] font-mono text-muted-foreground">
              Reference Status: <span className="text-amber-400 font-bold uppercase">PROCESSING</span>
              <span className="block mt-1">Expected Payout: within 24 Hours</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/wallet/payout-history" className="flex-1">
                <Button className="w-full text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                  Track Payout
                </Button>
              </Link>
              <Link href="/dashboard/wallet" className="flex-1">
                <Button variant="outline" className="w-full text-xs font-bold border-border/60 hover:bg-muted/40">
                  Wallet Home
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
