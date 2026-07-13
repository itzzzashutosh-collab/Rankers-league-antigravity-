export interface FilterOption {
  value: string;
  label: string;
}

export const timeFilters: FilterOption[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "overall", label: "Overall" }
];

export const regionFilters: FilterOption[] = [
  { value: "india", label: "India 🇮🇳" },
  { value: "international", label: "International 🌍" },
  { value: "global", label: "Global 🌐" }
];

export const viewFilters: FilterOption[] = [
  { value: "10", label: "Top 10" },
  { value: "20", label: "Top 20" },
  { value: "30", label: "Top 30" },
  { value: "50", label: "Top 50" },
  { value: "100", label: "Top 100" },
  { value: "250", label: "Top 250" },
  { value: "500", label: "Top 500" }
];
