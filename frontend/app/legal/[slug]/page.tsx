"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  Languages,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  History,
  AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { legalDocuments, type LegalDocument, type LegalSection } from "@/content/legal-center";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PremiumLegalDocumentReaderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // Language state: 'en' | 'hi'
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedSectionIndex, setCopiedSectionIndex] = useState<number | null>(null);
  const [copiedFullDoc, setCopiedFullDoc] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("section-1");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Find document
  const docIndex = legalDocuments.findIndex((d) => d.slug === slug);
  if (docIndex === -1) {
    notFound();
  }

  const doc = legalDocuments[docIndex];
  const prevDoc = docIndex > 0 ? legalDocuments[docIndex - 1] : null;
  const nextDoc = docIndex < legalDocuments.length - 1 ? legalDocuments[docIndex + 1] : null;

  // Select localized title, description, and sections
  const displayTitle = lang === "hi" && doc.titleHi ? doc.titleHi : doc.title;
  const displayDesc = lang === "hi" && doc.shortDescriptionHi ? doc.shortDescriptionHi : doc.shortDescription;
  const displaySections: LegalSection[] = lang === "hi" && doc.sectionsHi ? doc.sectionsHi : doc.sections;

  // Track Reading Scroll Progress & Active Heading Intersection
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Scroll Spy Heading Detection
      const headings = displaySections.map((_, i) => document.getElementById(`section-${i + 1}`));
      const scrollPos = window.scrollY + 180;

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(`section-${i + 1}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displaySections]);

  // Copy specific section
  const copySectionText = (sec: LegalSection, index: number) => {
    const bullets = sec.bulletPoints ? "\n" + sec.bulletPoints.map((b) => `• ${b}`).join("\n") : "";
    const textToCopy = `${sec.title}\n${sec.content}${bullets}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSectionIndex(index);
    setTimeout(() => setCopiedSectionIndex(null), 2500);
  };

  // Copy full document
  const copyFullDocument = () => {
    const fullText = `${displayTitle}\nVersion: ${doc.version} | Last Updated: ${doc.lastUpdated}\n\n${displayDesc}\n\n` +
      displaySections.map((sec) => `${sec.title}\n${sec.content}\n${sec.bulletPoints ? sec.bulletPoints.join("\n") : ""}`).join("\n\n");
    navigator.clipboard.writeText(fullText);
    setCopiedFullDoc(true);
    setTimeout(() => setCopiedFullDoc(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      
      {/* ── Reading Scroll Progress Bar (Top Edge) ───────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-primary/10">
        <div
          className="h-full bg-gradient-to-r from-primary via-emerald-500 to-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Header />

      <main className="flex-grow">
        {/* ── Sticky Stripe/OpenAI Style Reader Bar ──────────────────────────── */}
        <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md border-b border-border/40 py-3 shadow-xs">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: Back & Document Meta */}
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
                  {displayTitle}
                </span>
                <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                  {doc.version}
                </span>
              </div>
            </div>

            {/* Right: Actions (Language Switcher, Copy Full, Print, Share, Bookmark) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {/* Language Switcher Button */}
              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all shrink-0"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              <div className="h-4 w-px bg-border/50 shrink-0" />

              {/* Copy Full Document */}
              <button
                onClick={copyFullDocument}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
                title="Copy Full Document"
              >
                {copiedFullDoc ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{copiedFullDoc ? "Copied Full!" : "Copy Full"}</span>
              </button>

              {/* Print */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Print</span>
              </button>

              {/* Download PDF (using browser print to PDF) */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">PDF</span>
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

        {/* ── Document Reader Main Area (Max-width ~1100px) ────────────────────── */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* ── LEFT COLUMN: Notion/Apple Table of Contents Sidebar (3 cols) ── */}
            <aside className="lg:col-span-3 hidden lg:block sticky top-28 h-fit space-y-4">
              <div className="p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-1 border-l-2 border-border/30 pl-3">
                  {displaySections.map((sec, i) => {
                    const secId = `section-${i + 1}`;
                    const isActive = activeSectionId === secId;

                    return (
                      <a
                        key={i}
                        href={`#${secId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(secId)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`text-xs py-1 transition-all truncate block ${
                          isActive
                            ? "text-primary font-bold -ml-[13px] border-l-2 border-primary pl-2.5"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {sec.title}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Document Metadata Summary Box */}
              <div className="p-4 rounded-2xl border border-border/40 bg-card/20 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <strong className="text-foreground">{doc.category}</strong>
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

            {/* ── CENTER COLUMN: Centered Stripe/Apple Style Content (9 cols) ─── */}
            <article className="lg:col-span-9 space-y-8 max-w-[880px] mx-auto w-full">
              
              {/* Document Header Banner Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card/80 to-background p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
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

                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
                  {displayTitle}
                </h1>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {displayDesc}
                </p>
              </div>

              {/* Sections Container */}
              <div className="space-y-8">
                {displaySections.map((sec, i) => {
                  const secId = `section-${i + 1}`;
                  const isCopied = copiedSectionIndex === i;

                  return (
                    <motion.div
                      key={i}
                      id={secId}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      className="group relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4 hover:border-primary/30 transition-all shadow-xs"
                    >
                      {/* Heading Row with Section Anchor Link & Copy Section Button */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/30 gap-4">
                        <h2 className="text-lg sm:text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2 group-hover:text-primary transition-colors">
                          <a href={`#${secId}`} className="hover:underline flex items-center gap-2">
                            <span className="text-xs font-mono text-primary/80 opacity-60 group-hover:opacity-100">#</span>
                            {sec.title}
                          </a>
                        </h2>

                        {/* Copy Section Only Button */}
                        <button
                          onClick={() => copySectionText(sec, i)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border transition-all shrink-0"
                          title="Copy Section Text Only"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500 text-[10px]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">Copy Section</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Main Section Content Paragraph */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {sec.content}
                      </p>

                      {/* Bullet Points Container */}
                      {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                        <div className="pt-2">
                          <div className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-2.5">
                            {sec.bulletPoints.map((bp, bpIdx) => (
                              <div key={bpIdx} className="flex items-start gap-2.5 text-xs text-foreground/90 leading-relaxed font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{bp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Version History Log Section ─────────────────────────────── */}
              {doc.versionHistory && doc.versionHistory.length > 0 && (
                <div className="p-6 rounded-2xl border border-border/40 bg-card/20 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    Version History & Policy Log
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

              {/* ── Legal Disclaimer Footer Card ────────────────────────────── */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-foreground">Official Platform Governance Disclaimer</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    This document constitutes an official policy of Ranker's League. All registered contestants must comply with these terms during participation. For questions or legal notices, contact <a href="mailto:legal@rankersleague.com" className="text-primary underline font-bold">legal@rankersleague.com</a>.
                  </p>
                </div>
              </div>

              {/* ── Next / Previous Policy Navigation Buttons ────────────────── */}
              <div className="pt-6 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevDoc ? (
                  <Link href={`/legal/${prevDoc.slug}`} className="group">
                    <div className="p-4 rounded-xl border border-border/50 bg-card/40 hover:border-primary/40 transition-all flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous Policy
                      </span>
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {prevDoc.title}
                      </span>
                    </div>
                  </Link>
                ) : <div />}

                {nextDoc && (
                  <Link href={`/legal/${nextDoc.slug}`} className="group text-right sm:col-start-2">
                    <div className="p-4 rounded-xl border border-border/50 bg-card/40 hover:border-primary/40 transition-all flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1">
                        Next Policy <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {nextDoc.title}
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
