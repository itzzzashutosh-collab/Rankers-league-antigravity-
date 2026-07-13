"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { SelectField } from "../ui";

interface ContestSortProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function ContestSort({ value, onChange, className }: ContestSortProps) {
  const options = [
    { value: "date", label: "Date: Scheduled Soonest" },
    { value: "newest", label: "Date: Recently Added" },
    { value: "prize-desc", label: "Rewards: Highest First" },
    { value: "fee-asc", label: "Entry Fee: Lowest First" },
    { value: "fee-desc", label: "Entry Fee: Highest First" },
    { value: "closing-soon", label: "Deadline: Closing Soonest" },
    { value: "participants-desc", label: "Popular: Most Enrolled" },
  ];

  return (
    <div className={className}>
      <SelectField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-64 border-border/80"
        options={options}
        label=""
      />
    </div>
  );
}
export default ContestSort;
