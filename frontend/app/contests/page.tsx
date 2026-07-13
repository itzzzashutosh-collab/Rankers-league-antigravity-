"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section } from "@/components/ui";
import { Contest } from "@/types/contests";
import { ContestService } from "@/services/ContestService";

// Discovery Components
import { ContestHero } from "@/components/contests/ContestHero";
import { ContestSearch } from "@/components/contests/ContestSearch";
import { ContestFilters } from "@/components/contests/ContestFilters";
import { ContestSort } from "@/components/contests/ContestSort";
import { ContestCard } from "@/components/contests/ContestCard";
import { ContestSkeleton } from "@/components/contests/ContestSkeleton";
import { ContestEmptyState } from "@/components/contests/ContestEmptyState";
import { ContestBreadcrumb } from "@/components/contests/ContestBreadcrumb";

export default function ContestsListingPage() {
  const [contests, setContests] = React.useState<Contest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [activeDifficulty, setActiveDifficulty] = React.useState("All");
  const [activeFeeType, setActiveFeeType] = React.useState<"free" | "paid" | "all">("all");
  const [activeStatus, setActiveStatus] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("date");

  // Query database/local contents
  const fetchContests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await ContestService.queryContests({
        category: activeCategory,
        searchTerm,
        difficulty: activeDifficulty,
        entryFeeType: activeFeeType,
        status: activeStatus,
        sortBy,
      });
      setContests(results);
    } catch (err) {
      console.error("Failed to query contests", err);
    } finally {
      // Add slight delay for premium loading experience simulation
      setTimeout(() => setIsLoading(false), 450);
    }
  }, [activeCategory, searchTerm, activeDifficulty, activeFeeType, activeStatus, sortBy]);

  React.useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setActiveDifficulty("All");
    setActiveFeeType("all");
    setActiveStatus("All");
    setSortBy("date");
  };

  const breadcrumbs = [{ label: "Championship Arenas" }];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />

      <main className="flex-grow">
        {/* Banner Hero Section */}
        <ContestHero />

        {/* Navigation Breadcrumbs */}
        <Section className="py-4 border-b border-border/25 bg-secondary/20">
          <Container className="max-w-6xl mx-auto">
            <ContestBreadcrumb items={breadcrumbs} />
          </Container>
        </Section>

        {/* Workspace Listings Area */}
        <Section className="py-12 bg-background/50">
          <Container className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <ContestFilters
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  activeDifficulty={activeDifficulty}
                  onDifficultyChange={setActiveDifficulty}
                  activeFeeType={activeFeeType}
                  onFeeTypeChange={setActiveFeeType}
                  activeStatus={activeStatus}
                  onStatusChange={setActiveStatus}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Contest Display Grid & Controls */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                
                {/* Search & Sort Panel */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="w-full sm:flex-1">
                    <ContestSearch onSearch={setSearchTerm} />
                  </div>
                  <ContestSort value={sortBy} onChange={setSortBy} className="w-full sm:w-auto shrink-0" />
                </div>

                {/* Listing Results */}
                {isLoading ? (
                  <ContestSkeleton variant="card" count={6} />
                ) : contests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))}
                  </div>
                ) : (
                  <ContestEmptyState onReset={handleResetFilters} />
                )}
              </div>

            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
