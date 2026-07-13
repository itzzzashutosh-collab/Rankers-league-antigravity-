"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonialsContent } from "@/content/testimonials";

export function SuccessStories() {
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonialsContent.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonialsContent.length) % testimonialsContent.length);
  };

  // Auto-advance
  React.useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  const story = testimonialsContent[current];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

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
            Aspirant Voices
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Success Stories
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            Real achievements from aspirants who competed on Ranker&apos;s League and excelled in their target examinations.
          </p>
        </motion.div>

        <div className="relative">
          <div className="bg-background border border-border/60 rounded-2xl p-8 sm:p-12 overflow-hidden relative min-h-[320px] flex flex-col justify-center">
            <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={story.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center text-center gap-6"
              >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.gradientFrom} ${story.gradientTo} flex items-center justify-center text-white font-heading font-bold text-lg shadow-lg`}>
                  {story.initials}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-foreground leading-relaxed max-w-2xl italic">
                  &ldquo;{story.review}&rdquo;
                </p>

                {/* Meta */}
                <div className="flex flex-col items-center gap-1">
                  <span className="font-heading text-base font-bold text-foreground">
                    {story.name}
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    {story.achievement}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {story.institution}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonialsContent.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to story ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
              aria-label="Next story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
