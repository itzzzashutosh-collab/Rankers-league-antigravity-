"use client";

import React from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Download,
  CreditCard,
  ChevronRight,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  X,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  WalletBalances,
  WalletTransaction,
  FinancialInsights,
} from "@/services/auth/walletService";

interface WalletDashboardClientProps {
  userId: string;
  initialBalances: WalletBalances;
  initialTransactions: WalletTransaction[];
  initialInsights: FinancialInsights;
}

export default function WalletDashboardClient({
  userId,
  initialBalances,
  initialTransactions,
  initialInsights,
}: WalletDashboardClientProps) {
  const [balances, setBalances] = React.useState<WalletBalances>(initialBalances);
  const [transactions] = React.useState<WalletTransaction[]>(initialTransactions);
  const [insights] = React.useState<FinancialInsights>(initialInsights);

  // Add Balance modal states
  const [showAddBalance, setShowAddBalance] = React.useState(false);
  const [addAmount, setAddAmount] = React.useState("500");
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
      
      const nextBal = data.newBalance !== null && data.newBalance !== undefined ? Number(data.newBalance) : (balances.available_balance + num);
      setDepositSuccessRef(data.reference);
      // Update balance local state
      setBalances(prev => ({
        ...prev,
        available_balance: nextBal
      }));
      window.dispatchEvent(new CustomEvent("wallet-update", { detail: { balance: nextBal } }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setDepositError(msg);
    } finally {
      setDepositing(false);
    }
  };

  // Formatting utility with safe input handling
  const formatCurrency = (val: number | null | undefined) => {
    const num = typeof val === "number" && !isNaN(val) && isFinite(val) ? val : 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          icon: CheckCircle2,
          label: "Settled",
        };
      case "processing":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          icon: Clock,
          label: "Processing",
        };
      case "pending":
        return {
          bg: "bg-sky-500/10 border-sky-500/20 text-sky-400",
          icon: Clock,
          label: "Pending",
        };
      case "failed":
        return {
          bg: "bg-destructive/10 border-destructive/20 text-destructive",
          icon: AlertCircle,
          label: "Failed",
        };
      default:
        return {
          bg: "bg-muted/10 border-border/20 text-muted-foreground",
          icon: HelpCircle,
          label: "Cancelled",
        };
    }
  };

  const getTxTypeConfig = (type: string) => {
    switch (type) {
      case "prize_credit":
        return {
          label: "Prize Credit",
          icon: ArrowDownLeft,
          color: "text-emerald-400",
          symbol: "+",
        };
      case "bonus_reward":
        return {
          label: "Bonus Reward",
          icon: ArrowDownLeft,
          color: "text-amber-400",
          symbol: "+",
        };
      case "contest_refund":
        return {
          label: "Refund",
          icon: ArrowDownLeft,
          color: "text-sky-400",
          symbol: "+",
        };
      case "contest_entry":
        return {
          label: "Contest Entry",
          icon: ArrowUpRight,
          color: "text-rose-400",
          symbol: "-",
        };
      case "withdrawal":
        return {
          label: "Withdrawal",
          icon: ArrowUpRight,
          color: "text-zinc-400",
          symbol: "-",
        };
      default:
        return {
          label: "Adjustment",
          icon: ArrowUpRight,
          color: "text-foreground",
          symbol: "",
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Premium Balance Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card/80 to-background p-8 shadow-2xl">
        {/* Ambient glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Left: Big Balance Display */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Balance</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span className="text-[10px] text-emerald-500 font-bold">Ready to Withdraw</span>
                  </div>
                </div>
              </div>

              <div className="text-5xl sm:text-6xl font-extrabold font-heading text-foreground tracking-tight mb-2">
                {formatCurrency(balances.available_balance)}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  Lifetime Earned: <strong className="text-foreground ml-1">{formatCurrency(balances.lifetime_earnings)}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-primary" />
                  Total Withdrawn: <strong className="text-foreground ml-1">{formatCurrency(balances.lifetime_withdrawals)}</strong>
                </span>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-start lg:min-w-[200px]">
              <Button
                onClick={() => {
                  setDepositError(null);
                  setDepositSuccessRef(null);
                  setShowAddBalance(true);
                }}
                className="flex-1 lg:flex-none text-xs font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950/15 py-3"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Add Money
              </Button>
              <Link href="/dashboard/wallet/withdraw" className="flex-1 lg:flex-none">
                <Button className="w-full text-xs font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 py-3">
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw
                </Button>
              </Link>
              <Link href="/dashboard/wallet/transactions" className="flex-1 lg:flex-none">
                <Button variant="outline" className="w-full text-xs font-bold gap-2 border-border/60 hover:bg-muted/30 py-3">
                  <Layers className="w-4 h-4" />
                  History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Balance breakdown header (compact) ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Balance Overview
        </h2>
        <Link href="/dashboard/wallet/payment-methods">
          <Button variant="ghost" className="text-xs font-bold gap-1.5 border-border/50 border hover:bg-muted/30">
            <CreditCard className="w-3.5 h-3.5" />
            Linked Payment Methods
          </Button>
        </Link>
      </div>

      {/* Grid of Main Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Available Balance */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md p-6 shadow-xl shadow-emerald-950/5">
          <div className="absolute right-4 top-4 rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Available Balance</p>
          <h3 className="text-2xl font-black text-foreground mt-2 tracking-tight">
            {formatCurrency(balances.available_balance)}
          </h3>
          <p className="text-[10px] text-emerald-500/80 font-medium mt-2 leading-relaxed">
            Fully settled prize rewards. Eligible for instant withdrawal.
          </p>
        </div>

        {/* Card 2: Contest Entry Balance */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-950/10 backdrop-blur-md p-6 shadow-xl shadow-violet-950/5">
          <div className="absolute right-4 top-4 rounded-xl bg-violet-500/10 p-2 text-violet-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Contest Entry Balance</p>
          <h3 className="text-2xl font-black text-foreground mt-2 tracking-tight">
            {formatCurrency(balances.contest_entry_balance)}
          </h3>
          <p className="text-[10px] text-violet-500/80 font-medium mt-2 leading-relaxed">
            Reserved exclusively for arena registration fees.
          </p>
        </div>

        {/* Card 3: Pending Rewards */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md p-6 shadow-xl shadow-amber-950/5">
          <div className="absolute right-4 top-4 rounded-xl bg-amber-500/10 p-2 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Pending Rewards</p>
          <h3 className="text-2xl font-black text-foreground mt-2 tracking-tight">
            {formatCurrency(balances.pending_rewards)}
          </h3>
          <p className="text-[10px] text-amber-500/80 font-medium mt-2 leading-relaxed">
            Contest completed. Waiting for final ranking audit settlement.
          </p>
        </div>

        {/* Card 4: Processing Withdrawals */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950/20 backdrop-blur-md p-6 shadow-xl shadow-black/10">
          <div className="absolute right-4 top-4 rounded-xl bg-zinc-500/10 p-2 text-zinc-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Processing Withdrawals</p>
          <h3 className="text-2xl font-black text-foreground mt-2 tracking-tight">
            {formatCurrency(balances.processing_rewards)}
          </h3>
          <p className="text-[10px] text-zinc-500 font-medium mt-2 leading-relaxed">
            Verification pending bank or UPI settlement network processing.
          </p>
        </div>

      </div>

      {/* Lifetime stats footer bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 border border-border/40 rounded-xl">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-black">Lifetime Earnings</span>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(balances.lifetime_earnings)}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-black">Lifetime Withdrawals</span>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(balances.lifetime_withdrawals)}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-black">Settlement Cycle</span>
          <p className="text-sm font-bold text-foreground mt-0.5">T+1 Business Day</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-black">Account Security</span>
          <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
            Locked RLS
          </p>
        </div>
      </div>

      {/* Main Two Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Transactions list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Recent Transactions</h3>
            <Link href="/dashboard/wallet/transactions">
              <Button variant="ghost" className="text-xs font-bold gap-1 text-primary hover:bg-transparent px-0">
                Full Transaction History
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="border border-dashed border-border/60 bg-card/10 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Wallet className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-foreground">No transactions recorded</p>
              <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed">
                Join championship leagues or linked payout networks to execute balance events.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const status = getStatusConfig(tx.status_id);
                const type = getTxTypeConfig(tx.type_id);
                const StatusIcon = status.icon;
                const TypeIcon = type.icon;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/30 hover:border-border/80 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={cn("p-2 rounded-xl bg-card border border-border/60", type.color)}>
                        <TypeIcon className="w-4 h-4" />
                      </div>

                      {/* Title & Date */}
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {tx.contest_name || type.label}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-muted-foreground">
                            {tx.reference_number}
                          </span>
                          <span className="text-[9px] text-muted-foreground/60">•</span>
                          <span className="text-[9px] text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Status Badge */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={cn("text-sm font-black", type.color)}>
                        {type.symbol}
                        {formatCurrency(Math.abs(tx.amount))}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold border",
                          status.bg
                        )}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Column: Financial Insights & Monthly stats */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Financial Insights</h3>

          {/* Insights Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/40 bg-card/20">
              <span className="text-[9px] text-muted-foreground uppercase font-black">Total Prize Won</span>
              <h4 className="text-sm font-black text-emerald-400 mt-1">{formatCurrency(insights.totalPrizeEarned)}</h4>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-card/20">
              <span className="text-[9px] text-muted-foreground uppercase font-black">Entry Fees Paid</span>
              <h4 className="text-sm font-black text-rose-400 mt-1">{formatCurrency(insights.totalEntryFeesPaid)}</h4>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-card/20">
              <span className="text-[9px] text-muted-foreground uppercase font-black">Average Winnings</span>
              <h4 className="text-sm font-black text-foreground mt-1">{formatCurrency(insights.averagePrize)}</h4>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-card/20">
              <span className="text-[9px] text-muted-foreground uppercase font-black">Largest Winnings</span>
              <h4 className="text-sm font-black text-amber-400 mt-1">{formatCurrency(insights.largestPrize)}</h4>
            </div>
          </div>

          {/* Mini Monthly earnings visualizer */}
          <div className="p-5 rounded-2xl border border-border/40 bg-card/30 space-y-4">
            <div>
              <p className="text-xs font-bold text-foreground">Monthly Prize Distribution</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Prize credits earned month-over-month.</p>
            </div>

            {insights.monthlyEarnings.length === 0 ? (
              <p className="text-[10px] text-muted-foreground text-center py-6">No monthly earnings data available.</p>
            ) : (
              <div className="space-y-3.5 pt-2">
                {insights.monthlyEarnings.map((m) => {
                  const maxAmt = Math.max(...insights.monthlyEarnings.map((x) => x.amount), 1);
                  const pct = Math.max(12, Math.min(100, (m.amount / maxAmt) * 100));

                  return (
                    <div key={m.month} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-muted-foreground">{m.month}</span>
                        <span className="font-black text-foreground">{formatCurrency(m.amount)}</span>
                      </div>
                      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

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
                  <CheckCircle2 className="w-6 h-6" />
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
                  onClick={() => {
                    setShowAddBalance(false);
                    window.location.reload();
                  }}
                  className="w-full py-5 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 mt-4"
                >
                  Return to Financial Center
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
    </div>
  );
}
