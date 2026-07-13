"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function UsernameField({ value, onChange, disabled, error }: UsernameFieldProps) {
  const [availability, setAvailability] = React.useState<{
    available: boolean | null;
    message: string;
    loading: boolean;
  }>({ available: null, message: "", loading: false });

  const debouncedValue = useDebounce(value, 500);

  React.useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 3) {
      setAvailability({ available: null, message: "", loading: false });
      return;
    }

    const check = async () => {
      setAvailability((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(debouncedValue)}`);
        const data = await res.json();
        setAvailability({ available: data.available, message: data.message, loading: false });
      } catch {
        setAvailability({ available: null, message: "Unable to check username.", loading: false });
      }
    };
    check();
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    onChange(clean);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className={cn(
        "flex items-center gap-2 rounded-xl border-2 bg-card/30 backdrop-blur-sm px-4 py-3.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary",
        error || availability.available === false
          ? "border-destructive focus-within:ring-destructive/30"
          : availability.available === true
          ? "border-emerald-500/50 focus-within:ring-emerald-500/20 focus-within:border-emerald-500"
          : "border-border/50"
      )}>
        <span className="text-muted-foreground text-sm font-medium shrink-0">@</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="your_username"
          maxLength={20}
          className="flex-1 bg-transparent text-sm font-mono font-medium text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
        />
        {availability.loading && (
          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />
        )}
        {!availability.loading && availability.available === true && (
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
        {!availability.loading && availability.available === false && (
          <X className="w-4 h-4 text-destructive shrink-0" />
        )}
      </div>

      {(availability.message || error) && (
        <p className={cn(
          "text-xs font-medium",
          error ? "text-destructive" :
          availability.available === true ? "text-emerald-500" : "text-destructive"
        )}>
          {error || availability.message}
        </p>
      )}

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        3–20 characters · lowercase letters, numbers and underscore only
      </p>
    </div>
  );
}
export default UsernameField;
