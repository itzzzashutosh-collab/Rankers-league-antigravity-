"use client";

import * as React from "react";
import { Calendar, List, ChevronLeft, ChevronRight, Award } from "lucide-react";
import Link from "next/link";
import { LiveContest } from "../../types/live";
import { ContestTimeline } from "./ContestTimeline";
import { Card, Typography } from "../ui";
import { cn } from "@/lib/utils";

interface ContestCalendarProps {
  contests: LiveContest[];
  className?: string;
}

export function ContestCalendar({ contests, className }: ContestCalendarProps) {
  const [view, setView] = React.useState<"month" | "list">("month");

  // Grid for July 2026 (July starts on Wednesday, 31 days)
  const daysInJuly = 31;
  const startDayOffset = 3; // Wednesday is 3rd index (0: Sun, 1: Mon, 2: Tue, 3: Wed)
  const calendarCells = Array.from({ length: 35 }).map((_, idx) => {
    const dayNumber = idx - startDayOffset + 1;
    if (dayNumber > 0 && dayNumber <= daysInJuly) {
      return dayNumber;
    }
    return null;
  });

  // Find contest by day number for July 2026
  const getContestForDay = (day: number | null) => {
    if (!day) return null;
    return contests.find(c => {
      const d = new Date(c.date);
      return d.getDate() === day && d.getMonth() === 6 && d.getFullYear() === 2026; // July (Month index 6)
    });
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card variant="solid" className={cn("border border-border/40 p-5 rounded-2xl bg-card/25 backdrop-blur-md", className)}>
      <div className="flex items-center justify-between border-b border-border/20 pb-4 mb-6">
        <div>
          <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
            Contest Schedule Board
          </Typography>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest block mt-0.5">
            July 2026 Calendar
          </span>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex bg-secondary/80 border border-border/45 rounded-lg p-0.5">
          <button
            onClick={() => setView("month")}
            className={cn(
              "p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all select-none",
              view === "month" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendar
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all select-none",
              view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-3.5 h-3.5" />
            Timeline
          </button>
        </div>
      </div>

      {view === "list" ? (
        <ContestTimeline contests={contests} />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Header Row month selectors */}
          <div className="flex items-center justify-between text-xs font-bold px-2">
            <span className="text-foreground">July 2026</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 rounded hover:bg-muted text-muted-foreground/40 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled className="p-1 rounded hover:bg-muted text-muted-foreground/40 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday indicators */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider py-1.5 border-y border-border/20">
            {weekdays.map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((day, idx) => {
              const contest = getContestForDay(day);
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-16 border border-border/20 p-1.5 rounded-lg flex flex-col justify-between transition-all",
                    day ? "bg-card/20 hover:border-primary/20" : "bg-transparent border-transparent",
                    contest && "border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-sm"
                  )}
                >
                  {day ? (
                    <span className={cn("text-xs font-bold", contest ? "text-primary" : "text-muted-foreground/80")}>
                      {day}
                    </span>
                  ) : (
                    <span />
                  )}

                  {/* Contest Badge trigger inside cell */}
                  {contest && day && (
                    <Link
                      href={`/live/${contest.slug}`}
                      className="group flex flex-col text-[8px] bg-primary text-primary-foreground font-bold p-1 rounded uppercase tracking-wider truncate text-center hover:opacity-90 select-none animate-in fade-in zoom-in duration-200"
                      title={contest.title}
                    >
                      <span className="truncate block">{contest.exam}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
export default ContestCalendar;
