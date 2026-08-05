export interface LegalSection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  iconName: string;
  category: "Contests & Gameplay" | "Finance & Taxes" | "Platform & Security" | "Conduct & Ethics";
  shortDescription: string;
  lastUpdated: string;
  version: string;
  readTime: string;
  sections: LegalSection[];
}

export const legalCategories = [
  "All",
  "Contests & Gameplay",
  "Finance & Taxes",
  "Platform & Security",
  "Conduct & Ethics",
] as const;

export const legalDocuments: LegalDocument[] = [
  // ── 1. Contest Rules & Regulations ───────────────────────────────────────
  {
    slug: "contest-rules",
    title: "Contest Rules & Regulations",
    iconName: "FileText",
    category: "Contests & Gameplay",
    shortDescription: "Official governing rules, timing protocols, submission parameters, and scoring mechanics across all mock contests.",
    lastUpdated: "August 2026",
    version: "v3.1",
    readTime: "6 min read",
    sections: [
      {
        title: "1. Overview & Standard Competition Environment",
        content: "Ranker's League hosts standardized, proctored mock examinations designed to replicate official national entrance exams (such as JEE, NEET, UPSC, CAT, and GATE). All registered participants must adhere to these governing rules throughout the entire examination window.",
        bulletPoints: [
          "Every contest starts and ends at the exact scheduled time across all time zones.",
          "Questions are displayed under active proctoring lockdown to ensure zero external assistance.",
          "Submissions after the scheduled timer cutoff are automatically processed by the system."
        ]
      },
      {
        title: "2. Scoring & Marking Parameters",
        content: "Raw scores are calculated strictly according to official exam patterns. Correct answers earn positive weightage, while incorrect responses incur negative marks where applicable.",
        bulletPoints: [
          "JEE & NEET: Standard +4 for correct, -1 for incorrect responses.",
          "UPSC GS-1: +2 for correct, -0.66 for incorrect responses.",
          "Unattempted questions receive zero penalty."
        ]
      },
      {
        title: "3. Disqualification & Technical Offenses",
        content: "Any attempt to alter browser focus, run automated scrapers, inject scripts, or utilize AI assistance will trigger automated flag warnings and immediate disqualification without fee refunds."
      }
    ]
  },

  // ── 2. Fair Play Policy ───────────────────────────────────────────────────
  {
    slug: "fair-play",
    title: "Fair Play Policy",
    iconName: "Scale",
    category: "Conduct & Ethics",
    shortDescription: "Our zero-tolerance framework guaranteeing equal opportunity, anti-collusion, and genuine rank verification for every student.",
    lastUpdated: "August 2026",
    version: "v2.8",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Commitment to Absolute Meritocracy",
        content: "Ranker's League exists to empower honest students. Our Fair Play framework ensures that every AIR (All India Rank) certificate and reward earned reflects true individual intellectual merit.",
        bulletPoints: [
          "Single-Account Mandate: Each participant is allowed exactly one verified user account.",
          "No Shared Devices: Multiple simultaneous logins during an active contest are prohibited.",
          "Clean Environment: No secondary screens, communication apps, or remote desktop tools."
        ]
      },
      {
        title: "2. Anti-Collusion Enforcement",
        content: "Our system analyzes answer submission timestamp patterns and choice correlations between candidates. Coordinated group submissions or answer sharing will result in permanent banishment of all involved accounts."
      }
    ]
  },

  // ── 3. Prize Distribution Policy ─────────────────────────────────────────
  {
    slug: "prize-distribution",
    title: "Prize Distribution Policy",
    iconName: "Trophy",
    category: "Finance & Taxes",
    shortDescription: "Transparent guidelines on how contest prize pools, rank rewards, credit cashbacks, and physical trophies are distributed.",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "7 min read",
    sections: [
      {
        title: "1. Prize Allocation Architecture",
        content: "Prize pools are calculated using our audited distribution matrix. The exact rank payout table is published on every contest details page prior to registration.",
        bulletPoints: [
          "Rank 1 Toppers receive top-tier cash rewards plus physical trophies/medals.",
          "Top 1%–10% percentile candidates receive tiered cash rewards directly credited to their wallet.",
          "Top 20% candidates earn credit cashbacks for future arena entries."
        ]
      },
      {
        title: "2. Audit & Verification Period",
        content: "All contest rankings undergo a 2-hour automated and manual proctor audit before prizes are released to ensure standings are 100% verified."
      }
    ]
  },

  // ── 4. Refund Policy ──────────────────────────────────────────────────────
  {
    slug: "refund",
    title: "Refund Policy",
    iconName: "RotateCcw",
    category: "Finance & Taxes",
    shortDescription: "Clear terms on entry fee refunds, contest cancellations, technical disruptions, and wallet credit reversals.",
    lastUpdated: "August 2026",
    version: "v2.1",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Contest Cancellation & Rescheduling",
        content: "If a scheduled contest is cancelled or postponed by Ranker's League due to server disruption or administrative reasons, 100% of the entry fee credits will be credited back to every registered candidate's wallet immediately.",
        bulletPoints: [
          "Automatic 100% wallet credit refund within 15 minutes of cancellation.",
          "No manual ticket raising required for platform-driven cancellations."
        ]
      },
      {
        title: "2. Candidate-Initiated Withdrawals",
        content: "Candidates can un-register from an upcoming contest up to 1 hour before the scheduled start time to receive a full wallet credit refund. Un-registrations within 60 minutes of start time are non-refundable."
      }
    ]
  },

  // ── 5. Withdrawal Policy ──────────────────────────────────────────────────
  {
    slug: "withdrawal",
    title: "Withdrawal Policy",
    iconName: "Wallet",
    category: "Finance & Taxes",
    shortDescription: "Step-by-step rules, minimum thresholds, processing timelines, and banking security for withdrawing prize winnings.",
    lastUpdated: "August 2026",
    version: "v2.5",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Withdrawal Eligibility",
        content: "Only settled prize winnings stored in your 'Available Balance' are eligible for instant bank/UPI withdrawal. Deposit balances reserved for contest entry fees cannot be withdrawn.",
        bulletPoints: [
          "Minimum withdrawal amount: ₹100 INR.",
          "Maximum daily instant withdrawal limit: ₹50,000 INR.",
          "Payout methods supported: Instant UPI (GPay, PhonePe, Paytm), IMPS, NEFT."
        ]
      },
      {
        title: "2. KYC & Account Verification",
        content: "For cumulative withdrawals exceeding ₹10,000 INR, Indian tax law requires PAN card verification and bank account details matching the registered student profile."
      }
    ]
  },

  // ── 6. Tax & TDS Policy ───────────────────────────────────────────────────
  {
    slug: "tax-tds",
    title: "Tax & TDS Policy",
    iconName: "Receipt",
    category: "Finance & Taxes",
    shortDescription: "Compliance with Section 194BA of the Indian Income Tax Act regarding 30% TDS deduction on net contest winnings.",
    lastUpdated: "August 2026",
    version: "v2.2",
    readTime: "6 min read",
    sections: [
      {
        title: "1. Statutory TDS Mandate (Section 194BA)",
        content: "In accordance with Indian tax laws, TDS (Tax Deducted at Source) at the flat rate of 30% is deducted from net winnings at the time of withdrawal or financial year end.",
        bulletPoints: [
          "TDS applies strictly to Net Winnings (Total Winnings minus Total Entry Fees paid).",
          "Form 16A certificates are issued quarterly to all verified candidates for IT return filing.",
          "No TDS is deducted on entry fee credits or non-winning wallet balances."
        ]
      }
    ]
  },

  // ── 7. Contest Eligibility Policy ─────────────────────────────────────────
  {
    slug: "eligibility",
    title: "Contest Eligibility Policy",
    iconName: "UserCheck",
    category: "Contests & Gameplay",
    shortDescription: "Age criteria, academic qualifications, regional participation rules, and verification requirements for contestants.",
    lastUpdated: "August 2026",
    version: "v1.9",
    readTime: "4 min read",
    sections: [
      {
        title: "1. General Eligibility Criteria",
        content: "Ranker's League contests are open to students, competitive exam aspirants, and lifelong learners globally unless explicitly restricted by a specific contest's regulations.",
        bulletPoints: [
          "School & Olympiad Contests: Open to students in Classes 6 through 12.",
          "UG Entrance (JEE/NEET/CLAT/BITSAT): Open to Class 11, Class 12, and dropper candidates.",
          "PG & Govt Exams (UPSC/CAT/GATE/SSC): Open to undergraduates, graduates, and working professionals."
        ]
      }
    ]
  },

  // ── 8. Tie Breaking Policy ────────────────────────────────────────────────
  {
    slug: "tie-breaking",
    title: "Tie Breaking Policy",
    iconName: "GitCommit",
    category: "Contests & Gameplay",
    shortDescription: "Mathematical algorithm used to determine exact standings when two or more contestants achieve identical raw scores.",
    lastUpdated: "August 2026",
    version: "v2.0",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Standard Resolution Order",
        content: "When two or more candidates finish a contest with the same raw marks, ties are broken sequentially using the following deterministic criteria:",
        bulletPoints: [
          "1. Higher Accuracy Percentage: Candidate with fewer incorrect attempts ranks higher.",
          "2. Subject Priority Marks: Higher score in key subjects (e.g. Math in JEE, Bio in NEET).",
          "3. Time Efficiency: Candidate who completed the examination in less total duration.",
          "4. Hard-Question Score: Higher marks earned on questions flagged as 'Expert' difficulty."
        ]
      }
    ]
  },

  // ── 9. Anti-Cheating Policy ───────────────────────────────────────────────
  {
    slug: "anti-cheating",
    title: "Anti-Cheating Policy",
    iconName: "ShieldAlert",
    category: "Conduct & Ethics",
    shortDescription: "Browser lockdown technology, tab-switch monitors, AI behavior analytics, and penalties for illicit assistance.",
    lastUpdated: "August 2026",
    version: "v3.2",
    readTime: "6 min read",
    sections: [
      {
        title: "1. Proctoring Lockdown Architecture",
        content: "Ranker's League enforces active browser sandbox lockdown during live contest sessions to prevent unfair advantage.",
        bulletPoints: [
          "Tab-Switch Detection: More than 3 window focus losses results in instant contest termination.",
          "Copy-Paste Blocking: Clipboard operations are strictly disabled inside the test window.",
          "AI Response Analytics: Unrealistic question solving speeds (e.g. 1 second per complex numerical) trigger automatic flag for human review."
        ]
      }
    ]
  },

  // ── 10. Honor Code ────────────────────────────────────────────────────────
  {
    slug: "honor-code",
    title: "Honor Code",
    iconName: "Award",
    category: "Conduct & Ethics",
    shortDescription: "The pledge taken by every candidate to maintain academic honesty, integrity, and sportsmanship in the arena.",
    lastUpdated: "August 2026",
    version: "v1.5",
    readTime: "3 min read",
    sections: [
      {
        title: "1. The Ranker's League Pledge",
        content: "By registering on Ranker's League, every student pledges: 'I will solve all examination questions entirely through my own knowledge and effort, without seeking external aid, AI tools, or shared communication. I compete honorably to measure my true caliber.'",
        bulletPoints: [
          "Pledge honesty in every test submission.",
          "Respect fellow competitors on national leaderboards.",
          "Report any discovered system vulnerabilities responsibly to support."
        ]
      }
    ]
  },

  // ── 11. Community Guidelines ──────────────────────────────────────────────
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    iconName: "Users",
    category: "Conduct & Ethics",
    shortDescription: "Standards for respectful communication across discussion forums, mentor chats, and community study rooms.",
    lastUpdated: "August 2026",
    version: "v2.1",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Respectful & Inclusive Environment",
        content: "Ranker's League community spaces are dedicated to academic growth. Hate speech, harassment, spam, self-promotion, or abusive language in mentor chats or leaderboards will result in immediate chat ban.",
        bulletPoints: [
          "Be supportive of fellow aspirants during exam preparation.",
          "No sharing of unauthorized exam question leaks or copyrighted books.",
          "Keep all discussions focused on academics, strategy, and problem solving."
        ]
      }
    ]
  },

  // ── 12. Code of Conduct ───────────────────────────────────────────────────
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    iconName: "CheckSquare",
    category: "Conduct & Ethics",
    shortDescription: "Expected behavior standards for students, mentors, platform administrators, and community moderators.",
    lastUpdated: "August 2026",
    version: "v2.0",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Professional Standards",
        content: "Both staff and platform users must maintain the highest standards of professional conduct, ensuring safety, privacy, and equality for all participants across India and globally."
      }
    ]
  },

  // ── 13. Terms & Conditions ────────────────────────────────────────────────
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    iconName: "FileCheck",
    category: "Platform & Security",
    shortDescription: "The master legal agreement governing your access to and use of Ranker's League website, apps, and services.",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "10 min read",
    sections: [
      {
        title: "1. Agreement to Terms",
        content: "By creating an account or using Ranker's League, you agree to be bound by these Terms and Conditions. If you do not agree, you must refrain from using the platform.",
        bulletPoints: [
          "Accounts are non-transferable and personal to the registered student.",
          "Ranker's League reserves the right to modify services, contest structures, or pricing with prior notification.",
          "Intellectual Property: All test questions, solutions, and graphics belong exclusively to Ranker's League."
        ]
      }
    ]
  },

  // ── 14. Privacy Policy ────────────────────────────────────────────────────
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    iconName: "Lock",
    category: "Platform & Security",
    shortDescription: "How we collect, protect, encrypt, and handle your personal data, exam scores, and payment credentials.",
    lastUpdated: "August 2026",
    version: "v3.5",
    readTime: "8 min read",
    sections: [
      {
        title: "1. Data Collection & Usage",
        content: "We collect minimal personal data required to deliver our educational services, including name, email address, phone number, primary target exam, and performance scores.",
        bulletPoints: [
          "We NEVER sell student personal data to third-party advertisers.",
          "Bank/UPI details are tokenized and processed via PCI-DSS compliant payment gateways.",
          "Performance data is aggregated anonymously for national percentile benchmarking."
        ]
      }
    ]
  },

  // ── 15. Cookie Policy ─────────────────────────────────────────────────────
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    iconName: "Cookie",
    category: "Platform & Security",
    shortDescription: "Information on essential cookies, performance tracking, and how to manage your web browser preferences.",
    lastUpdated: "August 2026",
    version: "v1.8",
    readTime: "3 min read",
    sections: [
      {
        title: "1. Use of Cookies",
        content: "We use essential cookies to maintain secure login sessions, remember user theme preferences, and protect active contest states against disconnection."
      }
    ]
  },

  // ── 16. Security Policy ───────────────────────────────────────────────────
  {
    slug: "security",
    title: "Security Policy",
    iconName: "Shield",
    category: "Platform & Security",
    shortDescription: "Encryption standards, SSL/TLS protocols, row-level database security, and bug bounty vulnerability reporting.",
    lastUpdated: "August 2026",
    version: "v2.9",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Platform Infrastructure Security",
        content: "Our infrastructure runs on enterprise cloud servers protected by end-to-end AES-256 encryption, Web Application Firewalls (WAF), and automated DDoS mitigation.",
        bulletPoints: [
          "All data in transit is encrypted using TLS 1.3.",
          "Supabase Row Level Security (RLS) ensures candidates can only access authorized wallet & account records.",
          "Responsible Vulnerability Disclosure: Report security issues to security@rankersleague.com for bounty rewards."
        ]
      }
    ]
  },

  // ── 17. Responsible Competition Policy ────────────────────────────────────
  {
    slug: "responsible-competition",
    title: "Responsible Competition Policy",
    iconName: "HeartHandshake",
    category: "Conduct & Ethics",
    shortDescription: "Promoting healthy study habits, time limits, student mental wellness, and anti-burnout guidelines.",
    lastUpdated: "August 2026",
    version: "v1.4",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Student Mental Health & Balance",
        content: "Competitive prep should build confidence, not anxiety. We encourage healthy study breaks, adequate sleep, and positive learning mindset.",
        bulletPoints: [
          "Daily contest participation limits to prevent study burnout.",
          "Access to free academic stress management articles and mentor guidance.",
          "Option to self-exclude or lock contest entries temporarily during board exams."
        ]
      }
    ]
  },

  // ── 18. Account Suspension Policy ────────────────────────────────────────
  {
    slug: "account-suspension",
    title: "Account Suspension Policy",
    iconName: "UserX",
    category: "Platform & Security",
    shortDescription: "Conditions under which user accounts may be warned, temporarily locked, or permanently terminated.",
    lastUpdated: "August 2026",
    version: "v2.0",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Grounds for Account Action",
        content: "Account locks occur only in cases of confirmed Fair Play violations, multiple account creation, fraudulent payment chargebacks, or severe harassment.",
        bulletPoints: [
          "First Minor Violation: Warning notice + 7-day contest temporary pause.",
          "Severe Cheating / Fraud: Permanent account ban & forfeiture of illicit winnings.",
          "Suspended users receive written rationale via email."
        ]
      }
    ]
  },

  // ── 19. Appeal Policy ─────────────────────────────────────────────────────
  {
    slug: "appeal",
    title: "Appeal Policy",
    iconName: "HelpCircle",
    category: "Platform & Security",
    shortDescription: "Formal procedure for candidates to challenge disqualifications, score discrepancies, or account suspensions.",
    lastUpdated: "August 2026",
    version: "v1.7",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Filing an Appeal",
        content: "If you believe your contest result or account status was affected by technical error or unjust flagging, you may submit a formal appeal within 48 hours.",
        bulletPoints: [
          "Submit appeal ticket via the Support Desk with your contest Reference ID.",
          "Appeals are reviewed independently by our Senior Academic & Security Board.",
          "Resolution is delivered within 3 business days with complete technical log details."
        ]
      }
    ]
  },

  // ── 20. Contact & Legal Support ───────────────────────────────────────────
  {
    slug: "contact-support",
    title: "Contact & Legal Support",
    iconName: "Mail",
    category: "Platform & Security",
    shortDescription: "Direct contact channels for legal notices, regulatory inquiries, copyright claims, and privacy officers.",
    lastUpdated: "August 2026",
    version: "v1.0",
    readTime: "3 min read",
    sections: [
      {
        title: "1. Official Legal Contact Details",
        content: "For legal inquiries, statutory communications, compliance requests, or IP infringement notices, reach our dedicated legal team:",
        bulletPoints: [
          "Legal Desk Email: legal@rankersleague.com",
          "Privacy Officer Email: privacy@rankersleague.com",
          "Compliance Address: Ranker's League Legal Cell, Tech Park, New Delhi, India",
          "Response SLA: All formal legal communications are acknowledged within 24 hours."
        ]
      }
    ]
  }
];
