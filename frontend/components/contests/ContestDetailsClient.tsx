"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Award, Clock, Users, ShieldCheck, HelpCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { ContestDetail, Contest } from "../../types/contests";
import { ContestSidebar } from "./ContestSidebar";
import { ContestTimeline } from "./ContestTimeline";
import { ContestRewardCard } from "./ContestRewardCard";
import { ContestRules } from "./ContestRules";
import { ContestFAQ } from "./ContestFAQ";
import { ContestBreadcrumb } from "./ContestBreadcrumb";
import { ContestCard } from "./ContestCard";
import { Card, Typography, Container, Section } from "../ui";
import { cn } from "@/lib/utils";

interface ContestDetailsClientProps {
  contest: ContestDetail;
  relatedContests: Contest[];
}

export function ContestDetailsClient({ contest, relatedContests }: ContestDetailsClientProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "syllabus" | "rules" | "rewards" | "faq">("overview");
  const [expandedSubject, setExpandedSubject] = React.useState<number | null>(0);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "syllabus", label: "Syllabus Weightage" },
    { id: "rules", label: "Rules & Safety" },
    { id: "rewards", label: "Rewards Distribution" },
    { id: "faq", label: "Help & FAQs" },
  ] as const;

  const breadcrumbs = [
    { label: "Contests", href: "/contests" },
    { label: contest.title },
  ];

  const handleSubjectToggle = (idx: number) => {
    setExpandedSubject(expandedSubject === idx ? null : idx);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb strip */}
      <Section className="py-4 border-b border-border/20 bg-secondary/15">
        <Container className="max-w-6xl mx-auto">
          <ContestBreadcrumb items={breadcrumbs} />
        </Container>
      </Section>

      {/* Main Layout Grid */}
      <Section className="py-12">
        <Container className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Content Area (Colspan 2) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Header Title Information */}
              <div className="flex flex-col gap-4 text-left">
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/15 rounded-md px-3 py-1 w-fit select-none">
                  {contest.exam}
                </span>
                <Typography variant="display-l" className="font-extrabold tracking-tight">
                  {contest.title}
                </Typography>
                <Typography variant="subtitle" className="text-muted-foreground leading-relaxed">
                  {contest.overview}
                </Typography>
              </div>

              {/* Interactive Tabs Menu */}
              <div className="flex border-b border-border/30 overflow-x-auto gap-2 scrollbar-none pb-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap",
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Workspace Contents */}
              <div className="min-h-[400px] animate-in fade-in duration-200">
                
                {/* 1. Overview Tab */}
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-8 text-left">
                    <Card variant="solid" className="bg-card/30 border border-border/40 p-6 rounded-2xl">
                      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4.5 h-4.5 text-primary" />
                        Aspirant Eligibility Parameters
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {contest.eligibility}
                      </p>
                    </Card>

                    {/* Structure blocks */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="w-4.5 h-4.5 text-primary" />
                        Championship Workspace Structure
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {contest.structure.map((item, index) => (
                          <div
                            key={index}
                            className="p-4 bg-card/40 border border-border/30 rounded-xl text-xs text-muted-foreground flex gap-3 leading-relaxed"
                          >
                            <span className="text-primary font-bold text-sm select-none">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="flex flex-col gap-6 mt-2">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-primary" />
                        Championship Linear Timeline
                      </h3>
                      <ContestTimeline steps={contest.timeline} />
                    </div>
                  </div>
                )}

                {/* 2. Syllabus Accordion Tab */}
                {activeTab === "syllabus" && (
                  <div className="flex flex-col gap-6 text-left">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-sm font-bold text-foreground">Syllabus Breakdown & Subject Weightages</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The distribution coefficients mimic authentic national boards. Standard deviation and difficulty ratios represent historical weightages.
                      </p>
                    </div>

                    {contest.syllabus && contest.syllabus.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {contest.syllabus.map((sub, sIdx) => {
                          const isExpanded = expandedSubject === sIdx;
                          return (
                            <Card
                              key={sIdx}
                              variant="solid"
                              padding="none"
                              className={cn(
                                "border border-border/40 bg-card/25 overflow-hidden transition-all duration-300",
                                isExpanded && "border-primary/20 bg-card/50"
                              )}
                            >
                              <button
                                onClick={() => handleSubjectToggle(sIdx)}
                                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-foreground focus:outline-none"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                                  {sub.subject}
                                </span>
                                <span className="text-muted-foreground">
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="px-5 pb-5 pt-0 flex flex-col gap-5 animate-in slide-in-from-top-1 duration-200">
                                  <div className="border-t border-border/20 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div className="md:col-span-3 flex flex-col gap-4">
                                      {sub.chapters.map((chap, cIdx) => (
                                        <div key={cIdx} className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-xl border border-border/30">
                                          <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs font-bold text-foreground">{chap.name}</span>
                                            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 border border-primary/10 rounded">
                                              Weightage: {chap.weightage}%
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-1.5">
                                            {chap.topics.map((top, tIdx) => (
                                              <span key={tIdx} className="text-[10px] text-muted-foreground bg-background border border-border/40 px-2 py-0.5 rounded">
                                                {top}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Difficulty distribution board */}
                                    <div className="md:col-span-1 bg-secondary/50 border border-border/40 p-4 rounded-xl flex flex-col gap-3">
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                                        Difficulty Spread
                                      </span>
                                      <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs font-medium">
                                          <span className="text-emerald-500">Easy</span>
                                          <span className="text-foreground">{sub.difficultyDistribution.Easy}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-medium">
                                          <span className="text-amber-500">Medium</span>
                                          <span className="text-foreground">{sub.difficultyDistribution.Medium}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-medium">
                                          <span className="text-red-500">Hard</span>
                                          <span className="text-foreground">{sub.difficultyDistribution.Hard}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl bg-card/15">
                        <Typography variant="body-large" className="text-muted-foreground mb-1">
                          No syllabus metrics registered
                        </Typography>
                        <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto">
                          Subject mapping will be imported directly from board controllers 72 hours before lockdown activation.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Rules & Safety Tab */}
                {activeTab === "rules" && (
                  <div className="text-left animate-in fade-in duration-150">
                    <ContestRules customRules={contest.rules} />
                  </div>
                )}

                {/* 4. Rewards Distribution Tab */}
                {activeTab === "rewards" && (
                  <div className="flex flex-col gap-6 text-left">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-bold text-foreground">Reward Distribution Matrix</h3>
                      <p className="text-xs text-muted-foreground">
                        Verified standings allocate reward pools and badge qualifications automatically.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contest.rewards.map((reward, idx) => (
                        <ContestRewardCard key={idx} reward={reward} />
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FAQs Tab */}
                {activeTab === "faq" && (
                  <div className="text-left animate-in fade-in duration-150">
                    <ContestFAQ faqs={contest.faq} />
                  </div>
                )}

              </div>

            </div>

            {/* Right Side Sidebar (Colspan 1) */}
            <div className="lg:col-span-1">
              <ContestSidebar contest={contest} />
            </div>

          </div>
        </Container>
      </Section>

      {/* Related Contests Section */}
      {relatedContests.length > 0 && (
        <Section className="py-16 border-t border-border/20 bg-secondary/10">
          <Container className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                  Related Contests
                </Typography>
                <p className="text-xs text-muted-foreground mt-1">
                  Discover additional leagues matching your category and preparation calibrations.
                </p>
              </div>
              <Link href="/contests" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Browse All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Horizontal Grid Slider */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedContests.slice(0, 3).map((item) => (
                <ContestCard key={item.id} contest={item} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
export default ContestDetailsClient;
