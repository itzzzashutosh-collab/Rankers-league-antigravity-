"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ShieldCheck, CheckCircle2, FileText, Building2, IndianRupee, Printer } from "lucide-react";

interface TDSReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestTitle: string;
  grossAmount?: number;
  winnerName?: string;
}

export function TDSReceiptModal({
  isOpen,
  onClose,
  contestTitle,
  grossAmount = 10000,
  winnerName = "Ranker Candidate",
}: TDSReceiptModalProps) {
  if (!isOpen) return null;

  const entryFee = 500; // Offset entry fee for net winnings calculation
  const netWinnings = Math.max(0, grossAmount - entryFee);
  const isTDSApplicable = grossAmount >= 10000;
  const tdsRate = isTDSApplicable ? 0.30 : 0;
  const tdsAmount = isTDSApplicable ? Math.round(netWinnings * tdsRate) : 0;
  const netPayout = grossAmount - tdsAmount;

  const receiptNo = `RL-TDS-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-2xl bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-primary/15 via-card to-card border-b border-border/40 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground">Official TDS Tax Deduction Receipt</h3>
                <p className="text-[10px] text-muted-foreground">Section 194B / 194BA · Income Tax Department, Govt. of India</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/20 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Receipt Body */}
          <div className="p-6 space-y-6 text-left" id="printable-tds-receipt">
            {/* Header branding */}
            <div className="flex items-start justify-between border-b border-border/30 pb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-base font-black text-foreground">Ranker&apos;s League India</h2>
                <p className="text-[11px] text-muted-foreground">Official Academic Competition Platform</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">TAN: DELR12345F · PAN: AAACR1234F</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                  Verified Payout & Tax Receipt
                </span>
                <p className="text-xs font-mono font-bold text-foreground mt-1">{receiptNo}</p>
                <p className="text-[10px] text-muted-foreground">{dateStr}</p>
              </div>
            </div>

            {/* Candidate & Contest Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/30 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Candidate Name</span>
                <span className="font-black text-foreground text-sm">{winnerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Contest Arena</span>
                <span className="font-bold text-foreground">{contestTitle}</span>
              </div>
            </div>

            {/* TDS Deduction Statement Table */}
            <div>
              <span className="text-xs font-black text-foreground uppercase tracking-wider block mb-2">
                Tax Deduction & Settlement Statement
              </span>
              <div className="border border-border/40 rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-border/20">
                    <tr className="bg-card/40">
                      <td className="px-4 py-3 font-semibold text-muted-foreground">Gross Prize Winnings</td>
                      <td className="px-4 py-3 text-right font-mono font-black text-foreground">₹{grossAmount.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-muted-foreground">Less: Entry Fee Offset (Net Basis)</td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-muted-foreground">-₹{entryFee.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="bg-card/40">
                      <td className="px-4 py-3 font-bold text-foreground">Taxable Net Winnings Amount</td>
                      <td className="px-4 py-3 text-right font-mono font-black text-foreground">₹{netWinnings.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="bg-red-500/5">
                      <td className="px-4 py-3 font-bold text-red-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        Govt. TDS Tax Deduction ({isTDSApplicable ? "30%" : "0% — Below ₹10,000 threshold"})
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-red-400">
                        {isTDSApplicable ? `-₹${tdsAmount.toLocaleString("en-IN")}` : "₹0"}
                      </td>
                    </tr>
                    <tr className="bg-emerald-500/10 font-black text-sm">
                      <td className="px-4 py-3 text-emerald-500">Net Amount Credited to Wallet</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-500">₹{netPayout.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-1.5 text-primary font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                Statutory Government Compliance
              </div>
              <p>
                In accordance with Section 194B / 194BA of the Income Tax Act, 1961 (Govt. of India), 30% TDS is deducted at source for online competition winnings of ₹10,000 or more. All withheld TDS is directly deposited into the Govt. Treasury under your verified PAN card. Quarterly Form 16A TDS certificates are available for annual Income Tax Return (ITR) filing.
              </p>
            </div>

            {/* Footer Signoff */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/20 pt-3">
              <span>Issued by Ranker&apos;s League Finance Compliance Desk</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Digitally Verified
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
