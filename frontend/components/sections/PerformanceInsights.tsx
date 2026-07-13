"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Medal, BarChart3, Radar } from "lucide-react";

const insights = [
  {
    icon: Target,
    title: "Average Accuracy",
    value: "87.4%",
    change: "+3.2%",
    changeLabel: "vs last season",
    barPercent: 87,
    barColor: "bg-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Contest Performance",
    value: "Top 8%",
    change: "+12 positions",
    changeLabel: "monthly improvement",
    barPercent: 92,
    barColor: "bg-primary",
  },
  {
    icon: Medal,
    title: "National Ranking",
    value: "#1,247",
    change: "\u2191 340",
    changeLabel: "this quarter",
    barPercent: 78,
    barColor: "bg-amber-500",
  },
  {
    icon: BarChart3,
    title: "Improvement Trajectory",
    value: "+24.6%",
    change: "Accelerating",
    changeLabel: "6-month trend",
    barPercent: 65,
    barColor: "bg-violet-500",
  },
  {
    icon: Radar,
    title: "Skill Coverage",
    value: "94.2%",
    change: "6 of 8 domains",
    changeLabel: "mastered",
    barPercent: 94,
    barColor: "bg-cyan-500",
  },
];

export function PerformanceInsights() {
  return (
    <section className="py-24 bg-background relative">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Data-Driven Excellence
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Performance Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            Every championship delivers comprehensive analytics — transforming raw performance into actionable intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {insights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-5 bg-card border border-border/60 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/10">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                  {item.title}
                </span>
              </div>

              <span className="block text-2xl font-bold font-heading text-foreground mb-1">
                {item.value}
              </span>

              <div className="flex items-center gap-1.5 text-[10px] mb-4">
                <span className="text-emerald-500 font-semibold">{item.change}</span>
                <span className="text-muted-foreground">{item.changeLabel}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.barPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className={`h-full rounded-full ${item.barColor}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
