export interface LegalSection {
  title: string;
  lastUpdated: string;
  sections: {
    heading: string;
    text: string;
  }[];
}

export const legalContent: Record<string, LegalSection> = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Information We Collect", text: "We collect personal metrics such as names, validated email addresses, billing descriptors, and unique device environmental identifiers. During examinations, the browser-lockdown sandbox captures focus states and active monitors list to prevent cheating." },
      { heading: "How We Use Your Data", text: "Data is utilized strictly to verify candidate identities, generate merit certificates, and resolve grading anomalies. We do not sell user data to advertising entities." },
      { heading: "Security & Encryption", text: "Sensitive info, including bank details and identity credentials, is stored using high-grade AES-256 database encryption. Wallet balances and ledger sheets undergo SHA-256 integrity audits." }
    ]
  },
  terms: {
    title: "Terms & Conditions",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Platform Usage", text: "By accessing Ranker's League, you agree to comply with standard competitive guidelines. All accounts must correspond to a single, verified biological candidate." },
      { heading: "Account Security", text: "Aspirants are solely responsible for maintaining the confidentiality of their sessions. Secondary logins during active championships are blocked automatically." },
      { heading: "Intellectual Property", text: "All championship questions, grading algorithms, and admit card coordinates are the proprietary intellectual property of Ranker's League." }
    ]
  },
  "honor-code": {
    title: "Aspirant Honor Code",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Academic Integrity", text: "You pledge to solve all exams independently. No consultancies, external reference catalogs, or secondary screens are permitted during live examinations." },
      { heading: "Identity Authenticity", text: "You certify that your profile information (name, qualification records, exam categories) represents your true biological details without modifications." },
      { heading: "Cheating Countermeasures", text: "Active proctored examinations enforce strict sandbox parameters. Bypassing focus containment or swiping tabs triggers immediate investigation." }
    ]
  },
  "verification-terms": {
    title: "Verification Terms & Agreements",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Identity Validation", text: "Prize transfers and national merit listings require completing Level 1 & Level 2 KYC verification. Any forged identification document triggers profile bans." },
      { heading: "Public Standing Verification", text: "Ranker's League public standings and score metrics can be queried by verified academic institutions. You consent to sharing verified percentile records." },
      { heading: "Certificate Verifiability", text: "Issued merit certificates feature cryptographic validation hashes and QR indices. Forging digital credentials nullifies all associated rewards." }
    ]
  },
  "refund-policy": {
    title: "Refund Policy",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Contest Cancellations", text: "If a championship is canceled or postponed by the platform administrators, the full entry fee credits are refunded back to the user's wallet immediately." },
      { heading: "Technical Fault Exemption", text: "In cases where verified technical failures on our server side prevent answer submission, candidates are eligible for full registration fee reversals." },
      { heading: "Wallet Withdrawals", text: "Deposited available balances and cash rewards can be withdrawn to bank accounts. Processing settlements require 3-5 business days." }
    ]
  },
  "cookie-policy": {
    title: "Cookie Policy",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Essential Cookies", text: "These cookies are vital for maintaining secure user sessions and preventing multiple device sign-ins during active examinations." },
      { heading: "Analytics & Monitoring", text: "We use performance analytics cookies to monitor page latency and optimize rendering speeds across different regions." },
      { heading: "Managing Preferences", text: "Users can block third-party analytics cookies via browser settings. Essential session caches, however, cannot be disabled without losing platform login capabilities." }
    ]
  },
  "community-guidelines": {
    title: "Community Guidelines",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Respectful Interactions", text: "Harassment, hate speech, or derogatory remarks directed at other candidates, educators, or staff are strictly forbidden in public forums and dashboards." },
      { heading: "Zero Impersonation Tolerance", text: "Creating secondary accounts to inflate scores, falsify leaderboard listings, or copy profiles is a severe guideline violation." },
      { heading: "Reporting & Safety", text: "Candidates can flag inappropriate activity. Our security team reviews cases and applies penalties up to complete hardware/IP bans." }
    ]
  },
  "fair-competition-policy": {
    title: "Fair Competition Policy",
    lastUpdated: "July 01, 2026",
    sections: [
      { heading: "Integrity Standards", text: "We guarantee an identical evaluation environment for every candidate. Mock simulators execute strict timers and lock down focus controls." },
      { heading: "Cheating Detection Algorithms", text: "Our systems run behavioral analytics, scanning for abnormally fast answers, background clipboard copying, and screen sharing flags." },
      { heading: "Appeals & Disqualifications", text: "If flagged for anomalies, candidates receive a review notice. They can appeal with detailed logs within 48 hours before final grades are locked." }
    ]
  }
};
