"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  Swords,
  Medal,
  PieChart,
  Users,
  Eye,
} from "lucide-react";

const benefits = [
  {
    icon: Gauge,
    title: "Performance",
    description:
      "Measure your competitive readiness with percentile-accurate national benchmarks after every championship.",
  },
  {
    icon: Swords,
    title: "Competition",
    description:
      "Face real competition — thousands of aspirants competing simultaneously under identical conditions.",
  },
  {
    icon: Medal,
    title: "Recognition",
    description:
      "Earn verified national standings, achievement badges, and season rankings that showcase your merit.",
  },
  {
    icon: PieChart,
    title: "Analytics",
    description:
      "Deep-dive into topic-wise accuracy, time distribution, and comparative performance against top rankers.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join a community of serious aspirants who share the same ambition — competing at the national level.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every result is verified. Every ranking is earned. No manipulation, no shortcuts — pure meritocracy.",
  },
];

export function WhyStudentsLoveUs() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            The Difference
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Why Aspirants Choose Ranker&apos;s League
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            Six pillars that define why serious aspirants trust this platform for their competitive examination preparation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group p-8 bg-card border border-border/60 rounded-2xl hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
