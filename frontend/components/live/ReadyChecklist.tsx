"use client";

import * as React from "react";
import { Checkbox, Card } from "../ui";
import { cn } from "@/lib/utils";

interface ReadyChecklistProps {
  onStatusChange: (isReady: boolean) => void;
  className?: string;
}

export function ReadyChecklist({ onStatusChange, className }: ReadyChecklistProps) {
  const [readInstructions, setReadInstructions] = React.useState(false);
  const [agreeRules, setAgreeRules] = React.useState(false);
  const [understandPolicy, setUnderstandPolicy] = React.useState(false);
  const [readyBegin, setReadyBegin] = React.useState(false);

  React.useEffect(() => {
    const ready = readInstructions && agreeRules && understandPolicy && readyBegin;
    onStatusChange(ready);
  }, [readInstructions, agreeRules, understandPolicy, readyBegin, onStatusChange]);

  const items = [
    {
      id: "instr",
      label: "I have read and fully understood the championship structure and timings guidelines.",
      checked: readInstructions,
      onChange: setReadInstructions
    },
    {
      id: "rules",
      label: "I agree to all competitive examination rules, marking penalties, and guidelines.",
      checked: agreeRules,
      onChange: setAgreeRules
    },
    {
      id: "anti-cheat",
      label: "I understand the proctoring anti-cheating policy and agree to webcam audits and screen lockdowns.",
      checked: understandPolicy,
      onChange: setUnderstandPolicy
    },
    {
      id: "ready",
      label: "I am ready to begin and request activation of the locked examination interface.",
      checked: readyBegin,
      onChange: setReadyBegin
    }
  ];

  return (
    <Card variant="solid" className={cn("border border-border/40 p-5 rounded-2xl bg-card/25 text-left flex flex-col gap-4", className)}>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block border-b border-border/20 pb-3">
        Candidate Declarations & Confirmations
      </span>

      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <label key={it.id} className="flex items-start gap-3 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors py-1 select-none">
            <input
              type="checkbox"
              checked={it.checked}
              onChange={(e) => it.onChange(e.target.checked)}
              className="mt-0.5 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span>{it.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}
export default ReadyChecklist;
