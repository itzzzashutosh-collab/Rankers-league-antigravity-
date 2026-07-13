"use client";

import * as React from "react";
import { AlertCircle, FileQuestion, ShieldAlert, WifiOff, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── EMPTY STATE ───
interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Records Found",
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/80 rounded-2xl bg-card/20", className)}>
      <FolderOpen className="w-10 h-10 text-muted-foreground mb-4 shrink-0" />
      <h3 className="font-heading text-base font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="rounded-md text-xs font-semibold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// ─── ERROR STATE ───
type ErrorType = "404" | "403" | "500" | "offline";

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const errorConfig: Record<ErrorType, { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }> = {
  "404": {
    icon: FileQuestion,
    title: "Championship Not Found",
    desc: "The competitive arena you are looking for does not exist or has been moved.",
  },
  "403": {
    icon: ShieldAlert,
    title: "Access Restricted",
    desc: "You do not have the required calibration authorization to enter this championship.",
  },
  "500": {
    icon: AlertCircle,
    title: "Operational Anomaly",
    desc: "Our systems encountered an unexpected error. The engineering team has been notified.",
  },
  offline: {
    icon: WifiOff,
    title: "Connection Compromised",
    desc: "Please inspect your network parameters. Live championship connection requires active sync.",
  },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = "500",
  title,
  description,
  onRetry,
  className,
}) => {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto", className)}>
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive mb-4 shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">{title || config.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-6">{description || config.desc}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} className="rounded-md text-xs font-semibold">
          Retry Connection
        </Button>
      )}
    </div>
  );
};
