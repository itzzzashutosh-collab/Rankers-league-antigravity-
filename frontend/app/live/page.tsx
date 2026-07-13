"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Badge, Card } from "@/components/ui";
import { LiveContest, CompletedContestSummary } from "@/types/live";
import { liveContestRepository } from "@/repositories/LiveContestRepository";

// Components
import { LiveContestCard } from "@/components/live/LiveContestCard";
import { UpcomingContestCard } from "@/components/live/UpcomingContestCard";
import { ContestCalendar } from "@/components/live/ContestCalendar";
import { ContestBreadcrumb } from "@/components/contests/ContestBreadcrumb";
import { globalFAQContent } from "@/content/contest-faq";
import { ContestFAQ } from "@/components/contests/ContestFAQ";
import { Trophy, CheckCircle, Flame, Calendar, Clock } from "lucide-react";

export default function LiveContestsHubPage() {
  const [liveContests, setLiveContests] = React.useState<LiveContest[]>([]);
  const [upcomingContests, setUpcomingContests] = React.useState<LiveContest[]>([]);
  const [completedContests, setCompletedContests] = React.useState<CompletedContestSummary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const live = await liveContestRepository.getLiveContests();
        const upcoming = await liveContestRepository.getUpcomingContests();
        const completed = await liveContestRepository.getCompletedContests();
        
        setLiveContests(live);
        setUpcomingContests(upcoming);
        setCompletedContests(completed);
      } catch (err) {
        console.error("Failed to load live hub metrics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const breadcrumbs = [{ label: "Live Contest Hub" }];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        {/* Hub Banner */}
        <Section radialGlow className="pt-20 pb-12 border-b border-border/20 bg-background/30">
          <Container className="text-center max-w-4xl mx-auto flex flex-col gap-4">
            <Badge variant="featured" className="self-center">
              Active Championship Gateways
            </Badge>
            <Typography variant="display-l" className="font-extrabold tracking-tight">
              Live Contest Hub
            </Typography>
            <Typography variant="subtitle" className="max-w-2xl mx-auto text-muted-foreground">
              Connect to national competitive examinations, verify proctoring access keys, and enter the pre-examination sandboxed lobby workspaces.
            </Typography>
          </Container>
        </Section>

        {/* Breadcrumb row */}
        <Section className="py-4 border-b border-border/20 bg-secondary/15">
          <Container className="max-w-6xl mx-auto">
            <ContestBreadcrumb items={breadcrumbs} />
          </Container>
        </Section>

        {/* Live Grid Workspace */}
        <Section className="py-12 bg-background/50">
          <Container className="max-w-6xl mx-auto flex flex-col gap-16">
            
            {/* 1. Currently Live & Enrollment Options */}
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                  Currently Live & Check-In
                </Typography>
              </div>
              <p className="text-xs text-muted-foreground -mt-3">
                Enrollment and access validation gates enable exactly 30 minutes before official schedule start time.
              </p>
              
              {liveContests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {liveContests.map((c) => (
                    <LiveContestCard key={c.id} contest={c} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                  No live channels are running at this second.
                </div>
              )}
            </div>

            {/* 2. Starting Soon (Next 24h) */}
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                  Starting Soon (Next 24 Hours)
                </Typography>
              </div>
              
              {upcomingContests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upcomingContests.map((c) => (
                    <UpcomingContestCard key={c.id} contest={c} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                  No contests are starting in the next 24 hours.
                </div>
              )}
            </div>

            {/* 3. Upcoming Contests & Month Calendar Board */}
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                  Upcoming Contests Calendar
                </Typography>
              </div>
              <ContestCalendar contests={[...liveContests, ...upcomingContests]} />
            </div>

            {/* 4. Completed Today Summary */}
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                  Completed Today
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedContests.map((item) => (
                  <Card
                    key={item.id}
                    variant="solid"
                    className="border border-border/40 bg-card/25 hover:border-primary/20 transition-all p-5 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                        Completed at {item.completedTime}
                      </span>
                      <Typography variant="h4" className="font-bold text-foreground tracking-tight line-clamp-1">
                        {item.title}
                      </Typography>
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                        <span>Participants: <strong>{item.participants.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Avg accuracy: <strong>{item.accuracy}%</strong></span>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl flex items-center gap-2 shrink-0">
                      <Trophy className="w-5 h-5" />
                      <div className="text-left leading-none">
                        <span className="text-[8px] uppercase tracking-widest font-bold block">1st Rank</span>
                        <strong className="text-xs font-bold block mt-0.5 max-w-[100px] truncate">{item.winnerName}</strong>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 5. FAQs accordions */}
            <div className="flex flex-col gap-6 text-left border-t border-border/20 pt-12">
              <Typography variant="h3" className="font-extrabold text-foreground tracking-tight">
                Frequently Asked Enquiries
              </Typography>
              <ContestFAQ faqs={globalFAQContent} />
            </div>

          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
