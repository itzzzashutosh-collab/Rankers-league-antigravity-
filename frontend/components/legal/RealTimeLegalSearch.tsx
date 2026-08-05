"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  History,
  CornerDownLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import legalCmsService, { type CMSLegalDocument } from "@/services/legalCmsService";

export interface LegalSearchResult {
  document: CMSLegalDocument;
  matchType: "title" | "heading" | "content" | "keyword" | "definition";
  matchedSnippet: string;
  matchedHeading?: string;
  score: number;
}

const RECENT_SEARCHES_KEY = "rankers_legal_recent_searches";
const POPULAR_SEARCH_TAGS = [
  "Contest Rules",
  "Refund Policy",
  "TDS Deduction",
  "Fair Play",
  "Tie Breaking",
  "Withdrawal Limits",
  "Anti-Cheating",
  "Privacy",
];

interface RealTimeLegalSearchProps {
  placeholder?: string;
  className?: string;
  onSelectResult?: () => void;
}

export function RealTimeLegalSearch({
  placeholder = "Search 20+ policies, rules, refunds, TDS, fair play (English / हिन्दी)...",
  className = "",
  onSelectResult,
}: RealTimeLegalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Recent Searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Save Recent Search
  const saveRecentSearch = (searchTerm: string) => {
    const cleaned = searchTerm.trim();
    if (!cleaned) return;
    const updated = [cleaned, ...recentSearches.filter((s) => s !== cleaned)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const removeRecentSearch = (e: React.MouseEvent, searchTerm: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== searchTerm);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Real-Time Search Engine Algorithm across Titles, Headings, Sub-headings, Content, Definitions, and Keywords
  const searchResults = useMemo<LegalSearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const publishedDocs = legalCmsService.getPublishedDocuments();
    const results: LegalSearchResult[] = [];

    publishedDocs.forEach((doc) => {
      let score = 0;
      let matchType: LegalSearchResult["matchType"] = "content";
      let matchedSnippet = doc.shortDescription;
      let matchedHeading: string | undefined = undefined;

      // 1. Title match (Highest weight)
      if (doc.title.toLowerCase().includes(q) || (doc.titleHi && doc.titleHi.includes(q))) {
        score += 100;
        matchType = "title";
        matchedSnippet = doc.titleHi && doc.titleHi.includes(q) ? doc.titleHi : doc.title;
      }

      // 2. SEO Keywords match
      if (doc.seo?.keywords.some((k) => k.toLowerCase().includes(q))) {
        score += 50;
        matchType = "keyword";
      }

      // 3. Sections & Headings match
      doc.sections.forEach((sec) => {
        if (sec.title.toLowerCase().includes(q)) {
          score += 40;
          matchType = "heading";
          matchedHeading = sec.title;
          matchedSnippet = sec.content.slice(0, 140) + "...";
        } else if (sec.content.toLowerCase().includes(q)) {
          score += 20;
          if (matchType !== "title" && matchType !== "heading") {
            matchType = "content";
            matchedHeading = sec.title;
            const idx = sec.content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 40);
            const end = Math.min(sec.content.length, idx + 100);
            matchedSnippet = "..." + sec.content.slice(start, end) + "...";
          }
        }
      });

      // 4. Hindi Sections match
      if (doc.sectionsHi) {
        doc.sectionsHi.forEach((secHi) => {
          if (secHi.title.includes(q) || secHi.content.includes(q)) {
            score += 30;
            matchedHeading = secHi.title;
            matchedSnippet = secHi.content.slice(0, 140) + "...";
          }
        });
      }

      if (score > 0) {
        results.push({
          document: doc,
          matchType,
          matchedSnippet,
          matchedHeading,
          score,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }, [query]);

  // Keyboard Arrow Key Selection Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        saveRecentSearch(query);
        setIsOpen(false);
        if (onSelectResult) onSelectResult();
        window.location.href = `/legal/${selected.document.slug}`;
      }
    }
  };

  // Text Highlighting Helper
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    const parts = text.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-primary/30 text-primary font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      
      {/* ── Search Bar Input Field ────────────────────────────────────────── */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3.5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md text-xs sm:text-sm text-foreground placeholder:text-muted-foreground shadow-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
        />

        {/* Right side controls (Clear + Cmd/Ctrl+K badge) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-border/50 bg-muted/60 font-mono text-[10px] text-muted-foreground font-bold">
              <kbd>⌘</kbd><kbd>K</kbd>
            </span>
          )}
        </div>
      </div>

      {/* ── Real-Time Instant Search Results Dropdown ───────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl p-4 shadow-2xl space-y-4 max-h-[480px] overflow-y-auto"
          >
            {/* If user is typing, show live results */}
            {query.trim() ? (
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>Matches Found ({searchResults.length})</span>
                    <span>Use ↑↓ to navigate, Enter to select</span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.map((res, i) => {
                      const isSelected = selectedIndex === i;

                      return (
                        <Link
                          key={`search-res-${res.document.id || res.document.slug}-${i}`}
                          href={`/legal/${res.document.slug}`}
                          onClick={() => {
                            saveRecentSearch(query);
                            setIsOpen(false);
                            if (onSelectResult) onSelectResult();
                          }}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={`block p-3.5 rounded-2xl border transition-all ${
                            isSelected
                              ? "bg-primary/10 border-primary/40 shadow-xs"
                              : "border-border/30 bg-card/30 hover:border-border/60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-primary" />
                              <span className="font-bold text-xs text-foreground">
                                {highlightMatch(res.document.title, query)}
                              </span>
                              <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                {res.document.version}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {res.matchType}
                            </span>
                          </div>

                          {res.matchedHeading && (
                            <div className="text-[11px] font-semibold text-primary/80 mb-1 flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              <span>{highlightMatch(res.matchedHeading, query)}</span>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {highlightMatch(res.matchedSnippet, query)}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-bold text-foreground">No matching legal policies found</p>
                  <p className="text-xs text-muted-foreground">
                    Try searching for "refunds", "TDS", "JEE score", "fair play", or "rules".
                  </p>
                </div>
              )
            ) : (
              /* If input is empty, show Popular Tags & Recent Searches */
              <div className="space-y-4 text-xs">
                
                {/* Popular Tags */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" /> Popular Legal Topics
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setQuery(tag);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 rounded-xl border border-border/40 bg-card/40 hover:border-primary/40 text-foreground text-xs transition-all flex items-center gap-1.5"
                      >
                        <Tag className="w-3 h-3 text-primary/70" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border/30">
                    <div className="flex items-center justify-between text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-primary" /> Recent Searches
                      </span>
                      <button
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem(RECENT_SEARCHES_KEY);
                        }}
                        className="text-muted-foreground hover:text-foreground text-[10px]"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-1">
                      {recentSearches.map((s) => (
                        <div
                          key={s}
                          onClick={() => {
                            setQuery(s);
                            inputRef.current?.focus();
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/40 cursor-pointer text-foreground text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {s}
                          </span>
                          <button
                            onClick={(e) => removeRecentSearch(e, s)}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="pt-3 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> Press Enter to select
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-foreground font-bold"
              >
                Close (Esc)
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default RealTimeLegalSearch;
