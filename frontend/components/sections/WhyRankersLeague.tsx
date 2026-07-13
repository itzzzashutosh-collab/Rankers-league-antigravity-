"use client";

import { motion } from "framer-motion";
import {
  Globe,
  BarChart3,
  Award,
  Activity,
  LineChart,
  ShieldCheck,
  Sparkles,
  Crown,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "National Competition",
    description:
      "Compete against thousands of aspirants across the country simultaneously in scheduled championships that mirror actual examination conditions.",
  },
  {
    icon: BarChart3,
    title: "Transparent Rankings",
    description:
      "Every standing position is verified through automated response-pattern validation. No manipulation, no bias — pure merit-based national standings.",
  },
  {
    icon: Award,
    title: "Merit Based Results",
    description:
      "Rankings are determined solely by performance under standardized conditions. Your national percentile reflects your true competitive caliber.",
  },
  {
    icon: Activity,
    title: "Real Time Performance",
    description:
      "Live leaderboard updates during championships, instant result publication, and real-time percentile calculation upon completion.",
  },
  {
    icon: LineChart,
    title: "Detailed Analytics",
    description:
      "Comprehensive post-championship reports with topic-wise accuracy, time distribution, comparative analysis, and improvement trajectories.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Multi-layered integrity verification including session monitoring, browser lockdown, anomaly detection, and manual review protocols.",
  },
  {
    icon: Sparkles,
    title: "Professional Experience",
    description:
      "Enterprise-grade examination interface designed to replicate the exact pressure and format of India\u2019s most prestigious assessments.",
  },
  {
    icon: Crown,
    title: "Premium User Experience",
    description:
      "Crafted with obsessive attention to detail — from typography to micro-interactions — delivering the most refined competitive examination experience.",
  },
];

export function WhyRankersLeague() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Why Ranker&apos;s League
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            A platform engineered for aspirants who demand the highest standards of competition,
            transparency, and analytical depth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group p-6 bg-background border border-border/60 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
