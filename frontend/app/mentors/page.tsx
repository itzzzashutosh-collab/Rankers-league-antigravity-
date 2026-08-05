"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  MessageCircle,
  BookOpen,
  Award,
  ChevronRight,
  Zap,
  Quote,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mentors, mentorTestimonials, mentorshipSteps, type Mentor } from "@/content/mentors";

// ─── Accent colour map ─────────────────────────────────────────────────────────
const accentMap: Record<string, { text: string; bg: string; border: string; glow: string; badge: string }> = {
  blue: {
    text: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/15",
    badge: "bg-blue-500/15 text-blue-500 border border-blue-500/30",
  },
  emerald: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/15",
    badge: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
  },
  orange: {
    text: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/15",
    badge: "bg-orange-500/15 text-orange-500 border border-orange-500/30",
  },
  violet: {
    text: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/15",
    badge: "bg-violet-500/15 text-violet-500 border border-violet-500/30",
  },
};

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

// ─── Mentor Card ──────────────────────────────────────────────────────────────
function MentorCard({ mentor, index }: { mentor: Mentor; index: number }) {
  const a = accentMap[mentor.accent];
  const waLink = `https://wa.me/${mentor.whatsappNumber}?text=Hi%20${encodeURIComponent(mentor.name)}%2C%20I%20want%20to%20connect%20for%20mentorship%20on%20Ranker%27s%20League!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className={`relative flex flex-col rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group hover:${a.border} hover:shadow-xl ${a.glow}`}
    >
      {/* Top gradient band */}
      <div className={`h-1 w-full bg-gradient-to-r ${mentor.color}`} />

      <div className="p-6 flex flex-col h-full">
        {/* Header: Avatar + Name */}
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar placeholder with emoji + gradient */}
          <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${mentor.color} flex items-center justify-center shrink-0 shadow-lg`}>
            <span className="text-2xl">{mentor.emoji}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-extrabold text-foreground tracking-tight leading-tight">
              {mentor.name}
            </h3>
            <p className={`text-xs font-bold ${a.text} mb-1`}>{mentor.title}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{mentor.subject}</p>
          </div>
        </div>

        {/* Rating + Stats row */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <StarRating rating={mentor.rating} />
              <span className="text-xs font-bold text-foreground">{mentor.rating}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">{mentor.reviews.toLocaleString()} reviews</span>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">{mentor.students}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Students mentored</span>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-foreground">{mentor.experience}</span>
            <span className="text-[11px] text-muted-foreground">Experience</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          {mentor.bio}
        </p>

        {/* Specializations */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <BookOpen className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Specialises in</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mentor.specialization.map((spec, i) => (
              <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.badge}`}>
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Target Exams */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Award className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Target Exams</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mentor.exams.map((exam, i) => (
              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                {exam}
              </span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div className={`mb-5 px-4 py-3 rounded-xl ${a.bg} border ${a.border}`}>
          <p className={`text-xs font-semibold italic ${a.text} leading-snug`}>
            {mentor.tagline}
          </p>
        </div>

        {/* Achievements */}
        <div className="mb-6 flex flex-col gap-1.5">
          {mentor.achievements.map((ach, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <ChevronRight className={`w-3 h-3 ${a.text} shrink-0 mt-0.5`} />
              <span>{ach}</span>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-auto">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-[#25D366]/20 group-hover:shadow-[#25D366]/30"
          >
            <MessageCircle className="w-4 h-4" />
            Connect on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function MentorsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Background blobs */}
          <div
            className="aurora-blob absolute -top-20 -left-20 w-[400px] h-[400px] opacity-15"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
          />
          <div
            className="aurora-blob absolute top-10 right-0 w-[350px] h-[350px] opacity-10"
            style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", animationDelay: "4s" }}
          />
          <div
            className="aurora-blob absolute -bottom-10 left-1/2 w-[300px] h-[300px] opacity-10"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", animationDelay: "2s" }}
          />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-3.5 h-3.5" />
                Expert Mentorship
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground mb-5"
            >
              Learn from India&apos;s{" "}
              <span className="text-gradient-gold">
                Best Mentors
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Our mentors aren&apos;t just teachers — they&apos;re rank hunters who&apos;ve walked the path.
              Reach out directly on WhatsApp and start your personalised mentorship journey today.
            </motion.p>

            {/* Social proof chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {[
                { val: "39,500+", label: "Students Mentored" },
                { val: "4.9★", label: "Average Rating" },
                { val: "8,200+", label: "Success Stories" },
              ].map((chip, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
                  <span className="text-sm font-extrabold text-foreground">{chip.val}</span>
                  <span className="text-xs text-muted-foreground">{chip.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Mentor Cards ──────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {mentors.map((mentor, i) => (
                <MentorCard key={mentor.id} mentor={mentor} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── How Mentorship Works ─────────────────────────────────────────── */}
        <section className="py-20 border-t border-border/30">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                How Mentorship Works
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Three simple steps. One goal — your top rank.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mentorshipSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  {/* Connector line */}
                  {i < mentorshipSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-border/60 to-transparent" />
                  )}

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-sm text-2xl mb-4 shadow-sm">
                      {step.icon}
                    </div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{step.step}</div>
                    <h3 className="font-heading text-base font-extrabold text-foreground mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial Marquee ───────────────────────────────────────────── */}
        <section className="py-16 border-t border-border/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-2"
            >
              What Students Say
            </motion.h2>
            <p className="text-muted-foreground text-sm">Real results. Real stories.</p>
          </div>

          {/* Marquee strip */}
          <div className="relative">
            <div className="flex gap-5 animate-marquee" style={{ width: "max-content" }}>
              {[...mentorTestimonials, ...mentorTestimonials].map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5"
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <Quote className="w-3.5 h-3.5 text-primary opacity-60" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t border-border/30 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.exam} — {t.score}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {t.mentor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <section className="py-16 border-t border-border/30">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-[#25D366]/5 to-transparent p-10 backdrop-blur-sm"
            >
              <div className="text-4xl mb-4">💬</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Your Mentor is One Message Away
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-7">
                No waitlist. No bureaucracy. Just message your mentor on WhatsApp and start your journey to the top rank today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20start%20mentorship%20on%20Ranker%27s%20League!`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-8 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold transition-all shadow-lg shadow-[#25D366]/20 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Start Mentorship on WhatsApp
                  </button>
                </a>
                <Link href="/pricing">
                  <button className="px-8 py-3 rounded-xl border border-border/60 text-foreground text-sm font-bold hover:bg-card/50 transition-all">
                    View Subscription Plans
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
