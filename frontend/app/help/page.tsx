"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Section,
  Typography,
  Card,
  Badge,
  InputField,
  Accordion,
} from "@/components/ui";
import { Search, HelpCircle, Mail, BookOpen } from "lucide-react";
import { faqContent, FaqItem } from "@/content/faq";

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filtered = React.useMemo(() => {
    return faqContent.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const accordionItems = React.useMemo(() => {
    return filtered.map((faq) => ({
      id: faq.id,
      title: faq.question,
      content: (
        <div>
          <p>{faq.answer}</p>
          <span className="inline-block mt-3 text-[9px] text-primary font-bold uppercase bg-primary/5 px-2 py-0.5 rounded">
            {faq.category}
          </span>
        </div>
      ),
    }));
  }, [filtered]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <Section radialGlow className="pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-12">
            <Badge variant="featured" className="self-center">
              Support Core
            </Badge>
            <Typography variant="display-l">Platform Help Center</Typography>
            <Typography variant="subtitle">
              Locate guides, policy structures, and operational instructions. Search our comprehensive database below.
            </Typography>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-8 text-left">
            {/* Search Input */}
            <div className="relative">
              <InputField
                type="search"
                placeholder="Search help topics (e.g. anti-cheat, entry fee, refunds)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10"
              />
            </div>

            {/* Accordion FAQ */}
            <div>
              <Typography variant="h3" className="mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Frequently Answered Topics
              </Typography>
              {accordionItems.length > 0 ? (
                <Accordion items={accordionItems} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No matching topics located. Please try a different query phrase.
                </p>
              )}
            </div>

            {/* Support Desk Callout */}
            <Card variant="glass" className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground text-sm">Need Direct Desk Assistance?</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Our support crew handles standing disputes and credit refunds.</p>
                </div>
              </div>
              <a href="/contact" className="text-xs font-semibold text-primary hover:underline shrink-0">
                Submit Help Ticket &rarr;
              </a>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
