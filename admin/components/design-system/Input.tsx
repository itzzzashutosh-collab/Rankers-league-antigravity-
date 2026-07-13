"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar, Clock, DollarSign, ChevronDown, Check, X } from "lucide-react";

// Standard input base props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-9 px-3 rounded-lg border bg-background/50 font-sans text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary ${
          error ? "border-destructive focus:ring-destructive" : "border-border"
        } ${className}`}
        {...props}
      />
    );
  }
);
TextInput.displayName = "TextInput";

// Textarea
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full p-3 rounded-xl border bg-background/50 font-sans text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary ${
          error ? "border-destructive focus:ring-destructive" : "border-border"
        } ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Search Input
export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center text-xs w-full">
        <Search className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
        <TextInput ref={ref} className={`pl-9 ${className}`} {...props} />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

// Currency Input
export const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center text-xs w-full">
        <DollarSign className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
        <TextInput ref={ref} className={`pl-8 ${className}`} {...props} />
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

// DatePicker
export const DatePicker = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center text-xs w-full">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
        <TextInput type="date" ref={ref} className={`pl-8 ${className}`} {...props} />
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

// TimePicker
export const TimePicker = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center text-xs w-full">
        <Clock className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
        <TextInput type="time" ref={ref} className={`pl-8 ${className}`} {...props} />
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";

// OTP Input
export function OTPInput({ length = 6, value = "", onChange }: { length?: number; value?: string; onChange: (v: string) => void }) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.slice(-1);
    const chars = value.split("");
    chars[idx] = val;
    const newVal = chars.join("");
    onChange(newVal);

    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            if (el) inputsRef.current[idx] = el;
          }}
          type="text"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-10 h-10 text-center rounded-lg border border-border bg-background/50 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ))}
    </div>
  );
}

// Select Component (Searchable, Multi)
interface Option {
  label: string;
  value: string;
  group?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  isMulti = false,
  isSearchable = false,
  error = false
}: {
  options: Option[];
  value: string | string[];
  onChange: (val: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  error?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectOption = (opt: Option) => {
    if (isMulti) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.includes(opt.value)) {
        onChange(arr.filter(v => v !== opt.value));
      } else {
        onChange([...arr, opt.value]);
      }
    } else {
      onChange(opt.value);
      setIsOpen(false);
    }
  };

  const isSelected = (opt: Option) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(opt.value);
    }
    return value === opt.value;
  };

  const getLabel = () => {
    if (isMulti) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.length === 0) return placeholder;
      return `${arr.length} selected`;
    }
    const found = options.find(o => o.value === value);
    return found ? found.label : placeholder;
  };

  // Group by field if present
  const grouped: Record<string, Option[]> = {};
  filteredOptions.forEach(opt => {
    const key = opt.group || "";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(opt);
  });

  return (
    <div className="relative font-sans text-xs w-full" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-9 px-3 rounded-lg border bg-background/50 flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-primary text-left ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        <span className="truncate">{getLabel()}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full rounded-lg border border-border bg-card shadow-lg z-50 p-2 space-y-2 max-h-60 overflow-y-auto">
          {isSearchable && (
            <SearchInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <div className="space-y-2">
            {Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName} className="space-y-0.5">
                {groupName && (
                  <div className="px-2 py-1 text-[8px] font-black text-muted-foreground uppercase tracking-wider bg-muted/20 rounded">
                    {groupName}
                  </div>
                )}
                {items.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectOption(opt)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-muted/40 transition-colors text-left font-semibold"
                  >
                    <span>{opt.label}</span>
                    {isSelected(opt) && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground/60 font-bold">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
