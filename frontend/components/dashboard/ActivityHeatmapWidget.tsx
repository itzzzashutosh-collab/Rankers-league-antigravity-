"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Flame } from "lucide-react";

interface HeatmapDay {
  date: string;
  count: number;
  score?: number;
  contestName?: string;
}

interface ActivityHeatmapWidgetProps {
  data: HeatmapDay[];
  totalContests: number;
  currentStreak: number;
}

function getIntensity(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  return Math.ceil((count / max) * 4);
}

function getDayColor(intensity: number): string {
  switch (intensity) {
    case 0: return "bg-muted/30 border-border/20";
    case 1: return "bg-emerald-500/20 border-emerald-500/20";
    case 2: return "bg-emerald-500/40 border-emerald-500/30";
    case 3: return "bg-emerald-500/70 border-emerald-500/50";
    case 4: return "bg-emerald-500 border-emerald-400/80 shadow-sm shadow-emerald-500/30";
    default: return "bg-muted/30 border-border/20";
  }
}

function buildHeatmapGrid(data: HeatmapDay[]): (HeatmapDay | null)[][] {
  // Build 52 weeks x 7 days grid (1 year back)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const dataMap = new Map<string, HeatmapDay>();
  data.forEach(d => {
    const key = d.date.split("T")[0];
    dataMap.set(key, d);
  });

  const weeks: (HeatmapDay | null)[][] = [];
  let current = new Date(startDate);

  for (let w = 0; w < 53; w++) {
    const week: (HeatmapDay | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const key = current.toISOString().split("T")[0];
      const entry = dataMap.get(key) || null;
      week.push(entry ? entry : current <= today ? { date: key, count: 0 } : null);
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function ActivityHeatmapWidget({ data, totalContests, currentStreak }: ActivityHeatmapWidgetProps) {
  const [tooltip, setTooltip] = React.useState<{ day: HeatmapDay; x: number; y: number } | null>(null);
  const weeks = React.useMemo(() => buildHeatmapGrid(data), [data]);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Month label positions
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week.find(d => d !== null);
    if (firstDay) {
      const date = new Date(firstDay.date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTH_LABELS[month], col: wi });
        lastMonth = month;
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Contest Activity</h3>
            <p className="text-[10px] text-muted-foreground">{totalContests} contests in last year</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-black text-orange-400">{currentStreak} day streak</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex ml-6 mb-1">
            {monthLabels.map(({ label, col }) => (
              <div
                key={`${label}-${col}`}
                className="text-[9px] text-muted-foreground font-bold absolute"
                style={{ marginLeft: `${col * 12}px`, position: "relative" }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="w-4 h-[11px] flex items-center">
                  <span className="text-[8px] text-muted-foreground/60 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => {
                  if (!day) {
                    return <div key={di} className="w-[11px] h-[11px]" />;
                  }
                  const intensity = getIntensity(day.count, maxCount);
                  const colorClass = getDayColor(intensity);
                  return (
                    <div
                      key={di}
                      className={`w-[11px] h-[11px] rounded-[2px] border cursor-pointer transition-all duration-150 hover:scale-125 hover:z-10 relative ${colorClass}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({ day, x: rect.left, y: rect.top });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 ml-5">
            <span className="text-[9px] text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`w-[11px] h-[11px] rounded-[2px] border ${getDayColor(level)}`} />
            ))}
            <span className="text-[9px] text-muted-foreground">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-card/95 backdrop-blur border border-border/60 rounded-xl shadow-2xl text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
          style={{ left: tooltip.x + 6, top: tooltip.y - 8 }}
        >
          <p className="font-black text-foreground">{tooltip.day.date}</p>
          {tooltip.day.count > 0 ? (
            <>
              <p className="text-emerald-400 font-bold">{tooltip.day.count} contest{tooltip.day.count > 1 ? "s" : ""}</p>
              {tooltip.day.contestName && <p className="text-muted-foreground text-[10px]">{tooltip.day.contestName}</p>}
            </>
          ) : (
            <p className="text-muted-foreground">No activity</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
