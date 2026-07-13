"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── ALERT STATUS BANNER ───
type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description: string;
  className?: string;
  onClose?: () => void;
}

const alertStyles: Record<AlertVariant, string> = {
  info: "bg-blue-500/5 text-blue-500 border-blue-500/20",
  success: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/5 text-amber-500 border-amber-500/20",
  error: "bg-destructive/5 text-destructive border-destructive/20",
};

const alertIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const Alert: React.FC<AlertProps> = ({ variant = "info", title, description, className, onClose }) => {
  const Icon = alertIcons[variant];
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-xl border", alertStyles[variant], className)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-left">
        {title && <h4 className="font-heading text-sm font-bold text-foreground mb-1">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-0.5 rounded-md hover:bg-foreground/5 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ─── TOAST NOTIFICATION ───
export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant?: AlertVariant;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = alertIcons[toast.variant || "info"];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={cn(
                "p-4 rounded-xl border bg-card/95 backdrop-blur-sm shadow-xl flex items-start gap-3 border-border/80 glow-subtle pointer-events-auto",
                toast.variant === "success" && "border-emerald-500/20",
                toast.variant === "error" && "border-destructive/20"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 shrink-0 mt-0.5",
                toast.variant === "success" && "text-emerald-500",
                toast.variant === "error" && "text-destructive",
                toast.variant === "warning" && "text-amber-500",
                toast.variant === "info" && "text-blue-500"
              )} />
              <div className="flex-1 text-left">
                {toast.title && <h5 className="font-heading text-xs font-bold text-foreground mb-0.5">{toast.title}</h5>}
                <p className="text-xs text-muted-foreground leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => onRemove(toast.id)} className="p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
