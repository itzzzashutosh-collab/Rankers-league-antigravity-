"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen, Award, Clock, Users, ShieldCheck, HelpCircle, ArrowRight,
  ChevronDown, ChevronUp, FileText, Percent, IndianRupee, AlertCircle,
  Building2, Printer, Download, Sparkles, Scale, CheckCircle2, ShieldAlert
} from "lucide-react";
import { ContestDetail, Contest } from "../../types/contests";
import { ContestSidebar } from "./ContestSidebar";
import { ContestTimeline } from "./ContestTimeline";
import { ContestRewardCard } from "./ContestRewardCard";
import { ContestRules } from "./ContestRules";
import { ContestFAQ } from "./ContestFAQ";
import { ContestBreadcrumb } from "./ContestBreadcrumb";
import { ContestCard } from "./ContestCard";
import { Card, Typography, Container, Section } from "../ui";
import { TDSReceiptModal } from "./TDSReceiptModal";
import { PrizeMatrixLadder } from "./PrizeMatrixLadder";
import { cn } from "@/lib/utils";

interface ContestDetailsClientProps {
  contest: ContestDetail;
  relatedContests: Contest[];
}

export function ContestDetailsClient({ contest, relatedContests }: ContestDetailsClientProps) {
  const [expandedSubject, setExpandedSubject] = React.useState<number | null>(0);
  const [isTDSModalOpen, setIsTDSModalOpen] = React.useState(false);

  const breadcrumbs = [
    { label: "Contests", href: "/contests" },
    { label: contest.title },
  ];

  const handleSubjectToggle = (idx: number) => {
    setExpandedSubject(expandedSubject === idx ? null : idx);
  };

  // Top prize calculation for TDS display
  const topPrizeAmount = contest.rewards?.[0]?.prize
    ? parseInt(String(contest.rewards[0].prize).replace(/[^0-9]/g, "")) || contest.prizePool || 10000
    : contest.prizePool || 10000;

  const isTDSApplicable = topPrizeAmount >= 10000;
  const tdsAmount = isTDSApplicable ? Math.round((topPrizeAmount - 500) * 0.3) : 0;
  const netPayout = topPrizeAmount - tdsAmount;

  return (
    <div className="bg-background dark-luxury-bg min-h-screen pb-16 relative overflow-hidden">
      {/* Luxury Dark Mode Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-[30rem] h-[30rem] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none" />

      {/* Breadcrumb strip */}
      <Section className="py-4 border-b border-border/20 bg-secondary/15 relative z-10">
        <Container className="max-w-6xl mx-auto">
          <ContestBreadcrumb items={breadcrumbs} />
        </Container>
      </Section>

      {/* Main Content Layout Grid */}
      <Section className="py-10 relative z-10">
        <Container className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Content Area (Colspan 2) — Single unified scroll without tabs */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              
              {/* Header Title & Identity */}
              <div className="flex flex-col gap-4 text-left p-6 sm:p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 via-card/60 to-card/90 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2 flex-wrap relative z-10">
                  <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/15 border border-primary/30 rounded-xl px-3.5 py-1.5 shadow-sm select-none">
                    {contest.exam}
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3.5 py-1.5">
                    {contest.category || "Official League"}
                  </span>
                </div>
                <Typography variant="display-l" className="font-black tracking-tight leading-tight relative z-10 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  {contest.title}
                </Typography>
                <Typography variant="subtitle" className="text-muted-foreground leading-relaxed relative z-10">
                  {contest.overview}
                </Typography>
              </div>

              {/* ── 1. Eligibility & Structure ────────────────────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-black text-foreground">Eligibility & Arena Structure</h2>
                </div>

                <Card variant="solid" className="bg-card/40 border border-border/40 p-6 rounded-2xl">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Aspirant Eligibility Parameters
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {contest.eligibility}
                  </p>
                </Card>

                {/* Structure blocks */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {contest.structure.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-card/30 border border-border/30 rounded-xl text-xs text-muted-foreground flex gap-3 leading-relaxed"
                    >
                      <span className="text-primary font-black text-sm select-none">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 2. Syllabus & Subject Weightages ─────────────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-black text-foreground">Syllabus Breakdown & Subject Weightages</h2>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Official Board Pattern
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed -mt-3">
                  The subject weightages and chapter distribution coefficients mimic national competitive examination boards.
                </p>

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
                            isExpanded && "border-primary/30 bg-card/50 shadow-lg"
                          )}
                        >
                          <button
                            onClick={() => handleSubjectToggle(sIdx)}
                            className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-foreground focus:outline-none"
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-1.5 h-6 bg-primary rounded-full" />
                              <span className="text-base font-black">{sub.subject}</span>
                            </span>
                            <span className="text-muted-foreground">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-5 pt-0 flex flex-col gap-5 animate-in slide-in-from-top-1 duration-200">
                              <div className="border-t border-border/20 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="md:col-span-3 flex flex-col gap-3">
                                  {sub.chapters.map((chap, cIdx) => (
                                    <div key={cIdx} className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-xl border border-border/30">
                                      <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs font-bold text-foreground">{chap.name}</span>
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-md">
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
                                <div className="md:col-span-1 bg-secondary/50 border border-border/40 p-4 rounded-xl flex flex-col gap-3 text-center">
                                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">
                                    Difficulty Spread
                                  </span>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-emerald-400">Easy</span>
                                      <span className="text-foreground">{sub.difficultyDistribution.Easy}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-amber-400">Medium</span>
                                      <span className="text-foreground">{sub.difficultyDistribution.Medium}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-red-400">Hard</span>
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
                  <div className="p-6 border border-dashed border-border/60 rounded-2xl bg-card/15 text-center text-xs text-muted-foreground">
                    Standard subject distribution applies equally across Physics, Chemistry, and Mathematics/Biology.
                  </div>
                )}
              </div>

              {/* ── 3. Rules & Regulations & Fair Play Policy ────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-black text-foreground">Rules, Regulations & Fair Play Policy</h2>
                </div>
                <ContestRules customRules={contest.rules} />
              </div>

              {/* ── 4. Prize Money & 30% TDS Tax System ──────────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base font-black text-foreground">Prize Money & 30% Statutory TDS Tax Policy</h2>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                    Sec 194B Govt Tax Compliant
                  </span>
                </div>

                {/* TDS Policy Explanation Box */}
                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card space-y-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-foreground">Income Tax Act Statutory TDS Guidelines</h3>
                        <p className="text-xs text-muted-foreground">Section 194B / 194BA · Ministry of Finance, Govt. of India</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsTDSModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" /> Sample TDS Tax Receipt
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Under Indian Income Tax Regulations, any contestant winning <strong className="text-foreground">₹10,000 or higher</strong> in a competitive contest is subject to a flat <strong className="text-emerald-400">30% Statutory TDS (Tax Deducted at Source)</strong> on net winnings. All withheld tax is directly remitted to the Income Tax Department of India under the contestant&apos;s verified PAN card, and official <strong className="text-foreground">Form 16A TDS Certificates</strong> are issued for tax filing.
                  </p>

                  {/* Live TDS calculation example card */}
                  <div className="p-4 rounded-xl bg-background/80 border border-border/40 space-y-3">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
                      TDS Tax Settlement Calculation (For ₹10,000 Prize Winnings Example)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className="p-2.5 rounded-lg bg-card border border-border/30">
                        <span className="text-[10px] text-muted-foreground block">Gross Winnings</span>
                        <span className="font-black text-foreground text-sm">₹{topPrizeAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border/30">
                        <span className="text-[10px] text-muted-foreground block">Entry Fee Offset</span>
                        <span className="font-bold text-muted-foreground text-sm">-₹500</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                        <span className="text-[10px] text-red-400 font-bold block">30% Govt. TDS Tax</span>
                        <span className="font-black text-red-400 text-sm">-₹{tdsAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 font-bold block">Net Credited Wallet</span>
                        <span className="font-black text-emerald-400 text-sm">₹{netPayout.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 5. Rewards Distribution Matrix ────────────────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-black text-foreground">Reward Pool & Rank Distribution Matrix</h2>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Automated Standings Payout
                  </span>
                </div>

                {/* Highlight Reward Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contest.rewards.map((reward, idx) => (
                    <ContestRewardCard key={idx} reward={reward} />
                  ))}
                </div>

                {/* Full Mathematical Prize Ladder */}
                <PrizeMatrixLadder
                  seats={contest.maxParticipants || contest.seatsAvailable || 100}
                  entryFee={contest.entryFee || 500}
                  participants={contest.participants || 0}
                />
              </div>

              {/* ── 6. Linear Timeline ───────────────────────────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-black text-foreground">Contest Linear Timeline & Key Milestones</h2>
                </div>
                <ContestTimeline steps={contest.timeline} />
              </div>

              {/* ── 7. Frequently Asked Questions ────────────────── */}
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-black text-foreground">Help & Frequently Asked Questions</h2>
                </div>
                <ContestFAQ faqs={contest.faq} />
              </div>

            </div>

            {/* Right Side Sticky Sidebar (Colspan 1) */}
            <div className="lg:col-span-1 sticky top-24">
              <ContestSidebar contest={contest} />
            </div>

          </div>
        </Container>
      </Section>

      {/* Related Contests Section */}
      {relatedContests.length > 0 && (
        <Section className="py-14 border-t border-border/20 bg-secondary/10">
          <Container className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="font-black text-foreground tracking-tight">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedContests.slice(0, 3).map((item) => (
                <ContestCard key={item.id} contest={item} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* TDS Receipt Modal */}
      <TDSReceiptModal
        isOpen={isTDSModalOpen}
        onClose={() => setIsTDSModalOpen(false)}
        contestTitle={contest.title}
        grossAmount={topPrizeAmount}
      />
    </div>
  );
}
export default ContestDetailsClient;
