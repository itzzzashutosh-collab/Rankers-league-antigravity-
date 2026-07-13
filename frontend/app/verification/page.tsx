import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { CheckCircle2, ShieldCheck, QrCode, Code2, Search, Cpu } from "lucide-react";
import { verificationContent } from "@/content/footer/verification";

export default async function VerificationPage() {
  const data = verificationContent;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Credentials Verification" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-20 bg-gradient-to-b from-card/30 to-background/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="max-w-3xl mb-16 space-y-4">
              <Badge variant="national">Prestige Validation</Badge>
              <Typography variant="display-l" className="tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
                {data.title}
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                {data.intro}
              </Typography>
            </div>

            {/* Verification Pipelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              {data.pipelines.map((p, i) => (
                <Card key={i} className="p-8 rounded-3xl border border-border bg-card/20 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      {i === 0 ? <ShieldCheck className="w-5 h-5 text-primary" /> : <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                    <Typography variant="h3">{p.title}</Typography>
                  </div>
                  <Typography variant="body-medium" className="text-muted-foreground">
                    {p.description}
                  </Typography>
                  <div className="space-y-3.5 pt-4 border-t border-border/40">
                    <span className="text-[10px] font-bold text-foreground/80 tracking-widest uppercase block">
                      Verification Process Steps
                    </span>
                    <ol className="space-y-3">
                      {p.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted border border-border/80 flex items-center justify-center text-[10px] font-black text-foreground">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
              ))}
            </div>

            {/* ID & QR Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {data.verificationIds.map((item, idx) => (
                <Card key={idx} className="p-6 rounded-2xl border border-border bg-card/10 space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center">
                    <Search className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <Typography variant="h4" className="text-xs font-bold">
                    {item.name}
                  </Typography>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.details}
                  </p>
                </Card>
              ))}

              <Card className="p-6 rounded-2xl border border-border bg-card/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center">
                  <QrCode className="w-4.5 h-4.5 text-primary" />
                </div>
                <Typography variant="h4" className="text-xs font-bold">
                  QR Validation Engine
                </Typography>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.qrVerification}
                </p>
              </Card>
            </div>

            {/* Developer API Specs */}
            <Card className="p-8 md:p-10 rounded-3xl border border-border bg-card/35 backdrop-blur-md grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary tracking-wider uppercase">
                  <Cpu className="w-3.5 h-3.5" />
                  Developer Sandbox API
                </div>
                <Typography variant="h2" className="tracking-tight">
                  Public Validation API
                </Typography>
                <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
                  {data.developerApi.description}
                </Typography>
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 font-mono text-[10px] text-foreground font-semibold flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">GET</span>
                  {data.developerApi.endpoint}
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <div className="p-5 rounded-2xl border border-border/80 bg-black/60 font-mono text-[10px] text-emerald-400/90 shadow-inner overflow-x-auto leading-relaxed">
                  <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-3 text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                    <span>verification_response.json</span>
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <pre className="whitespace-pre-wrap">{data.developerApi.sampleResponse}</pre>
                </div>
              </div>
            </Card>

          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-static";
export const metadata = {
  title: "Credentials Verification | Ranker's League",
  description: "Cryptographically verify aspirant standings, merit awards, and results history.",
};
