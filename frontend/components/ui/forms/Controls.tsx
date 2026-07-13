"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TEXTAREA FIELD ───
export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className={cn("text-xs font-bold text-foreground tracking-wide", disabled && "opacity-50")}>
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full min-h-24 px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-y disabled:opacity-50",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-[10px] sm:text-xs font-semibold text-destructive">{error}</span>
        ) : (
          helperText && <span className="text-[10px] sm:text-xs text-muted-foreground">{helperText}</span>
        )}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

// ─── SELECT FIELD ───
export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, error, options, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className={cn("text-xs font-bold text-foreground tracking-wide", disabled && "opacity-50")}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-10 pl-3.5 pr-10 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none transition-all disabled:opacity-50",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
        </div>
        {error && <span className="text-[10px] sm:text-xs font-semibold text-destructive">{error}</span>}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

// ─── SWITCH TOGGLE ───
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <label htmlFor={inputId} className={cn("inline-flex items-center gap-3 cursor-pointer select-none", disabled && "opacity-50 pointer-events-none", className)}>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            disabled={disabled}
            {...props}
          />
          <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border/40" />
        </div>
        {label && <span className="text-xs sm:text-sm font-semibold text-foreground">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";

// ─── CHECKBOX ───
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <label htmlFor={inputId} className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", disabled && "opacity-50 pointer-events-none", className)}>
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={cn(
            "w-4 h-4 rounded border border-border bg-card text-primary focus:ring-1 focus:ring-primary/20 accent-primary cursor-pointer disabled:opacity-50",
            className
          )}
          {...props}
        />
        {label && <span className="text-xs sm:text-sm font-medium text-foreground">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ─── RADIO ───
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <label htmlFor={inputId} className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", disabled && "opacity-50 pointer-events-none", className)}>
        <input
          id={inputId}
          ref={ref}
          type="radio"
          disabled={disabled}
          className={cn(
            "w-4 h-4 border border-border bg-card text-primary focus:ring-1 focus:ring-primary/20 accent-primary cursor-pointer disabled:opacity-50",
            className
          )}
          {...props}
        />
        {label && <span className="text-xs sm:text-sm font-medium text-foreground">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";
