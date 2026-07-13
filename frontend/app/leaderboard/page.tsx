import * as React from "react";
import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section } from "@/components/ui";
import { LeaderboardClient } from "./LeaderboardClient";
import { LeaderboardSkeleton } from "@/components/live/LeaderboardSkeleton";

export const metadata: Metadata = {
  title: "National Standings Leaderboard | Ranker's League",
  description:
    "Track the highest-performing competitors across JEE, NEET, UPSC, and other elite competitive examinations on the official national leaderboard registry.",
  alternates: {
    canonical: "/leaderboard",
  },
  openGraph: {
    title: "National Standings Leaderboard | Ranker's League",
    description:
      "Compete, Climb, Conquer. View certified standings of top aspirants across engineering, medical, and civil services exams.",
    url: "/leaderboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "National Standings Leaderboard | Ranker's League",
    description: "Track elite competitor standings across India.",
  },
};

export default function LeaderboardPage() {
  // JSON-LD Structured Data Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "National Standings Leaderboard | Ranker's League",
    "description":
      "Track the highest-performing competitors across JEE, NEET, UPSC, and other elite competitive examinations on the official national leaderboard registry.",
    "url": "https://rankers-league.com/leaderboard",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Insert JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-grow">
        <Section className="pt-8 pb-20">
          <React.Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardClient />
          </React.Suspense>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
