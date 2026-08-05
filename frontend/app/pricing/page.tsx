"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Zap,
  Star,
  Crown,
  Rocket,
  Leaf,
  ChevronDown,
  ChevronUp,
  Shield,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { subscriptionTiers, pricingFAQ } from "@/content/pricing";

// ─── Tier icon map ─────────────────────────────────────────────────────────────
const tierIcons: Record<string, React.ReactNode> = {
  starter: <Leaf className="w-5 h-5" />,
  scholar: <Rocket className="w-5 h-5" />,
  champion: <Star className="w-5 h-5" />,
  legend: <Crown className="w-5 h-5" />,
};

// ─── Tier color map ────────────────────────────────────────────────────────────
const tierColors: Record<
  string,
  { bg: string; border: string; text: string; glow: string; badge: string; ring: string }
> = {
  starter: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-500",
    glow: "shadow-emerald-500/10",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    ring: "ring-emerald-500/20",
  },
  scholar: {
    bg: "bg-blue-500/10 dark:bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-500",
    glow: "shadow-blue-500/10",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    ring: "ring-blue-500/20",
  },
  champion: {
    bg: "bg-amber-500/10 dark:bg-amber-500/10",
    border: "border-amber-500/40",
    text: "text-amber-500",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/15 text-amber-500 border-amber-500/40",
    ring: "ring-amber-500/30",
  },
  legend: {
    bg: "bg-violet-500/10 dark:bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-500",
    glow: "shadow-violet-500/10",
    badge: "bg-violet-500/10 text-violet-500 border-violet-500/30",
    ring: "ring-violet-500/20",
  },
};

// ─── Stats strip ───────────────────────────────────────────────────────────────
const stats = [
  { icon: <Users className="w-4 h-4" />, value: "1,20,000+", label: "Active Students" },
  { icon: <Award className="w-4 h-4" />, value: "₹4.2 Cr+", label: "Prize Pool Distributed" },
  { icon: <TrendingUp className="w-4 h-4" />, value: "94%", label: "Rank Improvement Rate" },
  { icon: <Shield className="w-4 h-4" />, value: "100%", label: "Secure & Transparent" },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = React.useState(false);
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* ── Hero ─────────────────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Aurora background blobs */}
          <div
            className="aurora-blob absolute -top-32 left-1/4 w-[500px] h-[500px] opacity-20"
            style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
          />
          <div
            className="aurora-blob absolute top-20 right-1/4 w-[400px] h-[400px] opacity-15"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", animationDelay: "3s" }}
          />

          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-3.5 h-3.5" />
                Student-First Pricing
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground mb-5"
            >
              Invest in Your{" "}
              <span className="text-gradient-gold">
                Rank, Not Your Bill
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Choose a plan built for you — the student, the aspirant, the champion.
              Compete in India&apos;s most rigorous mock championship leagues and climb the national ranks.
            </motion.p>

            {/* Billing toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-flex items-center gap-4 bg-card/50 border border-border/60 rounded-full p-1.5 backdrop-blur-sm"
            >
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  !isYearly
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  isYearly
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  Save 30%
                </span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Stats Strip ──────────────────────────────────────────────────────── */}
        <section className="py-6 border-y border-border/40 bg-card/20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">{stat.icon}</div>
                  <div>
                    <div className="text-sm font-extrabold text-foreground">{stat.value}</div>
                    <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Cards ─────────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {subscriptionTiers.map((tier, i) => {
                const c = tierColors[tier.id];
                const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
                const isFree = price === 0;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className={`relative flex flex-col rounded-2xl border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      tier.popular
                        ? `border-amber-500/50 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20`
                        : `border-border/50 hover:${c.border}`
                    } overflow-hidden`}
                  >
                    {/* Popular banner */}
                    {tier.popular && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
                    )}

                    {tier.badge && (
                      <div className="absolute top-4 right-4">
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.badge}`}>
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-6 flex flex-col h-full">
                      {/* Icon + Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2.5 rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
                          {tierIcons[tier.id]}
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-foreground tracking-tight">{tier.name}</div>
                          <div className="text-[11px] text-muted-foreground leading-snug">{tier.tagline}</div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-5">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${tier.id}-${isYearly}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-baseline gap-1.5"
                          >
                            <span className="text-4xl font-extrabold font-heading text-foreground">
                              {isFree ? "Free" : `₹${price}`}
                            </span>
                            {!isFree && (
                              <span className="text-xs text-muted-foreground">
                                /{isYearly ? "mo, billed yearly" : "month"}
                              </span>
                            )}
                          </motion.div>
                        </AnimatePresence>
                        {isYearly && !isFree && (
                          <div className="text-[11px] text-muted-foreground mt-1">
                            ₹{tier.yearlyPrice * 12}/yr — saves ₹{(tier.monthlyPrice - tier.yearlyPrice) * 12}
                          </div>
                        )}
                        <div className={`mt-3 text-[11px] font-bold uppercase tracking-widest ${c.text}`}>
                          {tier.contestAccess}
                        </div>
                      </div>

                      {/* Feature list */}
                      <div className="flex flex-col gap-2.5 mb-8 flex-grow">
                        {tier.features.map((feature, fi) => (
                          <div key={fi} className="flex items-start gap-2.5 text-xs">
                            {feature.included ? (
                              <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.popular ? "text-amber-500" : "text-emerald-500"}`} />
                            ) : (
                              <X className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />
                            )}
                            <span
                              className={
                                feature.included
                                  ? feature.highlight
                                    ? "text-foreground font-semibold"
                                    : "text-muted-foreground"
                                  : "text-muted-foreground/50 line-through"
                              }
                            >
                              {feature.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Link href={isFree ? "/auth/signup" : "/auth/signup?plan=" + tier.id} className="block">
                        <button
                          className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                            tier.popular
                              ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 shadow-lg shadow-amber-500/25"
                              : tier.id === "legend"
                              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/20"
                              : isFree
                              ? "bg-foreground text-background hover:bg-foreground/90"
                              : `border ${c.border} ${c.text} hover:${c.bg} bg-transparent`
                          }`}
                        >
                          {tier.cta}
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Comparison Table (Desktop) ────────────────────────────────────────── */}
        <section className="py-16 border-t border-border/30">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Compare Every Detail
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                See exactly what each plan unlocks — no fine print, no hidden limits.
              </p>
            </motion.div>

            <div className="overflow-x-auto rounded-2xl border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-card/40">
                    <th className="py-4 px-5 text-left font-bold text-foreground text-xs uppercase tracking-widest">Feature</th>
                    {subscriptionTiers.map((tier) => (
                      <th key={tier.id} className="py-4 px-4 text-center font-extrabold text-xs uppercase tracking-widest">
                        <span className={tierColors[tier.id].text}>{tier.icon} {tier.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Monthly Contests", values: ["3 / month", "15 / month", "Unlimited", "Unlimited + Finals"] },
                    { label: "Contest Access", values: ["Foundation", "Foundation + Scholar", "All Tiers + Grand Prix", "All Tiers + Legend-only"] },
                    { label: "Performance Analytics", values: ["Basic", "Detailed", "Full + Radar Map", "Full + Predictive AI"] },
                    { label: "Rank Certificate", values: [false, false, "Digital PDF", "Digital + Physical Trophy"] },
                    { label: "Mentor Sessions", values: [false, "1 / month", "4 / month", "Unlimited"] },
                    { label: "AI Study Insights", values: [false, false, false, "Personalized Plan"] },
                    { label: "Priority Registration", values: [false, false, true, true] },
                  ].map((row, ri) => (
                    <tr key={ri} className={`border-b border-border/20 ${ri % 2 === 0 ? "bg-card/20" : ""}`}>
                      <td className="py-3.5 px-5 text-muted-foreground font-medium text-xs">{row.label}</td>
                      {row.values.map((val, vi) => (
                        <td key={vi} className="py-3.5 px-4 text-center">
                          {val === true ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : val === false ? (
                            <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" />
                          ) : (
                            <span className={`text-xs font-semibold ${vi === 2 ? "text-amber-500" : vi === 3 ? "text-violet-500" : "text-foreground"}`}>
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
        <section className="py-20 border-t border-border/30">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Questions? We&apos;ve Got Answers
              </h2>
            </motion.div>

            <div className="flex flex-col gap-3">
              {pricingFAQ.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-foreground">{faq.q}</span>
                    {openFAQ === i ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFAQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA Banner ─────────────────────────────────────────────────── */}
        <section className="py-16 border-t border-border/30">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-10 backdrop-blur-sm"
            >
              <div className="text-3xl mb-4">🎯</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Start Free. Compete Now.
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-7">
                No credit card required. Join 1.2 lakh+ students already competing on Ranker&apos;s League.
                Your rank is waiting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/signup">
                  <button className="px-8 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all shadow-lg">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/contests">
                  <button className="px-8 py-3 rounded-xl border border-border/60 text-foreground text-sm font-bold hover:bg-card/50 transition-all">
                    Browse Contests
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
