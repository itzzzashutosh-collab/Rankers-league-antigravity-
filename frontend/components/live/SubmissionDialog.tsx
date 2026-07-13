"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface SubmissionDialogProps {
  totalQuestions: number;
  stats: {
    answered: number;
    notAnswered: number;
    marked: number;
    notVisited: number;
  };
  timeLeftSeconds: number;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function SubmissionDialog({
  totalQuestions,
  stats,
  timeLeftSeconds,
  onConfirm,
  onCancel,
  isOpen,
}: SubmissionDialogProps) {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <Card
        variant="glass"
        className="w-full max-w-md border border-border/80 p-6 sm:p-8 rounded-2xl shadow-2xl bg-card text-left flex flex-col gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/15 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              Submit Competitive Examination?
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Once submitted, you will not be able to modify any responses. Verify the status breakdown metrics below before confirming.
            </p>
          </div>
        </div>

        {/* Status Metrics Breakdown Grid */}
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-4 grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-muted-foreground">Answered:</span>
            <strong className="text-foreground ml-auto">{stats.answered}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-muted-foreground">Not Answered:</span>
            <strong className="text-foreground ml-auto">{stats.notAnswered}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
            <span className="text-muted-foreground">Marked for Review:</span>
            <strong className="text-foreground ml-auto">{stats.marked}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted shrink-0" />
            <span className="text-muted-foreground">Not Visited:</span>
            <strong className="text-foreground ml-auto">{stats.notVisited}</strong>
          </div>
        </div>

        {/* Ticking time remaining info */}
        <div className="flex items-center justify-between text-xs border-y border-border/25 py-3 px-1">
          <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
            <Clock className="w-4 h-4 text-primary shrink-0" /> Time Remaining:
          </span>
          <span className="font-mono text-sm font-extrabold text-foreground">
            {formatTime(timeLeftSeconds)}
          </span>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center justify-end gap-3.5 pt-2">
          <button
            onClick={onCancel}
            className="text-xs uppercase tracking-wider font-bold py-2.5 px-5 border border-border bg-transparent hover:bg-secondary text-foreground rounded-xl transition-colors active:scale-95"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="text-xs uppercase tracking-wider font-bold py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/10 transition-colors flex items-center gap-1 active:scale-95"
          >
            Confirm Submit
          </button>
        </div>
      </Card>
    </div>
  );
}
export default SubmissionDialog;
