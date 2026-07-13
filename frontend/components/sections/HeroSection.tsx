"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, ChevronRight, Star, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeagueRecord } from "@/types/supabase";
import { heroContent } from "@/content/hero";

interface HeroSectionProps {
  initialLeagues?: LeagueRecord[];
}

export function HeroSection({ initialLeagues = [] }: HeroSectionProps) {
  const activeLeague = React.useMemo(() => {
    return (
      initialLeagues.find((l) => l.status === "active" || l.status === "upcoming") || {
        id: "default",
        title: "Civil Services Elite League",
        category: "Civil Services",
        scheduled_start: new Date(Date.now() + 23 * 3600 * 1000 + 58 * 60 * 1000).toISOString(),
        current_participants: 38492,
        difficulty_tier: "elite" as const,
      }
    );
  }, [initialLeagues]);

  const [timeLeft, setTimeLeft] = React.useState({
    hours: 23,
    minutes: 58,
    seconds: 42,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(activeLeague.scheduled_start) - +new Date();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeLeague.scheduled_start]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36">
      {/* Aurora mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-blob w-[500px] h-[500px] bg-primary/10 top-[-100px] left-[-100px]" />
        <div className="aurora-blob w-[400px] h-[400px] bg-emerald-500/8 bottom-[-50px] right-[-50px]" style={{ animationDelay: "4s" }} />
        <div className="aurora-blob w-[300px] h-[300px] bg-violet-500/6 top-[40%] left-[60%]" style={{ animationDelay: "8s" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">
        {/* Left Side Copy */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-wide self-start shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-primary" />
            {heroContent.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]"
          >
            {heroContent.headline.line1}
            <br />
            <span className="text-gradient-purple">
              {heroContent.headline.line2}
            </span>
          </motion.h1>

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
            <Button size="lg" className="px-7 rounded-xl font-semibold glow-subtle gap-2">
              {heroContent.primaryCta.label}
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-7 rounded-xl hover:bg-muted text-foreground"
            >
              {heroContent.secondaryCta.label}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-10 border-t border-border/60 max-w-lg"
          >
            {heroContent.stats.map((stat) => (
              <div key={stat.label}>
                <span className="block text-2xl font-bold font-heading text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Floating Cards + Countdown */}
        <div className="lg:col-span-5 flex flex-col gap-5 relative">
          {/* Floating contest preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="animate-float-delayed absolute -top-4 -left-8 z-10 hidden lg:block"
          >
            <div className="px-4 py-3 bg-card/90 backdrop-blur-sm border border-border/60 rounded-xl shadow-lg text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block leading-tight">+12 Rank Positions</span>
                  <span className="text-muted-foreground text-[10px]">This month</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating achievement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="animate-float-slow absolute -bottom-2 -right-6 z-10 hidden lg:block"
          >
            <div className="px-4 py-3 bg-card/90 backdrop-blur-sm border border-border/60 rounded-xl shadow-lg text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block leading-tight">{heroContent.floatingCards.achievementPreview.badge}</span>
                  <span className="text-muted-foreground text-[10px]">{heroContent.floatingCards.achievementPreview.exam} — {heroContent.floatingCards.achievementPreview.season}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main countdown card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md mx-auto p-8 bg-card border border-border/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative group glow-subtle"
          >
            <div className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Next Live Championship
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground mt-1">
              {activeLeague.title}
            </h3>
            <p className="text-xs text-primary font-medium mt-0.5">
              {activeLeague.category} Arena
            </p>

            {/* Countdown Grid */}
            <div className="grid grid-cols-3 gap-3 my-8 text-center">
              {[
                { value: formatNumber(timeLeft.hours), label: "Hours" },
                { value: formatNumber(timeLeft.minutes), label: "Minutes" },
                { value: formatNumber(timeLeft.seconds), label: "Seconds" },
              ].map((unit) => (
                <div key={unit.label} className="p-4 bg-background border border-border/60 rounded-xl">
                  <span className="block text-3xl font-bold font-heading text-foreground tabular-nums">
                    {unit.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Live Stats inside the card */}
            <div className="flex flex-col gap-3 pt-6 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">National Registered:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  {activeLeague.current_participants.toLocaleString()} Aspirants
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Championship Tier:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  {activeLeague.difficulty_tier.toUpperCase()} Level
                </span>
              </div>
            </div>

            <Button className="w-full mt-6 flex items-center justify-center gap-1.5 rounded-xl">
              Secure Championship Slot
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
