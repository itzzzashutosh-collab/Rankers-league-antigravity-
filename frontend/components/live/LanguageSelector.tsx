"use client";

import * as React from "react";
import { Languages, Check } from "lucide-react";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  availableLanguages: string[];
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  className?: string;
}

export function LanguageSelector({
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card variant="solid" className={cn("border border-border/40 p-4 rounded-xl text-left bg-card/30 relative", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Languages className="w-4.5 h-4.5 text-primary" />
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Language Selection
            </span>
            <span className="text-xs font-bold text-foreground block mt-0.5">
              Current: {selectedLanguage}
            </span>
          </div>
        </div>

        {/* Dropdown switch */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-3 bg-secondary hover:bg-muted border border-border/60 rounded-lg text-foreground transition-all flex items-center gap-1.5"
          >
            Change Language
          </button>

          {isOpen && (
            <div className="absolute right-0 bottom-full mb-2 bg-card border border-border/80 rounded-xl shadow-xl z-20 min-w-40 p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onLanguageChange(lang);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left text-xs py-2 px-3 rounded-lg flex items-center justify-between font-medium transition-colors",
                    selectedLanguage === lang
                      ? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {lang}
                  {selectedLanguage === lang && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="text-[9px] text-muted-foreground/80 block mt-2">
        ⚠️ Language selection cannot be altered once the examination begins.
      </span>
    </Card>
  );
}
export default LanguageSelector;
