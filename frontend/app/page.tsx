import { Header } from "@/components/header";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyRankersLeague } from "@/components/sections/WhyRankersLeague";
import { CompetitionCategories } from "@/components/sections/CompetitionCategories";
import { FeaturedLeagues } from "@/components/sections/FeaturedLeagues";
import { UpcomingCompetitions } from "@/components/sections/UpcomingCompetitions";
import { StandingsPreview } from "@/components/sections/StandingsPreview";
import { PerformanceInsights } from "@/components/sections/PerformanceInsights";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyStudentsLoveUs } from "@/components/sections/WhyStudentsLoveUs";
import { FAQSection } from "@/components/sections/FAQSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Query live championships for hero countdown
  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .order("scheduled_start", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* Premium Sticky Navigation */}
      <Header />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <HeroSection initialLeagues={championships || []} />

        {/* 3. Why Ranker's League */}
        <WhyRankersLeague />

        {/* 6. Competition Categories */}
        <CompetitionCategories />

        {/* 7. Featured Contests */}
        <FeaturedLeagues />

        {/* 8. Upcoming Competitions */}
        <UpcomingCompetitions />

        {/* 9. Leaderboard Preview */}
        <StandingsPreview />

        {/* 10. Performance Insights */}
        <PerformanceInsights />

        {/* 11. Student Success Stories */}
        <SuccessStories />

        {/* 12. How It Works */}
        <HowItWorks />

        {/* 13. Why Students Love Ranker's League */}
        <WhyStudentsLoveUs />

        {/* 14. Frequently Asked Questions */}
        <FAQSection />

        {/* 15. Newsletter */}
        <NewsletterSection />

        {/* 16. Call To Action */}
        <CTASection />
      </main>

      {/* 17. Footer */}
      <Footer />
    </div>
  );
}
