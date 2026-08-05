"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Trophy, Zap, Flame, Target, Percent, IndianRupee,
  TrendingUp, TrendingDown, Minus
} from "lucide-react";

interface HeroStat {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  trend?: "up" | "down" | "neutral";
  trendText?: string;
}

interface DashboardHeroStatsProps {
  stats: {
    total_contests_joined: number;
    total_contests_completed: number;
    total_contests_won: number;
    best_rank: number | null;
    average_score: number;
    total_aura_earned: number;
    current_streak: number;
    accuracy_percentage: number;
  };
  nationalRank: number | null;
  prizeWon?: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const end = value;
    const duration = 1000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display.toLocaleString("en-IN")}</>;
}

export default function DashboardHeroStats({ stats, nationalRank, prizeWon = 0 }: DashboardHeroStatsProps) {
  const cards: HeroStat[] = [
    {
      label: "National Rank",
      value: nationalRank ? `#${nationalRank}` : "—",
      subtext: stats.best_rank ? `Best: #${stats.best_rank}` : "Complete a contest",
      icon: Trophy,
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      trend: "neutral",
    },
    {
      label: "Total Aura",
      value: stats.total_aura_earned,
      subtext: "Competitive score points",
      icon: Zap,
      gradient: "from-primary/20 via-primary/5 to-transparent",
      iconBg: "bg-primary/20 text-primary border-primary/30",
      trend: "up",
      trendText: "Earning aura",
    },
    {
      label: "Active Streak",
      value: `${stats.current_streak}d`,
      subtext: "Days of participation",
      icon: Flame,
      gradient: "from-orange-500/20 via-red-500/5 to-transparent",
      iconBg: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      trend: stats.current_streak > 3 ? "up" : "neutral",
    },
    {
      label: "Contests",
      value: stats.total_contests_joined,
      subtext: `${stats.total_contests_completed} completed`,
      icon: Target,
      gradient: "from-violet-500/20 via-purple-500/5 to-transparent",
      iconBg: "bg-violet-500/20 text-violet-400 border-violet-500/30",
      trend: stats.total_contests_joined > 0 ? "up" : "neutral",
    },
    {
      label: "Accuracy",
      value: `${stats.accuracy_percentage || 0}%`,
      subtext: "Correct answer rate",
      icon: Percent,
      gradient: "from-sky-500/20 via-cyan-500/5 to-transparent",
      iconBg: "bg-sky-500/20 text-sky-400 border-sky-500/30",
      trend: (stats.accuracy_percentage || 0) >= 60 ? "up" : "down",
    },
    {
      label: "Prize Won",
      value: `₹${(prizeWon || 0).toLocaleString("en-IN")}`,
      subtext: "Total winnings",
      icon: IndianRupee,
      gradient: "from-emerald-500/20 via-green-500/5 to-transparent",
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      trend: prizeWon > 0 ? "up" : "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? TrendingUp : card.trend === "down" ? TrendingDown : Minus;
        const trendColor = card.trend === "up" ? "text-emerald-400" : card.trend === "down" ? "text-red-400" : "text-muted-foreground";

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-4 group hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 pointer-events-none`} />

            {/* Top row */}
            <div className="relative flex items-start justify-between mb-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-xl border ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <TrendIcon className={`w-3.5 h-3.5 mt-0.5 ${trendColor}`} />
            </div>

            {/* Value */}
            <div className="relative">
              <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-none">
                {card.label === "Total Aura" && typeof card.value === "number" ? (
                  <AnimatedNumber value={card.value as number} />
                ) : card.label === "Contests" && typeof card.value === "number" ? (
                  <AnimatedNumber value={card.value as number} />
                ) : (
                  card.value
                )}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 font-medium leading-tight">{card.subtext}</p>
              <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-2">{card.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
