"use client";

import React from "react";
import { Loader2, ChevronDown } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
      outline: "border border-border bg-background hover:bg-muted/40 text-foreground active:scale-[0.98]",
      ghost: "hover:bg-muted/30 text-foreground",
      link: "text-primary underline-offset-4 hover:underline p-0 bg-transparent rounded-none",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
      success: "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]"
    };

    const sizes = {
      sm: "h-8 px-3 text-[10px] gap-1",
      md: "h-9 px-4 text-xs gap-1.5",
      lg: "h-11 px-6 text-sm gap-2"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

// Dropdown Button
export function DropdownButton({ label, items, ...props }: { label: string; items: Array<{ label: string; onClick: () => void }> }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button variant="outline" rightIcon={<ChevronDown className="w-3.5 h-3.5" />} onClick={() => setOpen(!open)} {...props}>
        {label}
      </Button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden font-sans">
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-[11px] font-bold text-foreground hover:bg-muted/40 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Split Button
export function SplitButton({
  label,
  onClick,
  items,
  ...props
}: {
  label: string;
  onClick: () => void;
  items: Array<{ label: string; onClick: () => void }>;
}) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex" ref={menuRef}>
      <Button className="rounded-r-none border-r-0" onClick={onClick} {...props}>
        {label}
      </Button>
      <button
        onClick={() => setOpen(!open)}
        className="px-2 border border-border border-l-0 rounded-r-lg bg-background hover:bg-muted/30 text-foreground transition-colors flex items-center justify-center focus:outline-none"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden font-sans">
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-[11px] font-bold text-foreground hover:bg-muted/45 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
