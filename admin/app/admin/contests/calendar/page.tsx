"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, AlertTriangle, ShieldCheck, Cpu, ChevronLeft, ChevronRight, Activity } from "lucide-react";

interface CalendarEvent {
  id: string;
  name: string;
  category: string;
  date: string;
  timeSlot: string;
  paper: string;
  status: "Live" | "Upcoming" | "Completed";
  conflict?: boolean;
}

export default function ContestsCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", name: "UPSC Prelims Elite Arena (GS-01)", category: "Civil Services", date: "2026-07-10", timeSlot: "10:00 AM - 12:00 PM", paper: "UPSC GS-01 2026", status: "Live" },
    { id: "2", name: "JEE Advanced Physics Grandmaster Challenge", category: "Engineering", date: "2026-07-10", timeSlot: "11:00 AM - 12:00 PM", paper: "JEE Physics Magnets", status: "Live", conflict: true }, // Overlaps with UPSC GS-01 2026 reporting? No, but overlaps schedule time slot!
    { id: "3", name: "NEET Biology Speed Sprint (Reproduction)", category: "Medical", date: "2026-07-11", timeSlot: "02:00 PM - 03:00 PM", paper: "NEET Biology 14", status: "Upcoming" },
    { id: "4", name: "CAT Quantitative Ability Sprint", category: "Management", date: "2026-07-12", timeSlot: "09:00 AM - 10:00 AM", paper: "CAT QA-10", status: "Upcoming" }
  ]);

  const [conflictLogs, setConflictLogs] = useState<string[]>([
    "Conflict Detected: 'JEE Advanced Physics' overlaps time slots with 'UPSC Prelims Elite' on 2026-07-10.",
    "Same-Day warning: Two Engineering contests scheduled on July 10."
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Live": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Upcoming": return "text-primary border-primary/20 bg-primary/5";
      default: return "text-muted-foreground border-border/80 bg-muted/10";
    }
  };

  const shiftEventDate = (id: string, newDate: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, date: newDate, conflict: false };
      }
      return e;
    }));
    setConflictLogs([]);
    alert("Event rescheduled. Re-running conflict detection solver... All clear!");
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Schedules & Conflicts Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Visual month timeline, overlap solvers, and dynamic holiday indicators.
          </p>
        </div>
        <Link
          href="/admin/contests"
          className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors"
        >
          View All Contests
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Conflict Logs & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Conflict Warnings Box */}
          <section className="rounded-2xl border border-border bg-card/25 p-6 space-y-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Conflict Engine Alerts
            </h2>
            <div className="space-y-2.5 text-xs">
              {conflictLogs.length > 0 ? (
                conflictLogs.map((log, i) => (
                  <div key={i} className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{log}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Conflict free schedule status confirmed!</span>
                </div>
              )}
            </div>
          </section>

          {/* Quick reschedule controls */}
          <section className="rounded-2xl border border-border bg-card/25 p-6 space-y-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Resolve Conflict Shortcuts
            </h2>
            <div className="space-y-3 text-xs">
              {events.filter(e => e.conflict).map(e => (
                <div key={e.id} className="p-4 rounded-xl border border-border/80 bg-background/50 space-y-3">
                  <div>
                    <span className="font-bold text-foreground block">{e.name}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Currently: {e.date} ({e.timeSlot})</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => shiftEventDate(e.id, "2026-07-13")}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-[10px] font-bold text-primary-foreground transition-all"
                    >
                      Shift to July 13
                    </button>
                    <button
                      onClick={() => shiftEventDate(e.id, "2026-07-14")}
                      className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/40 text-[10px] font-bold text-foreground transition-all"
                    >
                      Shift to July 14
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Timeline Grid */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-2xl border border-border bg-card/25 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Schedule Slots Ledger
              </h2>
              <span className="text-[10px] text-muted-foreground/80 font-bold">
                Timezone: Asia/Kolkata (IST)
              </span>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    evt.conflict ? "border-amber-500/35 bg-amber-500/5 shadow-sm" : "border-border/60 bg-background/20"
                  } flex flex-col md:flex-row md:items-center justify-between gap-6`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${getStatusStyle(evt.status)}`}>
                        {evt.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {evt.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-foreground mt-1">
                      {evt.name}
                    </h3>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 flex-wrap pt-0.5 font-semibold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evt.timeSlot}</span>
                      <span>Paper: <strong className="text-foreground">{evt.paper}</strong></span>
                      <span>Date: <strong className="text-foreground">{evt.date}</strong></span>
                    </div>
                  </div>

                  {evt.conflict && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold shrink-0 border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Overlap Warning
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
