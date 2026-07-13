"use client";

import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  charCount?: number;
  maxCharCount?: number;
  children: React.ReactNode;
}

export function FormField({
  label,
  hint,
  error,
  success,
  required,
  charCount,
  maxCharCount,
  children
}: FormFieldProps) {
  return (
    <div className="space-y-1.5 text-xs font-sans">
      {/* Label and Character counter */}
      {(label || maxCharCount !== undefined) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="font-bold text-muted-foreground flex items-center gap-0.5">
              {label}
              {required && <span className="text-destructive font-black">*</span>}
            </label>
          )}
          {maxCharCount !== undefined && charCount !== undefined && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {charCount}/{maxCharCount}
            </span>
          )}
        </div>
      )}

      {/* Input container */}
      <div className="relative">{children}</div>

      {/* Validation status feedback */}
      {error && (
        <div className="flex items-center gap-1 text-[10px] text-destructive font-bold animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold animate-fade-in">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{success}</span>
        </div>
      )}

      {hint && !error && !success && (
        <p className="text-[10px] text-muted-foreground leading-normal font-medium">{hint}</p>
      )}
    </div>
  );
}

// FormSection Layout
export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-b border-border/30 pb-6 last:border-none last:pb-0">
      <div className="space-y-0.5">
        <h3 className="text-sm font-black text-foreground">{title}</h3>
        {description && <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
