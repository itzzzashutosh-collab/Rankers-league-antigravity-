"use client";

import * as React from "react";
import { ExamQuestion } from "../../types/exam";
import { OptionGroup } from "./OptionGroup";
import { Card, Typography } from "../ui";
import { FileText, Cpu, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionPanelProps {
  question: ExamQuestion;
  selectedLanguage: string;
  response: string | string[] | Record<string, string> | undefined;
  onChange: (val: string | string[] | Record<string, string> | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function QuestionPanel({
  question,
  selectedLanguage,
  response,
  onChange,
  disabled = false,
  className,
}: QuestionPanelProps) {
  return (
    <div className={cn("flex flex-col gap-6 text-left h-full overflow-y-auto pr-2", className)}>
      
      {/* 1. Header label info */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 border border-primary/10 rounded uppercase tracking-wider select-none">
          Question {question.number}
        </span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest select-none">
          Type: {question.type.replace("_", " ")}
        </span>
      </div>

      {/* 2. Supporting Case-Study / Paragraph context */}
      {question.paragraph && (
        <Card variant="solid" className="bg-secondary/40 border border-border/40 p-4 rounded-xl leading-relaxed flex gap-3 items-start">
          <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block mb-1">
              Case Passage Context
            </span>
            <p className="text-xs text-muted-foreground">
              {question.paragraph[selectedLanguage] || question.paragraph["English"]}
            </p>
          </div>
        </Card>
      )}

      {/* 3. Question Statement */}
      <div className="flex flex-col gap-4">
        <Typography variant="body-large" className="font-bold text-foreground leading-relaxed">
          {question.questionText[selectedLanguage] || question.questionText["English"]}
        </Typography>

        {/* Supporting formula formula box */}
        {question.equation && (
          <div className="p-3 bg-secondary/50 border border-border/40 rounded-xl font-mono text-sm text-foreground w-fit flex items-center gap-2 select-all">
            <Calculator className="w-4 h-4 text-primary shrink-0" />
            <code>{question.equation}</code>
          </div>
        )}

        {/* Supporting Figures placeholder or layout */}
        {question.supportingImage && (
          <div className="max-w-md border border-border/45 rounded-xl overflow-hidden bg-card">
            <div className="h-40 bg-gradient-to-br from-secondary/50 to-secondary flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-widest">
              Diagram Schema Placeholder
            </div>
          </div>
        )}
      </div>

      {/* 4. Options Inputs Interface */}
      <div className="border-t border-border/20 pt-6 mt-2">
        <OptionGroup
          question={question}
          selectedLanguage={selectedLanguage}
          response={response}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

    </div>
  );
}
export default QuestionPanel;
