"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PerformanceHeatmap, ConsistencyStatistic } from "@/services/auth/performanceService";
import { Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeatmapGridProps {
  heatmaps: PerformanceHeatmap[];
  consistency: ConsistencyStatistic[];
}

type ViewMetric = "consistency" | "accuracy" | "pace" | "difficulty";

interface GridDay {
  date: Date;
  dateString: string;
  completions: number;
  heatmaps: PerformanceHeatmap[];
  accuracy: number;
  averageTime: number;
  pace: "fast" | "normal" | "slow" | "very_slow" | null;
  difficulty: "easy" | "medium" | "hard" | "very_hard" | null;
  aura: number;
}

export function HeatmapGrid({ heatmaps, consistency }: HeatmapGridProps) {
  const [selectedMetric, setSelectedMetric] = useState<ViewMetric>("consistency");
  const [hoveredCell, setHoveredCell] = useState<GridDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate date grid for the last 120 days
  const gridData = useMemo(() => {
    const dates = [];
    const today = new Date();
    // Start from 119 days ago to have exactly 120 days (approx 17 weeks)
    for (let i = 119; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split("T")[0];

      // Find consistency data
      const consRecord = consistency.find((c) => c.date === dateString);
      const completions = consRecord ? consRecord.contests_completed : 0;

      // Find heatmap records for this date
      const dayHeatmaps = heatmaps.filter(
        (h) => new Date(h.contest_date).toISOString().split("T")[0] === dateString
      );

      // Aggregate info for this date
      const avgAccuracy =
        dayHeatmaps.length > 0
          ? dayHeatmaps.reduce((sum, h) => sum + Number(h.accuracy), 0) / dayHeatmaps.length
          : 0;

      const avgTime =
        dayHeatmaps.length > 0
          ? dayHeatmaps.reduce((sum, h) => sum + h.average_time_seconds, 0) / dayHeatmaps.length
          : 0;

      // Determine main pace
      let pace: "fast" | "normal" | "slow" | "very_slow" | null = null;
      if (dayHeatmaps.length > 0) {
        const paces = dayHeatmaps.map((h) => {
          if (h.average_time_seconds < 30) return "fast";
          if (h.average_time_seconds <= 50) return "normal";
          if (h.average_time_seconds <= 75) return "slow";
          return "very_slow";
        });
        // Take the most frequent pace or just the first
        pace = paces[0] as "fast" | "normal" | "slow" | "very_slow" | null;
      }

      // Determine main difficulty
      const difficulty = dayHeatmaps.length > 0 ? dayHeatmaps[0].difficulty : null;
      const aura = dayHeatmaps.reduce((sum, h) => sum + (h.aura_earned || 0), 0);

      dates.push({
        date: d,
        dateString,
        completions,
        heatmaps: dayHeatmaps,
        accuracy: avgAccuracy,
        averageTime: avgTime,
        pace,
        difficulty,
        aura,
      });
    }
    return dates;
  }, [heatmaps, consistency]);

  // Helper to chunk into weeks of 7 days
  const weeks = useMemo(() => {
    const chunked: GridDay[][] = [];
    let currentWeek: typeof gridData = [];

    gridData.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === gridData.length - 1) {
        chunked.push(currentWeek);
        currentWeek = [];
      }
    });

    return chunked;
  }, [gridData]);

  // Color mappings based on metric and value
  const getCellColor = (day: (typeof gridData)[0]) => {
    if (selectedMetric === "consistency") {
      const c = day.completions;
      if (c === 0) return "bg-muted/10 border-border/10";
      if (c === 1) return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
      if (c === 2) return "bg-emerald-500/50 border-emerald-500/60 text-emerald-200";
      return "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]";
    }

    if (selectedMetric === "accuracy") {
      if (day.heatmaps.length === 0) return "bg-muted/10 border-border/10";
      const acc = day.accuracy;
      if (acc < 50) return "bg-red-500/30 border-red-500/40 text-red-300";
      if (acc < 70) return "bg-amber-500/30 border-amber-500/40 text-amber-300";
      if (acc < 85) return "bg-yellow-400/40 border-yellow-400/50 text-yellow-200";
      return "bg-emerald-500/60 border-emerald-400/60 text-emerald-200 shadow-[0_0_6px_rgba(16,185,129,0.2)]";
    }

    if (selectedMetric === "pace") {
      if (day.heatmaps.length === 0) return "bg-muted/10 border-border/10";
      const pace = day.pace;
      if (pace === "fast") return "bg-cyan-500/50 border-cyan-400/60 text-cyan-200 shadow-[0_0_6px_rgba(6,182,212,0.2)]";
      if (pace === "normal") return "bg-blue-500/40 border-blue-400/50 text-blue-200";
      if (pace === "slow") return "bg-orange-500/30 border-orange-400/40 text-orange-300";
      return "bg-rose-500/30 border-rose-500/40 text-rose-300";
    }

    if (selectedMetric === "difficulty") {
      if (day.heatmaps.length === 0) return "bg-muted/10 border-border/10";
      const diff = day.difficulty;
      if (diff === "easy") return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
      if (diff === "medium") return "bg-blue-500/20 border-blue-500/30 text-blue-300";
      if (diff === "hard") return "bg-violet-500/35 border-violet-500/40 text-violet-300";
      return "bg-fuchsia-500/50 border-fuchsia-500/60 text-fuchsia-200 shadow-[0_0_6px_rgba(217,70,239,0.2)]";
    }

    return "bg-muted/10";
  };

  const handleMouseMove = (e: React.MouseEvent, cell: GridDay) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 10,
    });
    setHoveredCell(cell);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black tracking-tight text-foreground flex items-center gap-2">
            Activity & Performance Heatmap
            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize your competitive engagement patterns and efficiency distributions.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/20 self-start md:self-auto">
          {(
            [
              { id: "consistency", label: "Consistency" },
              { id: "accuracy", label: "Accuracy" },
              { id: "pace", label: "Solve Pace" },
              { id: "difficulty", label: "Difficulty" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                selectedMetric === m.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted">
        <div className="min-w-[680px] flex gap-1.5">
          <div className="flex flex-col justify-between text-[10px] text-muted-foreground pr-2 font-bold py-1 select-none">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          <div className="flex gap-1.5 flex-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col justify-between gap-1.5">
                {week.map((day) => {
                  const cellColor = getCellColor(day);
                  return (
                    <motion.div
                      key={day.dateString}
                      whileHover={{ scale: 1.25, zIndex: 10 }}
                      onMouseEnter={(e) => handleMouseMove(e, day)}
                      onMouseMove={(e) => handleMouseMove(e, day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={cn(
                        "w-[14px] h-[14px] rounded-[3px] border transition-all duration-150 cursor-pointer",
                        cellColor
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Summary Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 border-t border-border/30 pt-4 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground font-semibold">
          <span>Less</span>
          <div className="flex gap-1 mx-1.5">
            {selectedMetric === "consistency" && (
              <>
                <div className="w-3 h-3 rounded-[2px] bg-muted/10 border border-border/10" />
                <div className="w-3 h-3 rounded-[2px] bg-emerald-500/20 border border-emerald-500/30" />
                <div className="w-3 h-3 rounded-[2px] bg-emerald-500/50 border border-emerald-500/60" />
                <div className="w-3 h-3 rounded-[2px] bg-emerald-500 border border-emerald-400" />
              </>
            )}
            {selectedMetric === "accuracy" && (
              <>
                <div className="w-3 h-3 rounded-[2px] bg-muted/10 border border-border/10" />
                <div className="w-3 h-3 rounded-[2px] bg-red-500/30 border border-red-500/40" />
                <div className="w-3 h-3 rounded-[2px] bg-amber-500/30 border border-amber-500/40" />
                <div className="w-3 h-3 rounded-[2px] bg-yellow-400/40 border border-yellow-400/50" />
                <div className="w-3 h-3 rounded-[2px] bg-emerald-500/60 border border-emerald-400/60" />
              </>
            )}
            {selectedMetric === "pace" && (
              <>
                <div className="w-3 h-3 rounded-[2px] bg-muted/10 border border-border/10" />
                <div className="w-3 h-3 rounded-[2px] bg-rose-500/30 border border-rose-500/40" />
                <div className="w-3 h-3 rounded-[2px] bg-orange-500/30 border border-orange-400/40" />
                <div className="w-3 h-3 rounded-[2px] bg-blue-500/40 border border-blue-400/50" />
                <div className="w-3 h-3 rounded-[2px] bg-cyan-500/50 border border-cyan-400/60" />
              </>
            )}
            {selectedMetric === "difficulty" && (
              <>
                <div className="w-3 h-3 rounded-[2px] bg-muted/10 border border-border/10" />
                <div className="w-3 h-3 rounded-[2px] bg-emerald-500/20 border border-emerald-500/30" />
                <div className="w-3 h-3 rounded-[2px] bg-blue-500/20 border border-blue-500/30" />
                <div className="w-3 h-3 rounded-[2px] bg-violet-500/35 border border-violet-500/40" />
                <div className="w-3 h-3 rounded-[2px] bg-fuchsia-500/50 border border-fuchsia-500/60" />
              </>
            )}
          </div>
          <span>More</span>
        </div>

        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          {selectedMetric === "consistency" && (
            <span>Cells display daily mock exams completed. Higher saturation indicates higher contest completions.</span>
          )}
          {selectedMetric === "accuracy" && (
            <span>Cells show accuracy: <span className="text-red-400 font-bold">&lt;50% (Red)</span>, <span className="text-amber-400 font-bold">50-70% (Amber)</span>, <span className="text-yellow-400 font-bold">70-85% (Yellow)</span>, <span className="text-emerald-400 font-bold">&gt;85% (Green)</span>.</span>
          )}
          {selectedMetric === "pace" && (
            <span>Pace tracking: <span className="text-cyan-400 font-bold">Fast</span>, <span className="text-blue-400 font-bold">Normal</span>, <span className="text-orange-400 font-bold">Slow</span>, <span className="text-rose-400 font-bold">Very Slow</span> solve speeds.</span>
          )}
          {selectedMetric === "difficulty" && (
            <span>Visualizes primary challenge levels solved: <span className="text-emerald-400 font-bold">Easy</span>, <span className="text-blue-400 font-bold">Medium</span>, <span className="text-violet-400 font-bold">Hard</span>, <span className="text-fuchsia-400 font-bold">Very Hard</span>.</span>
          )}
        </div>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredCell && (
          <div
            style={{
              position: "fixed",
              left: tooltipPos.x - 120,
              top: tooltipPos.y - 120,
              pointerEvents: "none",
            }}
            className="w-60 p-3 bg-popover/95 border border-border/50 rounded-2xl shadow-2xl z-50 text-left backdrop-blur-md animate-fade-in"
          >
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
              {formatDate(hoveredCell.date)}
            </p>
            
            {hoveredCell.heatmaps.length === 0 ? (
              <p className="text-xs text-foreground font-medium">No activity recorded</p>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-foreground font-bold">
                  {hoveredCell.completions} {hoveredCell.completions === 1 ? "Contest" : "Contests"} Completed
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pt-1 border-t border-border/30 mt-1">
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>{" "}
                    <span className={cn(
                      "font-black",
                      hoveredCell.accuracy >= 80 ? "text-emerald-400" :
                      hoveredCell.accuracy >= 60 ? "text-amber-400" : "text-red-400"
                    )}>
                      {hoveredCell.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aura:</span>{" "}
                    <span className="text-primary font-black">+{hoveredCell.aura}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Time:</span>{" "}
                    <span className="text-foreground font-black">{hoveredCell.averageTime}s</span>
                  </div>
                  {hoveredCell.difficulty && (
                    <div className="capitalize">
                      <span className="text-muted-foreground">Diff:</span>{" "}
                      <span className="text-foreground font-black">{hoveredCell.difficulty}</span>
                    </div>
                  )}
                </div>
                <div className="text-[9px] text-primary/80 mt-1 font-medium truncate italic">
                  {hoveredCell.heatmaps[0]?.contest_name}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default HeatmapGrid;
