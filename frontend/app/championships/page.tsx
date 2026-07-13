import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { ArrowRight, Shield, Binary, Stethoscope, Briefcase, TrendingUp, Scale, GraduationCap, Globe, Award } from "lucide-react";
import { championshipsContent } from "@/content/footer/championships";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "civil-services": Shield,
  "engineering": Binary,
  "medical": Stethoscope,
  "management": Briefcase,
  "commerce": TrendingUp,
  "law": Scale,
  "defence": Award,
  "school": GraduationCap,
  "international": Globe,
};


export default async function ChampionshipsPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Championships" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-20 bg-gradient-to-b from-card/30 to-background/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="max-w-3xl mb-16 space-y-4">
              <Badge variant="national" className="animate-pulse">Active Leagues</Badge>
              <Typography variant="display-l" className="tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
                National Entrance Championships
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                Benchmark your readiness against the top 1% candidates nationwide in exact high-fidelity replicas of prestigious examination systems.
              </Typography>
            </div>

            {/* Championships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {championshipsContent.map((category) => {
                const IconComponent = iconMap[category.id] || Shield;
                return (
                  <Card
                    key={category.id}
                    className="group relative flex flex-col justify-between p-8 rounded-3xl border border-border/80 bg-card/20 hover:bg-card/45 hover:border-primary/30 transition-all duration-300 shadow-lg shadow-black/10 overflow-hidden"
                  >
                    {/* Corner gradient light */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />
                    
                    <div className="space-y-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="space-y-2">
                        <Typography variant="h3" className="group-hover:text-primary transition-colors">
                          {category.title}
                        </Typography>
                        <span className="text-xs font-semibold text-muted-foreground block">
                          Target: {category.exam}
                        </span>
                        <Typography variant="body-small" className="text-muted-foreground/80 line-clamp-3">
                          {category.overview}
                        </Typography>
                      </div>

                      {/* Supported Entrance Exams list */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-bold text-foreground/75 tracking-wider uppercase block">
                          Calibrated Replicas
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {category.supportedExams.map((exam, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-semibold bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                        {category.upcomingContests.length} upcoming contests
                      </span>
                      <Link
                        href={`/championships/${category.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors group/link"
                      >
                        Explore Arena
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-static";
export const metadata = {
  title: "Entrance Championships | Ranker's League",
  description: "Examine national-level challenger ratings inside exact replicas of top-tier tests (UPSC, JEE, NEET, and more).",
};
