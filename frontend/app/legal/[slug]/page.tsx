"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Shield,
  Printer,
  Share2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { legalDocuments, type LegalDocument } from "@/content/legal-center";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function LegalDocumentReadingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // Find document index and object
  const docIndex = legalDocuments.findIndex((d) => d.slug === slug);
  if (docIndex === -1) {
    notFound();
  }

  const doc = legalDocuments[docIndex];
  const prevDoc = docIndex > 0 ? legalDocuments[docIndex - 1] : null;
  const nextDoc = docIndex < legalDocuments.length - 1 ? legalDocuments[docIndex + 1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* ── Document Header ──────────────────────────────────────────────── */}
        <section className="relative pt-16 pb-12 border-b border-border/30 bg-muted/10">
          <div className="max-w-5xl mx-auto px-6">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link href="/legal" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                Legal Center
              </Link>
              <span>/</span>
              <span className="text-foreground font-semibold truncate">{doc.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-primary/20 bg-primary/10 text-primary">
                    {doc.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                    {doc.version}
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
                  {doc.title}
                </h1>

                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {doc.shortDescription}
                </p>
              </div>

              {/* Document Meta box */}
              <div className="flex flex-row lg:flex-col gap-4 shrink-0 p-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Updated: <strong className="text-foreground">{doc.lastUpdated}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Read time: <strong className="text-foreground">{doc.readTime}</strong></span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <span className="text-border">•</span>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: doc.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Document link copied to clipboard!");
                      }
                    }}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Document Body Layout ─────────────────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
            
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-1 hidden lg:block sticky top-24 h-fit space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Table of Contents
              </h3>
              <nav className="flex flex-col gap-2 border-l border-border/40 pl-3">
                {doc.sections.map((sec, i) => (
                  <a
                    key={i}
                    href={`#section-${i + 1}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-1 truncate leading-snug"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Reading Area */}
            <article className="lg:col-span-3 space-y-10">
              {doc.sections.map((sec, i) => (
                <motion.div
                  key={i}
                  id={`section-${i + 1}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4"
                >
                  <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    {sec.title}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sec.content}
                  </p>

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pt-2">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2.5 text-xs text-foreground/90 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}

              {/* End of Document Governance Stamp */}
              <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Ranker's League Legal Guarantee</h4>
                    <p className="text-[11px] text-muted-foreground">
                      This document is active and legally binding for all registered platform candidates.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Document Navigation (Prev / Next) ───────────────────────── */}
              <div className="pt-8 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
