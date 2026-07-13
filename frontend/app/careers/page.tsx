"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { Briefcase, Heart, RefreshCw, X, Check } from "lucide-react";
import { careersContent, CareerPosition } from "@/content/footer/careers";

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = React.useState<CareerPosition | null>(null);

  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Careers" },
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSelectedJob(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-20 bg-gradient-to-b from-card/30 to-background/50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="featured" className="self-center">
                We Are Hiring
              </Badge>
              <Typography variant="display-l" className="tracking-tight leading-tight">
                Join the Ranker&apos;s League Team
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                Help us construct the national standard of high-fidelity pre-examination evaluation. We are looking for builders to scale our secure arena frameworks.
              </Typography>
            </div>

            <div className="space-y-16 text-left">
              {/* Culture */}
              <div className="space-y-4 p-8 rounded-3xl border border-border/80 bg-card/10">
                <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Company Culture
                </Typography>
                <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
                  {careersContent.culture}
                </Typography>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Benefits & Perks
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {careersContent.benefits.map((b, i) => (
                    <Card key={i} className="p-6 rounded-2xl border border-border bg-card/10 space-y-2">
                      <Typography variant="h4" className="text-xs font-bold">
                        {b.title}
                      </Typography>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {b.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Hiring Process */}
              <div className="space-y-6 pt-8 border-t border-border/40">
                <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  Our Hiring Process
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {careersContent.process.map((p, i) => (
                    <Card key={i} className="p-6 rounded-2xl border border-border bg-card/15 space-y-2">
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase block">
                        {p.step}
                      </span>
                      <Typography variant="h4" className="text-xs font-bold">
                        {p.title}
                      </Typography>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Open Positions */}
              <div className="space-y-6 pt-8 border-t border-border/40">
                <Typography variant="h2" className="tracking-tight">
                  Open Opportunities
                </Typography>
                <div className="flex flex-col gap-4">
                  {careersContent.positions.map((pos) => (
                    <Card key={pos.id} className="p-6 rounded-2xl border border-border bg-card/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/20 transition-all">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-primary tracking-wider uppercase">
                          {pos.department} &bull; {pos.type}
                        </span>
                        <Typography variant="h4" className="text-xs font-bold">
                          {pos.title}
                        </Typography>
                        <p className="text-xs text-muted-foreground">
                          {pos.location}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedJob(pos)}
                        className="h-8 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold px-4 transition-colors"
                      >
                        Apply Position &rarr;
                      </button>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </Section>
      </main>

      {/* Application Form Drawer/Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <Typography variant="h3">Application Submitted!</Typography>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Thank you for applying for the {selectedJob.title} position. Our team will review your application.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-bold text-primary tracking-wider uppercase block">
                    Submit Application
                  </span>
                  <Typography variant="h3" className="text-xs font-bold leading-tight">
                    {selectedJob.title}
                  </Typography>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {selectedJob.location} &bull; {selectedJob.type}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground space-y-2">
                  <span className="font-bold text-foreground">Role Requirements:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedJob.requirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Application Form */}
                <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground block">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground block">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground block">Resume Link (PDF / Google Drive) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground block">Cover Letter / Note *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us why you're a great fit for Ranker's League..."
                      className="w-full p-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs transition-colors"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
