"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  CreditCard,
  Building2,
  X,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BankAccount, UpiAccount } from "@/services/auth/walletService";

interface PaymentMethodsClientProps {
  userId: string;
  initialBankAccounts: BankAccount[];
  initialUpiAccounts: UpiAccount[];
}

export default function PaymentMethodsClient({
  userId,
  initialBankAccounts,
  initialUpiAccounts,
}: PaymentMethodsClientProps) {
  const [bankAccounts, setBankAccounts] = React.useState<BankAccount[]>(initialBankAccounts);
  const [upiAccounts, setUpiAccounts] = React.useState<UpiAccount[]>(initialUpiAccounts);

  const [showAddBank, setShowAddBank] = React.useState(false);
  const [showAddUpi, setShowAddUpi] = React.useState(false);
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Bank form state
  const [holderName, setHolderName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [ifsc, setIfsc] = React.useState("");
  const [branch, setBranch] = React.useState("");

  // UPI form state
  const [upiId, setUpiId] = React.useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!holderName || !accountNumber || !confirmAccountNumber || !bankName || !ifsc || !branch) {
      setError("Please fill in all bank details.");
      return;
    }

    if (accountNumber !== confirmAccountNumber) {
      setError("Account numbers do not match.");
      return;
    }

    if (ifsc.length !== 11) {
      setError("IFSC code must be exactly 11 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/wallet/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_holder: holderName,
          account_number: "•••• •••• " + accountNumber.slice(-4),
          ifsc: ifsc.toUpperCase(),
          bank_name: bankName,
          branch,
          is_primary: bankAccounts.length === 0,
        }),
      });

      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to add bank account.");
      } else if (res.account) {
        setBankAccounts((prev) => [...prev, res.account]);
        setSuccess("Bank account added and verified successfully!");
        setShowAddBank(false);
        // Reset form
        setHolderName("");
        setAccountNumber("");
        setConfirmAccountNumber("");
        setBankName("");
        setIfsc("");
        setBranch("");
      }
    } catch {
      setError("Failed to add bank account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!upiId || !upiId.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@bank).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/wallet/upi-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId: upiId.trim().toLowerCase() }),
      });

      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to link UPI ID.");
      } else if (res.account) {
        setUpiAccounts((prev) => [...prev, res.account]);
        setSuccess("UPI account verified and linked successfully!");
        setShowAddUpi(false);
        setUpiId("");
      }
    } catch {
      setError("Failed to link UPI ID. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Are you sure you want to remove this bank account?")) return;
    clearMessages();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/wallet/bank-accounts?id=${id}`, {
        method: "DELETE",
      });
      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to remove bank account.");
      } else {
        setBankAccounts((prev) => prev.filter((b) => b.id !== id));
        setSuccess("Bank account removed successfully.");
      }
    } catch {
      setError("Failed to remove bank account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpi = async (id: string) => {
    if (!confirm("Are you sure you want to remove this UPI account?")) return;
    clearMessages();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/wallet/upi-accounts?id=${id}`, {
        method: "DELETE",
      });
      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to remove UPI ID.");
      } else {
        setUpiAccounts((prev) => prev.filter((u) => u.id !== id));
        setSuccess("UPI ID removed successfully.");
      }
    } catch {
      setError("Failed to remove UPI ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimaryBank = async (id: string) => {
    clearMessages();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/wallet/bank-accounts?id=${id}`, {
        method: "PATCH",
      });
      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to set primary bank account.");
      } else {
        setBankAccounts((prev) =>
          prev.map((b) => ({ ...b, is_primary: b.id === id }))
        );
        setSuccess("Primary bank account updated.");
      }
    } catch {
      setError("Failed to update account status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimaryUpi = async (id: string) => {
    clearMessages();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/wallet/upi-accounts?id=${id}`, {
        method: "PATCH",
      });
      const res = await response.json();

      if (!response.ok || res.error) {
        setError(res.error || "Failed to set primary UPI ID.");
      } else {
        setUpiAccounts((prev) =>
          prev.map((u) => ({ ...u, is_primary: u.id === id }))
        );
        setSuccess("Primary UPI account updated.");
      }
    } catch {
      setError("Failed to update UPI account status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back link */}
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
          <h1 className="text-xl font-black tracking-tight text-foreground">Linked Accounts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure secure destinations for withdrawal routing.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          {success}
        </div>
      )}

      {/* Linked Bank Accounts */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Bank Accounts</h3>
          <Button
            onClick={() => { setShowAddBank(true); setShowAddUpi(false); }}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1 border-border/60 hover:bg-muted/40"
          >
            <Plus className="w-3.5 h-3.5" /> Add Bank Account
          </Button>
        </div>

        {bankAccounts.length === 0 ? (
          <div className="border border-dashed border-border/60 bg-card/10 rounded-2xl p-10 text-center text-xs text-muted-foreground">
            No bank accounts linked yet. Click above to link one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className={cn(
                  "relative rounded-2xl border p-5 bg-gradient-to-br from-card to-card/40 backdrop-blur-md space-y-4",
                  bank.is_primary ? "border-primary/40 shadow-lg shadow-primary/5" : "border-border/40"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-foreground">{bank.bank_name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{bank.branch}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteBank(bank.id)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Holder</span>
                    <span className="font-bold text-foreground">{bank.account_holder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-mono font-bold text-foreground">{bank.account_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IFSC Code</span>
                    <span className="font-mono font-bold text-foreground">{bank.ifsc}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Active & Verified
                  </span>

                  {!bank.is_primary && (
                    <button
                      onClick={() => handleSetPrimaryBank(bank.id)}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Make Primary
                    </button>
                  )}
                  {bank.is_primary && (
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      Primary Destination
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Linked UPI Accounts */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground">UPI IDs</h3>
          <Button
            onClick={() => { setShowAddUpi(true); setShowAddBank(false); }}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1 border-border/60 hover:bg-muted/40"
          >
            <Plus className="w-3.5 h-3.5" /> Link UPI ID
          </Button>
        </div>

        {upiAccounts.length === 0 ? (
          <div className="border border-dashed border-border/60 bg-card/10 rounded-2xl p-10 text-center text-xs text-muted-foreground">
            No UPI IDs linked. Click above to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upiAccounts.map((upi) => (
              <div
                key={upi.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border bg-card/30 backdrop-blur-md",
                  upi.is_primary ? "border-primary/40" : "border-border/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{upi.upi_id}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="text-[9px] text-emerald-400 font-bold">Linked</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!upi.is_primary && (
                    <button
                      onClick={() => handleSetPrimaryUpi(upi.id)}
                      className="text-[9px] font-bold text-primary hover:underline"
                    >
                      Make Primary
                    </button>
                  )}
                  {upi.is_primary && (
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteUpi(upi.id)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Bank Account Modal */}
      {showAddBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAddBank(false)} />
          
          <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                <Building className="w-4.5 h-4.5 text-primary" />
                Add Bank Account
              </h3>
              <button
                onClick={() => setShowAddBank(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBank} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Holder Name *</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="Enter name exactly as in passbook"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Number *</label>
                  <input
                    type="password"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm Account Number *</label>
                  <input
                    type="text"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    placeholder="Re-enter account number"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bank Name *</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. HDFC Bank, SBI..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">IFSC Code *</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="e.g. HDFC0001234"
                    maxLength={11}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Branch Location *</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Enter branch name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  onClick={() => setShowAddBank(false)}
                  className="flex-1 text-xs font-bold bg-muted text-foreground hover:bg-muted/80"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Verifying..." : "Verify & Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add UPI Account Modal */}
      {showAddUpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAddUpi(false)} />
          
          <div className="relative w-full max-w-md bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                <PlusCircle className="w-4.5 h-4.5 text-primary" />
                Link UPI ID
              </h3>
              <button
                onClick={() => setShowAddUpi(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUpi} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">UPI ID Address *</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank (e.g. mobile@ybl)"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all lowercase"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  onClick={() => setShowAddUpi(false)}
                  className="flex-1 text-xs font-bold bg-muted text-foreground hover:bg-muted/80"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Verifying..." : "Link UPI ID"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
