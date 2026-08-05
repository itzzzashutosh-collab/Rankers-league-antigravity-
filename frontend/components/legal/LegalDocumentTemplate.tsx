"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Shield,
  Printer,
  Share2,
  Bookmark,
  Check,
  Copy,
  Download,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  History,
  AlertTriangle,
  Mail,
  FileCheck2,
  BookMarked,
  Info,
  Scale,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageToggle, type SupportedLanguage } from "@/components/ui/LanguageToggle";

export interface StandardLegalSection {
  id?: string;
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface DefinitionItem {
  term: string;
  meaning: string;
}

export interface VersionLogItem {
  version: string;
  date: string;
  summary: string;
}

export interface StandardLegalDocumentData {
  slug: string;
  title: string;
  titleHi?: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  readTime: string;
  category: string;
  
  // Standardized Sections
  introduction: string;
  introductionHi?: string;
  
  sections: StandardLegalSection[];
  sectionsHi?: StandardLegalSection[];
  
  definitions?: DefinitionItem[];
  definitionsHi?: DefinitionItem[];
  
  rights?: string[];
  rightsHi?: string[];
  
  responsibilities?: string[];
  responsibilitiesHi?: string[];
  
  exceptions?: string[];
  exceptionsHi?: string[];
  
  contactEmail?: string;
  contactAddress?: string;
  
  versionHistory?: VersionLogItem[];
  
  prevDoc?: { title: string; slug: string } | null;
  nextDoc?: { title: string; slug: string } | null;
}

interface LegalDocumentTemplateProps {
  document: StandardLegalDocumentData;
}

export function LegalDocumentTemplate({ document: doc }: LegalDocumentTemplateProps) {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [copiedFullDoc, setCopiedFullDoc] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("intro");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Localization selectors
  const isHi = lang === "hi";
  const displayTitle = isHi && doc.titleHi ? doc.titleHi : doc.title;
  const displayIntro = isHi && doc.introductionHi ? doc.introductionHi : doc.introduction;
  const displaySections = isHi && doc.sectionsHi ? doc.sectionsHi : doc.sections;
  const displayDefinitions = isHi && doc.definitionsHi ? doc.definitionsHi : doc.definitions;
  const displayRights = isHi && doc.rightsHi ? doc.rightsHi : doc.rights;
  const displayResponsibilities = isHi && doc.responsibilitiesHi ? doc.responsibilitiesHi : doc.responsibilities;
  const displayExceptions = isHi && doc.exceptionsHi ? doc.exceptionsHi : doc.exceptions;

  // Build Table of Contents Headings list
  const headings = [
    { id: "intro", title: isHi ? "1. परिचय (Introduction)" : "1. Introduction" },
    ...displaySections.map((s, i) => ({
      id: s.id || `section-${i + 1}`,
      title: `${i + 2}. ${s.title}`,
    })),
    ...(displayDefinitions ? [{ id: "definitions", title: isHi ? "परिभाषाएं (Definitions)" : "Definitions" }] : []),
    ...(displayRights ? [{ id: "rights", title: isHi ? "उपयोगकर्ता अधिकार (User Rights)" : "User Rights" }] : []),
    ...(displayResponsibilities ? [{ id: "responsibilities", title: isHi ? "जिम्मेदारियां (Responsibilities)" : "Responsibilities" }] : []),
    ...(displayExceptions ? [{ id: "exceptions", title: isHi ? "अपवाद (Exceptions)" : "Exceptions" }] : []),
    { id: "contact", title: isHi ? "संपर्क जानकारी (Contact Info)" : "Contact Information" },
    { id: "disclaimer", title: isHi ? "कानूनी अस्वीकरण (Disclaimer)" : "Legal Disclaimer" },
    ...(doc.versionHistory ? [{ id: "history", title: isHi ? "संस्करण इतिहास (Version History)" : "Version History" }] : []),
  ];

  // Track Reading Scroll Progress & Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }

      const elements = headings.map((h) => document.getElementById(h.id));
      const scrollPos = window.scrollY + 180;

      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Copy Section Text
  const copySection = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2500);
  };

  // Copy Full Document
  const copyFull = () => {
    const fullText = `${displayTitle}\nVersion: ${doc.version} | Effective: ${doc.effectiveDate} | Updated: ${doc.lastUpdated}\n\nIntroduction:\n${displayIntro}\n\n` +
      displaySections.map((s) => `${s.title}\n${s.content}\n${s.bulletPoints ? s.bulletPoints.join("\n") : ""}`).join("\n\n");
    navigator.clipboard.writeText(fullText);
    setCopiedFullDoc(true);
    setTimeout(() => setCopiedFullDoc(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-primary/10">
        <div
          className="h-full bg-gradient-to-r from-primary via-emerald-500 to-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Header />

      <main className="flex-grow">
        {/* Sticky Header Actions Bar */}
        <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md border-b border-border/40 py-3 shadow-xs">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: Back & Document Title */}
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
                <span className="text-xs font-black text-foreground tracking-tight truncate max-w-[220px] sm:max-w-[340px]">
                  {displayTitle}
                </span>
                <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                  {doc.version}
                </span>
              </div>
            </div>

            {/* Right: Actions Bar */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {/* iOS Animated Language Toggle */}
              <LanguageToggle
                currentLang={lang}
                onLanguageChange={(l) => setLang(l)}
                storageKey="rankers_legal_doc_lang"
              />

              <div className="h-4 w-px bg-border/50 shrink-0" />

              {/* Copy Full */}
              <button
                onClick={copyFull}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
              >
                {copiedFullDoc ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{copiedFullDoc ? "Copied!" : "Copy Full"}</span>
              </button>

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
                    navigator.share({ title: displayTitle, url: window.location.href });
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

        {/* Main Document Layout */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Sticky Table of Contents (3 cols) */}
            <aside className="lg:col-span-3 hidden lg:block sticky top-28 h-fit space-y-4">
              <div className="p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-1 border-l-2 border-border/30 pl-3">
                  {headings.map((h) => {
                    const isActive = activeSectionId === h.id;
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

              {/* Metadata Box */}
              <div className="p-4 rounded-2xl border border-border/40 bg-card/20 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <strong className="text-foreground font-mono">{doc.version}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Effective Date:</span>
                  <strong className="text-foreground">{doc.effectiveDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <strong className="text-foreground">{doc.lastUpdated}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Est. Read Time:</span>
                  <strong className="text-foreground">{doc.readTime}</strong>
                </div>
              </div>
            </aside>

            {/* Center Column: Standardized Content Body (9 cols) */}
            <article className="lg:col-span-9 space-y-8 max-w-[880px] mx-auto w-full">
              
              {/* Document Banner */}
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card/80 to-background p-8 shadow-xl">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-primary/20 bg-primary/10 text-primary">
                    {doc.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded border border-border/40 font-bold">
                    {doc.version}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 ml-auto">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {doc.readTime}
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
                  {displayTitle}
                </h1>

                {/* Metadata badges row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/30">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Effective: <strong className="text-foreground">{doc.effectiveDate}</strong></span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Updated: <strong className="text-foreground">{doc.lastUpdated}</strong></span>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* 1. Introduction Section */}
                  <div id="intro" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/30">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        {isHi ? "1. परिचय (Introduction)" : "1. Introduction"}
                      </h2>
                      <button
                        onClick={() => copySection("intro", displayIntro)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground text-xs"
                      >
                        {copiedSectionId === "intro" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{displayIntro}</p>
                  </div>

                  {/* 2. Policy Sections */}
                  {displaySections.map((sec, i) => {
                    const secId = sec.id || `section-${i + 1}`;
                    const isCopied = copiedSectionId === secId;

                    return (
                      <div
                        key={secId}
                        id={secId}
                        className="group relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4 hover:border-primary/30 transition-all shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-border/30 gap-4">
                          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                            <a href={`#${secId}`} className="hover:underline flex items-center gap-2">
                              <span className="text-xs font-mono text-primary/80 opacity-60">#</span>
                              {`${i + 2}. ${sec.title}`}
                            </a>
                          </h2>

                          <button
                            onClick={() => copySection(secId, `${sec.title}\n${sec.content}`)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground transition-all shrink-0"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">{isCopied ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{sec.content}</p>

                        {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                          <div className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-2">
                            {sec.bulletPoints.map((bp, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90 leading-relaxed font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{bp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* 3. Definitions Section */}
                  {displayDefinitions && displayDefinitions.length > 0 && (
                    <div id="definitions" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
                        <BookMarked className="w-4 h-4 text-primary" />
                        {isHi ? "परिभाषाएं (Definitions)" : "Definitions"}
                      </h2>
                      <div className="grid gap-3">
                        {displayDefinitions.map((def, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl border border-border/30 bg-card/20 space-y-1 text-xs">
                            <strong className="text-primary font-bold font-mono">{def.term}</strong>
                            <p className="text-muted-foreground leading-relaxed">{def.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Candidate Rights Section */}
                  {displayRights && displayRights.length > 0 && (
                    <div id="rights" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
                        <Scale className="w-4 h-4 text-emerald-500" />
                        {isHi ? "उपयोगकर्ता अधिकार (User Rights)" : "Candidate Rights"}
                      </h2>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {displayRights.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 5. Responsibilities Section */}
                  {displayResponsibilities && displayResponsibilities.length > 0 && (
                    <div id="responsibilities" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
                        <FileCheck2 className="w-4 h-4 text-amber-500" />
                        {isHi ? "जिम्मेदारियां (Responsibilities)" : "Candidate Responsibilities"}
                      </h2>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {displayResponsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 6. Exceptions Section */}
                  {displayExceptions && displayExceptions.length > 0 && (
                    <div id="exceptions" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        {isHi ? "अपवाद (Exceptions)" : "Exceptions & Edge Cases"}
                      </h2>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {displayExceptions.map((ex, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* 7. Contact Information Card */}
              <div id="contact" className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {isHi ? "संपर्क जानकारी (Legal Contact Desk)" : "Official Legal Contact Information"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For legal communications, statutory inquiries, or policy verifications regarding this document:
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-medium">
                  <a href={`mailto:${doc.contactEmail || "legal@rankersleague.com"}`} className="text-primary hover:underline font-bold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {doc.contactEmail || "legal@rankersleague.com"}
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{doc.contactAddress || "Ranker's League Legal Cell, Tech Park, New Delhi, India"}</span>
                </div>
              </div>

              {/* 8. Version History Log */}
              {doc.versionHistory && doc.versionHistory.length > 0 && (
                <div id="history" className="p-6 rounded-2xl border border-border/40 bg-card/20 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    {isHi ? "संस्करण इतिहास (Version History)" : "Version History & Policy Audit Log"}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/30 text-muted-foreground font-bold">
                          <th className="py-2 pr-4">Version</th>
                          <th className="py-2 pr-4">Date</th>
                          <th className="py-2">Changelog Summary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {doc.versionHistory.map((vh, idx) => (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="py-2.5 pr-4 font-mono font-bold text-primary">{vh.version}</td>
                            <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">{vh.date}</td>
                            <td className="py-2.5 text-foreground/90">{vh.summary}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 9. Legal Disclaimer Footer */}
              <div id="disclaimer" className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-foreground">Ranker's League Legal Governance Disclaimer</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    This document constitutes an active governing policy of Ranker's League. All registered contestants agree to abide by these terms. For statutory or regulatory notices, reach our compliance officer at <a href="mailto:legal@rankersleague.com" className="text-primary underline font-bold">legal@rankersleague.com</a>.
                  </p>
                </div>
              </div>

              {/* 10. Next / Previous Policy Navigation Controls */}
              <div className="pt-6 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doc.prevDoc ? (
                  <Link href={`/legal/${doc.prevDoc.slug}`} className="group">
                    <div className="p-4 rounded-xl border border-border/50 bg-card/40 hover:border-primary/40 transition-all flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous Policy
                      </span>
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {doc.prevDoc.title}
                      </span>
                    </div>
                  </Link>
                ) : <div />}

                {doc.nextDoc && (
                  <Link href={`/legal/${doc.nextDoc.slug}`} className="group text-right sm:col-start-2">
                    <div className="p-4 rounded-xl border border-border/50 bg-card/40 hover:border-primary/40 transition-all flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1">
                        Next Policy <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {doc.nextDoc.title}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

            </article>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LegalDocumentTemplate;
