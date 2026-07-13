"use client";

import React from "react";
import { HelpCircle, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { Button } from "./Button";

// Empty State
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon: Icon = HelpCircle
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="py-16 text-center border border-dashed border-border rounded-2xl text-muted-foreground/60 space-y-4 font-sans text-xs w-full max-w-md mx-auto">
      <Icon className="w-10 h-10 text-muted-foreground/20 mx-auto" />
      <div className="space-y-1">
        <h4 className="font-black text-sm text-foreground">{title}</h4>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
      {(onAction || onSecondaryAction) && (
        <div className="flex items-center justify-center gap-2">
          {onSecondaryAction && secondaryActionLabel && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {onAction && actionLabel && (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Error State
export function ErrorState({
  title = "Operation Timeout",
  description = "A connection drop occurred while querying the core gateway database.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-xs font-sans space-y-4 max-w-md mx-auto">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-destructive text-sm">{title}</h4>
          <p className="text-foreground/80 leading-relaxed font-semibold">{description}</p>
        </div>
      </div>
      {onRetry && (
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onRetry}
          >
            Retry Execution
          </Button>
        </div>
      )}
    </div>
  );
}

// Shimmer Skeleton
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

// Table Loading Shimmer
export function TableLoadingSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center px-4 py-2 border border-border rounded-xl">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="border border-border rounded-xl bg-card/5 overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
        <div className="divide-y divide-border/40 p-4 space-y-4">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex gap-4">
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
