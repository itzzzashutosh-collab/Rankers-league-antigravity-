import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { liveContestRepository } from "@/repositories/LiveContestRepository";
import { ContestBreadcrumb } from "@/components/contests/ContestBreadcrumb";
import { VerificationForm } from "@/components/live/VerificationForm";
import { Container, Section, Typography, Badge } from "@/components/ui";
import { ShieldAlert, Calendar, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ contestSlug: string }>;
}

export default async function SecureAccessPage({ params }: Props) {
  const { contestSlug } = await params;
  const contest = await liveContestRepository.findBySlug(contestSlug);

  if (!contest) {
    notFound();
  }

  // Double check if enrollment is open (starts in <= 30 mins)
  const startTimestamp = new Date(`${contest.date} ${contest.startTime}`).getTime();
  const diffMinutes = (startTimestamp - Date.now()) / (1000 * 60);
  const isEnrollmentOpen = contest.status !== "completed" && diffMinutes <= 30;

  const breadcrumbs = [
    { label: "Live Hub", href: "/live" },
    { label: contest.title, href: `/live/${contestSlug}` },
    { label: "Secure Verification" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow flex flex-col justify-center">
        {/* Breadcrumb stripping */}
        <Section className="py-4 border-b border-border/20 bg-secondary/15">
          <Container className="max-w-6xl mx-auto text-left">
            <ContestBreadcrumb items={breadcrumbs} />
          </Container>
        </Section>

        <Section className="py-12 flex-grow flex items-center">
          <Container className="max-w-md mx-auto">
            {isEnrollmentOpen ? (
              <div className="flex flex-col gap-6">
                <VerificationForm contestSlug={contestSlug} />
                
                {/* Security instructions footer */}
                <div className="p-4 bg-secondary/50 border border-border/40 rounded-xl text-[10px] text-muted-foreground flex gap-2.5 text-left leading-relaxed">
                  <ShieldAlert className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong>Proctoring Notice:</strong> Any attempt to bypass access controls, input fraudulent verification tokens, or share security passcodes will be flagged in standing audit logs.
                  </div>
                </div>
              </div>
            ) : (
              /* Locked Screen Layout */
              <Card variant="glass" className="border border-border/40 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center gap-6">
                <div className="p-4 bg-destructive/5 text-destructive rounded-full border border-destructive/15 animate-pulse">
                  <Lock className="w-8 h-8" />
                </div>
                
                <div>
                  <Typography variant="h3" className="font-extrabold text-foreground tracking-tight mb-2">
                    Gateway Locked
                  </Typography>
                  <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
                    This secure verification gateway only opens exactly **30 minutes** before the scheduled start time of the competitive examination.
                  </Typography>
                </div>

                <div className="w-full bg-secondary/60 border border-border/30 rounded-xl p-4 flex flex-col gap-2.5 text-xs text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Championship:</span>
                    <strong className="text-foreground max-w-[180px] truncate">{contest.title}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date:</span>
                    <strong className="text-foreground">{contest.date}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Start Time:</span>
                    <strong className="text-foreground">{contest.startTime} IST</strong>
                  </div>
                </div>

                <Link href={`/live/${contestSlug}`} className="w-full">
                  <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-bold rounded-xl transition-all">
                    Return to Details
                  </button>
                </Link>
              </Card>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

// Inline card shim to prevent import mismatches
function Card({ children, className, variant }: { children: React.ReactNode; className?: string; variant?: string }) {
  return (
    <div className={cn("bg-card text-card-foreground border border-border/80 p-6 rounded-xl", className)}>
      {children}
    </div>
  );
}
