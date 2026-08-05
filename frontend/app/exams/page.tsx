"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Flag,
  Layers,
  ChevronRight,
  X,
  BookOpen,
  Trophy,
  Users,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { exams, categoryMeta, type ExamCategory, type ExamRegion } from "@/content/exams";

// ─── Difficulty badge config ───────────────────────────────────────────────────
const difficultyConfig: Record<string, { label: string; color: string }> = {
  Foundation:   { label: "Foundation",   color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
  Intermediate: { label: "Intermediate", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  Advanced:     { label: "Advanced",     color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
  Expert:       { label: "Expert",       color: "text-rose-500 bg-rose-500/10 border-rose-500/30" },
};

const regionConfig: Record<ExamRegion, { label: string; flag: React.ReactNode; color: string }> = {
  India:         { label: "India",         flag: <>🇮🇳</>, color: "text-orange-500 bg-orange-500/10 border-orange-500/30" },
  International: { label: "International", flag: <>🌍</>,  color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  Both:          { label: "India + Global",flag: <>🌍🇮🇳</>, color: "text-violet-500 bg-violet-500/10 border-violet-500/30" },
};

const ALL_CATEGORIES = "All";
const ALL_REGIONS = "All";

export default function ExamsPage() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<ExamCategory | "All">(ALL_CATEGORIES);
  const [activeRegion, setActiveRegion] = React.useState<ExamRegion | "All">(ALL_REGIONS);
  const [showFilters, setShowFilters] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Compute category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    exams.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered list
  const filtered = React.useMemo(() => {
    return exams.filter((e) => {
      const matchCat = activeCategory === ALL_CATEGORIES || e.category === activeCategory;
      const matchReg = activeRegion === ALL_REGIONS || e.region === activeRegion;
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.shortName?.toLowerCase().includes(search.toLowerCase())) ||
        (e.conductingBody?.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchReg && matchSearch;
    });
  }, [activeCategory, activeRegion, search]);

  // Group filtered by category for display
  const grouped = React.useMemo(() => {
    if (activeCategory !== ALL_CATEGORIES) {
      return { [activeCategory]: filtered };
    }
    const groups: Record<string, typeof exams> = {};
    filtered.forEach((e) => {
      if (!groups[e.category]) groups[e.category] = [];
      groups[e.category].push(e);
    });
    return groups;
  }, [filtered, activeCategory]);

  const totalShowing = filtered.length;

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-14 overflow-hidden">
          <div
            className="aurora-blob absolute -top-20 left-1/4 w-[500px] h-[400px] opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
          />
          <div
            className="aurora-blob absolute top-10 right-0 w-[350px] h-[350px] opacity-10"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", animationDelay: "3s" }}
          />

          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                140+ Exams Covered
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground mb-5"
            >
              Every Exam.{" "}
              <span className="text-gradient-gold">One Arena.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            >
              From JEE & NEET to UPSC, Olympiads, and international contests —
              compete in championship-level mock arenas for every major exam on the planet.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams, boards, conducting bodies..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Sticky Filter Bar ────────────────────────────────────────────── */}
        <div className="sticky top-[60px] z-30 bg-background/90 backdrop-blur-md border-b border-border/40 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4">
              {/* Region filter */}
              <div className="flex items-center gap-2 shrink-0">
                {(["All", "India", "International", "Both"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRegion(r as ExamRegion | "All")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                      activeRegion === r
                        ? "bg-foreground text-background border-foreground"
                        : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {r === "India" && "🇮🇳"}
                    {r === "International" && "🌍"}
                    {r === "Both" && "🌍🇮🇳"}
                    {r}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-border/50 shrink-0" />

              {/* Count + filter icon */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ml-auto shrink-0 ${
                  showFilters
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Categories
              </button>

              <div className="text-xs text-muted-foreground font-medium shrink-0">
                {totalShowing} exams
              </div>
            </div>

            {/* Category pills — expandable */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 pb-1">
                    <button
                      onClick={() => setActiveCategory(ALL_CATEGORIES)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        activeCategory === ALL_CATEGORIES
                          ? "bg-foreground text-background border-foreground"
                          : "border-border/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All Categories ({exams.length})
                    </button>
                    {categoryMeta.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          activeCategory === cat.id
                            ? `${cat.bg} ${cat.border} ${cat.text}`
                            : "border-border/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        {cat.label}
                        <span className="opacity-60">({categoryCounts[cat.id] || 0})</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Exam Sections ─────────────────────────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {totalShowing === 0 ? (
              <div className="text-center py-24">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-base font-bold text-foreground mb-2">No exams found</p>
                <p className="text-sm text-muted-foreground">Try a different search or category</p>
              </div>
            ) : (
              <div className="space-y-14">
                {Object.entries(grouped).map(([catKey, catExams]) => {
                  const meta = categoryMeta.find((c) => c.id === catKey);
                  if (!meta || catExams.length === 0) return null;

                  return (
                    <motion.div
                      key={catKey}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45 }}
                    >
                      {/* Section header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-xl ${meta.bg} border ${meta.border}`}>
                          <span className="text-base">{meta.emoji}</span>
                        </div>
                        <div>
                          <h2 className={`font-heading text-lg font-extrabold ${meta.text}`}>
                            {meta.label}
                          </h2>
                          <p className="text-[11px] text-muted-foreground">{catExams.length} exams</p>
                        </div>
                        <div className="flex-1 h-px bg-border/40 ml-2" />
                      </div>

                      {/* Exam card grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {catExams.map((exam, i) => {
                          const region = regionConfig[exam.region];
                          const diff = exam.difficulty ? difficultyConfig[exam.difficulty] : null;

                          return (
                            <motion.div
                              key={exam.id}
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.04, duration: 0.35 }}
                            >
                              <Link href={`/contests?exam=${exam.slug}`} className="block group h-full">
                                <div
                                  className={`relative h-full flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 group-hover:${meta.border} group-hover:bg-card/80 overflow-hidden`}
                                >
                                  {/* Top accent line */}
                                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                                    meta.color === "blue"   ? "from-blue-500/60 to-transparent" :
                                    meta.color === "emerald" ? "from-emerald-500/60 to-transparent" :
                                    meta.color === "amber"  ? "from-amber-500/60 to-transparent" :
                                    meta.color === "red"    ? "from-red-500/60 to-transparent" :
                                    meta.color === "pink"   ? "from-pink-500/60 to-transparent" :
                                    meta.color === "violet" ? "from-violet-500/60 to-transparent" :
                                    meta.color === "slate"  ? "from-slate-500/60 to-transparent" :
                                    meta.color === "indigo" ? "from-indigo-500/60 to-transparent" :
                                    meta.color === "yellow" ? "from-yellow-500/60 to-transparent" :
                                    meta.color === "teal"   ? "from-teal-500/60 to-transparent" :
                                    meta.color === "rose"   ? "from-rose-500/60 to-transparent" :
                                    meta.color === "cyan"   ? "from-cyan-500/60 to-transparent" :
                                    meta.color === "green"  ? "from-green-500/60 to-transparent" :
                                    meta.color === "orange" ? "from-orange-500/60 to-transparent" :
                                    "from-sky-500/60 to-transparent"
                                  } opacity-0 group-hover:opacity-100 transition-opacity`} />

                                  {/* Exam name */}
                                  <h3 className="text-sm font-extrabold text-foreground leading-snug tracking-tight mb-2 group-hover:text-primary transition-colors">
                                    {exam.name}
                                  </h3>

                                  {/* Description */}
                                  <p className="text-[11px] text-muted-foreground leading-relaxed flex-1 mb-3 line-clamp-2">
                                    {exam.description}
                                  </p>

                                  {/* Tags row */}
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {/* Region badge */}
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${region.color}`}>
                                      {region.flag} {exam.region === "Both" ? "India + Global" : exam.region}
                                    </span>

                                    {/* Difficulty */}
                                    {diff && (
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold ${diff.color}`}>
                                        {diff.label}
                                      </span>
                                    )}
                                  </div>

                                  {/* Conducting body */}
                                  {exam.conductingBody && (
                                    <div className="mt-2.5 pt-2.5 border-t border-border/30 flex items-center justify-between">
                                      <span className="text-[10px] text-muted-foreground font-medium truncate">
                                        {exam.conductingBody}
                                      </span>
                                      <div className={`flex items-center gap-1 text-[10px] font-bold ${meta.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        Contests <ChevronRight className="w-3 h-3" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Stats Banner ─────────────────────────────────────────────────── */}
        <section className="py-14 border-t border-border/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <BookOpen className="w-5 h-5" />, value: "140+", label: "Exams Covered", color: "text-primary" },
                { icon: <Layers className="w-5 h-5" />, value: "15", label: "Categories", color: "text-amber-500" },
                { icon: <Globe className="w-5 h-5" />, value: "India + Global", label: "Reach", color: "text-blue-500" },
                { icon: <Trophy className="w-5 h-5" />, value: "500+", label: "Live Contests", color: "text-emerald-500" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-2 p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm"
                >
                  <div className={`p-2 rounded-xl bg-card border border-border/50 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className={`text-xl font-extrabold font-heading ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-16 border-t border-border/30">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-10 backdrop-blur-sm"
            >
              <div className="text-3xl mb-4">🏆</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Ready to Compete?
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-7">
                Browse contests tailored to your exam, your level, and your timeline.
                Register now and see where you rank — nationally.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contests">
                  <button className="px-8 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all shadow-lg flex items-center gap-2 justify-center">
                    <Trophy className="w-4 h-4" />
                    Browse All Contests
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-8 py-3 rounded-xl border border-border/60 text-foreground text-sm font-bold hover:bg-card/50 transition-all flex items-center gap-2 justify-center">
                    <Zap className="w-4 h-4" />
                    Get Started Free
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
