"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, ArrowRight, Zap, TrendingDown } from "lucide-react";
import Link from "next/link";

interface WeakTopic {
  topic: string;
  chapter?: string;
  subject: string;
  accuracy: number;
  attempted: number;
  severity: "critical" | "weak" | "average";
}

interface WeakTopicsPanelProps {
  topics: WeakTopic[];
}

function SeverityBadge({ severity }: { severity: WeakTopic["severity"] }) {
  const configs: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    weak: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    average: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };
  const labels: Record<string, string> = { critical: "Critical", weak: "Weak", average: "Average" };
  const badgeClass = configs[severity] || "bg-amber-500/20 text-amber-400 border-amber-500/30";
  const labelText = labels[severity] || String(severity);
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeClass}`}>
      {labelText}
    </span>
  );
}

function AccuracyBar({ accuracy }: { accuracy: number }) {
  const color = accuracy < 30 ? "bg-red-500" : accuracy < 50 ? "bg-orange-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${accuracy}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-black text-muted-foreground w-8 text-right">{accuracy}%</span>
    </div>
  );
}

export default function WeakTopicsPanel({ topics }: WeakTopicsPanelProps) {
  const isEmpty = topics.length === 0;

  const DEMO_TOPICS: WeakTopic[] = [
    { topic: "Organic Chemistry Mechanisms", chapter: "Reaction Mechanisms", subject: "Chemistry", accuracy: 22, attempted: 18, severity: "critical" },
    { topic: "Rotational Dynamics", chapter: "Rotational Motion", subject: "Physics", accuracy: 31, attempted: 14, severity: "weak" },
    { topic: "Integral Calculus", chapter: "Integration", subject: "Mathematics", accuracy: 38, attempted: 22, severity: "weak" },
    { topic: "Electrochemistry", chapter: "Electrolysis", subject: "Chemistry", accuracy: 45, attempted: 11, severity: "average" },
    { topic: "Waves & Oscillations", chapter: "SHM", subject: "Physics", accuracy: 47, attempted: 9, severity: "average" },
  ];

  const displayTopics = isEmpty ? DEMO_TOPICS : topics.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Weak Areas</h3>
            <p className="text-[10px] text-muted-foreground">Topics needing most attention</p>
          </div>
        </div>
        {isEmpty && (
          <span className="text-[10px] font-bold text-muted-foreground px-2 py-1 bg-muted/30 rounded-lg flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Demo data
          </span>
        )}
      </div>

      {/* Topics list */}
      <div className="space-y-3">
        {displayTopics.map((topic, i) => (
          <motion.div
            key={`${topic.topic}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
            className="p-3 rounded-xl border border-border/30 bg-muted/10 hover:border-primary/20 hover:bg-muted/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="min-w-0">
                <p className="text-xs font-black text-foreground leading-tight truncate">{topic.topic}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {topic.chapter && `${topic.chapter} · `}{topic.subject}
                </p>
              </div>
              <SeverityBadge severity={topic.severity} />
            </div>
            <AccuracyBar accuracy={topic.accuracy} />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">{topic.attempted} qs attempted</span>
              <Link
                href="/contests"
                className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
              >
                Practice <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {isEmpty && (
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            Complete contests to unlock your personalized weakness analysis.
          </p>
        </div>
      )}
    </motion.div>
  );
}
