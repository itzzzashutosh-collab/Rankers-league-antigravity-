"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Badge, Button, Card } from "@/components/ui";

import { liveContestRepository } from "@/repositories/LiveContestRepository";
import { examRepository } from "@/repositories/ExamRepository";
import { LiveContest } from "@/types/live";
import { ExamPaper, ExamQuestion, ExamSection, QuestionStatus, ExamSessionState } from "@/types/exam";

// Components
import { ExamHeader } from "@/components/live/ExamHeader";
import { QuestionPanel } from "@/components/live/QuestionPanel";
import { QuestionPalette } from "@/components/live/QuestionPalette";
import { ExamFooter } from "@/components/live/ExamFooter";
import { SubmissionDialog } from "@/components/live/SubmissionDialog";
import { RotateOverlay } from "@/components/live/RotateOverlay";
import { Loader2, ShieldAlert, AlertTriangle, Fullscreen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ contestSlug: string }>;
}

export default function ExamPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const contestSlug = resolvedParams.contestSlug;

  // Session & Metadata info
  const [contest, setContest] = React.useState<LiveContest | null>(null);
  const [paper, setPaper] = React.useState<ExamPaper | null>(null);
  const [authorized, setAuthorized] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Active question pointers
  const [currentSectionId, setCurrentSectionId] = React.useState("");
  const [currentQuestionId, setCurrentQuestionId] = React.useState("");

  // Exam Answers & Status logs State
  const [responses, setResponses] = React.useState<Record<string, string | string[] | Record<string, string>>>({});
  const [statuses, setStatuses] = React.useState<Record<string, QuestionStatus>>({});
  const [timeSpent, setTimeSpent] = React.useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = React.useState(0);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");

  // Layout Controls
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<"saved" | "saving" | "syncing" | "offline">("saved");
  const [connectionStatus, setConnectionStatus] = React.useState<"connected" | "reconnecting" | "offline">("connected");
  
  // Anti-cheat notifications
  const [cheatLogs, setCheatLogs] = React.useState<{ timestamp: string; event: string; details: string }[]>([]);
  const [warningMessage, setWarningMessage] = React.useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = React.useState(false);

  // Initialize Exam Session
  React.useEffect(() => {
    const initSession = async () => {
      // 1. Verify access validation tokens
      const token = localStorage.getItem(`contest-session-${contestSlug}`);
      if (!token) {
        setAuthorized(false);
        setIsLoading(false);
        return;
      }
      setAuthorized(true);

      try {
        const c = await liveContestRepository.findBySlug(contestSlug);
        const p = await examRepository.getExamPaper(contestSlug);

        if (!c || !p || p.questions.length === 0) {
          setAuthorized(false);
          setIsLoading(false);
          return;
        }

        setContest(c);
        setPaper(p);

        // Load or initialize session state
        const accessId = "aspirant101"; // In real setup, read parsed token params
        const savedState = await examRepository.loadSessionState(contestSlug, accessId);

        if (savedState) {
          // Restore session values
          setResponses(savedState.responses);
          setStatuses(savedState.statuses);
          setTimeSpent(savedState.timeSpent);
          setTimeLeftSeconds(savedState.timeLeftSeconds);
          setSelectedLanguage(savedState.selectedLanguage);
          setCurrentSectionId(savedState.currentSectionId);
          setCurrentQuestionId(savedState.currentQuestionId);
          setCheatLogs(savedState.cheatLogs);
        } else {
          // Initialize fresh states
          const initialStatuses: Record<string, QuestionStatus> = {};
          const initialTimeSpent: Record<string, number> = {};
          
          p.questions.forEach((q, idx) => {
            initialStatuses[q.id] = idx === 0 ? "visited" : "not_visited";
            initialTimeSpent[q.id] = 0;
          });

          setStatuses(initialStatuses);
          setTimeSpent(initialTimeSpent);

          // Calculate initial duration (Set to 15 minutes / 900 seconds for testing phase)
          const totalSecs = 900;
          setTimeLeftSeconds(totalSecs);

          setCurrentSectionId(p.sections[0]?.id || "");
          setCurrentQuestionId(p.questions[0]?.id || "");
        }
      } catch (err) {
        console.error("Failed to load proctored session", err);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, [contestSlug]);

  // Synchronized countdown timer ticking logic
  React.useEffect(() => {
    if (isLoading || authorized === false || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // Tick active question time spent parameter
      if (currentQuestionId) {
        setTimeSpent((prev) => ({
          ...prev,
          [currentQuestionId]: (prev[currentQuestionId] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, authorized, timeLeftSeconds, currentQuestionId]);

  // Automatic autosaving loop (every 5 seconds)
  React.useEffect(() => {
    if (isLoading || authorized === false || !contest) return;

    const interval = setInterval(async () => {
      setAutoSaveStatus("saving");
      
      const state: ExamSessionState = {
        contestSlug,
        accessId: "aspirant101",
        candidateName: "Aspirant Candidate",
        selectedLanguage,
        currentQuestionId,
        currentSectionId,
        timeLeftSeconds,
        responses,
        statuses,
        timeSpent,
        connectionStatus,
        cheatLogs,
      };

      try {
        await examRepository.saveSessionState(state);
        setTimeout(() => setAutoSaveStatus("saved"), 600);
      } catch {
        setAutoSaveStatus("offline");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading, authorized, contest, contestSlug, selectedLanguage, currentQuestionId, currentSectionId, timeLeftSeconds, responses, statuses, timeSpent, connectionStatus, cheatLogs]);

  // Global browser connection monitoring hooks
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const goOnline = () => setConnectionStatus("connected");
    const goOffline = () => setConnectionStatus("offline");

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Proctoring lockdown security hooks
  React.useEffect(() => {
    if (isLoading || authorized === false) return;

    // 1. Copy/Paste preventions
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation("Unauthorized copying", "Candidate attempted to copy question context.");
      triggerWarning("Context copying is prohibited under examination rules.");
    };

    const preventPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation("Unauthorized pasting", "Candidate attempted to paste content.");
      triggerWarning("Pasting characters is disabled inside the workspace.");
    };

    // 2. Right Click prevention
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      logViolation("Right click lookup", "Candidate clicked right mouse button.");
      triggerWarning("Right-click lookup functions are disabled.");
    };

    // 3. Tab switch / Window focus loss proctoring checks
    const handleWindowBlur = () => {
      logViolation("Focus lost", "Exam window lost active focus (tab switched/workspace resized).");
      triggerWarning("Alert: Do not leave the examination screen tab. Focus loss has been logged.");
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("paste", preventPaste);
    document.addEventListener("contextmenu", preventRightClick);
    window.addEventListener("blur", handleWindowBlur);

    // Fullscreen exit checking
    const handleFullscreenChange = () => {
      const isFs = !!(document.fullscreenElement);
      setIsFullscreen(isFs);
      if (!isFs) {
        logViolation("Fullscreen exit", "Candidate exited examination lockdown mode.");
        triggerWarning("Attention: Fullscreen exited. Re-enter fullscreen mode to continue.");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("paste", preventPaste);
      document.removeEventListener("contextmenu", preventRightClick);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isLoading, authorized]);

  const logViolation = (event: string, details: string) => {
    const stamp = new Date().toLocaleTimeString();
    setCheatLogs((prev) => [...prev, { timestamp: stamp, event, details }]);
  };

  const triggerWarning = (msg: string) => {
    setWarningMessage(msg);
    // Dismiss warnings automatically after 5 seconds
    setTimeout(() => {
      setWarningMessage((curr) => (curr === msg ? null : curr));
    }, 5000);
  };

  // Toggle Fullscreen APIs
  const toggleFullscreen = () => {
    if (typeof window === "undefined") return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        triggerWarning("Fullscreen sandbox authorization failed.");
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Navigations Actions
  const activeQuestionIndex = React.useMemo(() => {
    if (!paper) return 0;
    return paper.questions.findIndex((q) => q.id === currentQuestionId);
  }, [paper, currentQuestionId]);

  const handlePrev = () => {
    if (!paper || activeQuestionIndex <= 0) return;
    const prevQ = paper.questions[activeQuestionIndex - 1];
    navigateToQuestion(prevQ.id);
  };

  const handleNext = () => {
    if (!paper || activeQuestionIndex >= paper.questions.length - 1) return;
    const nextQ = paper.questions[activeQuestionIndex + 1];
    navigateToQuestion(nextQ.id);
  };

  const navigateToQuestion = (qId: string) => {
    // 1. Mark current status as visited if it wasn't answered
    setStatuses((prev) => {
      const curr = prev[currentQuestionId] || "visited";
      const updated = curr === "not_visited" ? "visited" : curr;
      return {
        ...prev,
        [currentQuestionId]: updated,
        [qId]: prev[qId] === "not_visited" ? "visited" : (prev[qId] || "visited"),
      };
    });

    // 2. Select target question
    setCurrentQuestionId(qId);

    // Resolve target section id
    if (paper) {
      const targetSec = paper.sections.find((s) => s.questionIds.includes(qId));
      if (targetSec) {
        setCurrentSectionId(targetSec.id);
      }
    }
  };

  const handleClear = () => {
    setResponses((prev) => {
      const next = { ...prev };
      delete next[currentQuestionId];
      return next;
    });

    setStatuses((prev) => ({
      ...prev,
      [currentQuestionId]: "visited",
    }));
  };

  const handleMarkForReview = () => {
    const hasValue = responses[currentQuestionId] !== undefined && String(responses[currentQuestionId]).trim() !== "";
    
    setStatuses((prev) => ({
      ...prev,
      [currentQuestionId]: hasValue ? "answered_marked" : "marked",
    }));

    // Auto next
    handleNext();
  };

  const handleSaveNext = () => {
    const hasValue = responses[currentQuestionId] !== undefined && String(responses[currentQuestionId]).trim() !== "";

    setStatuses((prev) => ({
      ...prev,
      [currentQuestionId]: hasValue ? "answered" : "visited",
    }));

    // Auto next
    handleNext();
  };

  const handleAutoSubmit = async () => {
    // Save session logs & status to localStorage before clearing
    localStorage.setItem(`contest-summary-${contestSlug}`, JSON.stringify({
      answered: stats.answered,
      notAnswered: stats.notAnswered,
      marked: stats.marked,
      notVisited: stats.notVisited,
      timeLeftSeconds,
      cheatViolationsCount: cheatLogs.length,
    }));

    await examRepository.clearSessionState(contestSlug);
    router.push(`/live/${contestSlug}/summary`);
  };

  // Question selection utilities from palette
  const handleSelectSection = (secId: string) => {
    const targetSection = paper?.sections.find((s) => s.id === secId);
    const firstQId = targetSection?.questionIds[0];
    if (firstQId) {
      navigateToQuestion(firstQId);
    }
  };

  // Compile stats for Submit confirmation dialog
  const stats = React.useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;

    if (paper) {
      paper.questions.forEach((q) => {
        const stat = statuses[q.id] || "not_visited";
        if (stat === "answered") answered++;
        else if (stat === "visited") notAnswered++;
        else if (stat === "marked" || stat === "answered_marked") marked++;
        else if (stat === "not_visited") notVisited++;
      });
    }

    return { answered, notAnswered, marked, notVisited };
  }, [paper, statuses]);

  if (authorized === false) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <Card className="border border-border/40 p-8 rounded-2xl max-w-sm text-center flex flex-col items-center gap-4">
            <div className="p-3 bg-destructive/5 text-destructive rounded-full border border-destructive/15">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Verification Token Missing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Examination workspaces require active passcode verification tokens. Verify credentials in lobby checkout.
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

  if (isLoading || !contest || !paper) {
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-semibold mt-2.5">
          Initializing secure examination console...
        </span>
      </div>
    );
  }

  const activeQuestion = paper.questions.find((q) => q.id === currentQuestionId) || paper.questions[0];

  return (
    <div className="flex flex-col h-screen bg-background select-none overflow-hidden">
      
      {/* Dynamic rotation alert for mobile users */}
      <RotateOverlay />

      {/* Top Proctoring Header Bar */}
      <ExamHeader
        contestTitle={contest.title}
        examName={contest.exam}
        candidateName="Aspirant Candidate"
        accessId="aspirant101"
        selectedLanguage={selectedLanguage}
        timeLeftSeconds={timeLeftSeconds}
        connectionStatus={connectionStatus}
        autoSaveStatus={autoSaveStatus}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Proctoring Warning Banner overlay */}
      {warningMessage && (
        <div className="bg-destructive text-white py-2 px-6 text-xs font-bold flex items-center justify-center gap-2 select-none z-50 animate-in slide-in-from-top duration-200">
          <AlertTriangle className="w-4.5 h-4.5 text-white shrink-0 animate-bounce" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Main Examination Workspace */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        
        {/* Left Hand Questions Frame (Colspan 3) */}
        <div className="md:col-span-3 border border-border/40 p-6 rounded-2xl bg-card/25 overflow-hidden flex flex-col">
          {activeQuestion ? (
            <QuestionPanel
              question={activeQuestion}
              selectedLanguage={selectedLanguage}
              response={responses[activeQuestion.id]}
              onChange={(val) => {
                setResponses((prev) => {
                  const copy = { ...prev };
                  if (val === undefined) {
                    delete copy[activeQuestion.id];
                  } else {
                    copy[activeQuestion.id] = val;
                  }
                  return copy;
                });
                setStatuses((prev) => ({
                  ...prev,
                  [activeQuestion.id]: val !== undefined && String(val).trim() !== "" ? "answered" : "visited",
                }));
              }}
              className="flex-grow"
            />
          ) : (
            <div className="flex items-center justify-center flex-grow text-muted-foreground text-xs">
              Select a question index from the palette.
            </div>
          )}
        </div>

        {/* Right Hand Palette Sidebar Control (Colspan 1) */}
        <div className="md:col-span-1 h-full flex flex-col gap-4 overflow-y-auto">
          <QuestionPalette
            sections={paper.sections}
            questions={paper.questions}
            currentSectionId={currentSectionId}
            currentQuestionId={currentQuestionId}
            statuses={statuses}
            onSelectSection={handleSelectSection}
            onSelectQuestion={navigateToQuestion}
            className="flex-grow"
          />

          {/* Dev Bypass Submit */}
          <button
            onClick={handleAutoSubmit}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-dashed border-red-500/35 hover:border-red-500 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
          >
            🧪 Dev Bypass: Force Submit
          </button>
        </div>

      </main>

      {/* Bottom Examination Actions Panel */}
      <ExamFooter
        onPrev={handlePrev}
        onNext={handleNext}
        onClear={handleClear}
        onMark={handleMarkForReview}
        onSaveNext={handleSaveNext}
        onSubmit={() => setIsSubmitOpen(true)}
        isFirst={activeQuestionIndex === 0}
        isLast={activeQuestionIndex === paper.questions.length - 1}
        hasAnswer={responses[currentQuestionId] !== undefined}
      />

      {/* Final submission break-down confirmation box */}
      <SubmissionDialog
        totalQuestions={paper.questions.length}
        stats={stats}
        timeLeftSeconds={timeLeftSeconds}
        onConfirm={handleAutoSubmit}
        onCancel={() => setIsSubmitOpen(false)}
        isOpen={isSubmitOpen}
      />

    </div>
  );
}

// Inline components shims
function Link({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="text-primary hover:underline">
      {children}
    </a>
  );
}
