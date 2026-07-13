import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { liveContestRepository } from "@/repositories/LiveContestRepository";
import { ContestBreadcrumb } from "@/components/contests/ContestBreadcrumb";
import { ContestBadge } from "@/components/contests/ContestBadge";
import { ContestTimeline } from "@/components/contests/ContestTimeline";
import { ContestRewardCard } from "@/components/contests/ContestRewardCard";
import { ContestRules } from "@/components/contests/ContestRules";
import { ContestFAQ } from "@/components/contests/ContestFAQ";
import { ContestSidebar } from "@/components/contests/ContestSidebar";
import { Card, Typography, Container, Section } from "@/components/ui";
import { liveContestsContent } from "@/content/live/live-contests";
import { upcomingContestsContent } from "@/content/live/upcoming-contests";
import { ContestDetail } from "@/types/contests";
import Link from "next/link";
import { ShieldCheck, BookOpen, Clock, Award, Languages } from "lucide-react";

interface Props {
  params: Promise<{ contestSlug: string }>;
}

// Pre-render slugs at build time
export async function generateStaticParams() {
  const all = [...liveContestsContent, ...upcomingContestsContent];
  return all.map((c) => ({
    contestSlug: c.slug,
  }));
}

// Generate SEO metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contestSlug } = await params;
  const contest = await liveContestRepository.findBySlug(contestSlug);

  if (!contest) {
    return { title: "Live Contest Not Found | Ranker's League" };
  }

  return {
    title: `Live Gateway: ${contest.title} | Ranker's League`,
    description: `Enroll and check-in to the ${contest.title} live proctored Competitive Examination.`,
  };
}

export default async function LiveContestDetailsPage({ params }: Props) {
  const { contestSlug } = await params;
  const contest = await liveContestRepository.findBySlug(contestSlug);

  if (!contest) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Live Hub", href: "/live" },
    { label: contest.title },
  ];

  // Map to common schemas for sidebar representation
  const sidebarContest: ContestDetail = {
    id: contest.id,
    slug: contest.slug,
    title: contest.title,
    exam: contest.exam,
    category: contest.exam,
    entryFee: contest.entryFee,
    prizePool: contest.prizePool,
    participants: contest.participants,
    maxParticipants: contest.maxParticipants,
    difficulty: "Elite",
    date: contest.date,
    time: contest.startTime,
    duration: contest.duration,
    seatsAvailable: contest.seatsAvailable,
    status: contest.status === "live" ? "active" : (contest.status === "completed" ? "completed" : "upcoming"),
    bannerGradient: contest.bannerGradient,
    language: contest.languages.join(", "),
    country: "India",
    isFeatured: true,
    isTrending: false,
    registrationDeadline: contest.registrationDeadline || new Date().toISOString(),
    overview: `This is the official live proctored portal for the ${contest.title} championship. Verify User ID (Username) and Secret Security Passkey to join lobby.`,
    eligibility: "Open to candidates registered with validated profiles.",
    structure: [
      `Championship Duration: ${contest.duration}`,
      `Languages Supported: ${contest.languages.join(", ")}`,
      "Zero-tolerance proctoring lockdown sandboxing active."
    ],
    syllabus: [],
    rewards: [
      { rank: "Top Ranks", prize: `₹${contest.prizePool.toLocaleString()}`, recognition: "Medal & Standing certificate" }
    ],
    rules: [
      "Keep webcam active throughout.",
      "Tab switching or remote assistance triggers auto-disqualification."
    ],
    timeline: [
      { step: "Identity check-in", time: contest.startTime, description: "Check in 15 mins before", status: "upcoming" }
    ],
    faq: []
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb stripping */}
        <Section className="py-4 border-b border-border/20 bg-secondary/15">
          <Container className="max-w-6xl mx-auto">
            <ContestBreadcrumb items={breadcrumbs} />
          </Container>
        </Section>

        {/* Layout Column Workspace */}
        <Section className="py-12">
          <Container className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Details Sheet */}
              <div className="lg:col-span-2 flex flex-col gap-8 text-left">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/15 rounded-md px-3 py-1 w-fit select-none animate-pulse">
                    LIVE CHAMPIONSHIP GATEWAY
                  </span>
                  <Typography variant="display-l" className="font-extrabold tracking-tight">
                    {contest.title}
                  </Typography>
                  <Typography variant="subtitle" className="text-muted-foreground leading-relaxed">
                    This is the proctored entry gateway for the {contest.title} championship. User ID (Username) verification validation is mandatory. Check-in becomes available exactly 30 minutes before start.
                  </Typography>
                </div>

                {/* Eligibility parameters */}
                <Card variant="solid" className="bg-card/20 border border-border/40 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Aspirant Proctored Guidelines
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Webcam monitoring, dual-screen detector triggers, and keyboard lockout hooks are active inside this arena. Candidates must agree to proctoring declarations on entering the lobby workspace.
                  </p>
                </Card>

                {/* Structure info cards */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Championship Parameters
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-card/40 border border-border/30 rounded-xl text-xs text-muted-foreground flex gap-3">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <strong className="text-foreground block mb-0.5">Timeline Limit</strong>
                        <span>Championship duration is set to {contest.duration}. Auto-submission triggers instantly when timeline complete.</span>
                      </div>
                    </div>
                    <div className="p-4 bg-card/40 border border-border/30 rounded-xl text-xs text-muted-foreground flex gap-3">
                      <Languages className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <strong className="text-foreground block mb-0.5">Language Translations</strong>
                        <span>Languages supported inside this arena: {contest.languages.join(", ")}. Select preference inside lobby.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rules details */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Lobby Verification Parameters
                  </h3>
                  <ContestRules customRules={sidebarContest.rules} />
                </div>
              </div>

              {/* Right Sidebar Checklist */}
              <div className="lg:col-span-1">
                <ContestSidebar contest={sidebarContest} />
              </div>

            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
