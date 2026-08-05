export interface MegaMenuLink {
  name: string;
  description: string;
  path: string;
}

export interface MegaMenuCategory {
  heading: string;
  links: MegaMenuLink[];
}

export const navigationContent = {
  megaMenu: [
    {
      heading: "Contests",
      links: [
        { name: "Civil Services Elite", description: "UPSC Prelims & Mains replicas", path: "/contests/upsc-elite" },
        { name: "Engineering Apex", description: "IIT JEE Advanced adaptive arenas", path: "/contests/jee-advanced" },
        { name: "Medical Prime", description: "NEET UG high-fidelity contests", path: "/contests/neet-prime" },
        { name: "All Competitions", description: "Browse our active 13+ arenas", path: "/contests" },
      ],
    },
    {
      heading: "Platform Hub",
      links: [
        { name: "National Standings", description: "Inspect verified aspirant ratings", path: "/leaderboard" },
        { name: "Rewards Arena", description: "Achievement badges & certificates", path: "/rewards" },
        { name: "Credit Pricing", description: "Entry bundles & package tiers", path: "/pricing" },
        { name: "Help Center", description: "Platform guide & support desks", path: "/help" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { name: "About Rankers", description: "Platform mission, vision & values", path: "/about" },
        { name: "Prestige Blog", description: "Examination strategy & announcements", path: "/blog" },
        { name: "Contact Desk", description: "Inquiries & office coordinates", path: "/contact" },
        { name: "Careers Hub", description: "Join our core engineering team", path: "/careers" },
      ],
    },
  ] as MegaMenuCategory[],
  searchPopularTags: ["UPSC CSE", "JEE Advanced", "NEET UG", "CAT", "GATE", "Percentiles", "Refund Policy"],
};
