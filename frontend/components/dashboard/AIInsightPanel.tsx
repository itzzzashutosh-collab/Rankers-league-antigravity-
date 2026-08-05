"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Brain, Clock, TrendingUp, AlertCircle, Lightbulb, CheckCircle } from "lucide-react";

interface PerformanceData {
  accuracy: number;
  avgTime?: number;
  weakSubject?: string;
  streak: number;
  totalContests: number;
  rank?: number | null;
  bestRank?: number | null;
}

interface AIInsightPanelProps {
  performance: PerformanceData;
  studentName?: string;
}

interface Insight {
  type: "warning" | "tip" | "success" | "analysis";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  color: string;
}

function generateInsights(p: PerformanceData): Insight[] {
  const insights: Insight[] = [];

  if (p.totalContests === 0) {
    insights.push({
      type: "tip",
      icon: Lightbulb,
      title: "Start Your Journey",
      message: "Enroll in your first contest to unlock personalized AI insights. Your performance data will help me identify your strengths and craft a strategy tailored specifically for you.",
      color: "text-primary bg-primary/10 border-primary/20",
    });
    insights.push({
      type: "analysis",
      icon: Brain,
      title: "Strategy Preview",
      message: "Top rankers typically attempt 75-80% of questions with high accuracy rather than attempting everything. Focus on your strong subjects first and build momentum.",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    });
    return insights;
  }

  if (p.accuracy < 40) {
    insights.push({
      type: "warning",
      icon: AlertCircle,
      title: "Accuracy Alert",
      message: `Your accuracy is at ${p.accuracy}% — that means negative marking is hurting your score. I recommend skipping uncertain questions rather than guessing. Quality over quantity always wins.`,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    });
  } else if (p.accuracy >= 70) {
    insights.push({
      type: "success",
      icon: CheckCircle,
      title: "Excellent Accuracy",
      message: `Outstanding! Your ${p.accuracy}% accuracy is in the top tier. Focus now on increasing your question attempt rate — you have the precision, now build the speed.`,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    });
  } else {
    insights.push({
      type: "tip",
      icon: TrendingUp,
      title: "Good Progress",
      message: `At ${p.accuracy}% accuracy, you're on the right track. Push it above 65% by practicing more ${p.weakSubject || "Chemistry"} — that's your key unlock for top 100 rank.`,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    });
  }

  if (p.weakSubject) {
    insights.push({
      type: "analysis",
      icon: Brain,
      title: `Focus: ${p.weakSubject}`,
      message: `${p.weakSubject} is your weak link right now. Rank #1 typically scores 85%+ accuracy there. Dedicate 30 minutes daily to ${p.weakSubject} for the next 2 weeks and you'll see a rank jump of 200-500 positions.`,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    });
  }

  if (p.avgTime && p.avgTime > 90) {
    insights.push({
      type: "warning",
      icon: Clock,
      title: "Time Management",
      message: `You're averaging ${p.avgTime}s per question. Rank #1 typically solves in under 60s. Practice speed-solving for MCQs — don't spend more than 2 mins on any single question in a contest.`,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    });
  }

  if (p.streak >= 7) {
    insights.push({
      type: "success",
      icon: TrendingUp,
      title: `${p.streak}-Day Streak!`,
      message: `Amazing consistency! ${p.streak} days in a row shows real dedication. Consistent practice is what separates rank holders from occasional competitors. Keep this momentum.`,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    });
  }

  if (p.rank && p.rank > 1000) {
    insights.push({
      type: "tip",
      icon: Lightbulb,
      title: "Rank Breakthrough Strategy",
      message: `You're at Rank #${p.rank}. To break into Top 500, you need 2 things: score above 220/360 consistently and reduce wrong answers below 5 per paper. That's a very achievable target in 3-4 contests.`,
      color: "text-primary bg-primary/10 border-primary/20",
    });
  }

  return insights;
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = React.useState("");
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  React.useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [started, text]);

  return <>{displayed}</>;
}

export default function AIInsightPanel({ performance, studentName }: AIInsightPanelProps) {
  const [expanded, setExpanded] = React.useState(false);
  const insights = generateInsights(performance);
  const firstInsight = insights[0];
  const restInsights = insights.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-card/60 backdrop-blur-xl overflow-hidden"
    >
      {/* Top gradient bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-violet-400 to-primary/0" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          {/* Ashu Sir Avatar */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-foreground">Ashu Sir · AI Intelligence</p>
              <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-wider">Live</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Personalized insights for {studentName ? <strong>{studentName.split(" ")[0]}</strong> : "you"}
            </p>
          </div>
        </div>

        {/* Main insight with typewriter */}
        {firstInsight && (
          <div className={`p-4 rounded-2xl border ${firstInsight.color} mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <firstInsight.icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-black">{firstInsight.title}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              <TypewriterText text={firstInsight.message} delay={0.5} />
            </p>
          </div>
        )}

        {/* Additional insights */}
        {expanded && restInsights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl border ${insight.color} mb-3`}
          >
            <div className="flex items-center gap-2 mb-2">
              <insight.icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-black">{insight.title}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{insight.message}</p>
          </motion.div>
        ))}

        {/* Expand / collapse */}
        {restInsights.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 text-xs font-black text-primary hover:bg-primary/10 transition-all"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show Less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> {restInsights.length} More Insights from Ashu Sir</>
            )}
          </button>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-primary/10">
          <Sparkles className="w-3 h-3 text-primary/60" />
          <p className="text-[9px] text-muted-foreground/60 font-medium">
            AI Intelligence · Powered by Ranker's League · Updates after each contest
          </p>
        </div>
      </div>
    </motion.div>
  );
}
