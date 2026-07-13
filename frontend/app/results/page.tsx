import * as React from "react";
import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Section, Typography, Badge } from "@/components/ui";
import { completedContests } from "@/content/results/results";
import { ResultCard } from "@/components/live/ResultCard";
import { Award, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Official Contest Results & Standings | Ranker's League",
  description:
    "View the certified rankings, final standings, safe zones, and prize payout matrices for completed proctored national championships.",
  alternates: {
    canonical: "/results",
  },
};

export default function ResultsDirectoryPage() {
  // Sort contests by timelines
  const recentlyPublished = completedContests.filter(c => c.resultStatus === "published");
  const finalizedResults = completedContests.filter(c => c.resultStatus === "final");
  const pendingResults = completedContests.filter(c => c.resultStatus === "under_verification");

  // JSON-LD Structured Data Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Official Contest Results & Standings | Ranker's League",
    "description": "Certified standings and payout matrices for completed proctored national championships.",
    "url": "https://rankers-league.com/results"
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-grow">
        
        {/* Hero Section */}
        <Section radialGlow className="pt-16 pb-12 border-b border-border/20 bg-gradient-to-b from-background via-secondary/10 to-background text-center select-none">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-4">
            <Badge variant="featured" className="self-center">
              📜 Verified Standings Registry
            </Badge>
            <Typography variant="display-l" className="font-extrabold tracking-tight">
              Official Results Portal
            </Typography>
            <Typography variant="subtitle" className="text-muted-foreground text-sm leading-relaxed max-w-xl">
              Certified standings and prize distributions for completed championships. Standings are finalized post double proctor check-ins.
            </Typography>
          </div>
        </Section>

        {/* Results Lists */}
        <Section className="py-12 select-none">
          <Container className="max-w-5xl mx-auto flex flex-col gap-10">

            {/* 1. Recently Published */}
            {recentlyPublished.length > 0 && (
              <div className="flex flex-col gap-5 text-left">
                <div className="flex items-center gap-2 border-b border-border/15 pb-2">
                  <Award className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
                    Recently Published Results
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentlyPublished.map(c => (
                    <ResultCard key={c.id} contest={c} />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Today's Verification Standings */}
            {pendingResults.length > 0 && (
              <div className="flex flex-col gap-5 text-left">
                <div className="flex items-center gap-2 border-b border-border/15 pb-2">
                  <FileCheck className="w-5 h-5 text-amber-500 shrink-0" />
                  <h3 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
                    Under Proctor Verification
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pendingResults.map(c => (
                    <ResultCard key={c.id} contest={c} />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Older & Finalized Rankings */}
            {finalizedResults.length > 0 && (
              <div className="flex flex-col gap-5 text-left">
                <div className="flex items-center gap-2 border-b border-border/15 pb-2">
                  <Award className="w-5 h-5 text-indigo-500 shrink-0" />
                  <h3 className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
                    Finalized Standings & archives
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {finalizedResults.map(c => (
                    <ResultCard key={c.id} contest={c} />
                  ))}
                </div>
              </div>
            )}

          </Container>
        </Section>

      </main>

      <Footer />
    </div>
  );
}
