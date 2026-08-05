"use client";

import React from "react";

export interface LegalSEOProps {
  title: string;
  description: string;
  slug: string;
  category: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections?: Array<{ title: string; content: string }>;
}

export function LegalSEO({
  title,
  description,
  slug,
  category,
  version,
  effectiveDate,
  lastUpdated,
  sections = [],
}: LegalSEOProps) {
  const baseUrl = "https://rankersleague.com";
  const canonicalUrl = `${baseUrl}/legal/${slug}`;
  const fullTitle = `${title} (${version}) | Ranker's League Legal Center`;

  // 1. BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Legal Center",
        "item": `${baseUrl}/legal`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": canonicalUrl,
      },
    ],
  };

  // 2. Article / Policy Document JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": canonicalUrl,
    "datePublished": effectiveDate,
    "dateModified": lastUpdated,
    "articleSection": category,
    "version": version,
    "author": {
      "@type": "Organization",
      "name": "Ranker's League Legal Cell",
      "url": baseUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ranker's League",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
      },
    },
  };

  // 3. FAQPage JSON-LD Schema (Compiled from policy sections)
  const faqSchema = sections.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": sections.map((s) => ({
      "@type": "Question",
      "name": s.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": s.content,
      },
    })),
  } : null;

  return (
    <>
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Metadata */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Ranker's League" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Structured Data JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

export default LegalSEO;
