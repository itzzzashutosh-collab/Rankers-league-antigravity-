"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Badge, Card } from "@/components/ui";

import { completedContests } from "@/content/results/results";
import { completedLeaderboards } from "@/content/results/leaderboard";
import { calculateWinningStatus } from "@/utils/backend/services/calculateWinningStatus";
import { calculateQuestionGap } from "@/utils/backend/services/calculateQuestionGap";

// Components
import { GapAnalysisCard } from "@/components/live/GapAnalysisCard";
import { PrizeMatrixTable } from "@/components/live/PrizeMatrixTable";

import { Award, Trophy, Users, ShieldAlert, Sparkles, CheckCircle2, ChevronLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default function ResultDetailsPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const contestId = resolvedParams.contestId;

  // Retrieve contest metadata details
  const contest = React.useMemo(() => {
    return completedContests.find((c) => c.id === contestId);
  }, [contestId]);

  // Retrieve leaderboard standings
  const leaderboard = React.useMemo(() => {
    return completedLeaderboards[contestId] || [];
  }, [contestId]);

  if (!contest) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <Card className="p-8 border border-border/40 max-w-sm text-center flex flex-col items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-destructive" />
            <h3 className="text-sm font-bold text-foreground">Result Record Not Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The requested contest results database sheet could not be mapped.
            </p>
            <Link href="/results">
              <button className="py-2.5 px-6 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-xl w-full">
                Return to Results Registry
              </button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate user standings statistics
  const contestParams = {
    entryFee: contest.entryFee,
    filledSeats: contest.participants,
    totalQuestions: contest.totalQuestions,
    maxScore: contest.maxScore
  };

  const winStatus = calculateWinningStatus(
    contestParams,
    contest.userRank,
    contest.userScore,
    contest.winningCutoffScore,
    contest.winningCutoffRank
  );

  const formattedPayout = winStatus.prizeAmount > 0 ? `₹${winStatus.prizeAmount.toLocaleString()}` : "No Prize";

  return (
    <div className="flex flex-col min-h-screen bg-background select-none">
      <Header />

      <main className="flex-grow select-none">
        
        {/* 1. Hero Section Banner */}
        <Section className="py-10 border-b border-border/20 bg-gradient-to-b from-background via-secondary/15 to-background text-left">
          <Container className="max-w-5xl mx-auto flex flex-col gap-4">
            <Link href="/results" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2 w-fit">
              <ChevronLeft className="w-4 h-4" /> Back to Directory
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 border border-primary/10 rounded uppercase tracking-wider w-fit">
                  {contest.category} / {contest.exam}
                </span>
                <Typography variant="h2" className="font-extrabold text-foreground tracking-tight leading-snug">
                  {contest.title}
                </Typography>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>📅 Date: {contest.date}</span>
                  <span>👥 Participants: {contest.participants}</span>
                  <span>🏆 Cutoff Rank: {contest.winningCutoffRank}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 md:text-right shrink-0">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">
                  Registry Status:
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 text-xs font-bold uppercase rounded-lg w-fit md:ml-auto">
                  {contest.resultStatus} Verified
                </span>
              </div>
            </div>
          </Container>
        </Section>

        {/* 2. Main Details Grid */}
        <Section className="py-12 select-none">
          <Container className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Sheet - User Results Card & Gap Analysis (Colspan 2) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Premium Your Result Card */}
              <Card variant="glass" className="border border-border/70 p-6 sm:p-8 rounded-2xl bg-card/20 text-left flex flex-col gap-6 shadow-md relative overflow-hidden">
                
                {/* Visual Congratulations/Regret banner at the top */}
                {winStatus.isWinner ? (
                  <div className="flex items-start gap-4 pb-4 border-b border-border/15">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/15 shrink-0">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                        🎉 Congratulations!
                        <Badge className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-[8px] font-extrabold tracking-widest uppercase">
                          Winning Zone
                        </Badge>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        You secured **Rank {contest.userRank}** out of {contest.participants} competitors. Your reward payout has been scheduled.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 pb-4 border-b border-border/15">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/15 shrink-0">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-foreground tracking-tight">
                        Contest Completed
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        You placed outside the winning zone. See the gap analysis metrics below to calculate recovery offsets.
                      </p>
                    </div>
                  </div>
                )}

                {/* Score Ratio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-secondary/40 border border-border/40 rounded-xl p-4">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
                      Your Standing
                    </span>
                    <strong className="text-lg font-extrabold text-foreground block mt-1">
                      Rank #{contest.userRank}
                    </strong>
                  </div>

                  <div className="bg-secondary/40 border border-border/40 rounded-xl p-4">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
                      Score Ratio
                    </span>
                    <strong className="text-lg font-extrabold text-foreground block mt-1 font-mono">
                      {contest.userScore} <span className="text-[10px] text-muted-foreground font-sans">/ {contest.maxScore}</span>
                    </strong>
                  </div>

                  <div className="bg-secondary/40 border border-border/40 rounded-xl p-4">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
                      Aura Earned
                    </span>
                    <strong className="text-lg font-extrabold text-primary block mt-1 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      +{contest.userRank <= 10 ? "550" : "150"}
                    </strong>
                  </div>

                  <div className="bg-secondary/40 border border-border/40 rounded-xl p-4">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block">
                      Prize Payout
                    </span>
                    <strong className={cn(
                      "text-lg font-extrabold block mt-1",
                      winStatus.isWinner ? "text-emerald-500" : "text-muted-foreground"
                    )}>
                      {formattedPayout}
                    </strong>
                  </div>
                </div>

                {/* Expected Payout Processing Timeline Status (If Won) */}
                {winStatus.isWinner && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-xs text-left leading-relaxed flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-500 font-bold">Expected payout credit timeline:</strong>
                      <span className="text-muted-foreground block mt-0.5">
                        {contest.prizeStatus === "prize_credited" 
                          ? "Payout complete. Sum credited directly to bank holdings." 
                          : "Processing payout. Credits complete within 24 hours."}
                      </span>
                    </div>
                  </div>
                )}

              </Card>

              {/* Gap Analysis Card (If candidate lost) */}
              {!winStatus.isWinner && (
                <GapAnalysisCard
                  contest={contestParams}
                  userRank={contest.userRank}
                  userScore={contest.userScore}
                  winningCutoffScore={contest.winningCutoffScore}
                  winningCutoffRank={contest.winningCutoffRank}
                />
              )}

              {/* Expandable Prize Matrix details */}
              <PrizeMatrixTable
                entryFee={contest.entryFee}
                filledSeats={contest.participants}
              />

            </div>

            {/* Right Sheet - Standings Leaderboard list (Colspan 1) */}
            <div className="lg:col-span-1 flex flex-col gap-5 text-left select-none">
              
              <div className="px-1">
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
                  Official Standings Registry
                </h4>
              </div>

              <Card variant="solid" className="border border-border/40 rounded-2xl overflow-hidden bg-card/25 shadow-lg select-none">
                <div className="p-4 border-b border-border/15 bg-card/50 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <span>Competitor (Rank)</span>
                  <span>Score</span>
                </div>

                <div className="divide-y divide-border/10 font-sans text-xs">
                  {leaderboard.map((item) => {
                    const isCurrentUser = item.isCurrentUser;
                    
                    return (
                      <div
                        key={item.username}
                        className={cn(
                          "p-4 flex items-center justify-between gap-3 transition-colors select-none",
                          isCurrentUser 
                            ? "bg-primary/10 border-l-4 border-primary text-foreground" 
                            : "hover:bg-muted/15 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold shrink-0 border",
                            item.rank === 1 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            item.rank === 2 ? "bg-slate-400/10 border-slate-400/20 text-slate-400" :
                            item.rank === 3 ? "bg-amber-700/10 border-amber-700/20 text-amber-700" :
                            "bg-secondary border-border text-muted-foreground"
                          )}>
                            {item.rank}
                          </span>
                          <span className={cn("font-bold truncate max-w-[110px]", isCurrentUser && "text-foreground font-extrabold")}>
                            {item.username}
                          </span>
                          <span title="Region">{item.countryFlag}</span>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 font-mono font-bold">
                          <span className={isCurrentUser ? "text-foreground font-extrabold" : "text-muted-foreground"}>
                            {item.score}
                          </span>
                          {item.prize > 0 && (
                            <span className="text-emerald-500 text-[10px] font-extrabold">
                              ₹{item.prize}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

            </div>

          </Container>
        </Section>

      </main>

      <Footer />
    </div>
  );
}
