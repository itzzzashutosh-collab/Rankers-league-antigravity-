"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  Award,
  FileText,
  Zap,
  Coins,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Clock,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

// Local content imports
import { heroContent } from "@/content/rewards/hero";
import { rewardCategories } from "@/content/rewards/reward-categories";
import { prizeSystemContent } from "@/content/rewards/prize-system";
import { prizeExamples } from "@/content/rewards/prize-examples";
import { auraContent } from "@/content/rewards/aura";
import { badgesContent } from "@/content/rewards/badges";
import { certificatesContent } from "@/content/rewards/certificates";
import { timelineContent } from "@/content/rewards/timeline";
import { faqContent } from "@/content/rewards/faq";

export default function RewardsPage() {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Premium Sticky Navigation */}
      <Header />

      <main className="flex-grow space-y-24 pb-24">
        {/* SECTION 1: HERO */}
        <section className="relative pt-20 pb-16 overflow-hidden border-b border-border/20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Prestige Accolades
            </span>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-[1.1] text-foreground">
              {heroContent.headline}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href={heroContent.buttons.primary.href}>
                <Button className="py-6 px-6 font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/20">
                  {heroContent.buttons.primary.label}
                  <ArrowRight className="w-4.5 h-4.5" />
                </Button>
              </Link>
              <Link href={heroContent.buttons.secondary.href}>
                <Button variant="outline" className="py-6 px-6 font-bold text-sm border-border/60 hover:bg-muted/40">
                  {heroContent.buttons.secondary.label}
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* SECTION 2: REWARD CATEGORIES */}
        <section className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Prestige Matrix</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">How Candidates are Recognized</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardCategories.map((c) => {
              // Custom icons mapping
              const Icon =
                c.icon === "coins"
                  ? Coins
                  : c.icon === "sparkles"
                  ? Sparkles
                  : c.icon === "award"
                  ? Award
                  : c.icon === "file-text"
                  ? FileText
                  : c.icon === "trophy"
                  ? Trophy
                  : Zap;

              return (
                <div
                  key={c.title}
                  className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4 hover:border-border/80 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-foreground">{c.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* SECTION 3: PRIZE POOL SYSTEM */}
        <section className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Transparency Ledger</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">The Prize Pool Flow</h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed">
              Every tournament operates on a verifiable pooling mechanism, guaranteeing maximum allocation to winning competitors.
            </p>
          </div>

          {/* Flow cards list with arrow links */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {prizeSystemContent.steps.map((step, idx) => (
              <div
                key={step.label}
                className="p-5 border border-border/40 bg-card/20 rounded-xl relative space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-black text-primary">STEP 0{idx + 1}</span>
                  <h4 className="text-xs font-black text-foreground mt-1">{step.label}</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/20 border border-border/40 rounded-xl text-[10px] text-center text-muted-foreground leading-normal">
            Prize structures and percentage allocations are hardcoded directly into each contest config and verified automatically by proctors.
          </div>
        </section>


        {/* SECTION 4: PRIZE DISTRIBUTION */}
        <section className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Distribution Index</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Standard Placement Allocations</h3>
          </div>

          <div className="border border-border/40 bg-card/30 rounded-xl overflow-hidden">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground font-black uppercase tracking-wider">
                  <th className="p-4">Placement Rank</th>
                  <th className="p-4">Reward Matrix</th>
                  <th className="p-4">Winner Count</th>
                  <th className="p-4">Verification Credentials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {prizeSystemContent.distributionTable.map((row) => (
                  <tr key={row.rankRange} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-foreground">{row.rankRange}</td>
                    <td className="p-4 text-muted-foreground font-semibold">{row.reward}</td>
                    <td className="p-4 text-foreground font-bold">{row.winnerCount > 0 ? row.winnerCount : "All Participants"}</td>
                    <td className="p-4 text-muted-foreground">{row.recognition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


        {/* SECTION 5: CONTEST REWARD EXAMPLES */}
        <section className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Live Models</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Sample Contest Prize Structures</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prizeExamples.map((ex) => (
              <div
                key={ex.name}
                className="rounded-2xl border border-border/40 bg-gradient-to-br from-card to-card/20 p-5 space-y-4 hover:border-border/80 transition-all duration-200"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">
                    {ex.examCategory}
                  </span>
                  <h4 className="text-xs font-black text-foreground mt-2.5 leading-snug">{ex.name}</h4>
                </div>

                <div className="space-y-2 text-[10px] border-t border-border/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Fee</span>
                    <span className="font-bold text-foreground">₹{ex.entryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Prize Pool</span>
                    <span className="font-black text-foreground">{formatCurrency(ex.prizePool)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contestants Limit</span>
                    <span className="font-bold text-foreground">{ex.participants} max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rank #1 Champion Reward</span>
                    <span className="font-black text-emerald-400">{formatCurrency(ex.firstPrize)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/contests">
                    <Button variant="outline" className="w-full text-[10px] font-bold py-3.5 border-border/60 hover:bg-muted/40">
                      View Live Arenas
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 6: RECOGNITION SYSTEM */}
        <section className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Aura Progression</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Competitive Player Levels</h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium mt-1">
              Aura represents competitor consistency. Scale tier metrics to display your ranking to the public.
            </p>
          </div>

          {/* Visual Tier Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {auraContent.tiers.map((t) => (
              <div
                key={t.tier}
                className={cn(
                  "p-4 border rounded-xl text-center space-y-2 transition-all hover:scale-[1.02]",
                  t.color
                )}
              >
                <span className="text-xs font-black block">{t.tier}</span>
                <span className="text-[10px] font-bold opacity-80 block">{t.minPoints.toLocaleString()}+ Aura</span>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 7: AURA SYSTEM POLICY */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card/25 border border-border/40 p-8 rounded-2xl">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-foreground">What is Aura?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {auraContent.description}
              </p>
              <div className="p-3 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] rounded-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                Aura cannot be purchased or transferred. Period.
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Earning Guidelines</p>
              <div className="space-y-2.5">
                {auraContent.earningRules.map((rule, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-muted-foreground leading-normal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 8: CERTIFICATES */}
        <section className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Official Credentials</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Verifiable Digital Certificates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificatesContent.map((c) => (
              <div
                key={c.title}
                className="p-5 border border-border/40 bg-card/30 rounded-xl space-y-4 text-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-foreground leading-snug">{c.title}</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 9: BADGES */}
        <section className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Trophy Cabinet</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Earnable Achievements</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {badgesContent.map((b) => (
              <div
                key={b.title}
                className="p-5 border border-border/40 bg-card/20 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-all text-xs"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-muted/40 flex items-center justify-center text-lg border border-border/40">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-foreground">{b.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{b.description}</p>
                  </div>
                </div>
                <div className="pt-3.5 border-t border-border/20 mt-4 text-[9px] text-primary font-black uppercase tracking-widest">
                  Req: {b.requirement}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 10: REWARD TIMELINE */}
        <section className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Operational Processing</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Credit & Settlements Timeline</h3>
          </div>

          <div className="relative border-l-2 border-border/30 pl-6 ml-4 space-y-8 text-xs">
            {timelineContent.map((step, idx) => (
              <div key={step.title} className="relative space-y-1">
                {/* Visual node */}
                <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full border bg-background border-primary flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-black text-foreground text-xs uppercase tracking-wide">
                    0{idx + 1}. {step.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5" />
                    {step.duration}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed max-w-xl">{step.description}</p>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 11: FAQ */}
        <section className="max-w-3xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Inquiries</h2>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">Rewards FAQ</h3>
          </div>

          <div className="space-y-3.5">
            {faqContent.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.question}
                  className="rounded-xl border border-border/40 bg-card/25 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 flex justify-between items-center text-xs font-black text-foreground text-left"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={cn("w-4.5 h-4.5 text-muted-foreground transition-transform duration-250", isOpen ? "rotate-180 text-primary" : "")} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-[11px] text-muted-foreground leading-relaxed border-t border-border/10 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>


        {/* SECTION 12: CALL TO ACTION */}
        <section className="max-w-4xl mx-auto px-4 relative">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-card/40 p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-primary/2 pointer-events-none" />

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Ready to Compete for Recognition?</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Join our premium examination leagues, scale the leaderboards, and secure authenticated credentials to validate your skills.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Link href="/contests">
                <Button className="py-6 px-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Contests
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="py-6 px-6 font-bold text-xs border-border/60 hover:bg-muted/40">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Sticky Footer */}
      <Footer />
    </div>
  );
}
