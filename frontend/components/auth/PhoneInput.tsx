"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
];

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

export function PhoneInput({ value, onChange, disabled, error, placeholder }: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = React.useState("+91");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [number, setNumber] = React.useState("");

  React.useEffect(() => {
    const digits = number.replace(/\D/g, "");
    onChange(`${selectedCode}${digits}`);
  }, [number, selectedCode, onChange]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className={cn(
        "flex items-center gap-0 rounded-xl border-2 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary",
        error ? "border-destructive focus-within:ring-destructive/30 focus-within:border-destructive" : "border-border/50"
      )}>
        {/* Country code selector */}
        <div className="relative shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-3.5 border-r border-border/30 hover:bg-muted/20 transition-colors text-sm font-bold text-foreground disabled:opacity-50"
          >
            <span>{COUNTRY_CODES.find(c => c.code === selectedCode)?.flag}</span>
            <span className="font-mono text-xs">{selectedCode}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-44 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden">
              {COUNTRY_CODES.map((c) => (
                <button
                  key={`${c.code}-${c.name}`}
                  type="button"
                  onClick={() => { setSelectedCode(c.code); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-muted/30 transition-colors text-left font-medium"
                >
                  <span>{c.flag}</span>
                  <span className="text-foreground">{c.name}</span>
                  <span className="ml-auto font-mono text-muted-foreground">{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone number field */}
        <input
          type="tel"
          inputMode="numeric"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
          placeholder={placeholder || "Mobile Number"}
          disabled={disabled}
          className="flex-1 px-4 py-3.5 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
        />
      </div>

      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}
export default PhoneInput;
