"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled, error }: OtpInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(length, "").split("").slice(0, length);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const char = val[val.length - 1];
    const newDigits = [...digits];
    newDigits[index] = char;
    onChange(newDigits.join("").replace(/\s/g, ""));
    // Move to next input
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newDigits = [...digits];
      if (digits[index]) {
        newDigits[index] = " ";
        onChange(newDigits.join("").trimEnd());
      } else if (index > 0) {
        newDigits[index - 1] = " ";
        onChange(newDigits.join("").trimEnd());
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    // Focus last filled or next empty
    const nextEmpty = pasted.length < length ? pasted.length : length - 1;
    inputsRef.current[nextEmpty]?.focus();
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === " " ? "" : digits[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-extrabold rounded-xl border-2 bg-card/30 backdrop-blur-sm transition-all duration-200 outline-none",
            "focus:ring-2 focus:ring-primary/40 focus:border-primary",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/30 text-destructive"
              : digits[i] && digits[i] !== " "
              ? "border-primary/60 bg-primary/5 text-foreground"
              : "border-border/50 text-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
export default OtpInput;
