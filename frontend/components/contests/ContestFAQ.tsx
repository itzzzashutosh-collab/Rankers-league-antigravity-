"use client";

import * as React from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { FAQItem } from "../../types/contests";
import { InputField, Card } from "../ui";
import { cn } from "@/lib/utils";

interface ContestFAQProps {
  faqs: FAQItem[];
  className?: string;
}

export function ContestFAQ({ faqs, className }: ContestFAQProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const filteredFaqs = React.useMemo(() => {
    if (!searchTerm) return faqs;
    const query = searchTerm.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
    );
  }, [faqs, searchTerm]);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Inline FAQ Search */}
      <div className="relative">
        <InputField
          type="text"
          placeholder="Filter frequently asked questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-border/80"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {/* Accordion Cards */}
      {filteredFaqs.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <Card
                key={idx}
                variant="solid"
                padding="none"
                className={cn(
                  "border border-border/40 hover:border-primary/25 transition-all duration-300 bg-card/30 overflow-hidden",
                  isExpanded && "border-primary/20 bg-card/60"
                )}
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-foreground focus:outline-none"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-primary shrink-0" />
                    {faq.question}
                  </span>
                  <span className="text-muted-foreground shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed animate-in slide-in-from-top-1 duration-200">
                    <p className="border-t border-border/20 pt-3">{faq.answer}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-xs bg-secondary/30 rounded-xl border border-dashed border-border">
          No FAQs match your search keyword.
        </div>
      )}
    </div>
  );
}
export default ContestFAQ;
