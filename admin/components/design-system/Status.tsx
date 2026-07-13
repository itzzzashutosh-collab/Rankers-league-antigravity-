"use client";

import React from "react";

export function Badge({
  children,
  variant = "info"
}: {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}) {
  const styles = {
    success: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    warning: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    error: "text-destructive border-destructive/20 bg-destructive/5",
    info: "text-primary border-primary/20 bg-primary/5",
    neutral: "text-muted-foreground border-border bg-muted/5"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
}

// Status Dot
export function StatusDot({
  status = "info",
  label
}: {
  status?: "success" | "warning" | "error" | "info" | "neutral";
  label?: string;
}) {
  const styles = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-destructive",
    info: "bg-primary",
    neutral: "bg-muted-foreground"
  };

  return (
    <span className="inline-flex items-center gap-1.5 font-sans text-xs">
      <span className={`w-1.5 h-1.5 rounded-full ${styles[status]}`} />
      {label && <span className="font-bold text-foreground/80">{label}</span>}
    </span>
  );
}

// Chip
export function Chip({
  label,
  onDelete
}: {
  label: string;
  onDelete?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-background text-[10px] font-bold text-foreground select-none">
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          &times;
        </button>
      )}
    </span>
  );
}

// Progress Bar
export function Progress({
  value,
  max = 100
}: {
  value: number;
  max?: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}
