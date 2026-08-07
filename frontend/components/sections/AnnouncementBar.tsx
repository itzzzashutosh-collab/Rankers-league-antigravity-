"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

const announcements = [
  "\uD83C\uDFC6 Season 7 Championships Now Open — Registration closes July 10",
  "\uD83D\uDD25 New: GATE CSE Elite Series Added — 30,000 seats available",
  "\u2728 Platform Update: Real-time performance analytics now live for all aspirants",
];

export function AnnouncementBar() {
  const [visible, setVisible] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-medium tracking-wide text-center flex items-center gap-2"
          >
            {announcements[currentIndex]}
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </motion.p>
        </AnimatePresence>

        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
