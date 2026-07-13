"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer
}: DialogProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    fullscreen: "max-w-full h-full rounded-none"
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-xs select-text">
      <div className={`w-full bg-card border border-border shadow-lg rounded-2xl flex flex-col overflow-hidden max-h-[90vh] animate-fade-in ${sizeClasses[size]}`}>
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-border/40 shrink-0">
          <h3 className="text-sm font-black text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/40 text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-border/45 bg-muted/20 flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Side Panel / Drawer
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer
}: Omit<DialogProps, "size">) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-xs z-50 flex justify-end font-sans text-xs select-text">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content body */}
      <div className="relative w-80 md:w-96 border-l border-border bg-card shadow-xl flex flex-col h-full animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-border/40 shrink-0">
          <h3 className="text-sm font-black text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/40 text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-border/45 bg-muted/10 flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
