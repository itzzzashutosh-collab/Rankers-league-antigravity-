"use client";

import * as React from "react";
import { LeaderboardHero } from "@/components/live/LeaderboardHero";
import { TopThreePodium } from "@/components/live/TopThreePodium";
import { LeaderboardEmptyState } from "@/components/live/LeaderboardEmptyState";
import { Card, Typography, Badge, InputField } from "@/components/ui";

// Mock data content databases
import { leaderboardData, LeaderboardEntry } from "@/content/leaderboard/leaderboard-data";
import { leaderboardCategories } from "@/content/leaderboard/leaderboard-categories";
import { timeFilters, regionFilters, viewFilters } from "@/content/leaderboard/leaderboard-filters";
import { leaderboardFAQ } from "@/content/leaderboard/leaderboard-faq";
import { leaderboardConfig } from "@/content/leaderboard/leaderboard-config";

// Icons
import { Search, Trophy, Globe, Clock, SlidersHorizontal, ChevronLeft, ChevronRight, HelpCircle, Flame, ArrowUpRight, ArrowDownRight, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeaderboardClient() {
  // State variables
  const [timeFilter, setTimeFilter] = React.useState("overall");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [regionFilter, setRegionFilter] = React.useState("india");
  const [viewFilter, setViewFilter] = React.useState("20");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, categoryFilter, regionFilter, viewFilter, searchTerm]);

  // Handle resets
  const handleClearFilters = () => {
    setTimeFilter("overall");
    setCategoryFilter("all");
    setRegionFilter("india");
    setViewFilter("20");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter computation
  const filteredAndSorted = React.useMemo(() => {
    const result = leaderboardData.filter((entry) => {
      // 1. Timeframe
      if (entry.timeframe !== timeFilter) return false;

      // 2. Category
      if (categoryFilter !== "all" && entry.category !== categoryFilter) return false;

      // 3. Region
      if (regionFilter !== "global") {
        if (entry.country !== regionFilter) return false;
      }

      // 4. Text Search (Name, Institution, or Rank number)
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = entry.name.toLowerCase().includes(query);
        const matchesInst = entry.institution.toLowerCase().includes(query);
        const matchesRank = entry.rank.toString() === query;
        if (!matchesName && !matchesInst && !matchesRank) return false;
      }

      return true;
    });

    // Sort by auraPoints descending
    return [...result].sort((a, b) => b.auraPoints - a.auraPoints);
  }, [timeFilter, categoryFilter, regionFilter, searchTerm]);

  // Sliced rankings based on view limit (Top N)
  const viewCount = parseInt(viewFilter) || 20;
  const limitedRankings = React.useMemo(() => {
    return filteredAndSorted.slice(0, viewCount);
  }, [filteredAndSorted, viewCount]);

  // Paginated Slicing
  const itemsPerPage = 8;
  const totalPages = Math.ceil(limitedRankings.length / itemsPerPage);
  const paginatedRankings = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return limitedRankings.slice(start, start + itemsPerPage);
  }, [limitedRankings, currentPage]);

  const activeCategory = leaderboardCategories.find((c) => c.id === categoryFilter) || leaderboardCategories[0];

  return (
    <div className="flex flex-col gap-10">
      
      {/* 1. Hero Layout banner */}
      <LeaderboardHero />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col gap-8">
        
        {/* 2. Interactive Filters Dashboard Card */}
        <Card variant="glass" className="border border-border/60 p-6 rounded-2xl bg-card/25 text-left flex flex-col gap-6 select-none shadow-md">
          
          {/* Top Header Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/20 pb-4">
            <h3 className="font-heading text-xs font-bold text-foreground tracking-widest uppercase flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary shrink-0" />
              Leaderboard Registry Configuration
            </h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <InputField
                type="search"
                placeholder="Search competitor, college, rank..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-secondary/35 border-border/70 focus:border-primary/20 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Filters Selectors Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {/* Time Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> Time Period
              </span>
              <div className="flex bg-secondary/40 border border-border/40 rounded-lg p-0.5">
                {timeFilters.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeFilter(tf.value)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none truncate text-center",
                      timeFilter === tf.value
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary shrink-0" /> Region Scope
              </span>
              <div className="flex bg-secondary/40 border border-border/40 rounded-lg p-0.5">
                {regionFilters.map((rf) => (
                  <button
                    key={rf.value}
                    onClick={() => setRegionFilter(rf.value)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none truncate text-center",
                      regionFilter === rf.value
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {rf.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* View filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-primary shrink-0" /> Standings Limit
              </span>
              <select
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
                className="w-full p-2.5 bg-secondary/40 border border-border/40 hover:border-border rounded-lg text-[10px] font-bold uppercase tracking-wider outline-none text-foreground"
              >
                {viewFilters.map((vf) => (
                  <option key={vf.value} value={vf.value} className="bg-card">
                    {vf.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters Button */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full py-2.5 bg-secondary hover:bg-muted text-foreground border border-border/60 hover:border-border text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 text-center"
              >
                Clear Filters
              </button>
            </div>

          </div>

          {/* Exam Category Filters Scrollbar */}
          <div className="flex flex-col gap-1.5 border-t border-border/20 pt-4">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5 block">
              Filter by Exam Championship
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
              {leaderboardCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider transition-all select-none",
                    categoryFilter === cat.id
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "border-border/80 bg-secondary/35 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

        </Card>

        {/* 3. Top 3 Podium Highlights */}
        {limitedRankings.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom duration-300">
            <TopThreePodium
              entries={limitedRankings.slice(0, 3)}
              categoryName={activeCategory.name}
            />
          </div>
        )}

        {/* 4. Table Standings List (Rank 4+) */}
        {limitedRankings.length > 0 ? (
          <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-1 select-none">
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
                Verified Standings Registry
              </h3>
            </div>

            <Card variant="solid" className="border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-card/25">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-card/50 text-muted-foreground border-b border-border/40 font-bold uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-4 w-20 sticky left-0 bg-card/50 z-10">Rank</th>
                      <th className="px-6 py-4">Competitor</th>
                      <th className="px-6 py-4">Championship</th>
                      <th className="px-6 py-4">Points</th>
                      <th className="px-6 py-4 text-right">Score Ratio</th>
                      <th className="px-6 py-4 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {paginatedRankings.map((entry) => {
                      // Lookup config levels for user badge
                      const badgeLevel = leaderboardConfig.badgeLevels.find(
                        (bl) => entry.auraPoints >= bl.minimumPoints
                      ) || leaderboardConfig.badgeLevels[3];

                      return (
                        <tr key={`${entry.name}-${entry.category}-${entry.timeframe}`} className="hover:bg-muted/20 transition-all select-none">
                          
                          {/* Rank */}
                          <td className="px-6 py-5 font-extrabold text-sm text-foreground sticky left-0 bg-card/10 backdrop-blur-md">
                            {entry.rank <= 3 ? (
                              <div className="flex items-center gap-1">
                                <span className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold border shadow-sm",
                                  entry.rank === 1 ? "bg-amber-500/15 border-amber-500/30 text-amber-500" :
                                  entry.rank === 2 ? "bg-slate-400/15 border-slate-400/30 text-slate-400" :
                                  "bg-amber-700/15 border-amber-700/30 text-amber-700"
                                )}>
                                  {entry.rank}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground font-mono pl-1">{entry.rank}</span>
                            )}
                          </td>

                          {/* Competitor Name, Institution, Flag */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-8 h-8 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center font-bold text-xs text-primary shrink-0 select-none">
                                {entry.initials}
                              </div>
                              <div className="leading-none min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-foreground truncate max-w-[150px]">{entry.name}</span>
                                  <span className="text-xs text-muted-foreground" title={entry.country}>
                                    {entry.countryFlag}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground block mt-1 truncate max-w-[180px]">
                                  {entry.institution}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="px-6 py-5">
                            <span className="text-[9px] font-bold text-foreground bg-secondary/60 px-2.5 py-0.5 rounded border border-border uppercase tracking-wide">
                              {entry.category.replace("-", " ")}
                            </span>
                          </td>

                          {/* Aura Points Badge */}
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-extrabold cursor-help select-all" title="Competition points details">
                              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>{entry.auraPoints.toLocaleString()} Aura</span>
                            </div>
                          </td>

                          {/* Score Ratio */}
                          <td className="px-6 py-5 text-right font-mono font-bold text-foreground text-xs select-all">
                            {entry.score} <span className="text-[9px] text-muted-foreground font-sans font-semibold">/ {entry.maxScore}</span>
                          </td>

                          {/* Trend */}
                          <td className="px-6 py-5 text-center">
                            <div className="flex justify-center items-center">
                              {entry.trend === "up" && (
                                <div className="text-emerald-500 flex items-center gap-0.5 font-extrabold text-[10px]">
                                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                              )}
                              {entry.trend === "down" && (
                                <div className="text-amber-500 flex items-center gap-0.5 font-extrabold text-[10px]">
                                  <ArrowDownRight className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                              )}
                              {entry.trend === "stable" && (
                                <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-1 text-xs select-none">
                <span className="text-muted-foreground font-semibold">
                  Page {currentPage} of {totalPages} ({limitedRankings.length} total entries)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-secondary border border-border/60 hover:bg-muted text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center active:scale-95"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-secondary border border-border/60 hover:bg-muted text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center active:scale-95"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <LeaderboardEmptyState onClearFilters={handleClearFilters} />
        )}

        {/* 5. FAQs Section */}
        <div className="border-t border-border/20 pt-10 text-left flex flex-col gap-6">
          <div className="flex items-center gap-2 px-1 select-none">
            <HelpCircle className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
              Leaderboard Registry FAQ
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leaderboardFAQ.map((faq, idx) => (
              <Card key={idx} variant="solid" className="border border-border/30 bg-card/25 p-5 rounded-2xl flex flex-col gap-2">
                <strong className="text-xs font-bold text-foreground tracking-tight leading-relaxed">
                  Q: {faq.question}
                </strong>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
export default LeaderboardClient;
