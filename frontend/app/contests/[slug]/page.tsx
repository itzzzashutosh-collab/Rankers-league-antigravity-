import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContestService } from "@/services/ContestService";
import { ContestDetailsClient } from "@/components/contests/ContestDetailsClient";
import { contestsContent } from "@/content/contests";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static routes at build time
export async function generateStaticParams() {
  return contestsContent.map((c) => ({
    slug: c.slug,
  }));
}

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const contest = await ContestService.getContestBySlug(slug);

  if (!contest) {
    return {
      title: "Championship Not Found | Ranker's League",
    };
  }

  const siteUrl = "https://rankersleague.com"; // placeholder canonical host
  const pageUrl = `${siteUrl}/contests/${contest.slug}`;

  return {
    title: `${contest.title} | ${contest.exam} Challenge`,
    description: contest.overview,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: contest.title,
      description: contest.overview,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: contest.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: contest.title,
      description: contest.overview,
    },
  };
}

export default async function ContestDetailsPage({ params }: Props) {
  const { slug } = await params;
  const contest = await ContestService.getContestBySlug(slug);

  if (!contest) {
    notFound();
  }

  // Load related contests
  const allContests = await ContestService.getAllContests();
  const related = allContests.filter(
    (c) => c.slug !== slug && (c.category === contest.category || c.isFeatured)
  );

  // Structured Schema.org SEO Markup
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rankersleague.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contests",
        item: "https://rankersleague.com/contests",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: contest.title,
        item: `https://rankersleague.com/contests/${contest.slug}`,
      },
    ],
  };

  let startDateISO = "2026-07-12";
  try {
    const parsedDate = new Date(contest.date);
    if (!isNaN(parsedDate.getTime())) {
      startDateISO = parsedDate.toISOString().split("T")[0];
    }
  } catch {}

  const contestSchema = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "name": contest.title,
    "description": contest.overview,
    "startDate": startDateISO,
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "VirtualLocation",
      "url": `https://rankersleague.com/contests/${contest.slug}`
    },
    "offers": {
      "@type": "Offer",
      "price": contest.entryFee,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Ranker's League",
      "url": "https://rankersleague.com"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Dynamic SEO JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contestSchema) }}
      />

      <Header />

      <main className="flex-grow">
        <ContestDetailsClient contest={contest} relatedContests={related} />
      </main>

      <Footer />
    </div>
  );
}
