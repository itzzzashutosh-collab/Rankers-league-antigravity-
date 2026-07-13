"use client";

import * as React from "react";
import { Trophy, Zap, Target, Award, Flame, Percent } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewCardsProps {
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
}

export function OverviewCards({ stats, nationalRank }: OverviewCardsProps) {
  const cards = [
    {
      label: "Current Rank",
      value: nationalRank ? `#${nationalRank}` : "—",
      subtext: stats.best_rank ? `Best Rank: #${stats.best_rank}` : "No completed contests",
      icon: Trophy,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Aura Points",
      value: (stats.total_aura_earned || 0).toLocaleString(),
      subtext: "Pure competition score",
      icon: Zap,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Competitions Joined",
      value: stats.total_contests_joined,
      subtext: `${stats.total_contests_completed} fully completed`,
      icon: Target,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Competitions Won",
      value: stats.total_contests_won,
      subtext: "Finished in Prize Pool Tiers",
      icon: Award,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Active Streak",
      value: `${stats.current_streak} days`,
      subtext: "Keep competing to build streak",
      icon: Flame,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Accuracy Rate",
      value: `${stats.accuracy_percentage || 0}%`,
      subtext: "Correct answer efficiency",
      icon: Percent,
      color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-foreground">{card.value}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 truncate">{card.subtext}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
export default OverviewCards;
