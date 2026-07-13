"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, Award, UserCheck, Flame, Clock, ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredContestsContent } from "@/content/featured-contests";

export function FeaturedLeagues() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 text-left max-w-2xl"
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              National Arenas
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Featured Contests
            </h2>
            <p className="text-sm text-muted-foreground">
              Reserve your slot in upcoming national-level championships. Compete against top talent
              simultaneously under standard competitive criteria.
            </p>
          </motion.div>
          <Button variant="outline" className="self-start md:self-auto rounded-md gap-2">
            View All Contests
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContestsContent.map((contest, index) => {
            const fillPercent = Math.round((contest.participants / contest.maxParticipants) * 100);
            return (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-card border border-border/80 rounded-2xl flex flex-col hover:border-primary/20 transition-all duration-300 relative group overflow-hidden glow-subtle"
              >
                {/* Banner gradient header */}
                <div className={`h-2 bg-gradient-to-r ${contest.bannerGradient}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Top row: category + status */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase bg-secondary px-2.5 py-1 rounded-md border border-border">
                      {contest.exam}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        contest.status === "Filling Fast"
                          ? "bg-amber-500/5 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {contest.status}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                    {contest.title}
                  </h3>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div>
                        <span className="block font-semibold text-foreground">{contest.date}</span>
                        <span>{contest.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div>
                        <span className="block font-semibold text-foreground">
                          &#x20B9;{contest.prizePool.toLocaleString("en-IN")}
                        </span>
                        <span>Prize Pool</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div>
                        <span className="block font-semibold text-foreground">{contest.duration}</span>
                        <span>Duration</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Flame className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div>
                        <span className="block font-semibold text-foreground">{contest.difficulty}</span>
                        <span>Tier</span>
                      </div>
                    </div>
                  </div>

                  {/* Seats fill bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        {contest.participants.toLocaleString("en-IN")} registered
                      </span>
                      <span>{contest.seatsAvailable.toLocaleString("en-IN")} seats left</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60 mt-auto">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" />
                      Entry: <strong className="text-foreground">&#x20B9;{contest.entryFee}</strong>
                    </span>
                    <Button size="sm" className="rounded-md text-xs font-semibold gap-1.5">
                      Enroll Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
