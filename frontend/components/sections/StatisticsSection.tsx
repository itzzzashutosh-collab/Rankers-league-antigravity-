"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { statisticsContent, StatItem } from "@/content/statistics";

function AnimatedCounter({ item, inView }: { item: StatItem; inView: boolean }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = item.value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, item.value);
      setCount(current);
      if (step >= steps) {
        setCount(item.value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, item.value]);

  const formatValue = (val: number) => {
    if (val >= 100000) return Math.floor(val).toLocaleString("en-IN");
    if (val >= 1000) return Math.floor(val).toLocaleString("en-IN");
    if (Number.isInteger(item.value)) return Math.floor(val).toString();
    return val.toFixed(1);
  };

  return (
    <span className="block text-3xl sm:text-4xl font-bold font-heading text-foreground tabular-nums">
      {item.prefix || ""}
      {formatValue(count)}
      {item.suffix}
    </span>
  );
}

export function StatisticsSection() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="py-20 bg-background relative">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Platform Performance
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Numbers That Define Excellence
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {statisticsContent.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="text-center flex flex-col items-center gap-2"
            >
              <AnimatedCounter item={item} inView={inView} />
              <span className="text-xs text-muted-foreground font-medium">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
