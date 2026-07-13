export interface CompanyInfo {
  name: string;
  slogan: string;
  foundingYear: number;
  locations: string[];
  headquarters: string;
  totalAspirantsEvaluated: number;
}

export const companyContent: CompanyInfo = {
  name: "Ranker's League",
  slogan: "Excellence through High-Fidelity Replication",
  foundingYear: 2024,
  locations: ["Bengaluru, India", "New Delhi, India"],
  headquarters: "Bengaluru, India",
  totalAspirantsEvaluated: 100000
};
