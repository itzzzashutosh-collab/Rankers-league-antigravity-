"use client";

import * as React from "react";
import { ShieldCheck, Monitor, Loader2, Lock } from "lucide-react";
import { Container, Section, Typography, Badge } from "@/components/ui";

interface Props {
  params: Promise<{ contestSlug: string }>;
}

export default function ContestWorkspacePlaceholder({ params }: Props) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.contestSlug;

  return (
    <div className="flex flex-col min-h-screen bg-background justify-center items-center select-none selection:bg-transparent">
      <Section className="py-24 text-center">
        <Container className="max-w-md mx-auto flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <Badge variant="featured" className="self-center">
              Proctored Exam Arena Active
            </Badge>
            <Typography variant="h2" className="font-extrabold text-foreground tracking-tight">
              Exam Workspace Locked
            </Typography>
            <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
              Browser lockdown proctoring is currently engaged. The examination engine is initializing, and test questions are syncing with the secure server database adapter.
            </Typography>
          </div>

          {/* Shimmer loaders to look extremely secure and professional */}
          <div className="w-full bg-secondary/40 border border-border/40 p-4 rounded-xl flex items-center gap-3 text-left">
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-foreground block">Downloading secure question bank...</span>
              <span className="text-muted-foreground text-[10px]">Validating RLS cryptographic permissions</span>
            </div>
          </div>

          <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-2">
            <Monitor className="w-3.5 h-3.5" />
            Lockdown Session: {slug.toUpperCase()}-SESSION-ID
          </span>
        </Container>
      </Section>
    </div>
  );
}
