"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Badge, Button, Card } from "@/components/ui";
import { liveContestRepository } from "@/repositories/LiveContestRepository";
import { LiveContest } from "@/types/live";
import { lobbyInstructions } from "@/content/live/contest-lobby";

// Components
import { ContestBreadcrumb } from "@/components/contests/ContestBreadcrumb";
import { LanguageSelector } from "@/components/live/LanguageSelector";
import { InstructionsPanel } from "@/components/live/InstructionsPanel";
import { AntiCheatPanel } from "@/components/live/AntiCheatPanel";
import { SystemCheckCard } from "@/components/live/SystemCheckCard";
import { ReadyChecklist } from "@/components/live/ReadyChecklist";
import { ContestCountdown } from "@/components/contests/ContestCountdown";
import { ShieldCheck, Timer, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ contestSlug: string }>;
}

export default function ContestLobbyPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const contestSlug = resolvedParams.contestSlug;

  const [contest, setContest] = React.useState<LiveContest | null>(null);
  const [authorized, setAuthorized] = React.useState<boolean | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  
  // Checking states
  const [diagnosticsPassed, setDiagnosticsPassed] = React.useState(false);
  const [declarationsPassed, setDeclarationsPassed] = React.useState(false);
  const [timeLeftMs, setTimeLeftMs] = React.useState<number | null>(null);

  React.useEffect(() => {
    // 1. Check local session auth token
    const token = localStorage.getItem(`contest-session-${contestSlug}`);
    if (!token) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);

    // 2. Fetch contest data
    const fetchContest = async () => {
      const c = await liveContestRepository.findBySlug(contestSlug);
      if (c) {
        setContest(c);
        setSelectedLanguage(c.languages[0] || "English");
        
        // Setup initial timer ticking calculation
        const targetTime = new Date(`${c.date} ${c.startTime}`).getTime();
        const diff = targetTime - Date.now();
        setTimeLeftMs(diff);
      }
    };
    fetchContest();
  }, [contestSlug]);

  // Synchronized countdown ticking logic to trigger redirect at zero
  React.useEffect(() => {
    if (timeLeftMs === null || timeLeftMs <= 0 || !contest) return;

    const timer = setInterval(() => {
      const targetTime = new Date(`${contest.date} ${contest.startTime}`).getTime();
      const diff = targetTime - Date.now();
      
      if (diff <= 0) {
        setTimeLeftMs(0);
        clearInterval(timer);
        
        // Auto-redirect when countdown hits zero
        if (authorized && diagnosticsPassed && declarationsPassed) {
          router.push(`/live/${contestSlug}/exam`);
        }
      } else {
        setTimeLeftMs(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftMs, contest, authorized, diagnosticsPassed, declarationsPassed, contestSlug, router]);

  if (authorized === false) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <Card className="border border-border/40 p-8 rounded-2xl max-w-sm text-center flex flex-col items-center gap-4">
            <div className="p-3 bg-destructive/5 text-destructive rounded-full border border-destructive/15">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Access Token Mismatch</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You must pass the security validation gateway before entering this championship lobby.
            </p>
            <Link href={`/live/${contestSlug}/access`}>
              <Button size="sm" className="rounded-lg text-xs font-bold w-full uppercase">
                Return to Access Checkpoint
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!contest || authorized === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const instructions = lobbyInstructions[contest.id] || {
    duration: contest.duration,
    questionPattern: "Standard multi-choice exam layout.",
    markingScheme: "+1 for correct choice, no negative mark.",
    negativeMarking: "No penalty deductions.",
    navigation: ["Use right-side buttons to skip items."],
    submission: ["Answers upload automatically on completion."]
  };

  const breadcrumbs = [
    { label: "Live Hub", href: "/live" },
    { label: contest.title, href: `/live/${contestSlug}` },
    { label: "Lobby Workspace" }
  ];

  const canEnterWorkspace = diagnosticsPassed && declarationsPassed;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <Section className="py-4 border-b border-border/20 bg-secondary/15">
          <Container className="max-w-6xl mx-auto text-left">
            <ContestBreadcrumb items={breadcrumbs} />
          </Container>
        </Section>

        <Section className="py-12">
          <Container className="max-w-6xl mx-auto flex flex-col gap-8">
            
            {/* Main Header with dynamic countdown banner */}
            <div className="bg-card border border-border/40 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                  Secure Sandboxed Examination Lobby
                </span>
                <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                  {contest.title}
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground font-semibold">Verification status:</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-emerald-500/20 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                  </span>
                </div>
              </div>

              {/* Dynamic countdown widget */}
              <div className="bg-destructive/5 border border-destructive/10 p-4 rounded-xl flex items-center justify-between gap-6 shrink-0">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-destructive/80 uppercase tracking-widest block leading-none">
                    Session Starts In:
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-1">Locked sandbox</span>
                </div>
                <ContestCountdown targetDate={`${contest.date} ${contest.startTime}`} size="lg" />
              </div>
            </div>

            {/* Layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Colspan 2) - Instructions & Declarations */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* 1. Language selector & Instructions */}
                <div className="flex flex-col gap-4 text-left">
                  <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                    Examination Instructions
                  </Typography>
                  
                  <LanguageSelector
                    availableLanguages={contest.languages}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />

                  <InstructionsPanel data={instructions} />
                </div>

                {/* 2. Anti-cheat parameters */}
                <div className="flex flex-col gap-4 text-left border-t border-border/20 pt-8">
                  <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                    Lockdown Anti-Cheating Policy
                  </Typography>
                  <AntiCheatPanel />
                </div>

                {/* 3. System checks diagnostics */}
                <div className="flex flex-col gap-4 text-left border-t border-border/20 pt-8">
                  <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                    Lobby Diagnostics Check
                  </Typography>
                  <SystemCheckCard onStatusChange={setDiagnosticsPassed} />
                </div>
              </div>

              {/* Right Column (Colspan 1) - Declarations and Join Button */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <ReadyChecklist onStatusChange={setDeclarationsPassed} />

                {/* Entrance button */}
                <Card variant="glass" className="border border-border/40 p-5 rounded-2xl flex flex-col gap-3.5 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Ready Confirmation Status
                    </span>
                    <strong className={cn(
                      "text-xs font-bold block mt-1",
                      canEnterWorkspace ? "text-emerald-500" : "text-destructive"
                    )}>
                      {canEnterWorkspace ? "All parameters verified" : "Pending diagnostics check"}
                    </strong>
                  </div>

                  <Link href={`/live/${contestSlug}/exam`} className="w-full">
                    <Button
                      disabled={!canEnterWorkspace}
                      className={cn(
                        "w-full py-4 text-xs font-bold uppercase tracking-wider rounded-xl gap-2",
                        canEnterWorkspace ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed border border-border/80"
                      )}
                    >
                      Enter Examination Arena
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link href={`/live/${contestSlug}/exam`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full py-3.5 text-[10px] font-bold uppercase tracking-wider rounded-xl gap-2 border-dashed border-primary/45 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10 mt-2.5"
                    >
                      🧪 Dev Bypass: Skip to Exam Workspace
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>

                  <span className="text-[9px] text-muted-foreground">
                    ⚠️ The locked examination sandbox requires browser lockdown confirmation.
                  </span>
                </Card>
              </div>

            </div>

          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
