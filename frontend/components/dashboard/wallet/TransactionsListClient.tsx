"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WalletTransaction, TransactionType, TransactionStatus } from "@/services/auth/walletService";

interface TransactionsListClientProps {
  userId: string;
  initialTransactions: WalletTransaction[];
}

export default function TransactionsListClient({
  userId,
  initialTransactions,
}: TransactionsListClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [timeRange, setTimeRange] = React.useState<string>("all");

  const [selectedTx, setSelectedTx] = React.useState<WalletTransaction | null>(null);

  // Formatting utility
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(val);
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

  // Perform filtration logic client side
  const filteredTransactions = React.useMemo(() => {
    const list = Array.isArray(initialTransactions) ? initialTransactions : [];
    return list.filter((tx) => {
      // 1. Search term match
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const refMatch = tx.reference_number.toLowerCase().includes(term);
        const nameMatch = tx.contest_name && tx.contest_name.toLowerCase().includes(term);
        const descMatch = tx.description && tx.description.toLowerCase().includes(term);
        if (!refMatch && !nameMatch && !descMatch) return false;
      }

      // 2. Type filter match
      if (selectedType !== "all" && tx.type_id !== selectedType) return false;

      // 3. Status filter match
      if (selectedStatus !== "all" && tx.status_id !== selectedStatus) return false;

      // 4. Time range match
      if (timeRange !== "all") {
        const txDate = new Date(tx.created_at);
        const now = new Date();
        if (timeRange === "7days") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (txDate < sevenDaysAgo) return false;
        } else if (timeRange === "30days") {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (txDate < thirtyDaysAgo) return false;
        } else if (timeRange === "thismonth") {
          if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
        } else if (timeRange === "thisyear") {
          if (txDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    });
  }, [initialTransactions, searchTerm, selectedType, selectedStatus, timeRange]);

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Back to wallet link */}
      <div>
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Financial Center
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-foreground">Transaction History</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit logs and statements for entries, refunds, and rewards.
          </p>
        </div>
      </div>

      {/* Filter and search control board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-card/40 border border-border/40 rounded-xl">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, contest..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-background/50 text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/50 bg-background/50 text-xs font-bold text-foreground outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="contest_entry">Contest Entry</option>
            <option value="contest_refund">Contest Refund</option>
            <option value="prize_credit">Prize Credit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="bonus_reward">Bonus Reward</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/50 bg-background/50 text-xs font-bold text-foreground outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Settled</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Time range */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/50 bg-background/50 text-xs font-bold text-foreground outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thismonth">This Month</option>
            <option value="thisyear">This Year</option>
          </select>
        </div>

      </div>

      {/* Transaction list display */}
      {filteredTransactions.length === 0 ? (
        <div className="border border-dashed border-border/60 bg-card/10 rounded-2xl p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <Filter className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-foreground">No matching records found</p>
          <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed">
            Refine your query terms or filter states to audit transaction logs.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-border/40 bg-card/30 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground font-black uppercase tracking-wider">
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Contest / Description</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-y-border/20">
                {filteredTransactions.map((tx) => {
                  const status = getStatusConfig(tx.status_id);
                  const type = getTxTypeConfig(tx.type_id);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-muted/10 cursor-pointer transition-colors duration-150"
                    >
                      <td className="p-4 font-mono font-bold text-foreground">{tx.reference_number}</td>
                      <td className="p-4">
                        <p className="font-bold text-foreground">{tx.contest_name || "Withdrawal/Adjustment"}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{tx.description}</p>
                      </td>
                      <td className="p-4 font-semibold text-muted-foreground">{type.label}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border",
                            status.bg
                          )}
                        >
                          <StatusIcon className="w-2.5 h-2.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className={cn("p-4 text-right font-black text-sm", type.color)}>
                        {type.symbol}
                        {formatCurrency(Math.abs(tx.amount))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction details modal (Slide-Over-like display) */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedTx(null)}
          />
          
          <div className="relative h-full w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-border/60 shadow-2xl p-8 flex flex-col justify-between overflow-y-auto">
            {/* Header info */}
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border/40">
                <h3 className="text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                  Audit Receipt
                </h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success layout details */}
              <div className="text-center p-6 bg-muted/20 border border-border/40 rounded-2xl space-y-2">
                <span className="text-[10px] text-muted-foreground font-black uppercase">Transaction Amount</span>
                <h2 className={cn("text-3xl font-black tracking-tight", getTxTypeConfig(selectedTx.type_id).color)}>
                  {getTxTypeConfig(selectedTx.type_id).symbol}
                  {formatCurrency(Math.abs(selectedTx.amount))}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border mt-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Settled
                </div>
              </div>

              {/* Transaction properties */}
              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between py-2 border-b border-border/20">
                  <span className="text-muted-foreground">Reference Number</span>
                  <span className="font-mono text-foreground font-bold">{selectedTx.reference_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/20">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-foreground font-bold">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/20">
                  <span className="text-muted-foreground">Log Action type</span>
                  <span className="text-foreground font-bold uppercase">{selectedTx.type_id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/20">
                  <span className="text-muted-foreground">Contest Event</span>
                  <span className="text-foreground font-bold text-right max-w-[200px] truncate">{selectedTx.contest_name || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/20">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="text-foreground font-bold">
                    {new Date(selectedTx.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/20">
                  <span className="text-muted-foreground">Settled At</span>
                  <span className="text-foreground font-bold">
                    {selectedTx.completed_at
                      ? new Date(selectedTx.completed_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A (Immediate)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6">
              <Button
                variant="outline"
                className="w-full text-xs font-bold gap-2 border-border/60 hover:bg-muted/40"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4" />
                Print Statement / Receipt
              </Button>
              <Button
                className="w-full text-xs font-bold bg-muted text-foreground hover:bg-muted/80"
                onClick={() => setSelectedTx(null)}
              >
                Close Receipt
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
