"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Crosshair, Star } from "lucide-react";

interface SubjectStrength {
  subject: string;
  accuracy: number;
  rank1Accuracy: number;
}

interface RadarStrengthChartProps {
  subjects: SubjectStrength[];
  examCategory?: string;
}

// Default demo data for new users
const DEFAULT_DATA: SubjectStrength[] = [
  { subject: "Physics", accuracy: 0, rank1Accuracy: 90 },
  { subject: "Chemistry", accuracy: 0, rank1Accuracy: 88 },
  { subject: "Mathematics", accuracy: 0, rank1Accuracy: 92 },
  { subject: "Speed", accuracy: 0, rank1Accuracy: 85 },
  { subject: "Accuracy", accuracy: 0, rank1Accuracy: 91 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 bg-card/95 backdrop-blur border border-border/50 rounded-xl shadow-xl text-xs">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-black text-foreground">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RadarStrengthChart({ subjects, examCategory }: RadarStrengthChartProps) {
  const data = subjects.length > 0 ? subjects : DEFAULT_DATA;
  const isEmpty = subjects.length === 0 || subjects.every(s => s.accuracy === 0);

  const chartData = data.map(s => ({
    subject: s.subject,
    You: Math.round(s.accuracy),
    "Rank #1": Math.round(s.rank1Accuracy),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Crosshair className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Strength Radar</h3>
            <p className="text-[10px] text-muted-foreground">You vs Rank #1{examCategory ? ` · ${examCategory}` : ""}</p>
          </div>
        </div>
        {isEmpty && (
          <span className="text-[10px] font-bold text-muted-foreground px-2 py-1 bg-muted/30 rounded-lg">
            Complete contests to unlock
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.4} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 700 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Rank #1"
            dataKey="Rank #1"
            stroke="hsl(43 96% 56%)"
            fill="hsl(43 96% 56%)"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 2"
          />
          <Radar
            name="You"
            dataKey="You"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={isEmpty ? 0 : 0.25}
            strokeWidth={2.5}
            dot={{ fill: "hsl(var(--primary))", r: 3, strokeWidth: 0 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", fontWeight: 700, paddingTop: "8px" }}
            formatter={(value) => (
              <span style={{ color: "hsl(var(--muted-foreground))" }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>

      {isEmpty && (
        <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <Star className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            Your strength profile will appear here after completing your first contest.
          </p>
        </div>
      )}
    </motion.div>
  );
}
