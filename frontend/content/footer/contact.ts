export interface ContactChannel {
  id: string;
  name: string;
  email: string;
  description: string;
}

export interface ContactContent {
  title: string;
  intro: string;
  channels: ContactChannel[];
}

export const contactContent: ContactContent = {
  title: "Contact Our Desk",
  intro: "Submit your query using the secure form, or reach out directly to our designated support channels.",
  channels: [
    { id: "support", name: "Aspirant Support", email: "support@rankersleague.com", description: "Exam anomalies, verification issues, or deposit assistance." },
    { id: "sales", name: "Institutional Partnerships", email: "partners@rankersleague.com", description: "B2B solutions, academic licenses, or custom exam replication." },
    { id: "business", name: "Business Desk", email: "biz@rankersleague.com", description: "Commercial sponsorships, press opportunities, and corporate alliances." }
  ]
};
