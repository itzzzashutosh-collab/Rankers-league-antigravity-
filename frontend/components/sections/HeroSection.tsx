"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, ChevronRight, Star, Award, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/content/hero";
import { contestsContent } from "@/content/contests";
import { ContestDetail } from "@/types/contests";
import ParticleText from "@/components/ui/ParticleText";

interface HeroSectionProps {
  initialLeagues?: any[];
}

export function HeroSection({ initialLeagues }: HeroSectionProps) {
  // Find official IIT JEE and UPSC Civil Services contests from content
  const jeeContest: ContestDetail = contestsContent.find((c: ContestDetail) => c.slug === "jee-advanced" || c.exam === "JEE Main") || contestsContent[0];
  const upscContest: ContestDetail = contestsContent.find((c: ContestDetail) => c.slug === "upsc-elite" || c.exam === "UPSC CSE") || contestsContent[1] || contestsContent[0];

  const [selectedContestSlug, setSelectedContestSlug] = React.useState<"jee" | "upsc">("jee");
  const currentContest = selectedContestSlug === "jee" ? jeeContest : upscContest;

  const [timeLeft, setTimeLeft] = React.useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36 bg-background dark-luxury-bg">
      {/* Aurora mesh ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-blob w-[500px] h-[500px] bg-purple-600/15 top-[-100px] left-[-100px]" />
        <div className="aurora-blob w-[450px] h-[450px] bg-violet-600/12 bottom-[-50px] right-[-50px]" style={{ animationDelay: "4s" }} />
        <div className="aurora-blob w-[350px] h-[350px] bg-emerald-500/8 top-[40%] left-[60%]" style={{ animationDelay: "8s" }} />
      </div>

      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side Copy */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-black text-purple-300 tracking-wider self-start shadow-sm"
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            {heroContent.badge}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full h-[160px] sm:h-[200px] md:h-[230px] my-1 relative -ml-2"
          >
            <ParticleText
              text="Compete. Rise. Earn your rank."
              particleSize={2.5}
              density={3}
              color="#a855f7"
              highlightColor="#c084fc"
              scatter={180}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={50}
              repelRadius={140}
              idleDrift={0.8}
              trigger="hover"
              fontSize="clamp(1.8rem, 5.5vw, 4.2rem)"
              fontWeight={900}
              glow={true}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            {heroContent.subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <Link href="/contests">
              <Button size="lg" className="px-8 py-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-xl shadow-purple-500/20">
                Explore All Leagues
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="px-7 py-6 rounded-xl border-border/80 hover:bg-muted font-bold text-foreground"
              >
                View Live Ranks
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-10 border-t border-border/40 max-w-lg"
          >
            {heroContent.stats.map((stat) => (
              <div key={stat.label}>
                <span className="block text-2xl font-black font-heading text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Dual IIT JEE & UPSC Contest Switcher & Live Card */}
        <div className="lg:col-span-5 flex flex-col gap-5 relative">
          
          {/* Floating live rank badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="animate-float-delayed absolute -top-5 -left-6 z-20 hidden lg:block"
          >
            <div className="px-4 py-3 bg-card/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-foreground block leading-tight">AIR Rank 1 Calibrated</span>
                  <span className="text-muted-foreground text-[10px]">Real-time AI Proctoring</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Contest Selection Switcher & Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card/80 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-2xl relative group glow-purple overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

            {/* Contest Arena Selector Buttons (IIT JEE vs UPSC Civil Services) */}
            <div className="flex items-center gap-2 p-1.5 bg-muted/40 border border-border/40 rounded-2xl mb-6 relative z-10">
              <button
                onClick={() => setSelectedContestSlug("jee")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  selectedContestSlug === "jee"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                IIT JEE Arena
              </button>
              <button
                onClick={() => setSelectedContestSlug("upsc")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  selectedContestSlug === "upsc"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                UPSC CSE Arena
              </button>
            </div>

            {/* Active Selected Contest Card Copy */}
            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full">
                {currentContest.exam} Official League
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Registration
              </span>
            </div>

            <h3 className="font-heading text-2xl font-black text-foreground mt-2 leading-snug relative z-10">
              {currentContest.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed relative z-10">
              {currentContest.overview || "High-precision national rank evaluation replica."}
            </p>

            {/* Countdown Grid */}
            <div className="grid grid-cols-3 gap-3 my-6 text-center relative z-10">
              {[
                { value: formatNumber(timeLeft.hours), label: "Hours" },
                { value: formatNumber(timeLeft.minutes), label: "Minutes" },
                { value: formatNumber(timeLeft.seconds), label: "Seconds" },
              ].map((unit) => (
                <div key={unit.label} className="p-3.5 bg-muted/30 border border-border/40 rounded-2xl">
                  <span className="block text-2xl font-black font-heading text-foreground tabular-nums">
                    {unit.value}
                  </span>
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Inside Card */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-border/30 text-xs relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Up To Prize Pool:</span>
                <span className="font-black text-emerald-400 font-mono text-sm">
                  ₹{currentContest.prizePool.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Registered Aspirants:</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  {currentContest.participants.toLocaleString("en-IN")} Seats
                </span>
              </div>
            </div>

            <Link href={`/contests/${currentContest.slug}`} className="w-full mt-6 block relative z-10">
              <Button className="w-full py-6 font-black uppercase tracking-wider text-xs rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground gap-2 shadow-lg shadow-purple-500/25">
                Register for {currentContest.exam} Contest
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
