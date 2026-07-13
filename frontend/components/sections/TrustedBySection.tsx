"use client";

import { motion } from "framer-motion";

const institutions = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "AIIMS Delhi",
  "NIT Trichy",
  "BITS Pilani",
  "Delhi University",
  "JNU",
  "IIM Ahmedabad",
  "IIM Bangalore",
  "NLSIU Bangalore",
  "Anna University",
  "SRCC Delhi",
  "IISc Bangalore",
  "NIT Warangal",
  "MAMC Delhi",
  "BHU Varanasi",
];

export function TrustedBySection() {
  const doubled = [...institutions, ...institutions];

  return (
    <section className="py-12 border-y border-border/60 bg-card/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-semibold text-muted-foreground tracking-widest uppercase text-center"
        >
          Trusted by aspirants from India&apos;s leading institutions
        </motion.p>
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center px-8 text-sm font-semibold text-muted-foreground/60 tracking-wide uppercase whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
