"use client";

import * as React from "react";
import { Search, Flame, Clock, Command, X, ArrowUpRight } from "lucide-react";
import { InputField } from "../ui";
import { popularSearches, recentSearches } from "../../content/contest-tags";
import { cn } from "@/lib/utils";

interface ContestSearchProps {
  onSearch: (term: string) => void;
  className?: string;
}

export function ContestSearch({ onSearch, className }: ContestSearchProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const handleSuggestionClick = (val: string) => {
    setSearchTerm(val);
    onSearch(val);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <InputField
          type="text"
          placeholder="Search by contest, exam, subject, difficulty..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-10 pr-16 py-3 bg-card/60 border border-border/80 rounded-xl text-sm transition-all focus:border-primary/50 focus:bg-card focus:shadow-md"
        />
        <div className="absolute left-3.5 text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>

        {/* Clear/Hotkey Indicator */}
        <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none select-none">
          {searchTerm ? (
            <button
              onClick={handleClear}
              className="pointer-events-auto p-1 rounded-md hover:bg-muted text-muted-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-muted/50 text-[10px] font-mono text-muted-foreground">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          )}
        </div>
      </div>

      {/* Instant Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-border/80 rounded-xl shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Popular searches */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-2.5 py-1 text-xs rounded-md bg-secondary hover:bg-primary/10 hover:text-primary transition-colors border border-border/60 text-foreground font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Recent searches */}
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              Recent Enquiries
            </span>
            <div className="flex flex-col gap-1.5">
              {recentSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground text-left transition-colors"
                >
                  <span>{s}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ContestSearch;
