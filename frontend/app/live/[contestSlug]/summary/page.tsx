"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Badge, Card, Button } from "@/components/ui";
import { liveContestRepository } from "@/repositories/LiveContestRepository";
import { LiveContest } from "@/types/live";
import { ShieldCheck, Calendar, Trophy, Lock, ClipboardCheck, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ contestSlug: string }>;
}

export default function ExamSummaryPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const contestSlug = resolvedParams.contestSlug;

  const [contest, setContest] = React.useState<LiveContest | null>(null);
  const [summaryData, setSummaryData] = React.useState<{
    answered: number;
    notAnswered: number;
    marked: number;
    notVisited: number;
    timeLeftSeconds: number;
    cheatViolationsCount: number;
  } | null>(null);

  React.useEffect(() => {
    // 1. Load contest info
    const fetchContest = async () => {
      const c = await liveContestRepository.findBySlug(contestSlug);
      if (c) {
        setContest(c);
      }
    };
    fetchContest();

    // 2. Fetch serialized summary stats
    const data = localStorage.getItem(`contest-summary-${contestSlug}`);
    if (data) {
      try {
        setSummaryData(JSON.parse(data));
      } catch {
        // Fallback
      }
    }
  }, [contestSlug]);

  const timestamp = React.useMemo(() => {
    return new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  if (!contest) {
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const answeredCount = summaryData?.answered ?? 0;
  const notAnsweredCount = (summaryData?.notAnswered ?? 0) + (summaryData?.notVisited ?? 0);
  const markedCount = summaryData?.marked ?? 0;
  const violationsCount = summaryData?.cheatViolationsCount ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 bg-background/50">
        <Container className="max-w-xl mx-auto flex flex-col gap-6 text-left">
          
          {/* Main completion card */}
          <Card variant="glass" className="border border-border/40 p-8 rounded-2xl shadow-2xl bg-card text-center flex flex-col items-center gap-6">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
              <ClipboardCheck className="w-10 h-10" />
            </div>

            <div>
              <Typography variant="h2" className="font-extrabold text-foreground tracking-tight mb-2">
                Contest Completed
              </Typography>
              <Typography variant="body-medium" className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Thank you. Your responses have been uploaded successfully to the secure examination registry.
              </Typography>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="w-full bg-secondary/55 border border-border/30 rounded-xl p-5 text-xs text-left flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/10 pb-2.5">
                <span className="text-muted-foreground font-semibold">Championship title:</span>
                <strong className="text-foreground text-right truncate max-w-[200px]">{contest.title}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-2.5">
                <span className="text-muted-foreground font-semibold">Attempted Questions:</span>
                <strong className="text-foreground font-extrabold">{answeredCount} answered</strong>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-2.5">
                <span className="text-muted-foreground font-semibold">Unanswered Questions:</span>
                <strong className="text-foreground">{notAnsweredCount} left blank</strong>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-2.5">
                <span className="text-muted-foreground font-semibold">Marked for Review:</span>
                <strong className="text-foreground">{markedCount} marked</strong>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-2.5">
                <span className="text-muted-foreground font-semibold">Submission Timestamp:</span>
                <strong className="text-foreground font-mono">{timestamp} IST</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Proctor integrity status:</span>
                <strong className={violationsCount > 0 ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>
                  {violationsCount > 0 ? `${violationsCount} warning warnings` : "Verified integrity"}
                </strong>
              </div>
            </div>

            {/* Score notice banner */}
            <div className="w-full p-4 bg-primary/5 border border-primary/15 rounded-xl text-[11px] text-muted-foreground text-left leading-relaxed flex gap-2.5">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> As per competitive examination policy rules, official standing marks, correct answers keys, and ranking sheets will be computed and published only on the results publication timeline date.
              </div>
            </div>

            {/* Home Trigger button */}
            <Link href="/" className="w-full">
              <button className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-bold rounded-xl transition-colors active:scale-95">
                Back to Home Screen
              </button>
            </Link>
          </Card>

        </Container>
      </main>

      <Footer />
    </div>
  );
}

// Shims
function Loader2({ className }: { className?: string }) {
  return <Loader2Icon className={cn("animate-spin text-primary", className)} />;
}
import { Loader2 as Loader2Icon } from "lucide-react";
