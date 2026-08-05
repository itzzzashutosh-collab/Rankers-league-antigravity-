"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Printer,
  Share2,
  Bookmark,
  Check,
  Download,
  BookOpen,
  ArrowUp,
  Mail,
  HelpCircle,
  Sparkles,
  FileCheck,
  Shield,
  Zap,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageToggle, type SupportedLanguage } from "@/components/ui/LanguageToggle";

export interface LegalTOCHeading {
  id: string;
  title: string;
}

export interface LegalReaderLayoutProps {
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  readTime: string;
  category: string;
  headings: LegalTOCHeading[];
  lang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  prevDoc?: { title: string; slug: string } | null;
  nextDoc?: { title: string; slug: string } | null;
  children: React.ReactNode;
}

export function LegalReaderLayout({
  title,
  version,
  effectiveDate,
  lastUpdated,
  readTime,
  category,
  headings,
  lang,
  onLanguageChange,
  prevDoc,
  nextDoc,
  children,
}: LegalReaderLayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>(headings[0]?.id || "");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedFullDoc, setCopiedFullDoc] = useState(false);
  const [copiedFloating, setCopiedFloating] = useState(false);

  // Track Reading Scroll Progress, Floating Scroll-to-Top, and Scroll Spy Active Heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      setShowScrollTop(window.scrollY > 300);

      // Auto Highlight Active Section via Scroll Spy
      const elements = headings.map((h) => document.getElementById(h.id));
      const scrollPos = window.scrollY + 200;

      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeadingId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyFullText = () => {
    const mainEl = document.getElementById("legal-main-content");
    if (mainEl) {
      navigator.clipboard.writeText(mainEl.innerText);
      setCopiedFullDoc(true);
      setTimeout(() => setCopiedFullDoc(false), 2500);
    }
  };

  const copyFloatingText = () => {
    const mainEl = document.getElementById("legal-main-content");
    if (mainEl) {
      navigator.clipboard.writeText(mainEl.innerText);
      setCopiedFloating(true);
      setTimeout(() => setCopiedFloating(false), 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      
      {/* ── 1. Scroll Progress Bar (Fixed Top Edge) ────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-primary/10">
        <div
          className="h-full bg-gradient-to-r from-primary via-emerald-500 to-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Header />

      <main className="flex-grow">
        
        {/* ── 2. Sticky Master Reader Header Bar ──────────────────────────── */}
        <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md border-b border-border/40 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Metadata & Back Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/legal"
                className="p-1.5 rounded-lg border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                title="Back to Legal Center"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <div className="h-4 w-px bg-border/50 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-foreground tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
                  {title}
                </span>
                <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                  {version}
                </span>
              </div>
            </div>

            {/* Right Toolbar Actions */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {/* iOS Animated Language Toggle */}
              <LanguageToggle
                currentLang={lang}
                onLanguageChange={onLanguageChange}
                storageKey="rankers_legal_doc_lang"
              />

              <div className="h-4 w-px bg-border/50 shrink-0" />

              {/* PDF / Print */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
                title="Print or Export PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Print / PDF</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Document link copied to clipboard!");
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
                title="Share Document"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Bookmark */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                  isBookmarked
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
                }`}
                title={isBookmarked ? "Bookmarked" : "Bookmark Document"}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current opacity-90" />
              </button>
            </div>

          </div>
        </div>

        {/* ── 3. 3-Column Document Reader Layout ───────────────────────────── */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ── LEFT COLUMN: Table of Contents Sidebar (3 cols) ──────────── */}
            <aside className="lg:col-span-3 hidden lg:block sticky top-28 h-fit space-y-4">
              <div className="p-4.5 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-3 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-1 border-l-2 border-border/30 pl-3">
                  {headings.map((h) => {
                    const isActive = activeHeadingId === h.id;
                    return (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`text-xs py-1 transition-all truncate block ${
                          isActive
                            ? "text-primary font-bold -ml-[13px] border-l-2 border-primary pl-2.5"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {h.title}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Document Overview Metadata */}
              <div className="p-4 rounded-2xl border border-border/40 bg-card/20 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <strong className="text-foreground">{category}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <strong className="text-foreground font-mono">{version}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Effective:</span>
                  <strong className="text-foreground">{effectiveDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <strong className="text-foreground">{lastUpdated}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Est. Read Time:</span>
                  <strong className="text-foreground">{readTime}</strong>
                </div>
              </div>
            </aside>

            {/* ── CENTER COLUMN: Main Document Content (6 cols lg / 9 cols) ── */}
            <article id="legal-main-content" className="lg:col-span-6 space-y-8 w-full max-w-[850px] mx-auto">
              {children}
            </article>

            {/* ── RIGHT COLUMN: Reading Progress & Quick Actions (3 cols) ──── */}
            <aside className="lg:col-span-3 hidden lg:block sticky top-28 h-fit space-y-4">
              
              {/* Reading Progress Circle Widget */}
              <div className="p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-3 shadow-xs text-center">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  Reading Progress
                </h4>
                
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted/30"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary transition-all duration-150"
                      strokeDasharray={`${scrollProgress}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-mono text-sm font-bold text-foreground">
                    {Math.round(scrollProgress)}%
                  </span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-2.5 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-primary" />
                  Quick Tools
                </h4>

                <button
                  onClick={() => window.print()}
                  className="w-full py-2 px-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card text-xs font-bold text-foreground flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-primary" /> Export as PDF
                  </span>
                </button>

                <a
                  href="mailto:legal@rankersleague.com"
                  className="w-full py-2 px-3 rounded-xl border border-primary/20 bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary flex items-center justify-between transition-all block text-left"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Legal Help Desk
                  </span>
                </a>
              </div>

            </aside>

          </div>
        </section>

        {/* ── 4. Floating Action Controls (Bottom Right) ──────────────────── */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
          {/* Floating Scroll-to-Top Button */}

          {/* Floating Scroll-to-Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="p-3 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default LegalReaderLayout;
