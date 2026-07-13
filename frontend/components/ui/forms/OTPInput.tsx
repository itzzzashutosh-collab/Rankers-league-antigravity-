"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
}) => {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newValue = value.split("");
    newValue[index] = val;
    const combinedValue = newValue.join("");
    onChange(combinedValue);

    // Focus next box
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newValue = value.split("");
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      } else {
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^[0-9]+$/.test(pastedData)) return;

    onChange(pastedData);
    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputsRef.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center w-full">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          disabled={disabled}
          value={value[index] || ""}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "w-10 h-12 text-center text-lg font-bold font-heading rounded-xl border border-border bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all tabular-nums disabled:opacity-50",
            value[index] && "border-primary bg-primary/[0.02]"
          )}
        />
      ))}
    </div>
  );
};
