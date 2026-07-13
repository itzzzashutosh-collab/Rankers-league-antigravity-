"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  FileText,
  X,
  CreditCard,
  Building,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WithdrawalRequest } from "@/services/auth/walletService";

interface PayoutHistoryClientProps {
  userId: string;
  initialPayouts: WithdrawalRequest[];
}

export default function PayoutHistoryClient({
  userId,
  initialPayouts,
}: PayoutHistoryClientProps) {
  const [payouts] = React.useState<WithdrawalRequest[]>(initialPayouts);
  const [selectedPayout, setSelectedPayout] = React.useState<WithdrawalRequest | null>(null);

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

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Financial Center
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-foreground">Payout History</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history of your settled prize rewards and withdrawals.
          </p>
        </div>
      </div>

      {/* Payout records list */}
      {payouts.length === 0 ? (
        <div className="border border-dashed border-border/60 bg-card/10 rounded-2xl p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-foreground">No payout records found</p>
          <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed">
            Initiate withdrawal payouts from your Available Winnings to record settlement logs.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-border/40 bg-card/30 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground font-black uppercase tracking-wider">
                  <th className="p-4">Reference Number</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4">Payout Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Settled Amount</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-y-border/20">
                {payouts.map((payout) => {
                  const status = getStatusConfig(payout.status_id);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={payout.id}
                      className="hover:bg-muted/10 transition-colors duration-150"
                    >
                      <td className="p-4 font-mono font-bold text-foreground">{payout.reference_number || "N/A"}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(payout.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 font-semibold text-muted-foreground uppercase">
                        {payout.method_id === "upi" ? "UPI ID" : "Bank Transfer"}
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
                      <td className="p-4 font-black text-foreground text-sm">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          onClick={() => setSelectedPayout(payout)}
                          variant="ghost"
                          size="sm"
                          className="text-[10px] font-bold gap-1 text-primary hover:bg-primary/10"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visual PDF receipt details overlay */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPayout(null)}
          />

          <div className="relative w-full max-w-md bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-primary" />
                Receipt Viewer
              </h3>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Premium receipt statement card */}
            <div className="border border-border/60 bg-muted/10 rounded-2xl p-6 space-y-6 text-xs" id="printable-receipt">
              <div className="text-center space-y-1">
                <h2 className="text-base font-black tracking-wider uppercase text-foreground">Ranker&apos;s League</h2>
                <p className="text-[10px] text-muted-foreground">Premium Competitive Arena Financial Receipt</p>
              </div>

              <div className="border-t border-dashed border-border/60 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt Number</span>
                  <span className="font-mono font-bold text-foreground">REC-{selectedPayout.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference Transaction</span>
                  <span className="font-mono font-bold text-foreground">{selectedPayout.reference_number || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Date</span>
                  <span className="text-foreground font-bold">
                    {new Date(selectedPayout.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payout Method</span>
                  <span className="text-foreground font-bold uppercase">{selectedPayout.method_id}</span>
                </div>
              </div>

              <div className="border-t border-b border-border/40 py-4 flex justify-between items-center bg-muted/20 px-3 rounded-xl">
                <span className="font-bold text-foreground text-xs">Total Settled Amount</span>
                <span className="font-black text-base text-foreground">{formatCurrency(selectedPayout.amount)}</span>
              </div>

              <div className="text-center space-y-1.5 pt-2">
                <p className="text-[9px] text-muted-foreground leading-normal">
                  Thank you for being part of Ranker&apos;s League! This is a system-generated statement.
                </p>
                <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Digitally Signed & Audited
                </span>
              </div>
            </div>

            {/* Receipt utility controls */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-bold gap-1.5 border-border/60 hover:bg-muted/40"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </Button>
              <Button
                onClick={() => setSelectedPayout(null)}
                className="flex-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
