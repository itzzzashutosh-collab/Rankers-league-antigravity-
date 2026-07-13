"use client";

import * as React from "react";
import { ExamQuestion } from "../../types/exam";
import { cn } from "@/lib/utils";

interface OptionGroupProps {
  question: ExamQuestion;
  selectedLanguage: string;
  response: string | string[] | Record<string, string> | undefined;
  onChange: (val: string | string[] | Record<string, string> | undefined) => void;
  disabled?: boolean;
}

export function OptionGroup({
  question,
  selectedLanguage,
  response,
  onChange,
  disabled = false,
}: OptionGroupProps) {
  // 1. Single Choice & Assertion Reason
  if (question.type === "single_choice" || question.type === "assertion_reason") {
    const options = question.options || [];
    return (
      <div className="flex flex-col gap-3 text-left">
        {options.map((opt) => {
          const isSelected = response === opt.id;
          return (
            <label
              key={opt.id}
              className={cn(
                "p-4 rounded-xl border border-border/60 hover:border-primary/30 bg-card/25 transition-all duration-200 cursor-pointer flex items-start gap-3 select-none",
                isSelected && "border-primary/40 bg-primary/5 text-primary shadow-sm"
              )}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt.id}
                checked={isSelected}
                onChange={() => onChange(opt.id)}
                disabled={disabled}
                className="mt-0.5 border-border focus:ring-primary accent-primary"
              />
              <div className="text-xs font-semibold leading-relaxed">
                <span className="font-bold mr-1.5">{opt.id}.</span>
                {opt.text[selectedLanguage] || opt.text["English"]}
              </div>
            </label>
          );
        })}
      </div>
    );
  }

  // 2. Multiple Choice
  if (question.type === "multiple_choice") {
    const options = question.options || [];
    const currentResponses = (response as string[]) || [];

    const handleCheckboxChange = (optionId: string, checked: boolean) => {
      if (checked) {
        onChange([...currentResponses, optionId]);
      } else {
        onChange(currentResponses.filter((x) => x !== optionId));
      }
    };

    return (
      <div className="flex flex-col gap-3 text-left">
        {options.map((opt) => {
          const isSelected = currentResponses.includes(opt.id);
          return (
            <label
              key={opt.id}
              className={cn(
                "p-4 rounded-xl border border-border/60 hover:border-primary/30 bg-card/25 transition-all duration-200 cursor-pointer flex items-start gap-3 select-none",
                isSelected && "border-primary/40 bg-primary/5 text-primary shadow-sm"
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleCheckboxChange(opt.id, e.target.checked)}
                disabled={disabled}
                className="mt-0.5 border-border text-primary focus:ring-primary accent-primary rounded"
              />
              <div className="text-xs font-semibold leading-relaxed">
                <span className="font-bold mr-1.5">{opt.id}.</span>
                {opt.text[selectedLanguage] || opt.text["English"]}
              </div>
            </label>
          );
        })}
      </div>
    );
  }

  // 3. Numerical & Integer
  if (question.type === "numerical") {
    return (
      <div className="flex flex-col gap-3 text-left max-w-sm">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Candidate Numerical Value Input:
        </label>
        <input
          type="text"
          placeholder="Enter numeric response (e.g. 1.25)"
          value={typeof response === "string" ? response : ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="p-3 bg-secondary/35 border border-border/80 focus:border-primary/30 rounded-xl outline-none text-xs font-mono font-bold text-foreground"
        />
        <span className="text-[9px] text-muted-foreground">
          ⚠️ Use keyboard numbers. Standard decimal scaling format supported.
        </span>
      </div>
    );
  }

  // 4. Matrix Match
  if (question.type === "matrix_match") {
    const leftRows = question.matrixLeft || [];
    const rightCols = question.matrixRight || [];
    const mapping = (response as Record<string, string>) || {};

    const handleSelectMatch = (rowId: string, colId: string) => {
      onChange({
        ...mapping,
        [rowId]: colId,
      });
    };

    return (
      <div className="flex flex-col gap-4 text-left border border-border/40 p-4 rounded-xl bg-card/25">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 border-b border-border/20 pb-2">
          Establish Mapping Grid (Row Matcher)
        </span>
        <div className="flex flex-col gap-3">
          {leftRows.map((row) => (
            <div key={row.id} className="grid grid-cols-2 gap-4 items-center border-b border-border/10 pb-2 last:border-b-0 last:pb-0">
              <span className="text-xs font-semibold text-foreground">
                <strong className="mr-1.5">{row.id}.</strong>
                {row.text[selectedLanguage] || row.text["English"]}
              </span>

              <select
                value={mapping[row.id] || ""}
                onChange={(e) => handleSelectMatch(row.id, e.target.value)}
                disabled={disabled}
                className="p-2 bg-secondary border border-border/80 rounded-lg text-xs font-semibold outline-none text-foreground"
              >
                <option value="">-- Match Column II --</option>
                {rightCols.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.id} ({col.text[selectedLanguage] || col.text["English"]})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Subjective (Detailed Paragraph Description)
  if (question.type === "subjective") {
    return (
      <div className="flex flex-col gap-3 text-left">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Candidate Subjective response:
        </label>
        <textarea
          rows={6}
          placeholder="Type your explanation parameters here..."
          value={typeof response === "string" ? response : ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="p-4 bg-secondary/35 border border-border/80 focus:border-primary/30 rounded-xl outline-none text-xs font-medium text-foreground leading-relaxed resize-y min-h-[120px]"
        />
      </div>
    );
  }

  // 6. Programming Workspaces
  if (question.type === "programming") {
    return (
      <div className="flex flex-col gap-3 text-left">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-sans">
          Proctored Code Console (Python Workspace)
        </label>
        <textarea
          rows={10}
          placeholder="# Write code function here\ndef sum_array(arr):\n    # Return parameters\n    return sum(arr)"
          value={typeof response === "string" ? response : ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="p-4 bg-secondary/30 border border-border/80 focus:border-primary/20 rounded-xl outline-none font-mono text-xs leading-relaxed resize-y text-primary min-h-[220px]"
        />
      </div>
    );
  }

  return null;
}
export default OptionGroup;
