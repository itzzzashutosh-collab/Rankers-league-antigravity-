import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { ShieldCheck, Target, Award, Cpu, BookOpen, Compass } from "lucide-react";
import { aboutContent } from "@/content/footer/about";

export default async function AboutPage() {
  const data = aboutContent;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About Us" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in">
      <Header />

      <main className="flex-grow">
        <Section className="py-20 bg-gradient-to-b from-card/30 to-background/50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="featured" className="self-center">
                Our Identity
              </Badge>
              <Typography variant="display-l" className="tracking-tight leading-tight">
                {data.title}
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                {data.subtitle}
              </Typography>
            </div>

            <div className="space-y-16 text-left">
              {/* Company Story */}
              <div className="space-y-4 p-8 rounded-3xl border border-border/80 bg-card/10">
                <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  Our Story
                </Typography>
                <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
                  {data.story}
                </Typography>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 rounded-2xl border border-border bg-card/20 space-y-3">
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <Typography variant="h3">Mission Statement</Typography>
                  <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
                    {data.mission}
                  </Typography>
                </Card>
                <Card className="p-8 rounded-2xl border border-border bg-card/20 space-y-3">
                  <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                  <Typography variant="h3">Vision Coordinates</Typography>
                  <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
                    {data.vision}
                  </Typography>
                </Card>
              </div>

              {/* Core Principles */}
              <div className="space-y-6">
                <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Core Principles
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.values.map((v, i) => (
                    <Card key={i} className="p-6 rounded-2xl border border-border bg-card/10 space-y-2">
                      <Typography variant="h4" className="text-xs font-bold">
                        {v.title}
                      </Typography>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {v.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Technology & Proctor Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-2">
                  <Typography variant="h4" className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-primary" />
                    Stack Architecture
                  </Typography>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {data.technology.coreStack}
                  </p>
                </div>
                <div className="space-y-2">
                  <Typography variant="h4" className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Integrity System
                  </Typography>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {data.technology.proctorEngine}
                  </p>
                </div>
                <div className="space-y-2">
                  <Typography variant="h4" className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Database Security
                  </Typography>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {data.technology.databaseSecurity}
                  </p>
                </div>
              </div>

              {/* Timeline Roadmap */}
              <div className="space-y-6 pt-8 border-t border-border/40">
                <Typography variant="h2" className="tracking-tight">
                  Development Roadmap
                </Typography>
                <div className="flex flex-col gap-6 relative pl-6 border-l border-border/60">
                  {data.roadmap.map((phase, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[30px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background" />
                      <span className="font-bold text-primary block mb-0.5">{phase.phase} ({phase.timeline})</span>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        {phase.milestones.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-static";
