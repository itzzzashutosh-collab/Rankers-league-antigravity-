"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, Swords, BarChart3, Award } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Contests",
    description:
      "Browse upcoming national championships across 13+ examination categories. Filter by exam, difficulty, date, and prize pool.",
  },
  {
    icon: UserPlus,
    title: "Register",
    description:
      "Secure your championship slot with credits. Registration closes 30 minutes before the scheduled start time.",
  },
  {
    icon: Swords,
    title: "Compete",
    description:
      "Enter the live arena at the scheduled time. Face the same questions as thousands of aspirants nationwide, under identical conditions.",
  },
  {
    icon: BarChart3,
    title: "View Rankings",
    description:
      "Receive your verified national standing within minutes. Access comprehensive performance analytics including topic-wise breakdowns.",
  },
  {
    icon: Award,
    title: "Earn Recognition",
    description:
      "Climb the seasonal leaderboard, earn achievement badges, and collect rewards from the championship prize pool.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/40">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Getting Started
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            How It Works
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            From discovery to recognition — five steps to compete at the national level.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border/60 hidden sm:block" />

          <div className="flex flex-col gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative sm:pl-20 group"
              >
                {/* Step number circle */}
                <div className="absolute left-[17px] top-1 hidden sm:flex items-center justify-center w-[26px] h-[26px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold border-4 border-background z-10 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>

                <div className="p-6 bg-background border border-border/60 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0 sm:hidden">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
