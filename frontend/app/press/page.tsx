import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { Download, ShieldAlert, FileText, Info, Mail } from "lucide-react";
import { pressContent } from "@/content/footer/press";

export default async function PressKitPage() {
  const data = pressContent;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Press Kit" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-20 bg-gradient-to-b from-card/30 to-background/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="max-w-3xl mb-16 space-y-4">
              <Badge variant="national">Resources Vault</Badge>
              <Typography variant="display-l" className="tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
                Press & Media Kit
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                {data.intro}
              </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start mb-16">
              {/* Brand assets download grid */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Official Brand Assets
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {data.brandAssets.map((asset, i) => (
                      <Card key={i} className="p-6 rounded-2xl border border-border bg-card/10 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <Typography variant="h4" className="text-xs font-bold">
                            {asset.name}
                          </Typography>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {asset.description}
                          </p>
                        </div>
                        <button className="h-8 rounded-lg border border-border bg-background hover:bg-card/40 transition-colors text-xs font-bold text-foreground flex items-center justify-center gap-1.5 w-max px-3">
                          <Download className="w-3.5 h-3.5" />
                          Download Asset
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Brand Guidelines */}
                <div className="space-y-4">
                  <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary" />
                    Usage & Guidelines
                  </Typography>
                  <div className="p-6 rounded-2xl border border-border bg-card/5 space-y-3.5">
                    {data.guidelines.map((g, i) => (
                      <div key={i} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Facts sidebar */}
              <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4">
                  <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Key Platform Facts
                  </Typography>
                  <Card className="p-6 rounded-2xl border border-border bg-card/25 backdrop-blur-md divide-y divide-border/60">
                    {data.companyFacts.map((fact, i) => (
                      <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-semibold">{fact.label}</span>
                        <span className="text-foreground font-bold">{fact.value}</span>
                      </div>
                    ))}
                  </Card>
                </div>

                {/* Press Contacts */}
                <div className="space-y-4">
                  <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Media Contacts
                  </Typography>
                  <Card className="p-6 rounded-2xl border border-border bg-card/25 backdrop-blur-md space-y-3 text-xs">
                    <div>
                      <span className="text-foreground font-bold block">{data.pressContact.name}</span>
                      <span className="text-muted-foreground block">{data.pressContact.role}</span>
                    </div>
                    <a
                      href={`mailto:${data.pressContact.email}`}
                      className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {data.pressContact.email}
                    </a>
                  </Card>
                </div>
              </div>
            </div>

            {/* Media resources / releases */}
            <div className="space-y-4 border-t border-border/40 pt-12">
              <Typography variant="h2" className="tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Featured Publications & Releases
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.mediaResources.map((res, i) => (
                  <Card key={i} className="p-5 rounded-xl border border-border bg-card/10 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-primary tracking-wider uppercase">{res.type}</span>
                      <Typography variant="h4" className="text-xs font-bold">{res.title}</Typography>
                    </div>
                    <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                      View
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </Card>
                ))}
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
export const metadata = {
  title: "Press & Media Kit | Ranker's League",
  description: "Official logos, style guidelines, quick platform facts, and media relations links.",
};
