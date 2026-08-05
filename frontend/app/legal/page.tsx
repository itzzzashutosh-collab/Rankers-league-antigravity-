"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Scale,
  Trophy,
  RotateCcw,
  Wallet,
  Receipt,
  UserCheck,
  GitCommit,
  ShieldAlert,
  Award,
  Users,
  CheckSquare,
  FileCheck,
  Lock,
  Cookie,
  Shield,
  HeartHandshake,
  UserX,
  HelpCircle,
  Mail,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { legalCategories } from "@/content/legal-center";
import legalCmsService from "@/services/legalCmsService";
import { RealTimeLegalSearch } from "@/components/legal/RealTimeLegalSearch";

// Dynamic Icon Map
const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  RotateCcw: <RotateCcw className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
  GitCommit: <GitCommit className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  CheckSquare: <CheckSquare className="w-5 h-5" />,
  FileCheck: <FileCheck className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Cookie: <Cookie className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  UserX: <UserX className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
};

// Category Badge Color helper
function getCategoryColor(category: string) {
  switch (category) {
    case "Contests & Gameplay":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "Finance & Taxes":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "Platform & Security":
      return "text-violet-500 bg-violet-500/10 border-violet-500/20";
    case "Conduct & Ethics":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default:
      return "text-primary bg-primary/10 border-primary/20";
  }
}

export default function LegalCenterHubPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Dynamic CMS filtering
  const filteredDocs = useMemo(() => {
    return legalCmsService.searchDocuments(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* ── 1. Hero Section ────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute -top-30 left-1/2 -translate-x-1/2 w-[600px] h-[350px] opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
          />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Shield className="w-3.5 h-3.5" />
              Transparency & Governance Hub
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground mb-4"
            >
              Legal Center
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Everything you need to know about Rankers League policies, contest rules, privacy, fair play, rewards, taxes and regulations.
            </motion.p>

            {/* Real-Time Legal Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative max-w-2xl mx-auto"
            >
              <RealTimeLegalSearch />
            </motion.div>
          </div>
        </section>

        {/* ── 2. Category Filter & Document Counter Bar ─────────────────────── */}
        <section className="sticky top-[60px] z-30 bg-background/90 backdrop-blur-md border-y border-border/40 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full sm:w-auto">
              {legalCategories.map((cat, catIdx) => (
                <button
                  key={`cat-${cat}-${catIdx}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? "bg-foreground text-background border-foreground shadow-xs"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground font-semibold shrink-0">
              Showing <span className="text-foreground font-bold">{filteredDocs.length}</span> of {legalCmsService.getPublishedDocuments().length} Documents
            </div>
          </div>
        </section>

        {/* ── 3. Document Library Grid ──────────────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border/60 bg-card/20 rounded-2xl p-8">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-foreground">No documents found</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  No legal policies match your search keyword &quot;{searchTerm}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredDocs.map((doc, idx) => {
                    const categoryBadgeClass = getCategoryColor(doc.category);
                    const icon = iconMap[doc.iconName] || <FileText className="w-5 h-5" />;

                    return (
                      <motion.div
                        key={`legal-doc-${doc.slug}-${idx}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                      >
                        <Link href={`/legal/${doc.slug}`} className="block h-full group">
                          <div className="relative h-full flex flex-col justify-between rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 hover:border-primary/40 hover:bg-card/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            
                            {/* Top row: Icon + Category Badge */}
                            <div>
                              <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                  {icon}
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${categoryBadgeClass}`}>
                                  {doc.category}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                                {doc.title}
                              </h3>

                              {/* Short Description */}
                              <p className="text-xs text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                                {doc.shortDescription}
                              </p>
                            </div>

                            {/* Bottom row: Metadata & Action CTA */}
                            <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                                <span>{doc.readTime}</span>
                                <span>•</span>
                                <span className="font-mono text-[10px] bg-muted/50 px-1.5 py-0.5 rounded border border-border/40">
                                  {doc.version}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                                Read Document
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>

                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* ── 4. Legal Contact Banner ────────────────────────────────────────── */}
        <section className="py-16 border-t border-border/30 bg-muted/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/80 to-background p-10 backdrop-blur-md shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Have Legal or Regulatory Questions?
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                Our legal compliance and privacy team is available to assist with statutory queries, copyright notices, or tax deduction verifications.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/legal/contact-support">
                  <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md">
                    <Mail className="w-4 h-4" />
                    Contact Legal Cell
                  </button>
                </Link>
                <Link href="/faq">
                  <button className="px-6 py-3 rounded-xl border border-border/60 text-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-card transition-all">
                    <BookOpen className="w-4 h-4" />
                    Browse FAQs
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
