"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Search, Star, ArrowRight, MapPin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { leaderboardContent, LeaderboardEntry } from "@/content/leaderboard";

export function StandingsPreview() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filtered: LeaderboardEntry[] = leaderboardContent.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Verified National Standings
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
              Leaderboard Preview
            </h2>
            <p className="text-sm text-muted-foreground mt-4">
              Top performers from the latest national championships. All standings undergo
              rigorous response-pattern validation before certification.
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto bg-background border border-border/80 rounded-2xl overflow-hidden shadow-xl glow-subtle">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-border/60 bg-card">
            <h3 className="font-heading text-sm font-bold text-foreground tracking-wide uppercase">
              Season 7 — National Standings
            </h3>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search aspirant or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Standings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-card/50 text-muted-foreground border-b border-border/60 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 w-16">Rank</th>
                  <th className="px-6 py-4">Aspirant</th>
                  <th className="px-6 py-4 hidden md:table-cell">Institution</th>
                  <th className="px-6 py-4 text-right">Score</th>
                  <th className="px-6 py-4 text-right">Accuracy</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Achievement</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.length > 0 ? (
                    filtered.map((row, i) => (
                      <motion.tr
                        key={row.name}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          {row.rank <= 3 ? (
                            <div className="flex items-center gap-1">
                              <Trophy className={`w-4 h-4 ${
                                row.rank === 1 ? "text-yellow-500" : row.rank === 2 ? "text-slate-400" : "text-amber-700"
                              }`} />
                            </div>
                          ) : (
                            <span className="text-muted-foreground font-bold pl-1">{row.rank}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${row.gradientFrom} ${row.gradientTo} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                              {row.initials}
                            </div>
                            <div>
                              <span className="font-semibold text-foreground block">{row.name}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 md:hidden">
                                <GraduationCap className="w-3 h-3" />
                                {row.institution}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-primary" />
                            {row.institution}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground tabular-nums">
                          {row.score}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-500">
                          {row.accuracy}%
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            {row.achievement}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No verified aspirant records match your lookup.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border/60 bg-card/30 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Showing top performers across all categories — India
            </span>
            <Button variant="ghost" className="h-8 text-primary hover:text-primary/80 gap-1.5">
              View Full Leaderboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
