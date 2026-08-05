"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Button } from "@/components/ui";
import { Contest } from "@/types/contests";
import { ContestService } from "@/services/ContestService";
import { createClient, DEMO_MOCK_PROFILE } from "@/utils/supabase/client";
import { EXAM_CATEGORY_LABELS, ExamCategory } from "@/types/auth";
import { Sparkles, Target, Filter, SlidersHorizontal, ChevronDown, ChevronUp, CheckCircle2, RotateCcw, Calendar, Zap, CheckCircle } from "lucide-react";

// Discovery Components
import { ContestHero } from "@/components/contests/ContestHero";
import { ContestSearch } from "@/components/contests/ContestSearch";
import { ContestFilters } from "@/components/contests/ContestFilters";
import { ContestSort } from "@/components/contests/ContestSort";
import { ContestCard } from "@/components/contests/ContestCard";
import { ContestSkeleton } from "@/components/contests/ContestSkeleton";
import { ContestEmptyState } from "@/components/contests/ContestEmptyState";
import { ContestBreadcrumb } from "@/components/contests/ContestBreadcrumb";

import { useSearchParams } from "next/navigation";

export default function ContestsListingPage() {
  const searchParams = useSearchParams();
  const [allContests, setAllContests] = React.useState<Contest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userExamCategory, setUserExamCategory] = React.useState<ExamCategory>("JEE_MAIN");
  const [userExamName, setUserExamName] = React.useState<string>("JEE Main");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Status Filter State: 'upcoming' (default), 'live', 'completed'
  const [statusTab, setStatusTab] = React.useState<"upcoming" | "live" | "completed">("upcoming");

  // Filter States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [activeDifficulty, setActiveDifficulty] = React.useState("All");
  const [activeFeeType, setActiveFeeType] = React.useState<"free" | "paid" | "all">("all");
  const [sortBy, setSortBy] = React.useState("date");
  const [targetExamFilter, setTargetExamFilter] = React.useState<string>("ALL");

  // Handle URL query parameters on mount
  React.useEffect(() => {
    const examParam = searchParams.get("exam");
    const categoryParam = searchParams.get("category");
    if (examParam) {
      setSearchTerm(examParam.replace(/-/g, " "));
      setTargetExamFilter("ALL");
    } else if (categoryParam) {
      setActiveCategory(categoryParam);
      setTargetExamFilter("ALL");
    }
  }, [searchParams]);

  // Fetch User Target Exam on mount
  React.useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: userRes } = await supabase.auth.getUser();
        if (userRes?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("primary_exam_category")
            .eq("id", userRes.user.id)
            .single();
          if (profile?.primary_exam_category) {
            setUserExamCategory(profile.primary_exam_category as ExamCategory);
            setUserExamName(EXAM_CATEGORY_LABELS[profile.primary_exam_category as ExamCategory] || "JEE Main");
            return;
          }
        }
      } catch {}
      // Default to demo profile exam category
      setUserExamCategory(DEMO_MOCK_PROFILE.primary_exam_category as ExamCategory);
      setUserExamName(EXAM_CATEGORY_LABELS[DEMO_MOCK_PROFILE.primary_exam_category as ExamCategory] || "JEE Main");
    }
    loadUserProfile();
  }, []);

  // Fetch all contests
  const fetchContests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await ContestService.queryContests({
        category: activeCategory,
        searchTerm,
        difficulty: activeDifficulty,
        entryFeeType: activeFeeType,
        status: statusTab === "upcoming" ? "upcoming" : statusTab === "live" ? "active" : "completed",
        sortBy,
      });
      setAllContests(results);
    } catch (err) {
      console.error("Failed to query contests", err);
    } finally {
      setTimeout(() => setIsLoading(false), 350);
    }
  }, [activeCategory, searchTerm, activeDifficulty, activeFeeType, statusTab, sortBy]);

  React.useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setActiveDifficulty("All");
    setActiveFeeType("all");
    setStatusTab("upcoming");
    setSortBy("date");
    setTargetExamFilter("RECOMMENDED");
  };

  // Exam matching logic
  const isMatchForUser = React.useCallback((contest: Contest, examCategory: ExamCategory, examName: string) => {
    const examLower = contest.exam.toLowerCase();
    const categoryLower = contest.category.toLowerCase();
    const targetLower = examName.toLowerCase();

    if (examCategory === "JEE_MAIN" || examCategory === "JEE_ADVANCED") {
      return categoryLower.includes("engineering") || examLower.includes("jee");
    }
    if (examCategory === "UPSC_CSE") {
      return categoryLower.includes("civil services") || examLower.includes("upsc");
    }
    if (examCategory === "NEET_UG" || examCategory === "NEET_PG") {
      return categoryLower.includes("medical") || examLower.includes("neet");
    }
    if (examCategory === "CLAT" || examCategory === "AILET") {
      return categoryLower.includes("law") || examLower.includes("clat");
    }
    if (examCategory === "CAT" || examCategory === "XAT" || examCategory === "GMAT") {
      return categoryLower.includes("finance") || examLower.includes("cat") || examLower.includes("frm");
    }
    return examLower.includes(targetLower) || categoryLower.includes(targetLower);
  }, []);

  // Filter contests matching target or active filters
  const displayedContests = React.useMemo(() => {
    if (targetExamFilter === "RECOMMENDED") {
      return allContests.filter((c) => isMatchForUser(c, userExamCategory, userExamName));
    }
    if (targetExamFilter === "INDIA") {
      return allContests.filter((c) => c.currency === "INR" || c.regionScope === "india" || c.country === "India");
    }
    if (targetExamFilter === "INTERNATIONAL") {
      return allContests.filter((c) => c.currency === "USD" || c.regionScope === "international" || c.category === "International" || c.country === "International");
    }
    return allContests;
  }, [allContests, isMatchForUser, targetExamFilter, userExamCategory, userExamName]);

  const breadcrumbs = [{ label: "Contests" }];

  const activeFiltersCount =
    (activeCategory !== "All" ? 1 : 0) +
    (activeDifficulty !== "All" ? 1 : 0) +
    (activeFeeType !== "all" ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />

      <main className="flex-grow">
        {/* Banner Hero Section */}
        <ContestHero />

        {/* Navigation Breadcrumbs */}
        <Section className="py-3 border-b border-border/25 bg-secondary/20">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContestBreadcrumb items={breadcrumbs} />
          </Container>
        </Section>

        {/* Intelligent Target Exam Banner Bar */}
        <Section className="py-4 border-b border-border/30 bg-card/60 backdrop-blur-md">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Your Target Exam:
                  </span>
                  <span className="bg-primary/15 text-primary text-xs font-black px-3 py-1 rounded-full border border-primary/25">
                    🎯 {userExamName}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Displaying contests tailored specifically for {userExamName} (Levels 1 to 5).
                </p>
              </div>
            </div>

            {/* Quick target exam & Regional Scope Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {[
                { label: "⚡ All 140+ Arenas", id: "ALL" },
                { label: "🇮🇳 Indian Arenas (INR ₹)", id: "INDIA" },
                { label: "🌐 International Arenas (USD $)", id: "INTERNATIONAL" },
                { label: `🎯 My Exam: ${userExamName}`, id: "RECOMMENDED" },
                { label: "Engineering", id: "JEE" },
                { label: "Government / UPSC", id: "UPSC" },
                { label: "Medical", id: "NEET" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => {
                    setTargetExamFilter(pill.id);
                    if (pill.id === "ALL") {
                      setActiveCategory("All");
                    } else if (pill.id === "INDIA") {
                      setActiveCategory("All");
                    } else if (pill.id === "INTERNATIONAL") {
                      setActiveCategory("All");
                    } else if (pill.id === "JEE") {
                      setUserExamCategory("JEE_MAIN");
                      setUserExamName("JEE Main");
                    } else if (pill.id === "UPSC") {
                      setUserExamCategory("UPSC_CSE");
                      setUserExamName("UPSC CSE");
                    } else if (pill.id === "NEET") {
                      setUserExamCategory("NEET_UG");
                      setUserExamName("NEET UG");
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    targetExamFilter === pill.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </Container>
        </Section>

        {/* Full-Width Workspace Listings Area */}
        <Section className="py-8 bg-background/50">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">

              {/* Top Status 3-State Toggle Switch Bar: Active, Live, Completed */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 border border-border/40 p-3 rounded-2xl">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-2 hidden lg:inline-block">
                    Contest Status:
                  </span>
                  <div className="bg-muted/50 p-1 rounded-xl flex items-center gap-1 border border-border/40 w-full sm:w-auto">
                    {[
                      { id: "upcoming", label: "🟢 Active & Upcoming", icon: Calendar },
                      { id: "live", label: "⚡ Live Now", icon: Zap },
                      { id: "completed", label: "🏁 Completed / Past", icon: CheckCircle },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = statusTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setStatusTab(tab.id as any)}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Collapsible Filter Toggle Button */}
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                      isFilterOpen || activeFiltersCount > 0
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-background text-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                    {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Sort Dropdown */}
                  <ContestSort value={sortBy} onChange={setSortBy} className="w-auto shrink-0" />
                </div>
              </div>

              {/* Search Panel */}
              <div className="w-full">
                <ContestSearch onSearch={setSearchTerm} />
              </div>

              {/* Expandable Filter Drawer Panel */}
              {isFilterOpen && (
                <div className="p-6 bg-card/80 backdrop-blur-md border border-border/40 rounded-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/30">
                    <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" />
                      Refine Contests & Difficulty Levels
                    </h3>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                    </button>
                  </div>

                  <ContestFilters
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    activeDifficulty={activeDifficulty}
                    onDifficultyChange={setActiveDifficulty}
                    activeFeeType={activeFeeType}
                    onFeeTypeChange={setActiveFeeType}
                    activeStatus="All"
                    onStatusChange={() => {}}
                    onReset={handleResetFilters}
                  />
                </div>
              )}

              {/* Contest Display Grid */}
              {isLoading ? (
                <ContestSkeleton variant="card" count={6} />
              ) : displayedContests.length === 0 ? (
                <ContestEmptyState onReset={handleResetFilters} />
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-2 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h2 className="text-base font-black text-foreground tracking-tight">
                        🎯 {statusTab === "upcoming" ? "Active & Upcoming" : statusTab === "live" ? "Live Ongoing" : "Completed / Past"} Contests ({userExamName})
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                      {displayedContests.length} Arena{displayedContests.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* Spacious 3-Column Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedContests.map((contest) => (
                      <div key={contest.id} className="relative">
                        <ContestCard contest={contest} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
