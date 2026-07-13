"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  ShieldCheck,
  X,
  RotateCw,
  Briefcase,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { ContestDetail } from "@/types/contests";

interface CheckoutClientProps {
  contest: ContestDetail;
  walletBalance: number;
  selectedLanguage: string;
}

export default function CheckoutClient({ contest, walletBalance, selectedLanguage }: CheckoutClientProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = React.useState(walletBalance);

  // Deposit modal states
  const [showAddBalance, setShowAddBalance] = React.useState(false);
  const [addAmount, setAddAmount] = React.useState(String(Math.max(100, contest.entryFee - walletBalance)));
  const [depositMethod, setDepositMethod] = React.useState<"upi" | "card">("upi");
  const [depositing, setDepositing] = React.useState(false);
  const [depositError, setDepositError] = React.useState<string | null>(null);
  const [depositSuccessRef, setDepositSuccessRef] = React.useState<string | null>(null);

  const handleDeposit = async () => {
    const num = Number(addAmount);
    if (isNaN(num) || num <= 0) {
      setDepositError("Please enter a valid amount.");
      return;
    }
    setDepositing(true);
    setDepositError(null);
    try {
      const res = await fetch("/api/auth/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num, method: depositMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deposit failed.");
      
      const newBal = data.newBalance !== null && data.newBalance !== undefined ? Number(data.newBalance) : (currentBalance + num);
      setDepositSuccessRef(data.reference);
      setCurrentBalance(newBal);
      window.dispatchEvent(new CustomEvent("wallet-update", { detail: { balance: newBal } }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setDepositError(msg);
    } finally {
      setDepositing(false);
    }
  };

  const entryFee = contest.entryFee;
  const isSufficient = currentBalance >= entryFee;
  const amountPayable = entryFee;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmRegistration = async () => {
    if (!agreed) {
      alert("Please accept the terms before confirming checkout.");
      return;
    }
    if (!isSufficient) {
      setErrorMsg("Insufficient wallet balance. Please add funds before attempting registration.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const dbContestId = contest.id === "upsc-elite" ? "upsc-elite-live" : contest.id === "jee-advanced" ? "jee-advanced-live" : `${contest.id}-live`;
      const res = await fetch("/api/auth/contests/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestId: dbContestId,
          contestName: contest.title,
          entryFee,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to confirm registration.");
      }

      if (data.newWalletBalance !== null && data.newWalletBalance !== undefined) {
        const nextBal = Number(data.newWalletBalance);
        setCurrentBalance(nextBal);
        window.dispatchEvent(new CustomEvent("wallet-update", { detail: { balance: nextBal } }));
      }

      router.push(`/contests/${contest.slug}/confirmation?regNo=${data.registrationNumber}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Registration transaction failed. Try again.";
      setErrorMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        {/* Back navigation */}
        <Link
          href={`/contests/${contest.slug}/register`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Registration details
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Columns: Invoice / Payments details */}
          <div className="md:col-span-2 space-y-6">
            {/* Invoice card */}
            <div className="bg-card/20 border border-border/40 rounded-2xl p-6 space-y-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Checkout Summary</span>
                <h1 className="text-xl font-black text-foreground mt-1">Verification & Payout Details</h1>
              </div>

              {/* Order breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-start text-xs border-b border-border/20 pb-4">
                  <div>
                    <p className="font-bold text-foreground">{contest.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Language: {selectedLanguage}</p>
                  </div>
                  <span className="font-black text-foreground">{formatCurrency(entryFee)}</span>
                </div>

                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>Entry Fee Subtotal</span>
                  <span>{formatCurrency(entryFee)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>Platform Processing Charges</span>
                  <span className="text-emerald-400">Waived (Free)</span>
                </div>

                <div className="flex justify-between text-sm font-black text-foreground border-t border-border/20 pt-4">
                  <span>Amount Payable</span>
                  <span>{formatCurrency(amountPayable)}</span>
                </div>
              </div>

              {/* Wallet Balance Check */}
              <div className="bg-muted/15 border border-border/30 rounded-xl p-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4.5 h-4.5 text-primary" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-black block">Wallet Winnings Balance</span>
                    <p className="font-bold text-foreground mt-0.5">{formatCurrency(currentBalance)}</p>
                  </div>
                </div>

                {isSufficient ? (
                  <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                    Sufficient Funds
                  </span>
                ) : (
                  <span className="text-[9px] font-black uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded">
                    Insufficient Balance
                  </span>
                )}
              </div>

              {/* Error block */}
              {errorMsg && (
                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-start gap-2.5 leading-normal">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Checkout Terms and Confirmation */}
              <div className="space-y-4 pt-4 border-t border-border/20">
                <label className="flex gap-3 items-start cursor-pointer text-xs font-bold text-foreground leading-relaxed select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary mt-0.5 cursor-pointer"
                  />
                  <span>
                    I authorize Ranker&apos;s League to deduct {formatCurrency(amountPayable)} from my wallet winnings. I understand this action reserves my seat and cannot be cancelled or refunded.
                  </span>
                </label>

                {isSufficient ? (
                  <Button
                    onClick={handleConfirmRegistration}
                    disabled={!agreed || loading}
                    className="w-full py-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5 shadow-lg shadow-primary/10"
                  >
                    {loading ? "Processing reservation..." : `Pay ${formatCurrency(amountPayable)} & Confirm Registration`}
                    {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setDepositError(null);
                      setDepositSuccessRef(null);
                      setShowAddBalance(true);
                    }}
                    className="w-full py-6 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-lg shadow-emerald-950/10"
                  >
                    Add Balance to Wallet (₹{entryFee - currentBalance} Missing)
                  </Button>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Terms list */}
          <div className="space-y-6 text-xs text-muted-foreground leading-normal">
            <div className="bg-card/30 border border-border/40 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Transaction Audit Security</h4>
              
              <div className="space-y-3">
                <div className="flex gap-2.5 items-start">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>All wallet entries are tracked on cryptographic ledgers.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>Your seat booking expires after 15 minutes if payment remains pending.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>Admit card details are compiled instantly upon confirmation success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Balance Modal */}
      {showAddBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAddBalance(false)} />

          <div className="relative w-full max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border/20 pb-3">
              <h3 className="text-xs font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-primary" />
                Add Funds to Wallet
              </h3>
              <button
                onClick={() => setShowAddBalance(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {depositSuccessRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-foreground">Deposit Successful</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ₹{Number(addAmount).toLocaleString("en-IN")} has been credited to your available balance.
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-2 bg-muted/40 p-2 rounded">
                    Ref: {depositSuccessRef}
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddBalance(false)}
                  className="w-full py-5 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 mt-4"
                >
                  Confirm & Go Back
                </Button>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                {/* Preset Options */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Preset Amounts</span>
                  <div className="grid grid-cols-4 gap-2">
                    {["100", "250", "500", "1000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAddAmount(preset)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-bold border transition-colors",
                          addAmount === preset
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted/15 border-border hover:bg-muted/40 text-foreground"
                        )}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Custom Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                    <input
                      type="text"
                      id="amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter amount..."
                      className="w-full bg-card/45 border border-border/45 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Payment Option choices */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment Pathway</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositMethod("upi")}
                      className={cn(
                        "p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all",
                        depositMethod === "upi"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-card border-border hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <Briefcase className="w-5 h-5" />
                      Instant UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositMethod("card")}
                      className={cn(
                        "p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all",
                        depositMethod === "card"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-card border-border hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <CreditCard className="w-5 h-5" />
                      Card Payment
                    </button>
                  </div>
                </div>

                {depositError && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-bold leading-relaxed">
                    {depositError}
                  </div>
                )}

                <Button
                  onClick={handleDeposit}
                  disabled={depositing}
                  className="w-full py-6 font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 shadow-lg shadow-emerald-950/20"
                >
                  {depositing ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Processing Checkout...
                    </>
                  ) : (
                    `Simulate Deposit of ₹${Number(addAmount || 0).toLocaleString("en-IN")}`
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
