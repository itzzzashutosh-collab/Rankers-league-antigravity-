"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ctaContent } from "@/content/cta";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-blob w-[600px] h-[600px] bg-primary/8 top-[-200px] left-[10%]" />
        <div className="aurora-blob w-[400px] h-[400px] bg-emerald-500/6 bottom-[-100px] right-[15%]" style={{ animationDelay: "5s" }} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.03_80/5%),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {ctaContent.headline}
          </h2>
          <p className="text-base text-muted-foreground mt-5 max-w-2xl mx-auto leading-relaxed">
            {ctaContent.subline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button size="lg" className="px-8 rounded-xl font-semibold glow-subtle gap-2">
              {ctaContent.primaryCta.label}
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 rounded-xl hover:bg-muted text-foreground"
            >
              {ctaContent.secondaryCta.label}
            </Button>
          </div>

          {/* Supporting stats */}
          <div className="grid grid-cols-3 gap-8 mt-14 pt-10 border-t border-border/60 max-w-lg mx-auto">
            {ctaContent.stats.map((stat) => (
              <div key={stat.label}>
                <span className="block text-xl font-bold font-heading text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
