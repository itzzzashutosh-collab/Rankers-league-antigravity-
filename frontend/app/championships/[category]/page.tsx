import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { Trophy, Calendar, DollarSign, HelpCircle, ArrowRight, Shield, Award, Users, BookOpen } from "lucide-react";
import { championshipsContent } from "@/content/footer/championships";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function ChampionshipCategoryPage({ params }: Props) {
  const { category } = await params;
  const content = championshipsContent.find((c) => c.slug === category);
  
  if (!content) return notFound();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Championships", href: "/championships" },
    { label: content.title },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <Section className="pt-16 pb-12 bg-gradient-to-b from-primary/5 via-transparent to-transparent border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                <Badge variant="national" className="animate-pulse">Active Arena</Badge>
                <Typography variant="display-l" className="tracking-tight leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
                  {content.title}
                </Typography>
                <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                  {content.overview}
                </Typography>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/40">
                  <div className="flex-1 p-4 rounded-xl border border-border/50 bg-card/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                      Eligibility Credentials
                    </span>
                    <Typography variant="body-small" className="text-foreground font-semibold">
                      {content.eligibility}
                    </Typography>
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-border/50 bg-card/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                      Calibrated Blueprints
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {content.supportedExams.map((exam, i) => (
                        <span key={i} className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Action Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-md space-y-5">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block">
                    Upcoming Championships
                  </span>
                  
                  {content.upcomingContests.length > 0 ? (
                    <div className="space-y-4">
                      {content.upcomingContests.map((contest) => (
                        <div key={contest.id} className="p-4 rounded-xl border border-border bg-background/50 space-y-3">
                          <Typography variant="h4" className="text-xs font-bold leading-tight">
                            {contest.title}
                          </Typography>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {contest.date}
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-border/40">
                            <span>Entry Fee: {formatCurrency(contest.fee)}</span>
                            <span className="text-emerald-400">Pool: {formatCurrency(contest.prizePool)}</span>
                          </div>
                          <Link href={`/contests/${contest.id === "upsc-elite-live" ? "upsc-elite" : contest.id === "jee-advanced-live" ? "jee-advanced" : "neet-prime"}`}>
                            <button className="w-full mt-2 h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                              Enroll & Pay {formatCurrency(contest.fee)}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground space-y-2">
                      <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                      <Typography variant="body-small" className="block text-xs font-semibold">
                        No upcoming schedules.
                      </Typography>
                      <span className="text-[10px] text-muted-foreground/60 block leading-normal">
                        Curriculum updates are currently in audit check stages.
                      </span>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* Content Tabs / Information sections */}
        <Section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Prize details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Trophy className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <Typography variant="h2" className="tracking-tight">Prize Allocations</Typography>
                </div>
                <div className="rounded-2xl border border-border overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/80 text-[10px] font-bold tracking-wider uppercase text-foreground/80">
                        <th className="p-4">Rank Bracket</th>
                        <th className="p-4">Rewards</th>
                        <th className="p-4">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {content.prizes.map((p, i) => (
                        <tr key={i} className="hover:bg-card/10 transition-colors">
                          <td className="p-4 font-bold text-foreground">{p.bracket}</td>
                          <td className="p-4 font-semibold text-emerald-400">{p.reward}</td>
                          <td className="p-4 text-muted-foreground">{p.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Leaderboard preview */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Users className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <Typography variant="h2" className="tracking-tight">Leaderboard Standing Preview</Typography>
                </div>
                {content.leaderboardPreview.length > 0 ? (
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/80 text-[10px] font-bold tracking-wider uppercase text-foreground/80">
                          <th className="p-4">Rank</th>
                          <th className="p-4">Aspirant</th>
                          <th className="p-4 text-right">Caliber Score</th>
                          <th className="p-4 text-right">Percentile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {content.leaderboardPreview.map((user, i) => (
                          <tr key={i} className="hover:bg-card/10 transition-colors">
                            <td className="p-4 font-bold text-primary">#{user.rank}</td>
                            <td className="p-4 font-semibold text-foreground">{user.name}</td>
                            <td className="p-4 text-right text-muted-foreground">{user.score}</td>
                            <td className="p-4 text-right text-emerald-400 font-bold">{user.percentile}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border border-dashed text-muted-foreground/60">
                    <Trophy className="w-10 h-10 text-muted-foreground/20 mb-2" />
                    <span className="text-xs font-semibold">Pre-season preparations active.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </Section>

        {/* FAQs Accordion */}
        <Section className="py-16 bg-muted/10 border-t border-border/40">
          <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <HelpCircle className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <Typography variant="h2" className="tracking-tight">Frequently Asked Questions</Typography>
            </div>
            
            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-border/80 bg-card/10 space-y-2">
                  <h4 className="text-xs font-bold text-foreground leading-normal flex items-start gap-2">
                    <span className="text-primary font-black">Q.</span>
                    {faq.q}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return championshipsContent.map((c) => ({
    category: c.slug,
  }));
}

export const dynamic = "force-static";
