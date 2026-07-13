"use client";

import * as React from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type = "text", label, error, helperText, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isPassword = type === "password";
    const isSearch = type === "search";
    
    const computedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-bold text-foreground tracking-wide select-none",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {/* Left Icon (Search overrides custom leftIcon) */}
          {isSearch ? (
            <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          ) : (
            leftIcon && <span className="absolute left-3.5 text-muted-foreground">{leftIcon}</span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={computedType}
            disabled={disabled}
            className={cn(
              "w-full h-10 px-3.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:pointer-events-none",
              isSearch && "pl-10",
              !isSearch && leftIcon && "pl-10",
              (isPassword || rightIcon) && "pr-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            {...props}
          />

          {/* Right Icon / Password toggle */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && <span className="absolute right-3.5 text-muted-foreground">{rightIcon}</span>
          )}
        </div>

        {error ? (
          <span className="text-[10px] sm:text-xs font-semibold text-destructive">
            {error}
          </span>
        ) : (
          helperText && (
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {helperText}
            </span>
          )
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
