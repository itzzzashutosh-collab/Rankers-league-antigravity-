"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Check,
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
} from "lucide-react";
import { LegalReaderLayout, type LegalTOCHeading } from "./LegalReaderLayout";
import { LegalVersionTimeline } from "./LegalVersionTimeline";
import { LegalSEO } from "./LegalSEO";
import { type SupportedLanguage } from "@/components/ui/LanguageToggle";

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
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  const isHi = lang === "hi";
  const displayTitle = isHi && doc.titleHi ? doc.titleHi : doc.title;
  const displayIntro = isHi && doc.introductionHi ? doc.introductionHi : doc.introduction;
  const displaySections = isHi && doc.sectionsHi ? doc.sectionsHi : doc.sections;
  const displayDefinitions = isHi && doc.definitionsHi ? doc.definitionsHi : doc.definitions;
  const displayRights = isHi && doc.rightsHi ? doc.rightsHi : doc.rights;
  const displayResponsibilities = isHi && doc.responsibilitiesHi ? doc.responsibilitiesHi : doc.responsibilities;
  const displayExceptions = isHi && doc.exceptionsHi ? doc.exceptionsHi : doc.exceptions;

  // Compile TOC headings
  const headings: LegalTOCHeading[] = [
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

  const copySection = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2500);
  };

  return (
    <LegalReaderLayout
      title={displayTitle}
      version={doc.version}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      readTime={doc.readTime}
      category={doc.category}
      headings={headings}
      lang={lang}
      onLanguageChange={(l) => setLang(l)}
      prevDoc={doc.prevDoc}
      nextDoc={doc.nextDoc}
    >
      {/* Dynamic SEO Metadata & JSON-LD Schemas */}
      <LegalSEO
        title={displayTitle}
        description={displayIntro}
        slug={doc.slug}
        category={doc.category}
        version={doc.version}
        effectiveDate={doc.effectiveDate}
        lastUpdated={doc.lastUpdated}
        sections={displaySections}
      />
      {/* Banner */}
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

      {/* Sections AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          {/* 1. Introduction */}
          <div id="intro" className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-3">
            <div className="pb-2 border-b border-border/30">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                {isHi ? "1. परिचय (Introduction)" : "1. Introduction"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{displayIntro}</p>
          </div>

          {/* 2. Policy Clauses */}
          {displaySections.map((sec, i) => {
            const secId = sec.id || `section-${i + 1}`;

            return (
              <div
                key={secId}
                id={secId}
                className="group relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-7 space-y-4 hover:border-primary/30 transition-all shadow-xs"
              >
                <div className="pb-3 border-b border-border/30">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                    <a href={`#${secId}`} className="hover:underline flex items-center gap-2">
                      <span className="text-xs font-mono text-primary/80 opacity-60">#</span>
                      {`${i + 2}. ${sec.title}`}
                    </a>
                  </h2>
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

          {/* 3. Definitions */}
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

          {/* 4. Candidate Rights */}
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

          {/* 5. Responsibilities */}
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

          {/* 6. Exceptions */}
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

      {/* 7. Contact Info */}
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

      {/* 8. Version History Timeline */}
      {doc.versionHistory && doc.versionHistory.length > 0 && (
        <div id="history">
          <LegalVersionTimeline currentVersion={doc.version} history={doc.versionHistory} />
        </div>
      )}

      {/* 9. Legal Disclaimer */}
      <div id="disclaimer" className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-foreground">Ranker's League Legal Governance Disclaimer</h4>
          <p className="text-muted-foreground leading-relaxed">
            This document constitutes an active governing policy of Ranker's League. All registered contestants agree to abide by these terms. For statutory or regulatory notices, reach our compliance officer at <a href="mailto:legal@rankersleague.com" className="text-primary underline font-bold">legal@rankersleague.com</a>.
          </p>
        </div>
      </div>

      {/* 10. Next / Prev Policy Controls */}
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
    </LegalReaderLayout>
  );
}

export default LegalDocumentTemplate;
