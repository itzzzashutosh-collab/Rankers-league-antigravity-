import React from "react";
import LegalLayout from "@/components/legal/LegalLayout";
import { legalContent } from "@/content/footer/legal";
import { Typography } from "@/components/ui";

export default async function FairCompetitionPolicyPage() {
  const data = legalContent["fair-competition-policy"];

  return (
    <LegalLayout title={data.title} lastUpdated={data.lastUpdated}>
      <div className="space-y-8">
        {data.sections.map((section, index) => (
          <section key={index} className="space-y-3">
            <Typography variant="h3" className="text-foreground tracking-tight">
              {index + 1}. {section.heading}
            </Typography>
            <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
              {section.text}
            </Typography>
          </section>
        ))}
      </div>
    </LegalLayout>
  );
}

export const dynamic = "force-static";
