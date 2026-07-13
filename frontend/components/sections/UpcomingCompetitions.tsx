"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: "uc-1",
    title: "UPSC CSE Prelims — Season 7 Finals",
    category: "Civil Services",
    date: "July 12, 2026",
    time: "09:30 AM",
    registrationDeadline: "July 11, 2026 — 11:59 PM",
    participants: "38,492",
  },
  {
    id: "uc-2",
    title: "JEE Advanced Apex Championship",
    category: "Engineering",
    date: "July 15, 2026",
    time: "02:00 PM",
    registrationDeadline: "July 14, 2026 — 11:59 PM",
    participants: "52,100",
  },
  {
    id: "uc-3",
    title: "NEET UG Medical Prime Cup",
    category: "Medical Sciences",
    date: "July 18, 2026",
    time: "10:00 AM",
    registrationDeadline: "July 17, 2026 — 11:59 PM",
    participants: "45,900",
  },
  {
    id: "uc-4",
    title: "CAT Management Prestige Series",
    category: "Business Administration",
    date: "July 22, 2026",
    time: "03:00 PM",
    registrationDeadline: "July 21, 2026 — 11:59 PM",
    participants: "21,300",
  },
  {
    id: "uc-5",
    title: "GATE CSE Elite Engineering Series",
    category: "Graduate Engineering",
    date: "July 25, 2026",
    time: "11:00 AM",
    registrationDeadline: "July 24, 2026 — 11:59 PM",
    participants: "18,700",
  },
];

export function UpcomingCompetitions() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/40">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Championship Calendar
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Upcoming Competitions
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            Scheduled national-level championships with fixed dates, simultaneous participation, and verified standings.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border/60 hidden md:block" />

          <div className="flex flex-col gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative md:pl-16 group"
              >
                {/* Timeline dot */}
                <div className="absolute left-[18px] top-6 w-3 h-3 rounded-full bg-primary border-2 border-background hidden md:block group-hover:scale-125 transition-transform" />

                <div className="p-6 bg-background border border-border/60 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                        {event.category}
                      </span>
                      <h3 className="font-heading text-base font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          {event.participants} registered
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Registration closes: {event.registrationDeadline}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-start sm:self-center gap-1.5 rounded-md border-primary/30 hover:border-primary hover:bg-primary/5 text-xs"
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" className="rounded-md gap-2">
            View Full Championship Calendar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
