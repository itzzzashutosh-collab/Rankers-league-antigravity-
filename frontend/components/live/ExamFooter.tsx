"use client";

import * as React from "react";
import { Button } from "../ui";
import { ChevronLeft, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamFooterProps {
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  onMark: () => void;
  onSaveNext: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
  hasAnswer: boolean;
  className?: string;
}

export function ExamFooter({
  onPrev,
  onNext,
  onClear,
  onMark,
  onSaveNext,
  onSubmit,
  isFirst,
  isLast,
  hasAnswer,
  className,
}: ExamFooterProps) {
  return (
    <footer className={cn("border-t border-border/40 bg-card/95 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none", className)}>
      
      {/* 1. Left controls (Mark for Review & Clear Response) */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <button
          onClick={onMark}
          className="text-xs uppercase tracking-wider font-bold py-2.5 px-4 bg-violet-500/10 hover:bg-violet-500/15 text-violet-500 rounded-xl transition-all border border-violet-500/25 active:scale-95"
        >
          Mark For Review
        </button>
        <button
          onClick={onClear}
          className="text-xs uppercase tracking-wider font-bold py-2.5 px-4 bg-secondary/80 hover:bg-muted border border-border/80 text-muted-foreground hover:text-foreground rounded-xl transition-all active:scale-95"
        >
          Clear Response
        </button>
      </div>

      {/* 2. Middle controls (Prev, Next, Save & Next) */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-center">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="p-2.5 bg-secondary hover:bg-muted border border-border/60 text-foreground rounded-xl disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-95 flex items-center justify-center"
          title="Previous Question"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onSaveNext}
          className="flex-1 sm:flex-initial text-xs uppercase tracking-wider font-bold py-2.5 px-6 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-md transition-all active:scale-95"
        >
          Save & Next
        </button>

        <button
          onClick={onNext}
          disabled={isLast}
          className="p-2.5 bg-secondary hover:bg-muted border border-border/60 text-foreground rounded-xl disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-95 flex items-center justify-center"
          title="Next Question"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Right control (Final submit) */}
      <div className="w-full sm:w-auto text-right">
        <button
          onClick={onSubmit}
          className="w-full sm:w-auto text-xs uppercase tracking-wider font-bold py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          Submit Championship
        </button>
      </div>

    </footer>
  );
}
export default ExamFooter;
