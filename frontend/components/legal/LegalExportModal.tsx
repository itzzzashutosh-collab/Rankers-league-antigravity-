"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Printer,
  Share2,
  Bookmark,
  Check,
  X,
  FileText,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";

interface LegalExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  onCopyFull: () => void;
}

export function LegalExportModal({
  isOpen,
  onClose,
  documentTitle,
  version,
  effectiveDate,
  lastUpdated,
  onCopyFull,
}: LegalExportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!isOpen) return null;

  const handlePrintOrPDF = () => {
    window.print();
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({ title: documentTitle, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = () => {
    onCopyFull();
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-background border border-border/50 rounded-3xl p-6 space-y-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                Official Export Tools
              </span>
              <h3 className="text-lg font-bold font-heading text-foreground">
                Document Export & Sharing
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Document Summary Badge */}
          <div className="p-4 rounded-2xl border border-border/40 bg-card/40 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground truncate max-w-[280px]">{documentTitle}</span>
              <span className="font-mono text-primary font-bold">{version}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span>Effective: {effectiveDate}</span>
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Download PDF */}
            <button
              onClick={handlePrintOrPDF}
              className="p-4 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-bold flex flex-col items-start gap-2 transition-all group text-left"
            >
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm">Download PDF</span>
                <span className="text-[10px] text-primary/80 font-normal">Export formatted PDF file</span>
              </div>
            </button>

            {/* Print Document */}
            <button
              onClick={handlePrintOrPDF}
              className="p-4 rounded-2xl border border-border/50 bg-card/40 hover:border-border text-foreground font-bold flex flex-col items-start gap-2 transition-all text-left"
            >
              <div className="p-2 rounded-xl bg-muted text-foreground">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm">Print Document</span>
                <span className="text-[10px] text-muted-foreground font-normal">Direct printer export</span>
              </div>
            </button>

            {/* Share Link */}
            <button
              onClick={handleShareLink}
              className="p-4 rounded-2xl border border-border/50 bg-card/40 hover:border-border text-foreground font-bold flex flex-col items-start gap-2 transition-all text-left"
            >
              <div className="p-2 rounded-xl bg-muted text-foreground">
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </div>
              <div>
                <span className="block text-sm">{copiedLink ? "Link Copied!" : "Share Document"}</span>
                <span className="text-[10px] text-muted-foreground font-normal">Share clean URL link</span>
              </div>
            </button>

          </div>

          {/* Bookmark Bar */}
          <div className="pt-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isBookmarked
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isBookmarked ? "Document Bookmarked" : "Bookmark Document for Later"}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default LegalExportModal;
