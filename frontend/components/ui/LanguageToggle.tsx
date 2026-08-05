"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export type SupportedLanguage = "en" | "hi" | string;

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

interface LanguageToggleProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  languages?: LanguageOption[];
  className?: string;
  storageKey?: string;
}

export function LanguageToggle({
  currentLang,
  onLanguageChange,
  languages = DEFAULT_LANGUAGES,
  className,
  storageKey = "rankers_pref_lang",
}: LanguageToggleProps) {
  // Load persisted language preference on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(storageKey);
      if (savedLang && languages.some((l) => l.code === savedLang) && savedLang !== currentLang) {
        onLanguageChange(savedLang);
      }
    } catch {}
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    onLanguageChange(code);
    try {
      localStorage.setItem(storageKey, code);
    } catch {}
  };

  // Keyboard Navigation (Left/Right Arrow Keys)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % languages.length;
      handleSelect(languages[nextIndex].code);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + languages.length) % languages.length;
      handleSelect(languages[prevIndex].code);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Language selection"
      className={cn(
        "relative inline-flex items-center bg-secondary/80 border border-border/50 p-1 rounded-full backdrop-blur-md select-none shadow-xs",
        className
      )}
    >
      {/* Optional leading icon */}
      <div className="pl-2 pr-1 text-muted-foreground hidden sm:flex items-center">
        <Languages className="w-3.5 h-3.5 opacity-70" />
      </div>

      <div className="flex items-center gap-1 relative">
        {languages.map((lang, index) => {
          const isActive = currentLang === lang.code;

          return (
            <button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(lang.code)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative z-10 px-3.5 py-1 rounded-full text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* iOS Animated Sliding Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="ios-active-lang-pill"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                  className="absolute inset-0 bg-primary rounded-full shadow-md -z-10"
                />
              )}

              <span>{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageToggle;
