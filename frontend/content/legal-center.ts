export interface LegalSection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface VersionLog {
  version: string;
  date: string;
  summary: string;
}

export interface LegalDocument {
  slug: string;
  title: string;
  titleHi?: string;
  iconName: string;
  category: "Contests & Gameplay" | "Finance & Taxes" | "Platform & Security" | "Conduct & Ethics";
  shortDescription: string;
  shortDescriptionHi?: string;
  lastUpdated: string;
  version: string;
  readTime: string;
  sections: LegalSection[];
  sectionsHi?: LegalSection[];
  versionHistory?: VersionLog[];
}

export const legalCategories = [
  "All",
  "Contests & Gameplay",
  "Finance & Taxes",
  "Platform & Security",
  "Conduct & Ethics",
] as const;

/** Alias mappings to resolve alternative URL slugs to primary document slugs */
export const slugAliasMap: Record<string, string> = {
  "refund-policy": "refund",
  "terms": "terms-and-conditions",
  "terms-of-service": "terms-and-conditions",
  "tax-policy": "tax-tds",
  "withdrawal-policy": "withdrawal",
  "contest-eligibility": "eligibility",
  "eligibility-policy": "eligibility",
  "eligibility": "eligibility",
  "security-policy": "security",
  "security": "security",
  "appeals": "appeal",
  "legal-support": "contact-support",
  "privacy": "privacy-policy",
  "responsible": "responsible-competition",
  "responsible-competition": "responsible-competition",
  "responsible-policy": "responsible-competition",
  "wallet-policy": "wallet",
  "payment-policy": "payment",
  "ip-policy": "intellectual-property",
  "intellectual-property": "intellectual-property",
  "copyright-policy": "copyright",
  "dmca": "copyright",
  "question-paper-policy": "question-paper",
  "question-paper": "question-paper",
  "ai-policy": "ai-usage",
  "ai-usage": "ai-usage",
  "grievance-policy": "grievance-redressal",
  "grievance-redressal": "grievance-redressal",
  "grievance": "grievance-redressal",
  "transparency-policy": "transparency",
  "transparency": "transparency",
  "cookie-policy": "cookie",
  "cookie": "cookie",
  "community-guidelines": "community-guidelines",
  "community": "community-guidelines",
  "code-of-conduct": "code-of-conduct",
  "conduct": "code-of-conduct",
  "honor-code": "code-of-conduct",
  "anti-cheating": "fair-play",
  "fair-competition-policy": "fair-play",
  "tie-breaking-policy": "tie-breaking",
  "tie-breaking": "tie-breaking",
};

/**
 * Scalable document resolver that checks primary slugs and aliases.
 * Adding new documents to legalDocuments automatically supports new routes without code changes!
 */
export function findLegalDocumentBySlug(slug: string): { doc: LegalDocument; index: number } | null {
  const canonicalSlug = slugAliasMap[slug] || slug;
  const index = legalDocuments.findIndex((d) => d.slug === canonicalSlug);
  if (index === -1) return null;
  return { doc: legalDocuments[index], index };
}

export const legalDocuments: LegalDocument[] = [
  // ── 1. Contest Rules & Regulations ───────────────────────────────────────
  {
    slug: "contest-rules",
    title: "Official Contest Rules & Regulations",
    titleHi: "आधिकारिक प्रतियोगिता नियम एवं विनियम (Official Contest Rules)",
    iconName: "FileText",
    category: "Contests & Gameplay",
    shortDescription: "Comprehensive governing framework, timing protocols, scoring mechanics, confirmation thresholds, proctoring rules, and prize payout policies.",
    shortDescriptionHi: "व्यापक शासकीय ढांचा, समय प्रोटोकॉल, अंकन प्रणाली, पुष्टि सीमा, प्रोक्टरिंग नियम और पुरस्कार भुगतान नीतियां।",
    lastUpdated: "August 2026",
    version: "v3.5",
    readTime: "15 min read",
    versionHistory: [
      { version: "v3.5", date: "August 2026", summary: "Added 70% minimum threshold confirmation rules, dynamic prize pool scaling, and 60s contest lock parameters." },
      { version: "v3.1", date: "August 2026", summary: "Added partial marking guidelines & live camera proctoring updates." },
      { version: "v3.0", date: "June 2026", summary: "Integrated Row-Level Security evaluation and instant rank audit." },
      { version: "v2.0", date: "January 2026", summary: "Initial multi-exam standardization release." }
    ],
    sections: [
      {
        title: "1. Overview & Competition Environment",
        content: "Ranker's League operates a standardized, proctored competitive examination platform designed to replicate official national entrance and recruitment exams (such as JEE Advanced, NEET UG, UPSC CSE, CAT, GATE, and CLAT). Every registered candidate participates under identical time limits, question sequences, and proctoring constraints.",
        bulletPoints: [
          "All mock contests start and end simultaneously across all time zones based on server clock synchronization.",
          "Questions are presented inside a sandboxed test interface to prevent unauthorized external aid.",
          "Submissions are evaluated using audited scoring algorithms adhering strictly to official exam marking schemes."
        ]
      },
      {
        title: "2. Key Legal & Platform Definitions",
        content: "For the purposes of these Contest Rules & Regulations, the following terms carry specific legal definitions:",
        bulletPoints: [
          "Contest: Any scheduled mock examination arena hosted on Ranker's League requiring registration.",
          "Participant / Candidate: A verified student or aspirant who has registered for an active contest.",
          "Entry Fee: The monetary consideration or wallet credits paid by a candidate to reserve a contest seat.",
          "Prize Pool: The total aggregated prize money allocated for distribution among top-ranking candidates.",
          "Minimum Participation Threshold: The mandatory 70% seat fill requirement needed for contest confirmation.",
          "Contest Lock: The automatic freeze executed 60 seconds prior to contest launch after which registrations close.",
          "Prize Ladder: The published rank-wise percentage payout structure specifying exact reward distribution.",
          "Winner Freeze: The post-contest audit state during which final standings are locked following proctor review."
        ]
      },
      {
        title: "3. Candidate Eligibility Parameters",
        content: "Participation in Ranker's League contests is open to students and competitive aspirants who satisfy the eligibility requirements specified for each examination stream:",
        bulletPoints: [
          "School & Olympiad Arenas: Open to students in Classes 6 through 12.",
          "UG Entrance Arenas (JEE / NEET / CLAT): Open to Class 11, Class 12, and dropper aspirants.",
          "PG & Govt Entrance Arenas (UPSC / CAT / GATE / SSC): Open to undergraduates, graduates, and working professionals.",
          "Candidates must possess a valid Mobile Number and Email Address for identity verification."
        ]
      },
      {
        title: "4. Registration Protocols & Seat Capacity",
        content: "Candidates must complete registration before the published deadline. Seat capacity for each contest arena is capped to maintain optimal server throughput and fair competitive ratios.",
        bulletPoints: [
          "Registrations close automatically 60 seconds before contest start time (Contest Lock).",
          "Candidates may un-register up to 60 minutes prior to launch to receive a 100% wallet credit refund.",
          "Un-registrations attempted within 60 minutes of launch are non-refundable."
        ]
      },
      {
        title: "5. Strict One Student One Entry Mandate",
        content: "To guarantee absolute meritocracy and prevent unfair manipulation, every participant is strictly restricted to ONE user account and ONE registration per contest session.",
        bulletPoints: [
          "Multiple registrations for the same contest by the same student using different accounts are strictly prohibited.",
          "Shared devices or simultaneous logins during an active contest will result in immediate disqualification.",
          "Violators face permanent account suspension and forfeiture of all accumulated wallet balances."
        ]
      },
      {
        title: "6. Contest Categories & Arena Structures",
        content: "Ranker's League hosts structured contest formats tailored for diverse preparation strategies:",
        bulletPoints: [
          "Mega Arenas: National-scale mock exams with large candidate pools and structured prize ladders.",
          "High Rollers: Top-tier competitive arenas for elite rankers with deep prize structures.",
          "Head-to-Head 1v1 Battles: Direct peer vs peer speed duels evaluating instant problem-solving accuracy.",
          "Practice Arenas: Non-monetary simulated tests for continuous skill assessment."
        ]
      },
      {
        title: "7. Contest Confirmation & 70% Threshold Rule",
        content: "To maintain competitive integrity and guarantee robust percentile distribution, every contest arena requires a Minimum Participation Threshold of 70% seat capacity prior to launch.",
        bulletPoints: [
          "If seat capacity reaches 70% or higher at the 60-second cutoff, the contest is CONFIRMED and launches as scheduled.",
          "If seat capacity is below 70% at the cutoff, the contest is automatically CANCELLED.",
          "In the event of cancellation, 100% of paid entry fees are instantly refunded to every candidate's wallet."
        ]
      },
      {
        title: "8. Dynamic Prize Pools & Prize Freeze Rules",
        content: "Prize pools on Ranker's League operate with dynamic transparency based on total confirmed entries:",
        bulletPoints: [
          "Dynamic Prize Pool: The total reward pool scales proportionately as additional seats are filled.",
          "Guaranteed Prize Pool: Specific featured arenas guarantee a fixed minimum prize pool regardless of fill rate.",
          "Prize Pool Freeze: At 60 seconds prior to launch (Contest Lock), the final Prize Pool is locked and published.",
          "No changes to the Prize Pool or Rank Payout Table can occur after the Prize Pool Freeze."
        ]
      },
      {
        title: "9. Contest Timings & Server Clock Synchronization",
        content: "All contest events, timer countdowns, and question transitions strictly follow the Ranker's League Master Server Clock (IST). Candidates must ensure reliable internet connectivity throughout the examination session."
      },
      {
        title: "10. Test Environment & Proctoring Lockdown",
        content: "During live contest sessions, the Ranker's League web application enforces automated proctoring security parameters:",
        bulletPoints: [
          "Fullscreen Focus Lock: Exiting full-screen mode or switching browser tabs triggers automated warnings.",
          "Tab-Switch Limit: Accumulating 3 tab-switch warnings results in immediate test termination.",
          "Clipboard Lockdown: Copying question text or pasting external content is completely disabled."
        ]
      },
      {
        title: "11. Contest Conduct & Integrity Code",
        content: "Participants must conduct themselves with absolute academic honesty. Seeking assistance from secondary devices, communication tools, private tutors, or AI language models during a live contest is strictly illegal."
      },
      {
        title: "12. Contest Completion & Response Processing",
        content: "Upon timer expiry, all answered, marked-for-review, and unattempted responses are automatically captured by the server and queued for scoring evaluation."
      },
      {
        title: "13. Result Declaration & Scorecard Transparency",
        content: "Preliminary scorecards displaying raw marks, subject breakdown, and time spent per question are published within 15 minutes of contest completion."
      },
      {
        title: "14. Final Rankings & Tie-Breaking Algorithms",
        content: "All-India Ranks (AIR) and percentiles are finalized using deterministic tie-breaking rules (higher accuracy percentage, subject weightage, time efficiency, and hard-question performance)."
      },
      {
        title: "15. Disqualification Conditions & Offenses",
        content: "Proctoring infractions, automated script usage, answer-sharing collusion, or payment fraud result in immediate candidate disqualification without entry fee refunds."
      },
      {
        title: "16. Ranker's League Statutory Platform Rights",
        content: "Ranker's League reserves the right to postpone contests due to technical downtime, audit suspicious score outliers, adjust seat caps prior to lock, and enforce fraud prevention measures."
      },
      {
        title: "17. Participant Obligations & Responsibilities",
        content: "Candidates are responsible for maintaining hardware performance, stable internet connections, valid account credentials, and compliance with platform terms."
      },
      {
        title: "18. Platform Commitments & Payout Guarantee",
        content: "Ranker's League guarantees 99.9% server uptime, transparent rank calculations, immediate wallet refund processing on cancelled tests, and instant UPI/bank withdrawal processing for verified prize winnings."
      },
      {
        title: "19. Policy Amendments & Notification Protocols",
        content: "Ranker's League may amend these Contest Rules periodically. Material updates will be published on the Legal Center hub with a 7-day prior notice tag."
      },
      {
        title: "20. Official Legal Contact Information",
        content: "For statutory communications, policy clarifications, or contest grievances, contact our legal desk: legal@rankersleague.com | Ranker's League Legal Cell, Tech Park, New Delhi, India."
      },
      {
        title: "21. Official Platform Governance Legal Disclaimer",
        content: "Ranker's League is an independent educational technology platform hosting skill-based competitive mock examinations. All entrance exam names (JEE, NEET, UPSC, CAT, GATE) belong to their respective statutory authorities."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं प्रतियोगिता वातावरण",
        content: "रैंकर्स लीग एक मानकीकृत, प्रोक्टर्ड प्रतियोगी परीक्षा प्लेटफॉर्म संचालित करता है जिसे आधिकारिक राष्ट्रीय प्रवेश परीक्षाओं (जैसे जेईई एडवांस्ड, नीट यूजी, यूपीएससी, कैट और गेट) की तर्ज पर डिज़ाइन किया गया है। प्रत्येक पंजीकृत उम्मीदवार समान समय सीमा और प्रोक्टरिंग नियमों के तहत भाग लेता है।",
        bulletPoints: [
          "सभी मॉक प्रतियोगिताएं सर्वर घड़ी के अनुसार सभी समय क्षेत्रों में एक साथ शुरू और समाप्त होती हैं।",
          "अनधिकृत बाहरी सहायता को रोकने के लिए प्रश्न सुरक्षित टेस्ट इंटरफ़ेस में दिखाए जाते हैं।"
        ]
      },
      {
        title: "2. मुख्य कानूनी एवं प्लेटफॉर्म परिभाषाएं",
        content: "इन नियमों के उद्देश्यों के लिए निम्नलिखित शब्दों की कानूनी परिभाषाएं हैं:",
        bulletPoints: [
          "प्रतियोगिता (Contest): रैंकर्स लीग पर आयोजित कोई भी निर्धारित मॉक परीक्षा।",
          "प्रतिभागी (Participant): एक सत्यापित छात्र जिसने सक्रिय प्रतियोगिता के लिए पंजीकरण किया है।",
          "प्रवेश शुल्क (Entry Fee): सीट आरक्षित करने के लिए छात्र द्वारा दिया गया शुल्क।",
          "पुरस्कार राशि (Prize Pool): शीर्ष रैंक वाले छात्रों में वितरित की जाने वाली कुल पुरस्कार राशि।",
          "न्यूनतम भागीदारी सीमा (70% Threshold): प्रतियोगिता पुष्टि के लिए 70% सीट भरने की अनिवार्य शर्त।",
          "प्रतियोगिता लॉक (Contest Lock): शुरुआत से 60 सेकंड पहले स्वचालित रूप से पंजीकरण बंद होना।"
        ]
      },
      {
        title: "3. उम्मीदवार पात्रता मानदंड",
        content: "रैंकर्स लीग प्रतियोगिताओं में भागीदारी उन छात्रों के लिए खुली है जो प्रत्येक परीक्षा श्रेणी के लिए निर्धारित पात्रता आवश्यकताओं को पूरा करते हैं।"
      },
      {
        title: "4. पंजीकरण प्रोटोकॉल एवं सीट क्षमता",
        content: "छात्रों को निर्धारित समय सीमा से पहले पंजीकरण पूरा करना होगा। प्रत्येक प्रतियोगिता के लिए सीट क्षमता सीमित है।"
      },
      {
        title: "5. सख्त एक छात्र एक प्रवेश नियम",
        content: "पूर्ण मेधावी निष्पक्षता की गारंटी के लिए, प्रत्येक प्रतिभागी केवल एक उपयोगकर्ता खाते से भाग ले सकता है।"
      },
      {
        title: "6. प्रतियोगिता श्रेणियां एवं संरचनाएं",
        content: "रैंकर्स लीग विभिन्न तैयारी रणनीतियों के लिए संरचित प्रतियोगिता प्रारूप आयोजित करता है।"
      },
      {
        title: "7. प्रतियोगिता पुष्टि एवं 70% सीमा नियम",
        content: "प्रतियोगिता पुष्टि के लिए लॉन्च से पहले 70% सीट क्षमता भरना अनिवार्य है। यदि सीट 70% से कम भरती है, तो प्रतियोगिता स्वचालित रूप से रद्द हो जाती है और 100% रिफंड मिलता है।"
      },
      {
        title: "8. डायनेमिक पुरस्कार राशि एवं फ्रिज नियम",
        content: "रैंकर्स लीग पर पुरस्कार राशि कुल पुष्टि की गई प्रविष्टियों के आधार पर पारदर्शी रूप से बढ़ती है। शुरुआत से 60 सेकंड पहले पुरस्कार राशि फ्रिज हो जाती है।"
      },
      {
        title: "9. समय एवं सर्वर घड़ी समकालन",
        content: "सभी परीक्षा कार्यक्रम रैंकर्स लीग मास्टर सर्वर घड़ी (IST) का पालन करते हैं।"
      },
      {
        title: "10. टेस्ट वातावरण एवं प्रोक्टरिंग सुरक्षा",
        content: "परीक्षा के दौरान active proctoring लागू रहती है। 3 बार टैब बदलने पर परीक्षा समाप्त कर दी जाएगी।"
      },
      {
        title: "11. आचरण एवं अखंडता नियम",
        content: "प्रतिभागियों को पूर्ण शैक्षणिक ईमानदारी बनाए रखनी होगी।"
      },
      {
        title: "12. प्रतियोगिता समाप्ति एवं उत्तर सबमिशन",
        content: "समय समाप्त होने पर सभी उत्तर स्वचालित रूप से सबमिट हो जाते हैं।"
      },
      {
        title: "13. परिणाम घोषणा एवं स्कोरकार्ड",
        content: "परीक्षा समाप्ति के 15 मिनट के भीतर स्कोरकार्ड प्रकाशित किए जाते हैं।"
      },
      {
        title: "14. अंतिम रैंकिंग एवं टाई-ब्रेकिंग",
        content: "ऑल इंडिया रैंक (AIR) सटीकता और समय दक्षता के आधार पर तय की जाती है।"
      },
      {
        title: "15. अयोग्यता स्थितियां एवं उल्लंघन",
        content: "धोखाधड़ी करने वाले छात्रों को तुरंत अयोग्य घोषित कर दिया जाएगा।"
      },
      {
        title: "16. रैंकर्स लीग के वैधानिक अधिकार",
        content: "प्लेटफॉर्म को तकनीकी गड़बड़ी पर परीक्षा स्थगित करने का अधिकार है।"
      },
      {
        title: "17. प्रतिभागी की जिम्मेदारियां",
        content: "छात्र स्थिर इंटरनेट और हार्डवेयर बनाए रखने के लिए जिम्मेदार हैं।"
      },
      {
        title: "18. प्लेटफॉर्म की प्रतिबद्धताएं",
        content: "रैंकर्स लीग 99.9% सर्वर अपटाइम और पारदर्शी पुरस्कार वितरण की गारंटी देता है।"
      },
      {
        title: "19. नीतियां संशोधन प्रोटोकॉल",
        content: "नियमों में बदलाव की सूचना 7 दिन पहले दी जाएगी।"
      },
      {
        title: "20. आधिकारिक कानूनी संपर्क विवरण",
        content: "कानूनी पूछताछ के लिए संपर्क करें: legal@rankersleague.com"
      },
      {
        title: "21. आधिकारिक प्लेटफॉर्म शासकीय कानूनी अस्वीकरण",
        content: "रैंकर्स लीग एक स्वतंत्र शैक्षणिक प्रौद्योगिकी प्लेटफॉर्म है।"
      }
    ]
  },

  // ── 1B. Enterprise Terms & Conditions ─────────────────────────────────────
  {
    slug: "terms-and-conditions",
    title: "Enterprise Terms & Conditions",
    titleHi: "एंटरप्राइज नियम एवं शर्तें (Terms & Conditions)",
    iconName: "FileCheck",
    category: "Platform & Security",
    shortDescription: "Master binding legal agreement governing platform use, account management, financial transactions, contest participation, IP rights, liabilities, and dispute resolution.",
    shortDescriptionHi: "प्लेटफॉर्म उपयोग, खाता प्रबंधन, वित्तीय लेनदेन, प्रतियोगिता भागीदारी, आईपी अधिकारों, देनदारियों और विवाद समाधान को नियंत्रित करने वाला मुख्य कानूनी अनुबंध।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "25 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master enterprise legal terms overhaul incorporating 70% threshold rules, dynamic pool scaling, TDS, anti-cheating, and New Delhi jurisdiction." },
      { version: "v3.0", date: "May 2026", summary: "Updated platform security, row-level data access, and instant UPI payout terms." }
    ],
    sections: [
      {
        title: "1. Acceptance of Terms & Legally Binding Agreement",
        content: "These Enterprise Terms & Conditions ('Terms' or 'Agreement') constitute a legally binding agreement between you ('User', 'Candidate', 'Participant') and Ranker's League Technologies Private Limited ('Ranker's League', 'Company', 'We', 'Us', 'Our'). By creating an account, accessing our web/mobile applications, registering for contests, or depositing funds, you explicitly acknowledge that you have read, understood, and agreed to be bound by these Terms.",
        bulletPoints: [
          "Contractual Execution: Accessing any service signifies instant digital signature and full contractual consent under Indian Contract Act, 1872.",
          "Incorporation by Reference: Our Fair Play Policy, Privacy Policy, Refund Policy, Prize Distribution Policy, Tax & TDS Policy, and Contest Rules are incorporated herein by reference.",
          "Rejection Protocol: If you do not agree to every provision contained herein, you must immediately cease accessing the platform and terminate your account."
        ]
      },
      {
        title: "2. Platform Description & EdTech Arena Scope",
        content: "Ranker's League operates a specialized educational technology (EdTech) platform offering proctored competitive mock examinations, percentile rank evaluations, national All India Rank (AIR) bench-marking, and merit-based reward contests for entrance exams (including JEE Advanced, NEET UG, UPSC CSE, CAT, GATE, CLAT, BITSAT, and SSC).",
        bulletPoints: [
          "Skill-Based Competition: All contests hosted on Ranker's League evaluate pure academic knowledge, analytical speed, accuracy, and examination strategy.",
          "No Chance / Gambling Element: Rankings and prize distributions depend 100% on verifiable candidate performance. Chance plays zero role in outcome determination.",
          "Independent Governance: Ranker's League is an independent private platform not affiliated with or endorsed by official testing bodies (NTA, UPSC, IITs, IIMs)."
        ]
      },
      {
        title: "3. User Account Registration, Verification & Security",
        content: "To participate in contest arenas, candidates must register and maintain a single verified user account.",
        bulletPoints: [
          "True Identity Obligation: Candidates must provide accurate, current, and verifiable personal details (Full Legal Name, Mobile Number, Email, Date of Birth).",
          "One Account Mandate: Operating multiple accounts by a single candidate using alternate emails or phone numbers is strictly prohibited.",
          "Credential Confidentiality: You are solely responsible for maintaining the confidentiality of your account login credentials, OTPs, and passcodes."
        ]
      },
      {
        title: "4. Candidate Eligibility & Age Requirements",
        content: "Participation is open to candidates satisfying eligibility parameters specified for each contest arena:",
        bulletPoints: [
          "Age Requirements: Minors (under 18 years of age) must obtain parent or legal guardian consent prior to entering monetary contests.",
          "Geographic Jurisdiction: Open to Indian residents and eligible international students. Contests involving entry fees comply with statutory state laws.",
          "Verification Clearance: Candidates must complete mobile OTP and email verification prior to registering for monetary contests."
        ]
      },
      {
        title: "5. Financial Terms: Deposits, Payments & Wallet System",
        content: "Ranker's League operates a secure tri-segmented digital wallet architecture to manage platform transactions:",
        bulletPoints: [
          "Deposit Balance: Funds added by candidates to pay contest entry fees. Non-withdrawable under any circumstances.",
          "Winning Balance: Net monetary prize earnings from contest standings. 100% eligible for instant bank/UPI withdrawal post proctor audit.",
          "Bonus / Credit Cashback: Promotional entry credits awarded via referrals or contest cashbacks. Non-withdrawable; usable for contest entries.",
          "Payment Gateways: Transactions are processed via RBI-licensed scheduled commercial banks and PCI-DSS Level 1 payment gateways."
        ]
      },
      {
        title: "6. Contest Rules, 70% Confirmation Threshold & 60s Lock",
        content: "Every contest arena launched on Ranker's League adheres to standardized operational parameters:",
        bulletPoints: [
          "70% Confirmation Threshold: Contests require a minimum seat fill capacity of 70% at the 60-second cutoff to launch.",
          "Automatic Cancellation: Contests filling <70% at cutoff cancel automatically, triggering 100% wallet credit refunds within 15 minutes.",
          "Contest Lock Protocol: At exactly 60 seconds prior to launch time, registrations close, and seat cancellations are locked permanently."
        ]
      },
      {
        title: "7. Dynamic Prize Pools, Winner Allocation & Tie-Breaking",
        content: "Prize rewards scale transparently and are allocated according to audited rank payout tables:",
        bulletPoints: [
          "Dynamic Pool Scaling: For dynamic arenas, Prize Pool scales between 70% fill and 100% fill per the formula: Final Pool = (Base Pool) × (Confirmed Seats / Max Seats).",
          "Prize Pool Freeze: At 60 seconds prior to launch (Contest Lock), final Prize Pool and Rank Payout Table freeze permanently.",
          "Tie-Breaker Mathematics: In the event of tied raw scores and parameters, payouts for tied rank slots are summed and split equally among tied rankers."
        ]
      },
      {
        title: "8. Statutory Tax & TDS Compliance (Section 194BA)",
        content: "Ranker's League complies strictly with Indian tax laws and CBDT directives regarding online competitive skill contest payouts:",
        bulletPoints: [
          "Dynamic Tax Withholding: Taxes and statutory deductions (TDS) are computed automatically based on prevailing laws at the time of payout.",
          "Net Winnings Basis: TDS applies strictly to Net Winnings (Total Winnings minus Total Paid Entry Fees).",
          "Form 16A Issuance: Quarterly Form 16A TDS certificates are generated for verified candidates for annual IT Return filing."
        ]
      },
      {
        title: "9. Refund & Fee Protection Guarantee",
        content: "Our Refund Policy guarantees 100% financial protection for platform-driven cancellations or technical disruptions:",
        bulletPoints: [
          "Platform Cancellation Refunds: 100% wallet credit refund issued within 15 minutes of cancellation.",
          "Candidate Un-Registrations: 100% wallet credit refund if un-registered >60 mins prior to launch. Non-refundable within 60 mins of launch.",
          "Zero Processing Charges: Ranker's League charges zero processing fees on cancellation refunds."
        ]
      },
      {
        title: "10. Withdrawals, Daily Limits, KYC & Banking Protocols",
        content: "Settled winning balances can be withdrawn directly to verified bank accounts or UPI VPAs:",
        bulletPoints: [
          "Minimum / Maximum Limits: Min ₹100 INR per transaction; Max ₹50,000 INR daily instant withdrawal.",
          "Instant Speed SLA: Processed automatically in <60 seconds for verified accounts.",
          "Mandatory PAN KYC: PAN verification is mandatory for cumulative withdrawals exceeding ₹10,000 INR."
        ]
      },
      {
        title: "11. Fair Play Policy, Anti-Cheating & AI Prohibition",
        content: "Ranker's League enforces a strict zero-tolerance code against cheating, AI solvers, proxy candidates, and bots:",
        bulletPoints: [
          "Prohibited Tools: ChatGPT, Gemini, Claude, Copilot, AnyDesk, TeamViewer, secondary screens, bots, auto-clickers, paper leaks.",
          "7 Detection Engines: Monitored via AI analytics, browser proctoring, keystroke dynamics, facial recognition, device fingerprinting, IP checks, anti-collusion.",
          "Penalty Escalation: Infractions lead to score voiding, prize forfeiture, temporary suspension, or permanent lifetime ban with legal notice."
        ]
      },
      {
        title: "12. Intellectual Property Rights & Proprietary Content",
        content: "All test questions, graphics, software code, algorithms, logos, and platform branding hosted on Ranker's League are exclusive intellectual property.",
        bulletPoints: [
          "Copyright Protection: Content is protected under Indian Copyright Act, 1957, and international IP treaties.",
          "No Unauthorized Copying: Screen recording, scraping, reproducing, or reselling test questions is strictly prohibited.",
          "Steganographic Tracking: Test screens contain invisible candidate-specific watermarks for immediate leak tracing."
        ]
      },
      {
        title: "13. Candidate Rights & Code of Conduct",
        content: "Candidates enjoy the right to fair exam proctoring, transparent standings, instant wallet credits, and prompt customer support.",
        bulletPoints: [
          "Code of Conduct: Candidates must refrain from abusive language, harassment of support staff, defamatory posts, or fraudulent chargeback threats.",
          "Accountability: Violations of user conduct rules result in immediate account restriction."
        ]
      },
      {
        title: "14. Platform Rights, Discretion & Audit Powers",
        content: "Ranker's League reserves the statutory right to audit contest sessions, verify standings, and maintain platform health:",
        bulletPoints: [
          "Audit Authority: Right to hold payouts during a 2-hour forensic proctor audit following test completion.",
          "Emergency Postponement: Right to reschedule contests in the event of major infrastructure failures or cyber-attacks.",
          "Account Discretion: Right to terminate accounts engaged in fraud, multi-account creation, or security breaches."
        ]
      },
      {
        title: "15. Privacy, Data Protection & Security",
        content: "We handle candidate personal data in compliance with Indian Information Technology (IT) Act, 2000, and DPDP regulations.",
        bulletPoints: [
          "Data Encryption: User data and financial tokens are protected using AES-256 bit encryption at rest and TLS 1.3 in transit.",
          "No Data Selling: Ranker's League never sells user personal details to third-party telemarketers or advertisers."
        ]
      },
      {
        title: "16. Limitation of Liability & Indemnification",
        content: "To the maximum extent permitted by law, Ranker's League shall not be liable for indirect, incidental, or consequential damages arising from platform usage.",
        bulletPoints: [
          "Cap on Liability: Maximum aggregate liability of Ranker's League for any claim shall not exceed the total entry fees paid by the candidate for the specific contest giving rise to liability.",
          "Indemnification: You agree to indemnify and hold harmless Ranker's League from any claims, losses, or legal fees resulting from your violation of these Terms or Fair Play Policy."
        ]
      },
      {
        title: "17. Disclaimers & Warranty Exclusions",
        content: "The platform is provided on an 'AS IS' and 'AS AVAILABLE' basis without warranties of any kind, express or implied.",
        bulletPoints: [
          "Network Disclaimer: Ranker's League is not responsible for candidate-side hardware glitches, device overheating, or local ISP internet drops.",
          "No Exam Guarantee: Participation on Ranker's League is for practice and assessment; we do not guarantee selection in statutory entrance exams."
        ]
      },
      {
        title: "18. Account Termination, Suspension & Forfeiture",
        content: "Accounts may be suspended or permanently terminated for cause upon written notice:",
        bulletPoints: [
          "Termination Triggers: Confirmed cheating, AI tool usage, paper leak, impersonation, multi-account registration, or payment fraud.",
          "Balance Forfeiture: Accounts terminated for fraudulent activity or Fair Play breaches forfeit all accumulated wallet balances and winnings."
        ]
      },
      {
        title: "19. Force Majeure & Network Disruptions",
        content: "Neither party shall be liable for failure or delay in performing obligations due to causes beyond reasonable control, including acts of God, war, national telecommunication blackout, cyber warfare, or pandemic emergency lockdown."
      },
      {
        title: "20. Amendments & Policy Modifications",
        content: "Ranker's League reserves the right to amend these Terms periodically. Material changes will be published on the Legal Center hub with a 7-day prior notice tag. Continued platform use constitutes acceptance."
      },
      {
        title: "21. Governing Law, Dispute Resolution & Exclusive Jurisdiction",
        content: "These Terms are governed by and construed in accordance with the statutory laws of India.",
        bulletPoints: [
          "Arbitration: Unresolved disputes shall be referred to sole arbitration under the Indian Arbitration and Conciliation Act, 1996.",
          "Exclusive Jurisdiction: The courts of New Delhi, India, shall have exclusive jurisdiction over all legal proceedings arising under these Terms."
        ]
      },
      {
        title: "22. Entire Agreement, Severability & Contact Info",
        content: "These Terms constitute the entire agreement between you and Ranker's League regarding platform usage.",
        bulletPoints: [
          "Severability: If any provision is deemed unenforceable, remaining provisions remain in full force and effect.",
          "Official Contact: For legal communications, contact our Legal Cell: legal@rankersleague.com | Tech Park, New Delhi, India."
        ]
      }
    ],
    sectionsHi: [
      {
        title: "1. नियमों की स्वीकृति एवं कानूनी रूप से बाध्यकारी समझौता",
        content: "ये नियम एवं शर्तें आपके और रैंकर्स लीग टेक्नोलॉजीज प्राइवेट लिमिटेड के बीच एक कानूनी रूप से बाध्यकारी समझौता हैं। खाता बनाकर या प्रतियोगिता में भाग लेकर, आप इन सभी शर्तों का पालन करने की सहमति देते हैं।",
        bulletPoints: [
          "अनुबंध निष्पादन: प्लेटफॉर्म का उपयोग करने पर भारतीय अनुबंध अधिनियम, 1872 के तहत डिजिटल सहमति मानी जाएगी।",
          "अस्वीकृति प्रोटोकॉल: यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया तुरंत प्लेटफॉर्म का उपयोग बंद कर दें।"
        ]
      },
      {
        title: "2. प्लेटफॉर्म का विवरण एवं एडटेक दायरा",
        content: "रैंकर्स लीग एक समर्पित शैक्षणिक प्रौद्योगिकी प्लेटफॉर्म है जो प्रतियोगी प्रवेश परीक्षाओं (JEE, NEET, UPSC, CAT, GATE) के लिए मानकीकृत प्रोक्टर्ड मॉक परीक्षाएं आयोजित करता है।"
      },
      {
        title: "3. उपयोगकर्ता खाता पंजीकरण एवं सुरक्षा",
        content: "प्रत्येक उम्मीदवार को केवल एक सत्यापित खाता रखने की अनुमति है। कई खाते बनाना या गलत जानकारी देना प्रतिबंधित है।"
      },
      {
        title: "4. पात्रता एवं आयु मानदंड",
        content: "18 वर्ष से कम आयु के नाबालिगों को नकद प्रतियोगिताओं में भाग लेने के लिए माता-पिता की सहमति की आवश्यकता होती है।"
      },
      {
        title: "5. वित्तीय शर्तें एवं 3-स्तरीय वॉलेट सिस्टम",
        content: "रैंकर्स लीग एक सुरक्षित 3-स्तरीय वॉलेट सिस्टम (Deposit, Winning, Bonus) संचालित करता है।"
      },
      {
        title: "6. 70% न्यूनतम पुष्टि सीमा एवं 60-सेकंड लॉक",
        content: "प्रतियोगिता पुष्टि के लिए 70% सीट भरना अनिवार्य है। 70% से कम सीट भरने पर 100% रिफंड मिलता है।"
      },
      {
        title: "7. डायनेमिक प्राइज पूल एवं टाई-ब्रेकिंग गणित",
        content: "70% से 100% सीट भरने पर प्राइज पूल आनुपातिक रूप से बढ़ता है। समान अंक आने पर पुरस्कार राशि बराबर बांटी जाती है।"
      },
      {
        title: "8. वैधानिक टीडीएस (TDS) कटौती नियम",
        content: "लागू भारतीय आयकर कानूनों और धारा 194BA के तहत शुद्ध जीत पर टीडीएस काटा जाता है।"
      },
      {
        title: "9. 100% रिफंड एवं शुल्क सुरक्षा गारंटी",
        content: "प्लेटफॉर्म द्वारा प्रतियोगिता रद्द होने पर 15 मिनट में 100% वॉलेट रिफंड दिया जाता है।"
      },
      {
        title: "10. विथड्रॉल, दैनिक सीमाएं एवं पैन (PAN) केवाईसी",
        content: "न्यूनतम ₹100 और अधिकतम ₹50,000 दैनिक तत्काल UPI निकासी। ₹10,000 से अधिक विथड्रॉल पर पैन कार्ड अनिवार्य है।"
      },
      {
        title: "11. फेयर प्ले नीति एवं एआई (AI) प्रतिबंध",
        content: "ChatGPT, Gemini, AnyDesk, बोट्स और नकल करना पूरी तरह प्रतिबंधित है।"
      },
      {
        title: "12. बौद्धिक संपदा अधिकार (IP Rights)",
        content: "सभी प्रश्न, कोड और लोगो रैंकर्स लीग की अनन्य बौद्धिक संपदा हैं।"
      },
      {
        title: "13. उम्मीदवार अधिकार एवं आचार संहिता",
        content: "छात्रों को निष्पक्ष परीक्षा और सहायता का अधिकार है। दुर्व्यवहार करने पर खाता प्रतिबंधित किया जाएगा।"
      },
      {
        title: "14. प्लेटफॉर्म के वैधानिक अधिकार एवं ऑडिट शक्तियां",
        content: "रैंकर्स लीग को 2 घंटे का प्रोक्टरिंग ऑडिट करने और धोखाधड़ी वाले खातों को बंद करने का अधिकार है।"
      },
      {
        title: "15. गोपनीयता एवं डेटा सुरक्षा",
        content: "उपयोगकर्ता डेटा AES-256 एन्क्रिप्शन से सुरक्षित है।"
      },
      {
        title: "16. दायित्व की सीमा एवं क्षतिपूर्ति",
        content: "रैंकर्स लीग का अधिकतम दायित्व छात्र द्वारा दिए गए प्रवेश शुल्क तक सीमित है।"
      },
      {
        title: "17. अस्वीकरण एवं वारंटी अपवाद",
        content: "छात्र की ओर से इंटरनेट या डिवाइस खराब होने के लिए प्लेटफॉर्म जिम्मेदार नहीं है।"
      },
      {
        title: "18. खाता समाप्ति एवं शेष राशि जब्ती",
        content: "धोखाधड़ी करने पर खाता बंद कर दिया जाएगा और वॉलेट शेष जब्त कर लिया जाएगा।"
      },
      {
        title: "19. अपरिहार्य घटना (Force Majeure)",
        content: "प्राकृतिक आपदा या राष्ट्रीय सर्वर ब्लैकआउट के लिए प्लेटफॉर्म उत्तरदायी नहीं है।"
      },
      {
        title: "20. शर्तों में संशोधन प्रोटोकॉल",
        content: "नियमों में बदलाव की सूचना 7 दिन पहले दी जाएगी।"
      },
      {
        title: "21. गवर्निंग लॉ एवं विशेष क्षेत्राधिकार (नई दिल्ली)",
        content: "सभी कानूनी विवादों के लिए exclusive jurisdiction केवल नई दिल्ली, भारत की अदालतों का होगा।"
      },
      {
        title: "22. पूर्ण समझौता एवं आधिकारिक कानूनी संपर्क",
        content: "कानूनी पूछताछ के लिए संपर्क करें: legal@rankersleague.com | टेक पार्क, नई दिल्ली, भारत।"
      }
    ]
  },

  // ── 1C. Enterprise Privacy Policy ─────────────────────────────────────────
  {
    slug: "privacy-policy",
    title: "Official Enterprise Privacy Policy",
    titleHi: "आधिकारिक एंटरप्राइज गोपनीयता नीति (Privacy Policy)",
    iconName: "Lock",
    category: "Platform & Security",
    shortDescription: "Master enterprise data protection framework compliant with Indian IT Act 2000, DPDP Act 2023, GDPR, CCPA, and global cybersecurity standards across 27 operational domains.",
    shortDescriptionHi: "भारतीय आईटी अधिनियम 2000, डीपीडीपी अधिनियम 2023, जीडीपीआर और 27 संचालन क्षेत्रों में वैश्विक सुरक्षा मानकों के अनुपालन में मास्टर एंटरप्राइज डेटा सुरक्षा नीति।",
    lastUpdated: "August 2026",
    version: "v5.0",
    readTime: "25 min read",
    versionHistory: [
      { version: "v5.0", date: "August 2026", summary: "Master Privacy Policy overhaul detailing DPDP Act 2023 compliance, 27 structural data domains, biometric proctoring telemetry, DPO channels, and erasure SLAs." },
      { version: "v4.0", date: "August 2026", summary: "Incorporated DPDP Act 2023, biometric KYC data handling, proctoring log auto-purge, and DPO channel." }
    ],
    sections: [
      {
        title: "1. Preamble & Statutory Data Protection Commitment",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us', 'Our') is committed to safeguarding the fundamental right to privacy, confidentiality, and data security of all candidates, students, mentors, and users ('User', 'You'). This Privacy Policy forms a legally binding framework governing how we collect, store, process, transfer, retain, and protect your personal data in full compliance with the Information Technology Act, 2000, IT (Reasonable Security Practices) Rules, 2011, the Digital Personal Data Protection (DPDP) Act, 2023 of India, Regulation (EU) 2016/679 (GDPR), and the California Consumer Privacy Act (CCPA).",
        bulletPoints: [
          "Zero Commercial Exploitation: We NEVER sell, rent, monetize, or trade candidate personal data or exam performance records to third-party ad brokers or telemarketers.",
          "Consent-Driven Architecture: Processing is conducted strictly on the basis of explicit, informed consent or statutory legal requirements.",
          "Data Protection Officer (DPO): We maintain a dedicated statutory DPO reachable at dpo@rankersleague.com / privacy@rankersleague.com."
        ]
      },
      {
        title: "2. Definitions & Interpretative Legal Terms",
        content: "For the purposes of this Privacy Policy, capitalized terms shall have the specific statutory meanings defined below:",
        bulletPoints: [
          "Data Fiduciary: Ranker's League Technologies Private Limited, which determines the purpose and means of personal data processing.",
          "Data Principal: The candidate, student, or user whose personal data is processed.",
          "Personal Data: Any data about an individual who is identifiable by or in relation to such data.",
          "Proctoring Telemetry: Algorithmic streams of webcam snapshots, keystroke dynamics, tab-switches, and microphone audio metrics captured during live tests.",
          "Sub-Processor: Certified third-party cloud infrastructure, telecom, or payment gateway providers engaged by Ranker's League."
        ]
      },
      {
        title: "3. Scope of Information We Collect & Data Stream Methodology",
        content: "Ranker's League collects personal data necessary to provide secure, proctored educational competitive contests. Information is collected through direct user input, automated proctoring telemetry, background system diagnostics, device sensors, and certified banking gateways."
      },
      {
        title: "4. Personal Information (Account Identification Data)",
        content: "Upon candidate registration, we collect core identification attributes:",
        bulletPoints: [
          "Full Legal Name, Mobile Phone Number, Email Address, Date of Birth, Gender, City/State of Residence, and Account Display Name / Roll Number."
        ]
      },
      {
        title: "5. Educational & Exam Background Information",
        content: "To customize contest arenas and target exam categories, we collect academic profile data:",
        bulletPoints: [
          "Academic Stream (Engineering PCM / Medical PCB / Foundation / SSC / CUET), Target Entrance Exam Year, Current School / Coaching Institute, and Mock Practice Scores."
        ]
      },
      {
        title: "6. Contest & Examination Performance Information",
        content: "During live and practice examination sessions, we collect detailed performance metrics:",
        bulletPoints: [
          "Selected Option Vectors, Raw Scores (+4/-1 scheme), Time Taken Per Question (`mm:ss`), Submission Timestamps (`YYYY-MM-DD HH:MM:SS.mmm`), Percentiles, and All India Ranks (AIR)."
        ]
      },
      {
        title: "7. Device, Hardware & Network Telemetry",
        content: "To enforce anti-cheat proctoring and detect multi-account fraud, our systems capture technical device fingerprints:",
        bulletPoints: [
          "Device Model, OS Version, Browser Engine, Screen Resolution/DPI, GPU Canvas Hash, Keystroke Dynamics, Local Network IP Address, and MAC Hash."
        ]
      },
      {
        title: "8. Payment & Financial Sub-Ledger Information",
        content: "For processing contest entry deposits and prize withdrawals:",
        bulletPoints: [
          "Tokenized UPI VPAs, Masked Bank Account Numbers, IFSC Codes, Gateway Reference IDs, and Wallet Sub-Ledger Passbook Records. (Raw Credit/Debit card numbers and CVVs are NEVER stored)."
        ]
      },
      {
        title: "9. Statutory KYC & Identity Verification Information",
        content: "In compliance with Indian Income Tax laws and Anti-Money Laundering (AML) directives, candidates accumulating lifetime withdrawals exceeding ₹10,000 INR must submit:",
        bulletPoints: [
          "Masked Aadhaar Copies, PAN Card Copies, Government Photo IDs, and 60-second Live Video KYC Verification Clips."
        ]
      },
      {
        title: "10. Cookies, Web Beacons & Tracking Technologies",
        content: "Ranker's League utilizes essential session cookies, security anti-cheat tokens, preference storage, and analytical web beacons to maintain browser session state and secure test environments. Candidates can manage cookie preferences via browser settings."
      },
      {
        title: "11. Analytics & Behavioral Monitoring",
        content: "We utilize aggregated product analytics (Google Analytics 4, internal telemetry) to monitor platform load throughput, UI latency, drop-off rates, and server response times. No personal exam answers are exposed to analytical sub-processors."
      },
      {
        title: "12. Log Files & Server Diagnostic Telemetry",
        content: "Automated web server logs record access timestamps, HTTP status codes, user-agent strings, API endpoint latencies, and system crash stack traces for 24/7 cyber defense."
      },
      {
        title: "13. Camera, Microphone & Device Sensor Permissions",
        content: "For live proctored prize contests, candidate browsers request explicit one-time device permissions:",
        bulletPoints: [
          "Webcam Camera Permission: Used to capture periodic 5-second low-resolution audit snapshots during live tests.",
          "Microphone Audio Permission: Used to monitor ambient noise spikes for anti-cheat verification.",
          "Screen Orientation Sensors: Used to lock screen display state on mobile apps during active tests."
        ]
      },
      {
        title: "14. How Information Is Used (Primary & Secondary Purposes)",
        content: "Personal data is processed strictly for: 1. Administering proctored competitive exams; 2. Calculating AIR ranks; 3. Disbursing prize winnings; 4. Remitting statutory TDS to tax authorities; 5. Preventing cheating and multi-account fraud; 6. Platform cybersecurity."
      },
      {
        title: "15. Artificial Intelligence (AI) & Anti-Cheating Data Processing",
        content: "Our AI Forensic Engine processes candidate keystroke dynamics (<20ms intervals), webcam snapshots, and answer velocity metrics to detect LLM solver usage (ChatGPT, Gemini) and proxy candidates. Algorithmic flags are verified by human compliance officers before account actions."
      },
      {
        title: "16. Data Security, AES-256 Encryption & Cyber Resilience",
        content: "Ranker's League implements multi-layered enterprise cybersecurity controls:",
        bulletPoints: [
          "AES-256 Encryption at Rest: Databases, KYC documents, and financial records are encrypted using bank-grade AES-256 algorithms.",
          "TLS 1.3 Encryption in Transit: All data transfers are secured via TLS 1.3 cryptographic transport.",
          "Row-Level Security (RLS): Strict database isolation prevents cross-tenant data exposure.",
          "SOC 2 Type II Datacenters: Infrastructure hosted in certified, ISO-27001 datacenters inside India."
        ]
      },
      {
        title: "17. Statutory Data Retention Schedules & Auto-Purge Triggers",
        content: "Data retention follows strict lifecycle management:\n" +
          "1. Active Account Data: Retained while account remains active.\n" +
          "2. Statutory Financial Records: Retained for 7 years per Indian Income Tax Act requirements.\n" +
          "3. Proctoring Webcam Snapshots: Automatically purged from servers 90 days following contest audit finalization."
      },
      {
        title: "18. Third-Party Service Providers & Cloud Data Processors",
        content: "We share data with trusted sub-processors under binding non-disclosure agreements (NDAs): Cloud Datacenter Hosts (AWS/GCP India), Telecom SMS Gateways, and Email Delivery Services."
      },
      {
        title: "19. Payment Partners & Banking Gateways",
        content: "Financial deposits and prize withdrawals are processed exclusively through RBI-regulated commercial aggregators (Razorpay, Cashfree, Paytm Payment Gateway). Raw payment card details are never stored."
      },
      {
        title: "20. Candidate Privacy Rights under DPDP Act 2023 & Global Standards",
        content: "Candidates possess explicit statutory rights under Indian DPDP Act 2023: 1. Right to Access personal data; 2. Right to Correction/Erasure; 3. Right to Grievance Redressal; 4. Right to Nominate a representative."
      },
      {
        title: "21. Data Deletion, Right to be Forgotten & Erasure Protocols",
        content: "Candidates can request account deletion via `privacy@rankersleague.com` or App Settings. Active profile data is permanently erased within 14 days, excluding statutory 7-year financial transaction records required by law."
      },
      {
        title: "22. Data Portability & Access Rights",
        content: "Candidates may download structured JSON/CSV exports of their academic scorecards, contest performance metrics, and wallet ledger histories from Profile Settings."
      },
      {
        title: "23. Children's Privacy & Minor Student Consent Protocols",
        content: "Ranker's League hosts Olympiad contests for students under 18 years of age. Registration requires verifiable parental/guardian consent. Minor student profiles are masked on public leaderboards."
      },
      {
        title: "24. International Users & Cross-Border Data Transfer Rules",
        content: "All candidate data is primary hosted within cloud datacenters located inside the Republic of India. Cross-border transfers adhere strictly to DPDP Act cross-border provisions and GDPR adequacy safeguards."
      },
      {
        title: "25. Policy Updates, Change Management & Notification SLAs",
        content: "Ranker's League reserves the right to update this Privacy Policy. Material updates will be notified via email and platform banners 15 days prior to implementation. Version history logs remain permanently accessible."
      },
      {
        title: "26. Contact Information & Data Protection Officer (DPO) Directory",
        content: "For privacy inquiries, statutory data requests, or DPDP grievance redressal, contact our Data Protection Officer:\n" +
          "Data Protection Officer (DPO): Adv. Rajendra Sharma\n" +
          "Official Email: dpo@rankersleague.com | privacy@rankersleague.com\n" +
          "Physical Address: Ranker's League Legal Cell, Tech Park, New Delhi - 110001, India."
      },
      {
        title: "27. Official Governance Legal & Privacy Disclaimer",
        content: "This Privacy Policy is legally binding under the laws of India. Ranker's League guarantees zero commercial data exploitation and 100% statutory compliance."
      }
    ],
    sectionsHi: [
      {
        title: "1. प्रस्तावना एवं वैधानिक डेटा सुरक्षा प्रतिबद्धता",
        content: "रैंकर्स लीग टेक्नोलॉजीज प्राइवेट लिमिटेड आपकी गोपनीयता और सुरक्षा की रक्षा के लिए 100% प्रतिबद्ध है। यह नीति भारतीय आईटी अधिनियम 2000, आईटी नियम 2011, डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) अधिनियम 2023 और यूरोपीय संघ के GDPR नियमों के तहत बनाई गई है।",
        bulletPoints: [
          "शून्य व्यावसायिक दुरुपयोग: हम आपका डेटा कभी भी तीसरे पक्ष को नहीं बेचते हैं।",
          "डेटा सुरक्षा अधिकारी (DPO): dpo@rankersleague.com पर संपर्क करें।"
        ]
      },
      {
        title: "2. परिभाषाएं एवं कानूनी शब्दावली (Definitions)",
        content: "डेटा फिड्यूशरी (Data Fiduciary): रैंकर्स लीग जो डेटा के उद्देश्य तय करता है। डेटा प्रिंसिपल (Data Principal): परीक्षा देने वाला छात्र।"
      },
      {
        title: "3. एकत्र की जाने वाली जानकारी का दायरा (Scope)",
        content: "डेटा छात्र पंजीकरण, स्वचालित प्रोक्टरिंग, सिस्टम diagnostics और बैंक गेटवे द्वारा एकत्र किया जाता है।"
      },
      {
        title: "4. व्यक्तिगत जानकारी (Personal Data)",
        content: "पूरा नाम, मोबाइल नंबर, ईमेल आईडी, जन्म तिथि, लिंग और निवास स्थान का राज्य।"
      },
      {
        title: "5. शैक्षणिक एवं परीक्षा पृष्ठभूमि (Educational Background)",
        content: "अकादमिक स्ट्रीम (PCM/PCB/Commerce), लक्ष्य परीक्षा (JEE/NEET/CUET/SSC) और कोचिंग संस्थान।"
      },
      {
        title: "6. परीक्षा एवं प्रदर्शन जानकारी (Contest Performance)",
        content: "उत्तर विकल्प, प्राप्तांक (+4/-1), सबमिशन समय, प्रति प्रश्न समय, ऑल इंडिया रैंक (AIR) और प्रतिशतता।"
      },
      {
        title: "7. डिवाइस एवं हार्डवेयर फिंगरप्रिंट (Hardware Telemetry)",
        content: "डिवाइस मॉडल, ऑपरेटिंग सिस्टम, ब्राउज़र, स्क्रीन रिज़ॉल्यूशन, आईपी एड्रेस और मैक हैश।"
      },
      {
        title: "8. वित्तीय एवं भुगतान जानकारी (Payment Information)",
        content: "टोकनकृत यूपीआई आईडी, बैंक खाता विवरण और वॉलेट पासबुक रिकॉर्ड। (रॉ कार्ड नंबर कभी स्टोर नहीं होते)।"
      },
      {
        title: "9. वैधानिक केवाईसी जानकारी (KYC Information)",
        content: "₹10,000 से अधिक विथड्रॉल पर पैन कार्ड, आधार कार्ड और 60-सेकंड लाइव वीडियो केवाईसी।"
      },
      {
        title: "10. कुकीज़ एवं ट्रैकिंग तकनीक (Cookies)",
        content: "आवश्यक सेशन कुकीज़ और एंटी-चीट टोकन का उपयोग।"
      },
      {
        title: "11. एनालिटिक्स एवं उत्पाद निगरानी (Analytics)",
        content: "सर्वर लोड और ऐप परफॉर्मेंस सुधारने के लिए एग्रीगेटेड डेटा का उपयोग।"
      },
      {
        title: "12. लॉग फाइल्स एवं सर्वर डायग्नोस्टिक्स (Log Data)",
        content: "सर्वर एक्सेस टाइमस्टैम्प, त्रुटि लॉग्स और एपीआई रिस्पांस टाइम।"
      },
      {
        title: "13. कैमरा एवं माइक्रोफोन अनुमति (Camera/Mic Permissions)",
        content: "लाइव प्रोक्टर्ड परीक्षा के दौरान वेबकैम फोटो और माइक्रोफोन ऑडियो मेट्रिक्स।"
      },
      {
        title: "14. जानकारी का उपयोग कैसे किया जाता है (How Data Is Used)",
        content: "परीक्षा संचालन, रैंक जारी करने, टीडीएस टैक्स रिपोर्टिंग और धोखाधड़ी रोकने के लिए।"
      },
      {
        title: "15. AI एवं एंटी-चीटिंग प्रोक्टरिंग डेटा (AI Processing)",
        content: "टाइपिंग स्पीड (Keystroke Dynamics), वेबकैम फोटो और एआई सिग्नेचर मैचिंग से नकल पकड़ना।"
      },
      {
        title: "16. डेटा सुरक्षा एवं AES-256 एन्क्रिप्शन (Data Security)",
        content: "AES-256 बिट एन्क्रिप्शन और TLS 1.3 सुरक्षा प्रोटोकॉल से 100% सुरक्षित।"
      },
      {
        title: "17. डेटा प्रतिधारण एवं ऑटो-पर्ज (Data Retention)",
        content: "टैक्स डेटा 7 साल तक सुरक्षित रखा जाता है। प्रोक्टरिंग फोटो 90 दिनों में अपने आप डिलीट हो जाती हैं।"
      },
      {
        title: "18. तीसरे पक्ष के सेवा प्रदाता (Third-Party Services)",
        content: "केवल भारत में स्थित सुरक्षित क्लाउड सेंटरों (AWS/GCP India) का उपयोग।"
      },
      {
        title: "19. भुगतान साझेदार एवं बैंक गेटवे (Payment Partners)",
        content: "आरबीआई (RBI) द्वारा विनियमित बैंक गेटवे (Razorpay, Cashfree, Paytm) से लेन-देन।"
      },
      {
        title: "20. छात्र के वैधानिक अधिकार (DPDP Act 2023 Rights)",
        content: "डेटा देखने, सुधारने, हटाने और शिकायत दर्ज करने का वैधानिक अधिकार।"
      },
      {
        title: "21. डेटा डिलीट एवं खाता समाप्ति (Data Deletion)",
        content: "privacy@rankersleague.com पर आवेदन करने पर 14 दिनों के भीतर डेटा स्थायी रूप से डिलीट कर दिया जाता है।"
      },
      {
        title: "22. डेटा पोर्टेबिलिटी (Data Portability)",
        content: "छात्र अपने अंक और स्कोरकार्ड JSON/CSV फॉर्मेट में डाउनलोड कर सकते हैं।"
      },
      {
        title: "23. नाबालिग छात्रों की गोपनीयता सुरक्षा (Children's Privacy)",
        content: "18 वर्ष से कम आयु के छात्रों के लिए अभिभावक की सहमति अनिवार्य है। लीडरबोर्ड पर नाम मास्क किया जाता है।"
      },
      {
        title: "24. अंतरराष्ट्रीय डेटा ट्रांसफर नियम (International Users)",
        content: "सभी डेटा भारत में स्थित डेटा सेंटरों में सुरक्षित रूप से प्रोसेस होता है।"
      },
      {
        title: "25. नीति में संशोधन की प्रक्रिया (Policy Updates)",
        content: "बदलाव की सूचना 15 दिन पहले ईमेल और ऐप पर दी जाएगी।"
      },
      {
        title: "26. डेटा सुरक्षा अधिकारी (DPO) संपर्क निर्देशिका",
        content: "डेटा सुरक्षा अधिकारी: dpo@rankersleague.com | लीगल सेल, टेक पार्क, नई दिल्ली - 110001, भारत।"
      },
      {
        title: "27. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह गोपनीयता नीति भारतीय डीपीडीपी अधिनियम 2023 के तहत 100% कानूनी रूप से बाध्यकारी है।"
      }
    ]
  },

  // ── 1D. Enterprise Cookie Policy ──────────────────────────────────────────
  {
    slug: "cookie",
    title: "Official Enterprise Cookie & Tracking Policy",
    titleHi: "आधिकारिक एंटरप्राइज कुकी एवं ट्रैकिंग नीति (Cookie Policy)",
    iconName: "Cookie",
    category: "Platform & Security",
    shortDescription: "Comprehensive rules on HTTP cookies, essential authentication tokens, preference storage, performance beacons, analytics consent, browser controls, and statutory DPDP compliance.",
    shortDescriptionHi: "एचटीटीपी कुकीज़, आवश्यक प्रमाणीकरण टोकन, वरीयता भंडारण, एनालिटिक्स सहमति, ब्राउज़र नियंत्रण और वैधानिक डीपीडीपी अनुपालन नीति।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "15 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Cookie Policy overhaul detailing 13 operational domains, granular DPDP 2023 consent banners, session/persistent lifespan schedules, and browser management guides." },
      { version: "v3.0", date: "June 2026", summary: "Updated third-party payment gateway cookie inventory and CSRF token security TTLs." }
    ],
    sections: [
      {
        title: "1. What Are Cookies & Web Tracking Technologies",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') uses HTTP cookies, web beacons, local storage (`localStorage`), session storage (`sessionStorage`), and tracking pixels to ensure seamless platform operation, maintain secure test environments, prevent multi-account fraud, and remember user preferences across visits. A 'Cookie' is a small cryptographic text file placed on your device browser when visiting our website or mobile web portal.",
        bulletPoints: [
          "HTTP Cookies: Cryptographic data tokens stored in browser cookie jars.",
          "Local Storage (`localStorage`): Persistent key-value storage used for UI theme modes and language preferences.",
          "Session Storage (`sessionStorage`): Temporary volatile memory cleared upon browser tab closure, used for test timer states."
        ]
      },
      {
        title: "2. Essential / Strictly Necessary Cookies",
        content: "Essential cookies are strictly mandatory for the core operation, cybersecurity, and proctored test environment of Ranker's League. These cookies cannot be disabled, as doing so breaks authentication and security validation.",
        bulletPoints: [
          "`__rl_session_id`: Encrypted JWT session token verifying authenticated candidate logins.",
          "`__rl_csrf_token`: Cross-Site Request Forgery protection key safeguarding wallet & test submissions.",
          "`__rl_proctor_key`: Cryptographic security token validating client-side proctoring environment integrity.",
          "`__rl_lb_affinity`: Cloud load balancer routing cookie maintaining server connection stickiness during live tests."
        ]
      },
      {
        title: "3. Functional & Preference Cookies",
        content: "Functional cookies allow Ranker's League to remember choices you make and provide enhanced, personalized user features across sessions:",
        bulletPoints: [
          "`__rl_lang_pref`: Stores selected interface language preference (English vs Hindi).",
          "`__rl_theme_mode`: Retains UI display theme preference (Neon Dark Mode vs High Contrast Light).",
          "`__rl_sound_effects`: Remembers exam audio notification and sound effect toggle states.",
          "`__rl_timer_format`: Persists candidate preference for exam countdown timer display (`HH:MM:SS` vs Seconds)."
        ]
      },
      {
        title: "4. Performance & Infrastructure Reliability Cookies",
        content: "Performance cookies collect aggregated technical data regarding how candidates interact with platform infrastructure, optimizing page load velocity and server response times:",
        bulletPoints: [
          "`__rl_cdn_edge`: Identifies closest Cloudflare/Fastly edge data center node for ultra-low latency test delivery.",
          "`__rl_latency_ms`: Measures real-time round-trip network ping between client device and exam server.",
          "`__rl_error_dump`: Temporarily logs client-side JavaScript execution exceptions for 24/7 technical debugging."
        ]
      },
      {
        title: "5. Analytics & Behavioral Monitoring Cookies",
        content: "Analytics cookies help us analyze candidate traffic patterns, UI usage frequencies, and platform drop-off points to continuously improve user experience:",
        bulletPoints: [
          "`_ga` / `_ga_*`: Google Analytics 4 cookies generating aggregated, anonymous visitor statistics.",
          "`__rl_funnel_track`: Measures registration and contest entry funnel completion rates.",
          "Zero Answer Exposure: Analytics cookies NEVER record, analyze, or transmit candidate exam question responses."
        ]
      },
      {
        title: "6. Session Cookies vs. Persistent Cookies",
        content: "Cookies operate under two distinct lifespan mechanisms based on operational necessity:\n" +
          "1. Session Cookies: Temporary cookies stored in volatile browser memory during an active session. They are automatically deleted when the candidate closes the browser or logs out.\n" +
          "2. Persistent Cookies: Stored on the candidate's device hard drive with explicit expiration timestamps (ranging from 30 days to 24 months) to recognize returning candidates."
      },
      {
        title: "7. Third-Party Cookies & Sub-Processor Technologies",
        content: "Ranker's League integrates trusted third-party sub-processors who may issue cookies on our domain under strict non-disclosure contracts:\n" +
          "• Razorpay / Cashfree: 3DS payment gateway fraud prevention and transaction verification cookies.\n" +
          "• Cloudflare: Anti-DDoS security verification and SSL handshake validation cookies.\n" +
          "• Google Analytics: Aggregated web performance analytics."
      },
      {
        title: "8. Itemized Cookie Retention & Lifespan Schedule",
        content: "Below is the statutory breakdown of primary cookies utilized on Ranker's League:\n" +
          "1. `__rl_session_id` | Essential | RankersLeague.com | Session | Erased on Logout\n" +
          "2. `__rl_csrf_token` | Essential | RankersLeague.com | Session | 24 Hours\n" +
          "3. `__rl_proctor_key` | Essential | RankersLeague.com | Session | Exam Duration\n" +
          "4. `__rl_lang_pref` | Functional | RankersLeague.com | Persistent | 365 Days\n" +
          "5. `__rl_theme_mode` | Functional | RankersLeague.com | Persistent | 365 Days\n" +
          "6. `_ga` | Analytics | Google.com | Persistent | 24 Months"
      },
      {
        title: "9. Browser Settings & Manual Cookie Control Guidelines",
        content: "Candidates maintain complete control over browser cookies. You can inspect, block, or delete cookies via your browser settings menu:\n" +
          "• Google Chrome: Settings > Privacy and Security > Third-party cookies (`chrome://settings/cookies`).\n" +
          "• Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data (`about:preferences#privacy`).\n" +
          "• Apple Safari: Preferences > Privacy > Block all cookies.\n" +
          "• Microsoft Edge: Settings > Cookies and site permissions > Manage and delete cookies."
      },
      {
        title: "10. Granular Cookie Consent Framework",
        content: "In compliance with the Indian DPDP Act 2023 and EU GDPR, Ranker's League deploys an explicit Consent Banner on first visit. Candidates can grant or revoke consent for Analytics and Functional cookies at any time via Profile Settings > Cookie Preferences."
      },
      {
        title: "11. Impact & Functional Consequences of Disabling Cookies",
        content: "Candidates should note that disabling Essential cookies will cause severe functional degradation:\n" +
          "1. Automatic logout from active account sessions.\n" +
          "2. Inability to enter live proctored contest arenas due to security key validation failures.\n" +
          "3. Reset of language preferences to English defaults."
      },
      {
        title: "12. Policy Updates, Change Management & Notification SLAs",
        content: "Ranker's League reserves the right to modify this Cookie Policy. Material changes to cookie technology or sub-processor lists will be published with a 15-day prior notice tag. Immutable version history logs (`v1.0` through `v4.0`) are publicly maintained."
      },
      {
        title: "13. Official Governance Legal & Regulatory Disclaimer",
        content: "This Cookie Policy is governed by the laws of India (IT Act 2000, DPDP Act 2023) and global ePrivacy Directives. For cookie privacy inquiries, contact our Data Protection Officer at `dpo@rankersleague.com` / `privacy@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. कुकीज़ एवं ट्रैकिंग तकनीक क्या हैं (What Are Cookies)",
        content: "रैंकर्स लीग एचटीटीपी कुकीज़, लोकल स्टोरेज (`localStorage`) और वेब बीकन्स का उपयोग प्लेटफॉर्म सुरक्षा, यूजर प्रमाणीकरण और भाषा प्राथमिकताओं को सहेजने के लिए करता है। कुकी आपकी डिवाइस पर रखी जाने वाली एक छोटी एन्क्रिप्टेड फाइल है।"
      },
      {
        title: "2. आवश्यक एवं अनिवार्य कुकीज़ (Essential Cookies)",
        content: "ये कुकीज़ प्लेटफॉर्म सुरक्षा और लाइव परीक्षा आयोजित करने के लिए 100% अनिवार्य हैं। इन्हें बंद नहीं किया जा सकता:\n" +
          "• `__rl_session_id`: लॉगिन प्रमाणीकरण टोकन।\n" +
          "• `__rl_csrf_token`: सुरक्षा और धोखाधड़ी से बचाव टोकन।\n" +
          "• `__rl_proctor_key`: प्रोक्टरिंग परीक्षा सुरक्षा टोकन।"
      },
      {
        title: "3. कार्यात्मक एवं वरीयता कुकीज़ (Functional Cookies)",
        content: "ये कुकीज़ छात्र की भाषा (हिंदी/अंग्रेजी), थीम मोड (डार्क/लाइट) और साउंड सेटिंग्स को सहेजती हैं।"
      },
      {
        title: "4. प्रदर्शन एवं विश्वसनीयता कुकीज़ (Performance Cookies)",
        content: "ये कुकीज़ सर्वर रिस्पांस टाइम, नेटवर्क स्पीड और पेज लोड वेलोसिटी को बेहतर बनाने में मदद करती हैं।"
      },
      {
        title: "5. एनालिटिक्स एवं उत्पाद निगरानी कुकीज़ (Analytics Cookies)",
        content: "गूगल एनालिटिक्स (`_ga`) की मदद से प्लेटफॉर्म के उपयोग का विश्लेषण किया जाता है। परीक्षा के उत्तर कभी एनालिटिक्स में साझा नहीं होते।"
      },
      {
        title: "6. सेशन बनाम परसिस्टेंट कुकीज़ (Session vs Persistent)",
        content: "1. सेशन कुकीज़: ब्राउज़र बंद करने पर अपने आप हट जाती हैं।\n" +
          "2. परसिस्टेंट कुकीज़: आपकी डिवाइस पर तय समय (30 दिन से 24 महीने) तक सुरक्षित रहती हैं।"
      },
      {
        title: "7. तीसरे पक्ष की कुकीज़ (Third-Party Cookies)",
        content: "रेज़रपे (Razorpay), कैशफ्री (Cashfree) और क्लाउडफ्लेयर (Cloudflare) जैसे सुरक्षित बैंक गेटवे धोखाधड़ी रोकने के लिए कुकीज़ जारी करते हैं।"
      },
      {
        title: "8. कुकी प्रतिधारण समय सारणी (Retention Schedule)",
        content: "`__rl_session_id` (लॉगआउट तक), `__rl_lang_pref` (365 दिन), `_ga` (24 महीने)।"
      },
      {
        title: "9. ब्राउज़र सेटिंग्स एवं कुकी नियंत्रण (Browser Settings)",
        content: "आप गूगल क्रोम, मोज़िला फायरफॉक्स, सफारी या एज की सेटिंग्स में जाकर कुकीज़ को ब्लॉक या डिलीट कर सकते हैं।"
      },
      {
        title: "10. कुकी सहमति ढांचा (Cookie Consent)",
        content: "डीपीडीपी अधिनियम 2023 के तहत पहली बार आने पर कुकी सहमति बैनर दिखाया जाता है जिसे आप कभी भी बदल सकते हैं।"
      },
      {
        title: "11. कुकीज़ ब्लॉक करने का प्रभाव (Disabling Cookies)",
        content: "आवश्यक कुकीज़ ब्लॉक करने पर आप परीक्षा में शामिल नहीं हो पाएंगे और सेशन अपने आप बंद हो जाएगा।"
      },
      {
        title: "12. नीति अद्यतन एवं सूचना सीमा (Policy Updates)",
        content: "कुकी नीति में किसी भी बदलाव की सूचना 15 दिन पहले दी जाएगी।"
      },
      {
        title: "13. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह कुकी नीति भारतीय आईटी अधिनियम 2000 और डीपीडीपी अधिनियम 2023 के तहत 100% कानूनी रूप से बाध्यकारी है। संपर्क: dpo@rankersleague.com।"
      }
    ]
  },

  // ── 1E. Enterprise Community Guidelines ────────────────────────────────────
  {
    slug: "community-guidelines",
    title: "Official Enterprise Community Guidelines",
    titleHi: "आधिकारिक एंटरप्राइज समुदाय दिशा-निर्देश (Community Guidelines)",
    iconName: "Users",
    category: "Conduct & Ethics",
    shortDescription: "Master community standards governing respectful behavior, academic discussions, zero tolerance for abuse, hate speech, harassment, spam, impersonation, reporting workflows, and moderation enforcement.",
    shortDescriptionHi: "आदरपूर्ण व्यवहार, शैक्षणिक चर्चा, दुर्व्यवहार पर शून्य-सहनशीलता, अभद्र भाषा, उत्पीड़न, स्पैम, छद्मवेश और मॉडरेशन नियमों का मास्टर कोड।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "18 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Community Guidelines overhaul detailing 17 operational domains, AI profanity filters, IT Rules 2021 compliance, and 4-tier enforcement matrix." },
      { version: "v3.0", date: "May 2026", summary: "Updated report escalation workflows and anti-harassment shield protocols." }
    ],
    sections: [
      {
        title: "1. Preamble & Academic Integrity Mandate",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') is dedicated to fostering a dignified, safe, empowering, and intellectually rigorous academic community for all candidates preparing for national entrance examinations (JEE, NEET, CUET, SSC, Banking). Every discussion board, contest chat arena, live doubt-solving session, and peer interaction must embody absolute mutual respect, academic integrity, and sportsmanship.",
        bulletPoints: [
          "Dignified Environment: Zero tolerance for hostility, harassment, or toxic behavior.",
          "Academic Focus: All community channels are designed strictly for educational peer learning and constructive debate.",
          "IT Rules 2021 Compliance: Operates in full compliance with the Information Technology (Intermediary Guidelines) Rules, 2021."
        ]
      },
      {
        title: "2. Respectful Behavior & Dignified Student Conduct",
        content: "Candidates must treat all fellow students, rankers, mentors, and moderators with dignity and courtesy. Disagreements must be expressed constructively using civil, objective academic language. Personal attacks, condescension, and derogatory remarks are strictly prohibited."
      },
      {
        title: "3. Academic Discussions & Peer Learning Protocols",
        content: "We encourage active peer learning, problem-solving, and formula walkthroughs across community forums. When posting academic content, candidates must adhere to basic rules:",
        bulletPoints: [
          "Constructive Support: Help peers understand complex concepts without ridiculing their doubts.",
          "Clean Math/Code Formatting: Use standard LaTeX or clean text formatting when sharing mathematical formulas.",
          "No Exam Solution Leaks: Sharing live contest answer keys during an active test window is strictly illegal under Question Paper Policy."
        ]
      },
      {
        title: "4. Healthy Competition & Positive Sportsmanship",
        content: "Ranker's League celebrates competitive excellence while fostering positive sportsmanship. Top rankers must maintain humility, while candidates facing difficult test arenas should receive encouragement. Toxic academic elitism, rank-shaming, or mocking lower scores is forbidden."
      },
      {
        title: "5. Zero Tolerance for Verbal Abuse, Profanity & Defamation",
        content: "Profanity, vulgarity, abusive language, cuss words, personal threats, or defamatory accusations directed at candidates, instructors, or platform staff are strictly prohibited. Automated AI profanity filters mask profanity instantly, and human moderators issue immediate strikes."
      },
      {
        title: "6. Zero Tolerance for Hate Speech & Discrimination",
        content: "Ranker's League enforces an unyielding zero-tolerance policy against hate speech. Any content, comment, or username that promotes discrimination, hatred, or violence against individuals based on race, ethnicity, religion, caste, gender, sexual orientation, disability, or regional origin is strictly illegal under Indian law and results in immediate permanent banishment."
      },
      {
        title: "7. Zero Tolerance for Harassment & Cyberstalking",
        content: "Persistent unwanted messaging, private message spamming, stalking candidates across social platforms, unwanted romantic advances, or intimidating behavior is strictly prohibited. Victims can utilize the 'Block Candidate' and 'Report Harassment' tools for instant protection."
      },
      {
        title: "8. Zero Tolerance for Bullying & Cyber-Intimidation",
        content: "We protect younger candidates, school students, and beginners from academic bullying, public ridicule, or targeted dogpiling. Any candidate engaging in systematic intimidation or public shaming will be removed from the platform immediately."
      },
      {
        title: "9. Prohibition of Spam, Phishing & Unsolicited Links",
        content: "Community forums must remain free from commercial spam and malicious content. The following are strictly banned:",
        bulletPoints: [
          "Repetitive Message Flooding: Posting duplicate comments or emojis repeatedly across chat streams.",
          "External Group Invites: Posting links to unauthorized WhatsApp groups, Telegram channels, or external Discord servers.",
          "Phishing & Malware: Sharing deceptive links, paid test series scams, or malicious download links."
        ]
      },
      {
        title: "10. Prohibition of Fake Accounts & Identity Fraud",
        content: "Candidates must represent themselves authentically. Creating fake profiles, alt accounts, or sockpuppet accounts to manipulate community upvotes, harass users, or enter contest arenas is strictly illegal."
      },
      {
        title: "11. Prohibition of Impersonation",
        content: "Posing as Ranker's League executives, moderators, exam toppers, subject matter experts, or famous coaching faculty is a severe offense resulting in immediate lifetime account termination and legal action."
      },
      {
        title: "12. Prohibition of Commercial Promotion & Self-Advertising",
        content: "All unauthorized commercial advertising is banned. Candidates may not post affiliate links, sell study notes, promote third-party coaching institutes, or advertise private paid services within community channels."
      },
      {
        title: "13. In-App Reporting System & Moderation Workflows",
        content: "Ranker's League provides robust in-app reporting tools on every comment, post, and chat message. Candidates can tap 'Report' and select a category (Harassment, Hate Speech, Spam, Cheating). Reported items enter our 24/7 Moderation Queue and are reviewed within 15 minutes by human compliance officers."
      },
      {
        title: "14. Community Moderation & AI Content Filtering",
        content: "Our moderation system operates a dual-layer defense:\n" +
          "1. AI Automated Filter: Real-time Natural Language Processing (NLP) models detect and mask profanity, hate speech, and spam links automatically.\n" +
          "2. Human Moderation Board: Certified compliance officers review flagged reports, issue formal strikes, and handle account appeals."
      },
      {
        title: "15. Graduated Violation Matrix & Penalties",
        content: "Violations of these guidelines trigger enforced penalties based on severity:\n" +
          "• Level 1 (Minor Misconduct): System warning pop-up & 24-hour community mute.\n" +
          "• Level 2 (Moderate Spam / Rudeness): 7-day posting ban.\n" +
          "• Level 3 (Severe Harassment / Hate Speech): 30-day account suspension & prize forfeiture.\n" +
          "• Level 4 (Illegal Activity / Impersonation / Paper Leak): Permanent lifetime account banishment & legal notice."
      },
      {
        title: "16. Formal Appeals & Reinstatement Protocol",
        content: "Candidates who believe their posting privileges were restricted in error may submit a formal appeal within 48 hours via Legal Center > Appeals Hub. Appeals are reviewed by an independent moderation board within 3 business days."
      },
      {
        title: "17. Official Governance Legal Disclaimer",
        content: "These Community Guidelines form an integral part of the Ranker's League Terms of Service and are legally binding under the Information Technology Rules, 2021 of India. For community moderation inquiries, contact `moderation@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. प्रस्तावना एवं अकादमिक अखंडता जनादेश (Preamble)",
        content: "रैंकर्स लीग सभी प्रतियोगी परीक्षा (JEE, NEET, CUET, SSC) उम्मीदवारों के लिए एक सुरक्षित, आदरणीय और गरिमापूर्ण समुदाय बनाने के लिए प्रतिबद्ध है। सभी चर्चाओं में आपसी सम्मान और शैक्षणिक अखंडता अनिवार्य है।"
      },
      {
        title: "2. आदरणीय व्यवहार एवं छात्र आचार (Respectful Behavior)",
        content: "सभी छात्रों, टॉपर्स और शिक्षकों के साथ आदरपूर्वक व्यवहार करें। व्यक्तिगत हमलों और अभद्र भाषा का प्रयोग पूरी तरह प्रतिबंधित है।"
      },
      {
        title: "3. शैक्षणिक चर्चा एवं सहपाठी अध्ययन (Academic Discussions)",
        content: "हम प्रश्नों के समाधान और अध्ययन तकनीकों को साझा करने को प्रोत्साहित करते हैं। परीक्षा के दौरान लाइव उत्तर लीक करना अवैध है।"
      },
      {
        title: "4. स्वस्थ प्रतिस्पर्धा एवं खेल भावना (Healthy Competition)",
        content: "टॉपर्स का सम्मान करें और कठिन परीक्षा के बाद साथियों का उत्साहवर्धन करें। किसी के कम अंकों का मजाक उड़ाना सख्त मना है।"
      },
      {
        title: "5. गाली-गलौज एवं मानहानि पर शून्य सहनशीलता (No Abuse)",
        content: "गाली-गलौज, अश्लील भाषा या मानहानि करने पर खाता तुरंत म्यूट और प्रतिबंधित कर दिया जाएगा।"
      },
      {
        title: "6. अभद्र भाषा एवं भेदभाव पर पूर्ण प्रतिबंध (No Hate Speech)",
        content: "धर्म, जाति, लिंग, क्षेत्र या समुदाय के आधार पर नफरत फैलाने वाली भाषा का प्रयोग करने पर बिना चेतावनी के स्थायी प्रतिबंध लगाया जाएगा।"
      },
      {
        title: "7. उत्पीड़न एवं साइबर स्टॉकिंग पर प्रतिबंध (No Harassment)",
        content: "किसी छात्र को बार-बार अवांछित संदेश भेजना या परेशान करना सख्त मना है। पीड़ित छात्र 'Block' और 'Report' टूल का उपयोग कर सकते हैं।"
      },
      {
        title: "8. डराने-धमकाने पर शून्य सहनशीलता (No Bullying)",
        content: "नाबालिग और नए छात्रों को सार्वजनिक रूप से नीचा दिखाने या धमकाने पर सख्त कार्रवाई की जाएगी।"
      },
      {
        title: "9. स्पैम एवं फर्जी लिंक पर प्रतिबंध (No Spam)",
        content: "बार-बार एक ही संदेश भेजना, बाहरी व्हाट्सएप/टेलीग्राम ग्रुप के लिंक पोस्ट करना या फर्जी वेबसाइट लिंक साझा करना प्रतिबंधित है।"
      },
      {
        title: "10. फर्जी खातों पर प्रतिबंध (No Fake Accounts)",
        content: "दूसरों को परेशान करने या वोटिंग में हेरफेर के लिए फर्जी खाते बनाना पूरी तरह अवैध है।"
      },
      {
        title: "11. छद्मवेश (Impersonation) पर पूर्ण प्रतिबंध",
        content: "रैंकर्स लीग के अधिकारी, टॉपर या शिक्षक बनने का नाटक करने पर खाता तुरंत बंद करके कानूनी कार्रवाई की जाएगी।"
      },
      {
        title: "12. व्यावसायिक प्रचार पर प्रतिबंध (No Promotion)",
        content: "सामुदायिक मंचों पर निजी कोचिंग, टेस्ट सीरीज़ या पेड नोट्स का प्रचार करना सख्त मना है।"
      },
      {
        title: "13. इन-ऐप रिपोर्टिंग प्रणाली (Reporting System)",
        content: "हर पोस्ट और संदेश पर 'Report' बटन उपलब्ध है। रिपोर्ट किए गए कंटेंट की समीक्षा 15 मिनट के भीतर की जाती है।"
      },
      {
        title: "14. समुदाय मॉडरेशन एवं एआई फिल्टर (Moderation)",
        content: "एआई ऑटोमेटेड सिस्टम अभद्र भाषा को तुरंत ब्लॉक करता है और मॉडरेशन टीम 24/7 समीक्षा करती है।"
      },
      {
        title: "15. उल्लंघन एवं चरणबद्ध दंड (Penalties)",
        content: "चेतावनी (24 घंटे म्यूट), 7 दिन का प्रतिबंध, 30 दिन का निलंबन, और गंभीर मामलों में स्थायी खाता समाप्ति (Lifetime Ban)।"
      },
      {
        title: "16. अपील प्रक्रिया (Appeals)",
        content: "गलती से प्रतिबंध लगने पर छात्र 48 घंटे के भीतर लीगल सेंटर से अपील कर सकता है।"
      },
      {
        title: "17. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह समुदाय दिशा-निर्देश भारतीय आईटी नियम 2021 के तहत 100% कानूनी रूप से बाध्यकारी हैं। संपर्क: moderation@rankersleague.com।"
      }
    ]
  },

  // ── 1F. Enterprise Code of Conduct ─────────────────────────────────────────
  {
    slug: "code-of-conduct",
    title: "Official Enterprise Code of Conduct",
    titleHi: "आधिकारिक एंटरप्राइज आचार संहिता (Code of Conduct)",
    iconName: "ShieldCheck",
    category: "Conduct & Ethics",
    shortDescription: "Master organizational code detailing institutional ethics, academic integrity, contest discipline, communication standards, user/platform duties, violations, and disciplinary actions.",
    shortDescriptionHi: "संस्थागत नैतिकता, अकादमिक अखंडता, परीक्षा अनुशासन, संचार मानकों, उपयोगकर्ता और प्लेटफॉर्म कर्तव्यों तथा अनुशासनात्मक कार्रवाई का मास्टर कोड।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "18 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Code of Conduct overhaul detailing institutional ethics, user vs platform duties, academic integrity, 4-tier disciplinary matrix, and formal appeals." },
      { version: "v3.0", date: "April 2026", summary: "Updated platform transparency obligations and proctoring audit window guidelines." }
    ],
    sections: [
      {
        title: "1. Institutional Ethics & Moral Mandate",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') is governed by an unyielding institutional commitment to moral integrity, absolute fairness, zero corruption, zero favoritism, and equal meritocratic opportunity for all students preparing for national entrance examinations (JEE, NEET, CUET, SSC, Banking). This Code of Conduct establishes the binding ethical expectations for all candidates, mentors, and platform representatives.",
        bulletPoints: [
          "Uncompromised Integrity: Every All India Rank (AIR), percentile score, and reward must reflect genuine intellectual effort.",
          "Equal Meritocracy: Every candidate competes under identical sandboxed technical parameters.",
          "Institutional Accountability: Ranker's League holds its platform algorithms and administrative staff to the highest ethical standards."
        ]
      },
      {
        title: "2. Academic Integrity & Honest Meritocracy",
        content: "Academic integrity is the cornerstone of Ranker's League. Candidates explicitly pledge to attempt all practice tests and prize contests relying solely on their individual intellectual capability. Utilizing artificial intelligence solvers (ChatGPT, Gemini), proxy test-takers, secondary devices, paper leaks, or collusion is strictly prohibited and legally actionable."
      },
      {
        title: "3. Contest Conduct & Arena Discipline",
        content: "During active examination sessions, candidates must maintain strict arena discipline:",
        bulletPoints: [
          "Fullscreen Focus: Remaining inside the sandboxed test window without attempting tab switching or focus loss.",
          "Proctoring Compliance: Maintaining clear webcam visibility and un-muted microphone ambient audio when entering proctored arenas.",
          "Timer Respect: Submitting answer vectors prior to timer expiration without attempting client-side API script manipulation."
        ]
      },
      {
        title: "4. Professional Communication Standards",
        content: "All interactions across platform forums, live chat streams, doubt-solving channels, and support tickets must adhere to professional etiquette. Communication must remain civil, constructive, objective, and respectful. Obscenity, profanity, and derogatory insults are strictly banned."
      },
      {
        title: "5. Mutual Respect, Diversity & Inclusivity",
        content: "Ranker's League welcomes students from all backgrounds across India regardless of race, caste, religion, gender, region, or financial status. We enforce zero tolerance for discrimination, hate speech, harassment, or rank-shaming. Every candidate deserves an encouraging, safe environment."
      },
      {
        title: "6. User Rights & Primary Candidate Responsibilities",
        content: "Candidates possess rights to fair proctored exams, transparent leaderboards, and fast withdrawals, accompanied by mandatory responsibilities:\n" +
          "1. Single Account Obligation: Maintaining strictly ONE verified personal account.\n" +
          "2. Credential Security: Safeguarding account passwords and OTPs against third-party access.\n" +
          "3. KYC Compliance: Providing accurate government identity documents (PAN/Aadhaar) for prize withdrawals exceeding ₹10,000 INR.\n" +
          "4. Integrity Reporting: Reporting suspected cheating or technical anomalies through official support channels."
      },
      {
        title: "7. Platform Duties & Institutional Responsibilities",
        content: "Ranker's League commits to explicit institutional duties:\n" +
          "• 100% Fair Execution: Operating un-biased, auditable examination engines free from arbitrary score manipulation.\n" +
          "• 70% Threshold Guarantee: Automatically cancelling contests and refunding 100% entry fees within 15 minutes if seat fill falls below 70%.\n" +
          "• 2-Hour Audit Window: Conducting thorough forensic audits before locking final All India Ranks and prize payouts.\n" +
          "• Data Security: Protecting candidate data using bank-grade AES-256 encryption."
      },
      {
        title: "8. Classification of Conduct Violations",
        content: "Infractions are classified into four operational categories:\n" +
          "1. Category A (Minor Misconduct): Brief focus loss, tab-switch warnings, mild forum rudeness.\n" +
          "2. Category B (Academic Fraud): Utilizing AI solvers, secondary devices, screen sharing, or proxy candidates.\n" +
          "3. Category C (Financial Fraud): Payment chargeback abuse, multi-account referral farming, or wallet manipulation.\n" +
          "4. Category D (Systemic Corruption): Hacking platform APIs, leaking test question papers, or threatening staff."
      },
      {
        title: "9. Disciplinary Actions & Enforced Penalties",
        content: "Confirmed violations trigger enforced disciplinary measures:\n" +
          "• Level 1 (Warning): Official warning notification & 24-hour feature mute.\n" +
          "• Level 2 (Moderate Misconduct): 7-day community ban & contest score cancellation.\n" +
          "• Level 3 (Severe Academic Fraud): 30-day account suspension, prize money forfeiture, & rank removal.\n" +
          "• Level 4 (Illegal Activity / Impersonation / Paper Leak): Permanent lifetime account banishment, wallet balance seizure, & statutory law enforcement escalation."
      },
      {
        title: "10. Formal Appeals & Due Process Protocol",
        content: "Candidates facing disciplinary restrictions possess the right to due process. A formal appeal may be filed within 48 hours via Legal Center > Appeals Hub. Appeals are reviewed by an independent Disciplinary Committee within 3 business days."
      },
      {
        title: "11. Policy Updates & Change Management SLAs",
        content: "Ranker's League reserves the right to update this Code of Conduct. Material revisions will be published with a 15-day prior notice tag. Immutable version history logs (`v1.0` through `v4.0`) are publicly maintained."
      },
      {
        title: "12. Official Governance Legal & Regulatory Disclaimer",
        content: "This Code of Conduct forms a legally binding agreement under the Indian Contract Act, 1872 and IT Act, 2000. For ethics or compliance inquiries, contact our Ethics Committee at `ethics@rankersleague.com` / `legal@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. संस्थागत नैतिकता एवं नैतिक जनादेश (Institutional Ethics)",
        content: "रैंकर्स लीग 100% नैतिक अखंडता, निष्पक्षता, शून्य भ्रष्टाचार और सभी छात्रों के लिए समान अवसर के सिद्धांत पर संचालित होता है। यह आचार संहिता सभी उम्मीदवारों और कर्मचारियों पर लागू होती है।"
      },
      {
        title: "2. अकादमिक अखंडता एवं निष्पक्ष परीक्षा (Academic Integrity)",
        content: "सभी परीक्षाएं केवल व्यक्तिगत योग्यता के आधार पर दी जानी चाहिए। एआई टूल्स (ChatGPT, Gemini), प्रॉक्सी कैंडिडेट, नकल या पेपर लीक पूरी तरह से अवैध है।"
      },
      {
        title: "3. परीक्षा आचार एवं अनुशासन (Contest Conduct)",
        content: "परीक्षा के दौरान फुलस्क्रीन मोड में रहें, वेबकैम/माइक्रोफोन चालू रखें और समय सीमा का पालन करें।"
      },
      {
        title: "4. पेशेवर संचार मानक (Communication Standards)",
        content: "मंच पर सभी चर्चाएं और संदेश आदरपूर्ण और पेशेवर होने चाहिए। गाली-गलौज और अपमानजनक भाषा प्रतिबंधित है।"
      },
      {
        title: "5. आपसी सम्मान एवं समावेशिता (Mutual Respect)",
        content: "सभी छात्रों के साथ सम्मानपूर्वक व्यवहार करें। धर्म, जाति, लिंग या अंकों के आधार पर भेदभाव पूरी तरह प्रतिबंधित है।"
      },
      {
        title: "6. उपयोगकर्ता अधिकार एवं कर्तव्य (User Responsibilities)",
        content: "केवल एक सत्यापित खाता रखें, अपना पासवर्ड सुरक्षित रखें और ₹10,000 से अधिक विथड्रॉल पर पैन/आधार केवाईसी जमा करें।"
      },
      {
        title: "7. प्लेटफॉर्म के संस्थागत कर्तव्य (Platform Duties)",
        content: "100% निष्पक्ष परीक्षा, 70% सीट न भरने पर 15 मिनट में रिफंड, 2 घंटे का फॉरेंसिक ऑडिट और AES-256 डेटा सुरक्षा देना प्लेटफॉर्म की जिम्मेदारी है।"
      },
      {
        title: "8. उल्लंघनों का वर्गीकरण (Classification of Violations)",
        content: "मामूली गलतियां (म्यूट), अकादमिक धोखाधड़ी (स्कोर रद्द), वित्तीय धोखाधड़ी (खाता बंद), और साइबर अपराध (कानूनी कार्रवाई)।"
      },
      {
        title: "9. अनुशासनात्मक कार्रवाई एवं दंड सारणी (Disciplinary Actions)",
        content: "चेतावनी, 7 दिन का प्रतिबंध, 30 दिन का निलंबन, और गंभीर मामलों में स्थायी खाता समाप्ति (Lifetime Ban) तथा राशि जब्ती।"
      },
      {
        title: "10. अपील एवं निष्पक्ष प्रक्रिया (Appeals)",
        content: "दंड के खिलाफ छात्र 48 घंटे के भीतर लीगल सेंटर से अपील कर सकता है। स्वतंत्र समिति 3 दिनों में निर्णय लेगी।"
      },
      {
        title: "11. नीति अद्यतन एवं सूचना सीमा (Policy Updates)",
        content: "आचार संहिता में बदलाव की सूचना 15 दिन पहले दी जाएगी।"
      },
      {
        title: "12. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह आचार संहिता भारतीय अनुबंध अधिनियम 1872 और आईटी अधिनियम 2000 के तहत कानूनी रूप से बाध्यकारी है। संपर्क: ethics@rankersleague.com।"
      }
    ]
  },

  // ── 1G. Enterprise Contest Eligibility Policy ─────────────────────────────
  {
    slug: "eligibility",
    title: "Official Enterprise Contest Eligibility Policy",
    titleHi: "आधिकारिक एंटरप्राइज प्रतियोगिता पात्रता नीति (Eligibility Policy)",
    iconName: "UserCheck",
    category: "Platform & Security",
    shortDescription: "Master rules governing registration eligibility, age thresholds, minor consent, country residency, statutory KYC, One-Student-One-Account, One-Entry rules, restricted categories, and FAQs.",
    shortDescriptionHi: "पंजीकरण पात्रता, आयु सीमा, अभिभावक सहमति, निवासी नियम, वैधानिक केवाईसी, एकल खाता नियम, एकल प्रवेश नियम और प्रतिबंधित श्रेणियों का मास्टर कोड।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "15 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Eligibility Policy overhaul detailing 11 operational domains, minor consent protocols, NRI rules, ₹10k KYC thresholds, and One-Student-One-Account enforcement." },
      { version: "v3.0", date: "May 2026", summary: "Updated state residency compliance and video KYC procedures." }
    ],
    sections: [
      {
        title: "1. Overview & Core Eligibility Criteria",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') enforces transparent, standardized eligibility rules for all candidates participating in competitive entrance examination mock contests (JEE, NEET, CUET, SSC, Banking). Participation is open to all genuine student candidates who satisfy our account registration, age, residency, statutory KYC, and fair-play requirements.",
        bulletPoints: [
          "Equal Access: Open to all academic aspirants preparing for national entrance exams across India.",
          "Verifiable Identity: All candidates must maintain an authentic, single verified user profile.",
          "Statutory Compliance: Governed by the Indian Contract Act, 1872 and Income Tax Act, 1961."
        ]
      },
      {
        title: "2. Student Registration & Account Verification Requirements",
        content: "To enter any practice contest or prize arena, candidates must complete standard registration requirements:",
        bulletPoints: [
          "Active Mobile Number: Verification via mandatory one-time password (OTP) sent to an active Indian mobile number.",
          "Valid Email Address: Verified email account for receiving contest tickets, scorecards, and tax certificates.",
          "Academic Profile Setup: Accurate selection of Academic Stream (PCM/PCB/Commerce), Target Exam Year, and City/State of Residence."
        ]
      },
      {
        title: "3. Age Requirements & Minor Student Consent Protocols",
        content: "Age eligibility operates under clear statutory guidelines:\n" +
          "1. Practice Arenas (Free): Open to students aged 13 and above.\n" +
          "2. Prize Contests: Open independently to candidates aged 18 and above. Candidates under 18 years of age ('Minors') may participate in prize contests strictly under parental or legal guardian supervision and consent.\n" +
          "3. Parental Responsibility: Parents or guardians are legally responsible for managing minor candidates' account activities and wallet transactions."
      },
      {
        title: "4. Geographic & Country Residency Criteria",
        content: "Ranker's League contests are open to Indian citizens, Non-Resident Indians (NRIs), and domestic residents residing across all 28 States and 8 Union Territories of India. NRIs must possess a valid Indian bank account / UPI VPA and PAN card for prize money tax remitting."
      },
      {
        title: "5. Statutory KYC & Identity Verification Thresholds",
        content: "To comply with Indian tax laws (Section 194BA) and Anti-Money Laundering (AML) standards, identity verification is strictly enforced:\n" +
          "• Threshold: KYC completion is mandatory prior to processing cumulative lifetime withdrawals exceeding ₹10,000 INR.\n" +
          "• Required Documents: Valid PAN Card copy, masked Aadhaar Card copy, and a 60-second Live Video KYC verification clip.\n" +
          "• Name Match: The name on the government ID must exactly match the candidate's registered bank account / UPI profile."
      },
      {
        title: "6. Mandatory 'One Student, One Account' Rule",
        content: "Every candidate is strictly limited to ONE verified Ranker's League account. Operating multiple accounts, secondary profiles, or shared logins is a severe violation resulting in immediate permanent banishment and forfeiture of all wallet balances across all linked accounts."
      },
      {
        title: "7. Mandatory 'One Entry Per Contest' Rule",
        content: "A registered candidate may enter a specific live contest arena exactly ONCE. Attempting to enter the same contest arena multiple times using alternate accounts or proxy profiles results in immediate disqualification of all submitted test attempts."
      },
      {
        title: "8. Restricted Users & Ineligible Categories",
        content: "The following categories of individuals are strictly prohibited from entering prize contests on Ranker's League:\n" +
          "1. Employees, directors, software developers, and contractors of Ranker's League Technologies Private Limited.\n" +
          "2. Question paper setters, subject matter experts, and proctoring auditors involved in contest preparation.\n" +
          "3. Immediate family members (spouses, children, parents, siblings) of Ranker's League staff.\n" +
          "4. Accounts previously terminated for Fair Play breaches or fraud."
      },
      {
        title: "9. Immediate Disqualification Triggers & Penalty Protocols",
        content: "A candidate is subject to immediate disqualification and account suspension for:\n" +
          "• Submitting fake, altered, or forged PAN/Aadhaar KYC documents.\n" +
          "• Operating multi-accounts or using VPN/proxy networks to hide geolocation.\n" +
          "• Employing proxy test-takers or utilizing AI solvers (ChatGPT, Gemini) during live tests.\n" +
          "• Consequences: Zero score assignment, All India Rank removal, wallet balance seizure, and legal notice."
      },
      {
        title: "10. Frequently Asked Questions (FAQs) on Eligibility",
        content: "Q1: Can a Class 11/12 student enter prize contests?\n" +
          "Ans: Yes, students under 18 can enter prize contests under parental/guardian supervision.\n\n" +
          "Q2: Are NRIs eligible to participate and win cash prizes?\n" +
          "Ans: Yes, provided they have a valid Indian bank account/UPI and PAN card for statutory TDS deduction.\n\n" +
          "Q3: What if I accidentally created two accounts in the past?\n" +
          "Ans: Contact support@rankersleague.com immediately to merge and deactivate the secondary account before entering any live contest.\n\n" +
          "Q4: Is PAN Card mandatory for withdrawals under ₹10,000?\n" +
          "Ans: Basic profile verification is required for small amounts; PAN card becomes mandatory once lifetime cumulative withdrawals reach ₹10,000.\n\n" +
          "Q5: Can coaching institute teachers enter student contests?\n" +
          "Ans: Teachers and faculty members may enter practice tests but are ineligible for student prize pool ranks."
      },
      {
        title: "11. Official Governance Legal & Regulatory Disclaimer",
        content: "This Contest Eligibility Policy forms a legally binding agreement under the Indian Contract Act, 1872 and IT Act, 2000. For eligibility or KYC inquiries, contact `eligibility@rankersleague.com` / `kyc@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं मुख्य पात्रता मानदंड (Overview)",
        content: "रैंकर्स लीग प्रतियोगी प्रवेश परीक्षाओं (JEE, NEET, CUET, SSC) के लिए पारदर्शी और मानकीकृत पात्रता नियम लागू करता है। यह नीति सभी वास्तविक छात्रों के लिए खुली है जो हमारे नियमों का पालन करते हैं।"
      },
      {
        title: "2. छात्र पंजीकरण एवं खाता सत्यापन (Registration)",
        content: "पंजीकरण के लिए सक्रिय भारतीय मोबाइल नंबर (ओटीपी सत्यापन), वैध ईमेल आईडी और सटीक शैक्षणिक स्ट्रीम (PCM/PCB) का चयन अनिवार्य है।"
      },
      {
        title: "3. आयु सीमा एवं अभिभावक सहमति (Age & Minor Consent)",
        content: "मुफ्त अभ्यास परीक्षाएं 13 वर्ष से अधिक आयु के छात्रों के लिए खुली हैं। 18 वर्ष से कम आयु के छात्र ('नाबालिग') माता-पिता की सहमति और देखरेख में नकद पुरस्कार प्रतियोगिताओं में भाग ले सकते हैं।"
      },
      {
        title: "4. निवासी एवं भौगोलिक नियम (Residency)",
        content: "भारत के सभी 28 राज्यों और 8 केंद्र शासित प्रदेशों के छात्र तथा अनिवासी भारतीय (NRI) भाग ले सकते हैं। एनआरआई के पास भारतीय बैंक खाता/यूपीआई और पैन कार्ड होना अनिवार्य है।"
      },
      {
        title: "5. वैधानिक केवाईसी एवं पहचान सत्यापन (KYC Threshold)",
        content: "₹10,000 से अधिक कुल विथड्रॉल पर पैन कार्ड, आधार कार्ड और 60-सेकंड लाइव वीडियो केवाईसी जमा करना अनिवार्य है। पैन और बैंक खाते का नाम बिल्कुल समान होना चाहिए।"
      },
      {
        title: "6. 'एक छात्र, एक खाता' नियम (One Student One Account)",
        content: "प्रत्येक छात्र को केवल एक सत्यापित खाता रखने की अनुमति है। एक से अधिक खाते बनाने पर सभी खाते स्थायी रूप से बंद कर दिए जाएंगे और राशि जब्ती होगी।"
      },
      {
        title: "7. 'एक प्रतियोगिता, एक प्रवेश' नियम (One Entry Rule)",
        content: "एक छात्र एक ही परीक्षा में केवल एक बार प्रवेश ले सकता है। फर्जी खातों से दोबारा परीक्षा देने पर सभी प्रयास रद्द कर दिए जाएंगे।"
      },
      {
        title: "8. प्रतिबंधित श्रेणियां (Restricted Categories)",
        content: "रैंकर्स लीग के कर्मचारी, सॉफ्टवेयर डेवलपर, प्रश्न पत्र बनाने वाले विशेषज्ञ, प्रोक्टर और उनके निकटतम परिजन पुरस्कार प्रतियोगिताओं में भाग नहीं ले सकते।"
      },
      {
        title: "9. अयोग्यता के कारण एवं दंड (Disqualification)",
        content: "फर्जी केवाईसी दस्तावेज, मल्टी-अकाउंट, वीपीएन का उपयोग, प्रॉक्सी कैंडिडेट या एआई मॉडल का उपयोग करने पर खाता बंद और राशि जब्त की जाएगी।"
      },
      {
        title: "10. अक्सर पूछे जाने वाले प्रश्न (FAQs)",
        content: "प्र1: क्या 11वीं/12वीं के छात्र भाग ले सकते हैं?\n" +
          "उत्तर: हां, माता-पिता की देखरेख में।\n\n" +
          "प्र2: क्या एनआरआई छात्र नकद पुरस्कार जीत सकते हैं?\n" +
          "उत्तर: हां, भारतीय बैंक खाते और पैन कार्ड के साथ।\n\n" +
          "प्र3: यदि मेरे पास दो खाते हैं तो क्या करूं?\n" +
          "उत्तर: तुरंत support@rankersleague.com पर संपर्क करके दूसरा खाता बंद करवाएं।"
      },
      {
        title: "11. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह पात्रता नीति भारतीय अनुबंध अधिनियम 1872 और आयकर अधिनियम 1961 के तहत 100% कानूनी रूप से बाध्यकारी है। संपर्क: eligibility@rankersleague.com।"
      }
    ]
  },

  // ── 1H. Enterprise Tie Breaking Policy ─────────────────────────────────────
  {
    slug: "tie-breaking",
    title: "Official Enterprise Tie Breaking Policy",
    titleHi: "आधिकारिक एंटरप्राइज टाई-ब्रेकिंग नीति (Tie Breaking Policy)",
    iconName: "GitMerge",
    category: "Contests & Gameplay",
    shortDescription: "Master mathematical framework governing multi-level tie-resolution rules, raw score hierarchy, accuracy ratios, negative mark minimization, response speed timing, shared rank allocation, and equal prize splitting formulas.",
    shortDescriptionHi: "टाई समाधान नियमों, अंक पदानुक्रम, सटीकता अनुपात, नकारात्मक अंक न्यूनतमकरण, उत्तर गति, साझा रैंक और समान पुरस्कार वितरण गणित का मास्टर कोड।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "15 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Tie Breaking Policy overhaul detailing 12 operational domains, 4-level resolution hierarchy, mathematical split formulas, and 2-hr audit window protocols." },
      { version: "v3.0", date: "June 2026", summary: "Updated millisecond timing precision metrics and shared rank trophy distribution rules." }
    ],
    sections: [
      {
        title: "1. Preamble & Deterministic Tie Resolution Principles",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') is committed to 100% mathematical predictability, absolute fairness, and objective transparency in determining All India Ranks (AIR) and distributing prize rewards. Ties between candidates are resolved through automated, multi-tiered deterministic algorithms without subjective manual interference, coin tosses, or arbitrary decisions.",
        bulletPoints: [
          "Automated Resolution: Multi-level algorithmic filtration executed instantly upon contest submission.",
          "Zero Arbitrary Action: No coin tosses, manual overrides, or subjective moderator interventions.",
          "Auditable Calculations: Every candidate receives a detailed scorecard displaying all tie-breaker parameter values."
        ]
      },
      {
        title: "2. Level 1 Tie-Breaker: Total Raw Marks Hierarchy",
        content: "The primary rank determinant is the Total Raw Marks achieved by the candidate during the examination, calculated under standard marking parameters (+4 marks for each correct response, -1 mark for each incorrect response, 0 for unattempted questions)."
      },
      {
        title: "3. Level 2 Tie-Breaker: Percentage Accuracy Ratio",
        content: "If two or more candidates achieve identical Total Raw Marks, rank precedence is determined by Percentage Accuracy Ratio, calculated as:\n" +
          "$$\\text{Accuracy \\%} = \\left(\\frac{\\text{Total Correct Responses}}{\\text{Total Attempted Questions}}\\right) \\times 100$$\n" +
          "The candidate with the higher accuracy percentage earns higher rank precedence."
      },
      {
        title: "4. Level 3 Tie-Breaker: Negative Mark Minimization",
        content: "If candidates remain tied after accuracy calculation, rank precedence is awarded to the candidate with the fewest incorrect responses (minimum negative marks deducted)."
      },
      {
        title: "5. Level 4 Tie-Breaker: Speed & Time Taken per Correct Response",
        content: "If candidates remain tied across marks, accuracy, and incorrect attempts, rank precedence is determined by Net Examination Completion Time (`mm:ss.mmm`). The candidate who completed the examination in faster total net time takes precedence."
      },
      {
        title: "6. Rank Determination for Unresolved Shared Positions",
        content: "If two or more candidates tie across ALL 4 levels (identical raw marks, identical accuracy, identical incorrect count, and identical net completion time), they are awarded a Shared All India Rank (e.g. Joint Rank 2). The subsequent candidate receives the rank position corresponding to total filled slots."
      },
      {
        title: "7. Mathematical Prize Distribution Formula for Shared Positions",
        content: "When candidates share a rank position, the cash prizes allocated for those tied rank slots are aggregated and divided equally among the tied candidates:\n" +
          "$$\\text{Individual Cash Payout} = \\frac{\\sum_{i=1}^{k} \\text{Payout of Rank Slot } R_i}{k}$$\n" +
          "Worked Example: Candidate A and Candidate B tie for Rank 2 in an arena where Rank 2 pays ₹100,000 INR and Rank 3 pays ₹75,000 INR.\n" +
          "Combined Pool = ₹100,000 + ₹75,000 = ₹175,000 INR.\n" +
          "Final Payout: Candidate A receives ₹87,500 INR and Candidate B receives ₹87,500 INR. The next candidate receives Rank 4."
      },
      {
        title: "8. Special Cases & Complex Edge Scenarios",
        content: "1. 100% Perfect Score Scenario: Multiple candidates scoring 100% marks with zero errors share the top rank slot. Cash prizes sum and divide equally.\n" +
          "2. Rank Cut-Off Boundary Ties: Ties occurring on the border of prize payout tiers (e.g. Rank 10 and Rank 11 where Rank 10 is Top 1% and Rank 11 is Top 5%). Cash prizes sum and divide equally, ensuring neither candidate is penalized.\n" +
          "3. Trophy Allocation: In cases of joint Rank 1, duplicate physical trophies are manufactured and dispatched to both joint toppers."
      },
      {
        title: "9. Forensic Verification & 2-Hour Audit Window",
        content: "All tied standings enter a mandatory 2-Hour Forensic Audit Period following test closure. Compliance officers audit proctoring logs, webcam snapshots, and timestamp vectors to confirm tied candidates did not engage in collusion or synchronized cheating."
      },
      {
        title: "10. Appeals & Scorecard Dispute Resolution Protocols",
        content: "Candidates who believe their tie-breaker metrics were calculated incorrectly due to technical server latency may submit a formal appeal within 48 hours via Legal Center > Appeals Hub. Independent technical auditors re-calculate timing logs and response vectors within 3 business days."
      },
      {
        title: "11. Frequently Asked Questions (FAQs) on Tie Resolution",
        content: "Q1: Does submitting early improve my rank if I have higher marks?\n" +
          "Ans: Marks take first priority. Speed only breaks ties between candidates with identical marks, accuracy, and negative marks.\n\n" +
          "Q2: How does a tie affect my All India Rank certificate?\n" +
          "Ans: Joint rankers receive official AIR certificates reflecting their joint rank (e.g. 'AIR 2 (Joint)').\n\n" +
          "Q3: Are bonus credits or referral rewards split during a tie?\n" +
          "Ans: Yes, all cash and promotional prize allocations for tied rank slots are aggregated and split equally."
      },
      {
        title: "12. Official Governance Legal & Mathematical Disclaimer",
        content: "This Tie Breaking Policy is governed by the laws of India and constitutes a binding mathematical standard. For tie resolution inquiries, contact `tiebreaking@rankersleague.com` / `audit@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. प्रस्तावना एवं टाई समाधान के गणितीय सिद्धांत (Overview)",
        content: "रैंकर्स लीग 100% गणितीय शुद्धता और पारदर्शिता के साथ ऑल इंडिया रैंक (AIR) और पुरस्कार राशि तय करता है। टाई का समाधान स्वचालित गणितीय प्रणालियों द्वारा किया जाता है।"
      },
      {
        title: "2. स्तर 1 टाई-ब्रेकर: कुल प्राप्तांक (Total Raw Marks)",
        content: "रैंक निर्धारण का पहला मापदंड छात्र द्वारा प्राप्त कुल अंक (+4 सही उत्तर के लिए, -1 गलत उत्तर के लिए) हैं।"
      },
      {
        title: "3. स्तर 2 टाई-ब्रेकर: प्रतिशत सटीकता अनुपात (Accuracy Ratio)",
        content: "अंक समान होने पर उच्च सटीकता (Accuracy %) वाले छात्र को उच्च रैंक दी जाती है:\n" +
          "$$\\text{सटीकता \\%} = \\left(\\frac{\\text{सही उत्तर}}{\\text{कुल प्रयास}}\\right) \\times 100$$"
      },
      {
        title: "4. स्तर 3 टाई-ब्रेकर: न्यूनतम नकारात्मक अंक (Minimum Negative Marks)",
        content: "अंक और सटीकता समान होने पर सबसे कम गलत उत्तर देने वाले छात्र को प्राथमिकता दी जाती है।"
      },
      {
        title: "5. स्तर 4 टाई-ब्रेकर: उत्तर देने की गति एवं समय (Time Taken)",
        content: "सभी मापदंड समान होने पर सबसे कम समय (`mm:ss.mmm`) में परीक्षा पूरी करने वाले छात्र को उच्च रैंक मिलती है।"
      },
      {
        title: "6. साझा रैंक आवंटन नियम (Shared Rank Allocation)",
        content: "यदि सभी 4 मापदंड समान रहते हैं, तो छात्रों को साझा रैंक (जैसे संयुक्त रैंक 2) दी जाती है।"
      },
      {
        title: "7. साझा रैंक के लिए पुरस्कार राशि वितरण गणित (Prize Distribution)",
        content: "साझा रैंक आने पर उन रैंकों की कुल पुरस्कार राशि जोड़कर tied छात्रों में बराबर बांट दी जाती है:\n" +
          "उदाहरण: रैंक 2 (₹1,00,000) और रैंक 3 (₹75,000) पर टाई होने पर कुल ₹1,75,000 दोनों छात्रों में ₹87,500 - ₹87,500 बराबर बांटे जाएंगे। अगला छात्र रैंक 4 प्राप्त करेगा।"
      },
      {
        title: "8. विशेष मामले एवं परिस्थितियां (Special Cases)",
        content: "1. 100% अंक: 100% अंक पाने वाले छात्रों में प्राइज पूल बराबर बांटा जाता है।\n" +
          "2. ट्रॉफी आवंटन: संयुक्त रैंक 1 आने पर दोनों छात्रों को अलग-अलग फिजिकल गोल्ड ट्रॉफी भेजी जाती है।"
      },
      {
        title: "9. फॉरेंसिक सत्यापन एवं 2-घंटे का ऑडिट (Forensic Audit)",
        content: "परीक्षा समाप्त होने के बाद 2 घंटे का लाइव प्रोक्टरिंग ऑडिट होता है ताकि यह सुनिश्चित किया जा सके कि tied छात्रों ने नकल नहीं की है।"
      },
      {
        title: "10. अपील एवं विवाद निवारण (Appeals)",
        content: "गणना में त्रुटि की आशंका होने पर छात्र 48 घंटे के भीतर लीगल सेंटर से अपील दाखिल कर सकता है।"
      },
      {
        title: "11. अक्सर पूछे जाने वाले प्रश्न (FAQs)",
        content: "प्र1: क्या जल्दी पेपर जमा करने पर रैंक बेहतर मिलती है?\n" +
          "उत्तर: अंक और सटीकता पहली प्राथमिकता हैं। समय का उपयोग केवल समान अंक वाले छात्रों में टाई तोड़ने के लिए होता है।\n\n" +
          "प्र2: क्या सर्टिफिकेट पर संयुक्त रैंक लिखा होता है?\n" +
          "उत्तर: हां, सर्टिफिकेट पर 'AIR 2 (Joint)' दर्ज होता है।"
      },
      {
        title: "12. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह टाई-ब्रेकिंग नीति भारतीय कानूनों के तहत गणितीय रूप से बाध्यकारी है। संपर्क: tiebreaking@rankersleague.com।"
      }
    ]
  },

  // ── 1I. Enterprise Responsible Competition Policy ──────────────────────────
  {
    slug: "responsible-competition",
    title: "Official Enterprise Responsible Competition Policy",
    titleHi: "आधिकारिक एंटरप्राइज जिम्मेदार प्रतियोगिता नीति (Responsible Competition)",
    iconName: "HeartHandshake",
    category: "Conduct & Ethics",
    shortDescription: "Master policy governing educational purpose, healthy competition, financial spending caps, daily contest limits, student mental wellbeing, parental controls, self-exclusion, and FAQs.",
    shortDescriptionHi: "शैक्षणिक उद्देश्य, स्वस्थ प्रतिस्पर्धा, वित्तीय जमा सीमा, दैनिक प्रतियोगिता सीमा, छात्र मानसिक कल्याण, अभिभावक नियंत्रण और स्व-बहिष्कार नीति।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "15 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Responsible Competition Policy overhaul detailing 10 operational domains, daily/monthly deposit caps, self-exclusion tools, and parental control guides." },
      { version: "v3.0", date: "May 2026", summary: "Updated student mental health resource directory and cooldown timer rules." }
    ],
    sections: [
      {
        title: "1. Educational Purpose & Primary Mission Declaration",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') operates first and foremost as a dedicated educational technology and mock exam assessment platform for national entrance examination candidates (JEE, NEET, CUET, SSC, Banking). Prize rewards are designed exclusively as secondary motivational incentives to recognize academic preparation. Our platform is strictly NOT a financial investment, gambling, or betting service.",
        bulletPoints: [
          "Educational Priority: Mock test practice and All India Rank assessment form our core operational goal.",
          "Motivational Cash Rewards: Financial rewards exist solely to encourage academic diligence and reward merit.",
          "Zero Financial Risk Mindset: Candidates are urged never to view contests as financial income sources."
        ]
      },
      {
        title: "2. Fostering Healthy Competition & Balanced Mindset",
        content: "Ranker's League actively promotes healthy competitive rivalry, continuous self-improvement, and emotional resilience. Candidates are encouraged to view mock exam scores as diagnostic tools to identify academic weak points rather than measures of self-worth. Unhealthy exam obsession, sleep deprivation, and extreme burnout are strongly discouraged."
      },
      {
        title: "3. Fair & Ethical Participation Principles",
        content: "Every participant agrees to compete with complete academic honesty, dignity, and positive sportsmanship. Candidates must treat fellow rankers with respect and avoid toxic academic pressure or rank-shaming."
      },
      {
        title: "4. Responsible Spending & Financial Deposit Safeguards",
        content: "To protect candidates from reckless financial spending, Ranker's League enforces mandatory spending controls:\n" +
          "• Default Daily Deposit Limit: Maximum deposit cap of ₹2,500 INR per 24-hour cycle.\n" +
          "• Default Monthly Deposit Cap: Maximum cumulative deposit cap of ₹10,000 INR per calendar month.\n" +
          "• Self-Imposed Limits: Candidates can lower their daily or monthly deposit limits at any time via Profile > Responsible Gaming Settings. Limit reductions take effect instantly; limit increases require a mandatory 48-hour cooling-off period."
      },
      {
        title: "5. Mandatory Contest Participation Limits & Guardrails",
        content: "To prevent exam fatigue and maintain study-rest balance, our platform enforces automated guardrails:\n" +
          "1. Maximum Daily Contests: Candidates are restricted to a maximum of 5 contest entries per calendar day.\n" +
          "2. Consecutive Testing Cap: A mandatory 30-minute cooling-off break is enforced after 4 consecutive hours of testing.\n" +
          "3. Cooldown Pop-Ups: Automated banners remind candidates to take rest breaks during prolonged testing sessions."
      },
      {
        title: "6. Student Mental Wellbeing & Self-Exclusion Protocols",
        content: "Ranker's League prioritizes student mental health above all else. We provide robust self-exclusion tools allowing candidates to pause their platform access:\n" +
          "• Temporary Take-a-Break: Self-exclude for 24 Hours, 7 Days, or 30 Days.\n" +
          "• Permanent Exclusion: Permanently block account contest entry privileges upon written request to `responsible@rankersleague.com`.\n" +
          "• Student Helplines: Direct access to free 24/7 student mental wellness counseling helplines."
      },
      {
        title: "7. Parent & Guardian Guidance Protocols",
        content: "We encourage active parental involvement for minor students (under 18 years of age):\n" +
          "• Spending Monitoring: Parents should review monthly wallet deposit statements and set parental spending controls.\n" +
          "• Academic Balance: Ensure contest practice complements regular school/coaching study schedules.\n" +
          "• Account Supervision: Minor accounts must be registered under parental oversight."
      },
      {
        title: "8. Institutional Platform Recommendations & Best Practices",
        content: "Ranker's League recommends the following academic best practices for candidates:\n" +
          "1. Mock Frequency: Limit full-length mock exams to a maximum of 2 tests per week to allow sufficient revision time.\n" +
          "2. Error Analysis: Spend at least 2 hours analyzing missed questions for every 1 hour of testing.\n" +
          "3. Healthy Sleep: Maintain 7–8 hours of uninterrupted sleep before major contest days."
      },
      {
        title: "9. Frequently Asked Questions (FAQs) on Responsible Competition",
        content: "Q1: How can I lower my daily wallet deposit limit?\n" +
          "Ans: Go to Profile Settings > Responsible Gaming > Deposit Limits and enter your desired daily cap.\n\n" +
          "Q2: Can I reverse a self-exclusion request early?\n" +
          "Ans: No, self-exclusion periods cannot be cancelled early to protect candidate wellbeing.\n\n" +
          "Q3: What should a parent do if a minor spends money without permission?\n" +
          "Ans: Contact support@rankersleague.com immediately for account lock and wallet refund processing."
      },
      {
        title: "10. Official Governance Legal & Regulatory Disclaimer",
        content: "This Responsible Competition Policy forms an integral part of the Ranker's League Terms of Service under the Consumer Protection Act, 2019 and IT Act, 2000. For student wellness or spending limit inquiries, contact `responsible@rankersleague.com` / `wellness@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. शैक्षणिक उद्देश्य एवं प्राथमिक मिशन घोषणा (Overview)",
        content: "रैंकर्स लीग मुख्य रूप से प्रतियोगी परीक्षाओं (JEE, NEET, CUET, SSC) के लिए एक शैक्षणिक तकनीक और मॉक परीक्षा मूल्यांकन मंच है। नकद पुरस्कार केवल पढ़ाई के प्रति प्रोत्साहन के लिए हैं। यह मंच कोई वित्तीय निवेश या जुआ सेवा नहीं है।"
      },
      {
        title: "2. स्वस्थ प्रतिस्पर्धा एवं संतुलित मानसिकता (Healthy Competition)",
        content: "हम सकारात्मक प्रतिस्पर्धा, आत्म-सुधार और मानसिक संतुलन का समर्थन करते हैं। परीक्षा के अंकों को केवल सुधार के माध्यम के रूप में देखें, न कि तनाव का कारण।"
      },
      {
        title: "3. निष्पक्ष एवं नैतिक भागीदारी सिद्धांत (Fair Play)",
        content: "सभी छात्र पूर्ण शैक्षणिक ईमानदारी, खेल भावना और साथियों के प्रति आदर के साथ प्रतियोगिताओं में भाग लेने की प्रतिज्ञा करते हैं।"
      },
      {
        title: "4. जिम्मेदार खर्च एवं वित्तीय जमा सीमा (Deposit Limits)",
        content: "छात्रों को अत्यधिक खर्च से बचाने के लिए वित्तीय नियंत्रण लागू हैं:\n" +
          "• दैनिक जमा सीमा: अधिकतम ₹2,500 प्रति 24 घंटे।\n" +
          "• मासिक जमा सीमा: अधिकतम ₹10,000 प्रति कैलेंडर माह।\n" +
          "• स्व-निर्धारित सीमा: छात्र अपनी सीमा कभी भी कम कर सकते हैं जो तुरंत लागू होती है।"
      },
      {
        title: "5. प्रतियोगिता भागीदारी सीमाएँ (Contest Guardrails)",
        content: "1. दैनिक सीमा: अधिकतम 5 प्रतियोगिताएं प्रति दिन।\n" +
          "2. लगातार परीक्षा सीमा: 4 घंटे की लगातार परीक्षा के बाद 30 मिनट का अनिवार्य ब्रेक।"
      },
      {
        title: "6. छात्र मानसिक कल्याण एवं स्व-बहिष्कार (Self-Exclusion)",
        content: "छात्रों के मानसिक स्वास्थ्य की सुरक्षा के लिए 'Take a Break' टूल (24 घंटे, 7 दिन, 30 दिन का ब्रेक) और 24/7 हेल्पलाइन उपलब्ध हैं।"
      },
      {
        title: "7. अभिभावक (Parent) मार्गदर्शन निर्देशिका",
        content: "18 वर्ष से कम आयु के छात्रों के माता-पिता को सलाह दी जाती है कि वे वॉलेट खर्च पर नज़र रखें और पढ़ाई व विश्राम में संतुलन बनाएं।"
      },
      {
        title: "8. संस्थागत अनुशंसित अध्ययन अभ्यास (Best Practices)",
        content: "सप्ताह में अधिकतम 2 फुल-लेंथ मॉक टेस्ट दें और हर परीक्षा के बाद 2 घंटे का विस्तृत एनालिसिस करें।"
      },
      {
        title: "9. अक्सर पूछे जाने वाले प्रश्न (FAQs)",
        content: "प्र1: मैं अपनी दैनिक जमा सीमा कैसे कम कर सकता हूं?\n" +
          "उत्तर: प्रोफाइल सेटिंग्स > Responsible Gaming में जाकर अपनी दैनिक सीमा घटाएं।\n\n" +
          "प्र2: क्या स्व-बहिष्कार (Self-exclusion) को समय से पहले रद्द किया जा सकता है?\n" +
          "उत्तर: नहीं, छात्र कल्याण के लिए इसे समय से पहले रद्द नहीं किया जा सकता।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह जिम्मेदार प्रतियोगिता नीति उपभोक्ता संरक्षण अधिनियम 2019 और आईटी अधिनियम 2000 के तहत कानूनी रूप से बाध्यकारी है। संपर्क: responsible@rankersleague.com।"
      }
    ]
  },

  // ── 1J. Enterprise Security Policy ─────────────────────────────────────────
  {
    slug: "security",
    title: "Official Enterprise Cybersecurity & Data Infrastructure Policy",
    titleHi: "आधिकारिक एंटरप्राइज साइबर सुरक्षा एवं डेटा इंफ्रास्ट्रक्चर नीति (Security Policy)",
    iconName: "Shield",
    category: "Platform & Security",
    shortDescription: "Master security policy detailing account protection, Bcrypt/Argon2 hashing, OTP TTLs, login velocity monitoring, PCI-DSS Level 1 payment security, AES-256 encryption, threat detection, CERT-In compliance, and bug bounty programs.",
    shortDescriptionHi: "खाता सुरक्षा, पासवर्ड हैशिंग, ओटीपी सुरक्षा, लॉगिन सुरक्षा, डिवाइस फिंगरप्रिंटिंग, पीसीआई-डीएसएस भुगतान सुरक्षा, एईएस-256 एन्क्रिप्शन, थ्रेट डिटेक्शन और सीईआरटी-इन अनुपालन का मास्टर कोड।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "20 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Master Cybersecurity Policy overhaul detailing 15 technical domains, CERT-In 6-hour breach SLAs, Argon2id hashing, Zero-Trust Architecture, and VDP safe harbor rules." },
      { version: "v3.0", date: "May 2026", summary: "Updated TLS 1.3 cryptographic transport standards and HSM master key rotation cycles." }
    ],
    sections: [
      {
        title: "1. Preamble & Cybersecurity Infrastructure Mandate",
        content: "Ranker's League Technologies Private Limited ('Ranker's League', 'We', 'Us') is committed to upholding bank-grade cybersecurity defenses, technical resilience, and absolute data protection across all educational contest systems. Our security architecture complies with ISO/IEC 27001:2022 standards, SOC 2 Type II datacenter controls, PCI-DSS Level 1 payment gateway directives, Section 43A of the Indian Information Technology Act, 2000, and CERT-In Cyber Security Directions, 2022.",
        bulletPoints: [
          "Bank-Grade Security: Enterprise encryption and Zero-Trust Network Access (ZTNA) across all endpoints.",
          "CERT-In Compliance: Full compliance with national cybersecurity reporting directives.",
          "Zero Third-Party Data Monetization: We never sell or compromise infrastructure keys."
        ]
      },
      {
        title: "2. User Account Security & Authentication Standards",
        content: "Account authentication is protected by multi-tenant session isolation, JSON Web Token (JWT) cryptographic signatures, multi-factor authentication (MFA), and automated brute-force lockout triggers (locking accounts after 5 failed login attempts)."
      },
      {
        title: "3. Password & Credential Protection Policy",
        content: "User passwords are encrypted using industry-standard Bcrypt (work factor 12) or Argon2id cryptographic hashing algorithms with unique salt vectors. Plain-text credential storage is strictly impossible. Users may enable optional 90-day password rotation prompts."
      },
      {
        title: "4. One-Time Password (OTP) & Telecom Gateway Security",
        content: "SMS authentication operates under strict security parameters:\n" +
          "• Cryptographic OTP: 6-digit randomly generated cryptographic tokens dispatched via DLT-approved telecom gateways.\n" +
          "• 2-Minute Expiry: OTPs expire automatically after 120 seconds.\n" +
          "• Rate-Limiting: Maximum of 3 OTP requests per phone number per hour to prevent SMS flooding attacks.\n" +
          "• Anti-SIM Swap: IP address and SIM registration metadata are cross-validated during OTP logins."
      },
      {
        title: "5. Login Security & Session Management Protocols",
        content: "All login endpoints operate over mandatory TLS 1.3 encrypted connections. Our security engine monitors login velocity, flags geographic IP anomalies, and automatically revokes active session tokens across all devices upon password resets or account locks."
      },
      {
        title: "6. Device & Hardware Forensic Security",
        content: "Client-side examination environments enforce strict sandboxing during live proctored tests. Systems capture GPU canvas hashes, keystroke dynamics, and device hardware fingerprints to detect virtual machines, Selenium/Playwright bots, and emulator scripts."
      },
      {
        title: "7. Payment & Financial Sub-Ledger Security",
        content: "Financial workflows operate through certified PCI-DSS Level 1 RBI-regulated commercial payment aggregators (Razorpay, Cashfree, Paytm). Raw credit/debit card numbers and CVVs are NEVER stored on Ranker's League servers. Every deposit and withdrawal generates an immutable sub-ledger transaction log."
      },
      {
        title: "8. Statutory KYC & Identity Verification Security",
        content: "Government identity documents (PAN Card, Aadhaar Card, Voter ID) submitted for high-value prize withdrawals (>₹10,000 INR) are encrypted using AES-256 at rest. Row-Level Security (RLS) database policies ensure KYC records are accessible exclusively by authorized compliance auditors."
      },
      {
        title: "9. Cryptographic Encryption Standards",
        content: "Ranker's League implements enterprise cryptographic standards:\n" +
          "• Encryption at Rest: AES-256 bit encryption applied to all database instances, object storage buckets, and server backups.\n" +
          "• Encryption in Transit: TLS 1.3 cryptographic transport applied to all client-server API calls and web traffic.\n" +
          "• Key Management: Hardware Security Modules (HSM) manage master encryption keys with annual automated key rotation."
      },
      {
        title: "10. Anti-Fraud & Real-Time Threat Detection Architecture",
        content: "Our AI Forensic Engine monitors platform traffic 24/7 to detect and neutralize threats: Web Application Firewall (WAF) blocks SQL injection and XSS attacks; Rate-Limiters mitigate Layer-7 DDoS attacks; Steganographic Watermarking traces question paper screenshot leaks."
      },
      {
        title: "11. Comprehensive Data Protection & Privacy Infrastructure",
        content: "Our cloud architecture enforces Zero-Trust Network Access (ZTNA), least-privilege administrative access, and 24/7 audit logging. Web-cam proctoring audit snapshots captured during live tests are automatically purged from servers after 90 days."
      },
      {
        title: "12. Security Incident Response Protocol & CERT-In Compliance",
        content: "In the event of a suspected cybersecurity incident, our Incident Response Team (IRT) triggers a 15-minute triage SLA. Confirmed cyber incidents or data breaches are reported to CERT-In (Indian Computer Emergency Response Team) within 6 hours as mandated by Indian Cyber Law."
      },
      {
        title: "13. Vulnerability Disclosure & Responsible Bug Bounty Program",
        content: "We welcome ethical security research through our Vulnerability Disclosure Program (VDP). Ethical researchers can submit bug reports to `security@rankersleague.com`. Ranker's League grants Safe Harbor to researchers adhering to responsible disclosure guidelines."
      },
      {
        title: "14. Continuous Security Auditing & Patch Management",
        content: "Ranker's League undergoes quarterly Vulnerability Assessment and Penetration Testing (VAPT) conducted by CERT-In empaneled third-party cybersecurity auditors. Critical security patches are deployed to production servers within 24 hours of release."
      },
      {
        title: "15. Official Governance Legal & Cybersecurity Disclaimer",
        content: "This Security Policy is governed by Section 43A and Section 66 of the Indian Information Technology Act, 2000. For cybersecurity inquiries, vulnerability reports, or incident escalations, contact our Chief Information Security Officer (CISO) at `ciso@rankersleague.com` / `security@rankersleague.com`."
      }
    ],
    sectionsHi: [
      {
        title: "1. प्रस्तावना एवं साइबर सुरक्षा इंफ्रास्ट्रक्चर (Overview)",
        content: "रैंकर्स लीग बैंक-ग्रेड साइबर सुरक्षा, ISO-27001 मानकों, SOC 2 टाइप II क्लाउड सेंटरों और पीसीआई-डीएसएस भुगतान सुरक्षा दिशानिर्देशों का 100% पालन करता है।"
      },
      {
        title: "2. उपयोगकर्ता खाता सुरक्षा एवं प्रमाणीकरण (Account Security)",
        content: "खाता प्रमाणीकरण क्रिप्टोग्राफिक JWT टोकन, मल्टी-फैक्टर ऑथेंटिकेशन (MFA) और 5 बार गलत पासवर्ड डालने पर ऑटो-लॉकडाउन द्वारा सुरक्षित है।"
      },
      {
        title: "3. पासवर्ड एवं क्रेडेंशियल सुरक्षा नीति (Password Policy)",
        content: "सभी पासवर्ड Bcrypt (Work Factor 12) या Argon2id cryptographic hashing से एन्क्रिप्ट किए जाते हैं। प्लेन-टेक्स्ट पासवर्ड कभी स्टोर नहीं होते।"
      },
      {
        title: "4. वन-टाइम पासवर्ड (OTP) एवं टेलीकॉम सुरक्षा (OTP Security)",
        content: "ओटीपी 120 सेकंड में एक्सपायर हो जाता है। एसएमएस फ्लडिंग रोकने के लिए प्रति घंटे अधिकतम 3 ओटीपी अनुरोध की अनुमति है।"
      },
      {
        title: "5. लॉगिन सुरक्षा एवं सेशन प्रबंधन (Login Security)",
        content: "सभी लॉगिन TLS 1.3 एन्क्रिप्टेड कनेक्शन पर चलते हैं। पासवर्ड बदलने पर सभी डिवाइसों से सेशन तुरंत बंद कर दिया जाता है।"
      },
      {
        title: "6. डिवाइस एवं हार्डवेयर फॉरेंसिक सुरक्षा (Device Security)",
        content: "परीक्षा के दौरान डिवाइस फिंगरप्रिंटिंग और जीपीयू हैश द्वारा वर्चुअल मशीन (VM) और बोट्स को तुरंत ब्लॉक किया जाता है।"
      },
      {
        title: "7. भुगतान एवं वित्तीय सब-लेजर सुरक्षा (Payment Security)",
        content: "लेन-देन आरबीआई द्वारा विनियमित पीसीआई-डीएसएस (PCI-DSS Level 1) गेटवे द्वारा संसाधित होते हैं। कार्ड नंबर कभी स्टोर नहीं होते।"
      },
      {
        title: "8. वैधानिक केवाईसी एवं पहचान दस्तावेज सुरक्षा (KYC Security)",
        content: "₹10,000 से अधिक विथड्रॉल पर जमा पैन/आधार दस्तावेज AES-256 एन्क्रिप्शन से डेटाबेस में पूरी तरह सुरक्षित रहते हैं।"
      },
      {
        title: "9. क्रिप्टोग्राफिक एन्क्रिप्शन मानक (Encryption Standards)",
        content: "डेटाबेस में स्टोर डेटा पर **AES-256 बिट एन्क्रिप्शन** और नेटवर्क पर ट्रांसफर डेटा पर **TLS 1.3 एन्क्रिप्शन** लागू है।"
      },
      {
        title: "10. धोखाधड़ी रोकथाम एवं थ्रेट डिटेक्शन (Fraud Detection)",
        content: "एआई थ्रेट इंजन SQL injection, XSS हमलों, DDoS हमलों और पेपर लीक स्क्रीनशॉट को 24/7 ट्रैक और ब्लॉक करता है।"
      },
      {
        title: "11. डेटा सुरक्षा एवं ऑटो-पर्ज (Data Protection)",
        content: "जीरो-ट्रस्ट नेटवर्क आर्किटेक्चर लागू है। वेबकैम प्रोक्टरिंग फोटो 90 दिनों के भीतर सर्वर से डिलीट कर दी जाती हैं।"
      },
      {
        title: "12. सुरक्षा घटना प्रतिक्रिया एवं CERT-In अनुपालन (Incident Response)",
        content: "किसी भी साइबर घटना की सूचना 6 घंटे के भीतर भारतीय कंप्यूटर इमरजेंसी रिस्पॉन्स टीम (CERT-In) को देना अनिवार्य है।"
      },
      {
        title: "13. सुरक्षा भेद्यता प्रकटीकरण एवं बग बाउंटी (Vulnerability Reporting)",
        content: "सुरक्षा शोधकर्ता security@rankersleague.com पर सुरक्षा खामियों की रिपोर्ट दर्ज करा सकते हैं।"
      },
      {
        title: "14. निरंतर सुरक्षा ऑडिट एवं पैच प्रबंधन (Security Updates)",
        content: "हर तिमाही CERT-In द्वारा मान्यता प्राप्त ऑडिटरों से VAPT सुरक्षा परीक्षण कराया जाता है और 24 घंटे में सुरक्षा पैच लगाए जाते हैं।"
      },
      {
        title: "15. आधिकारिक शासकीय कानूनी अस्वीकरण (Disclaimer)",
        content: "यह सुरक्षा नीति भारतीय आईटी अधिनियम 2000 की धारा 43A और 66 के तहत कानूनी रूप से बाध्यकारी है। मुख्य सूचना सुरक्षा अधिकारी (CISO) संपर्क: ciso@rankersleague.com।"
      }
    ]
  },
  {
    slug: "fair-play",
    title: "Official Fair Play & Anti-Cheat Policy",
    titleHi: "आधिकारिक फेयर प्ले एवं एंटी-चीटिंग नीति (Fair Play Policy)",
    iconName: "Scale",
    category: "Conduct & Ethics",
    shortDescription: "Enterprise-grade zero-tolerance framework prohibiting AI models, secondary devices, proxy candidates, bots, paper leaks, and multi-accounts.",
    shortDescriptionHi: "एआई मॉडल, सेकेंडरी डिवाइस, प्रॉक्सी कैंडिडेट, बोट्स, पेपर लीक और मल्टी-अकाउंट्स को प्रतिबंधित करने वाला हमारा एंटरप्राइज-ग्रेड फ्रेमवर्क।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "12 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Integrated AI LLM solver detection (ChatGPT, Gemini, Claude, Copilot) and forensic device fingerprinting rules." },
      { version: "v3.0", date: "June 2026", summary: "Added IP sequence anomaly monitoring and multi-account auto-blocking." },
      { version: "v2.0", date: "March 2026", summary: "Updated anti-collusion timestamp correlation models." }
    ],
    sections: [
      {
        title: "1. Academic Integrity & Absolute Meritocracy Mandate",
        content: "Ranker's League is built on the unwavering foundation of honest competition. Our Fair Play Policy guarantees that every All-India Rank (AIR), percentile score, scorecard, and reward earned on our platform reflects 100% genuine individual intellectual effort. Cheating undermines honest students and will be met with swift, unyielding enforcement.",
        bulletPoints: [
          "Zero-Tolerance Standard: Any intentional attempt to bypass test constraints results in immediate disqualification.",
          "Equal Opportunity: Every contestant solves questions under identical sandboxed parameters.",
          "Verifiable Standings: All top-ranking candidates undergo automated forensic audit before rewards are released."
        ]
      },
      {
        title: "2. Zero-Tolerance Prohibition on AI Models & LLMs",
        content: "The use of artificial intelligence language models, automated solvers, or optical character recognition (OCR) tools during live contest sessions is strictly illegal. Ranker's League utilizes AI-detection algorithms that analyze response timing profiles and question-solving velocities.",
        bulletPoints: [
          "Prohibited AI Tools: ChatGPT (OpenAI), Gemini (Google), Claude (Anthropic), Copilot (Microsoft), Perplexity, and open-source LLMs.",
          "Prohibited OCR Extensions: Screen capture browser extensions, Google Lens, and automated formula solvers.",
          "Anomaly Trigger: Solving complex multi-step numericals in under 2 seconds triggers an immediate automated fraud flag."
        ]
      },
      {
        title: "3. Secondary Devices & Screen-Sharing Violations",
        content: "Contestants are strictly prohibited from utilizing external hardware or remote screen-sharing software during live examinations.",
        bulletPoints: [
          "Prohibited Software: AnyDesk, TeamViewer, UltraViewer, Discord screen share, Zoom, and Remote Desktop Protocol (RDP).",
          "Prohibited Hardware: Secondary monitors, mobile phones, tablets, smart glasses, or hidden HDMI capture cards.",
          "Screen Lockdown: Exiting fullscreen focus or attempting tab switching 3 times terminates the examination instantly."
        ]
      },
      {
        title: "4. Proxy Candidate & Impersonation Prohibition",
        content: "Registered candidates must take every examination personally. Employing a proxy candidate, subject matter expert, or paid test-taker to attempt a contest on your behalf constitutes severe identity fraud.",
        bulletPoints: [
          "Biometric & Photo KYC Matching: Ranker's League verifies winner identities against registered government ID documents.",
          "Facial Recognition Audits: Periodic webcam snapshot audits during proctored tests verify candidate presence.",
          "Immediate Banishment: Proxy attempts lead to permanent lifetime banishment and criminal fraud prosecution."
        ]
      },
      {
        title: "5. Multiple Accounts & Network Proxy Offenses",
        content: "Each participant is strictly limited to ONE verified Ranker's League account. Operating multiple accounts to enter the same contest arena is a major breach of platform integrity.",
        bulletPoints: [
          "Prohibited Network Tools: Virtual Private Networks (VPNs), TOR browsers, residential proxy networks, and Virtual Machines (VMs).",
          "Multi-Account Sweep: Duplicate accounts created using alternate emails or phone numbers are automatically linked and banned.",
          "Forfeiture: All entry fee deposits and winnings associated with secondary accounts are immediately forfeited."
        ]
      },
      {
        title: "6. Automation, Bots & Scripting Infractions",
        content: "Running automated scripts, browser extensions, DOM scrapers, or keypress emulators inside the test interface is strictly banned.",
        bulletPoints: [
          "Prohibited Scripts: Auto-clickers, Tampermonkey/Greasemonkey scripts, Python Selenium/Playwright bots.",
          "Payload Injection: Attempting to manipulate test JavaScript payloads or submit responses directly via API calls triggers permanent ban."
        ]
      },
      {
        title: "7. Paper Leak & Question Sharing Offenses",
        content: "All test questions, graphics, and answer keys hosted on Ranker's League are protected intellectual property. Leaking or broadcasting test content during a live contest is strictly illegal.",
        bulletPoints: [
          "Prohibited Groups: Sharing screenshots or live questions on Telegram, WhatsApp, Discord, or YouTube live streams.",
          "Digital Watermarking: Question screens contain invisible candidate-specific steganographic watermarks for instant leak tracing."
        ]
      },
      {
        title: "8. Communication & Voice Assistance Prohibitions",
        content: "Candidates must complete examinations in a quiet, isolated environment free from external oral or written communication.",
        bulletPoints: [
          "Prohibited Earpieces: Bluetooth earbuds, hidden earpieces, smartwatches, or walkie-talkies.",
          "Team Solving: Group problem-solving in study halls or coaching centers during live test windows is strictly prohibited."
        ]
      },
      {
        title: "9. Collusion & Pattern Correlation Detection",
        content: "Ranker's League deploys advanced statistical correlation engines that cross-analyze answer submission sequences, choice selections, and timestamp gaps between candidates across India.",
        bulletPoints: [
          "Identical Pattern Detection: Candidates submitting identical wrong choice sequences at identical timestamps are flagged for collusion.",
          "Consequence: Confirmed collusion results in mutual disqualification of all participating accounts."
        ]
      },
      {
        title: "10. Leaderboard & Score Manipulation Prohibitions",
        content: "Any attempt to alter database records, intercept client-server HTTP headers, or artificially inflate percentile standings violates national cybersecurity laws."
      },
      {
        title: "11. Forensic Detection & Device Fingerprinting",
        content: "Our security architecture records key forensic signals during examination sessions to maintain absolute integrity:",
        bulletPoints: [
          "Canvas & Hardware Device Fingerprinting: Tracks unique browser environment hashes.",
          "Keystroke Dynamics & Mouse Heatmaps: Verifies natural human interaction versus automated bot scripts.",
          "IP & Network Geolocation Matching: Flags sudden geographic jumps during active test windows."
        ]
      },
      {
        title: "12. Tiered Penalties & Enforcement Matrix",
        content: "Violations of this Fair Play Policy trigger enforced penalties based on severity:",
        bulletPoints: [
          "Level 1 (Minor Focus Loss): System warning pop-up on first tab-switch infraction.",
          "Level 2 (Proctor Lockdown Breach): Automatic test termination and zero score assignment.",
          "Level 3 (Confirmed Fraud / AI Use): Disqualification, complete prize money forfeiture, and 90-day suspension.",
          "Level 4 (Paper Leak / Impersonation): Permanent lifetime account banishment, wallet balance seizure, and legal notice."
        ]
      },
      {
        title: "13. Formal Appeals & Dispute Resolution Process",
        content: "If a candidate believes their account was flagged in error due to technical disruption, they may file a formal appeal within 48 hours via the Legal Center hub.",
        bulletPoints: [
          "Appeal Filing Window: Must be submitted within 48 hours of contest completion.",
          "Review Panel: An independent compliance board reviews proctor logs, webcam snapshots, and device telemetry.",
          "Final Decision: Decisions rendered by the Compliance Officer following log audit are final and binding."
        ]
      },
      {
        title: "14. Future Anti-Cheat Prevention Upgrades",
        content: "Ranker's League continuously updates its forensic models to counter emerging cheating technologies, ensuring honest students are protected at all times."
      },
      {
        title: "15. Official Governance Legal Disclaimer",
        content: "This Fair Play Policy constitutes a binding agreement between Ranker's League and all registered contestants. Violations involving computer misuse or financial fraud will be reported to statutory law enforcement authorities."
      }
    ],
    sectionsHi: [
      {
        title: "1. शैक्षणिक ईमानदारी एवं पूर्ण मेधावी जनादेश",
        content: "रैंकर्स लीग ईमानदार प्रतियोगिता की अटूट नींव पर बना है। हमारी फेयर प्ले नीति यह सुनिश्चित करती है कि हमारे प्लेटफॉर्म पर अर्जित प्रत्येक ऑल इंडिया रैंक (AIR), परसेंटाइल स्कोर और पुरस्कार 100% वास्तविक व्यक्तिगत प्रयास को दर्शाता है।",
        bulletPoints: [
          "शून्य-सहनशीलता मानक: परीक्षा नियमों का उल्लंघन करने के किसी भी प्रयास का परिणाम तुरंत अयोग्यता होगा।",
          "समान अवसर: प्रत्येक प्रतियोगी समान सुरक्षा मापदंडों के तहत प्रश्नों को हल करता है।"
        ]
      },
      {
        title: "2. एआई मॉडल (ChatGPT, Gemini, Claude, Copilot) पर पूर्ण प्रतिबंध",
        content: "परीक्षा के दौरान आर्टिफिशियल इंटेलिजेंस (AI) लैंग्वेज मॉडल, ऑटोमेटेड सॉल्वर्स या इमेज सर्च टूल्स का उपयोग पूरी तरह से प्रतिबंधित है।",
        bulletPoints: [
          "प्रतिबंधित एआई टूल्स: ChatGPT, Gemini, Claude, Copilot, Perplexity और अन्य एआई टूल्स।",
          "प्रतिबंधित एक्सटेंशन: स्क्रीन कैप्चर, गूगल लेंस और ऑटोमैटिक फॉर्मूला सॉल्वर्स।"
        ]
      },
      {
        title: "3. सेकेंडरी डिवाइस एवं स्क्रीन शेयरिंग प्रतिबंध",
        content: "परीक्षा के दौरान बाहरी हार्डवेयर या रिमोट स्क्रीन-शेयरिंग सॉफ्टवेयर का उपयोग करना सख्त मना है।",
        bulletPoints: [
          "प्रतिबंधित सॉफ्टवेयर: AnyDesk, TeamViewer, UltraViewer, Zoom, Discord स्क्रीन शेयर।",
          "प्रतिबंधित हार्डवेयर: दूसरी स्क्रीन, मोबाइल फोन, टैबलेट, स्मार्ट ग्लास।"
        ]
      },
      {
        title: "4. प्रॉक्सी उम्मीदवार एवं छद्मवेश प्रतिबंध",
        content: "पंजीकृत उम्मीदवार को स्वयं परीक्षा देनी होगी। अपनी जगह किसी अन्य व्यक्ति या विशेषज्ञ को परीक्षा में बैठाना गंभीर पहचान धोखाधड़ी है।"
      },
      {
        title: "5. मल्टीपल अकाउंट्स एवं वीपीएन उल्लंघन",
        content: "प्रत्येक प्रतिभागी केवल एक सत्यापित खाते से परीक्षा दे सकता है। वीपीएन (VPN) या प्रॉक्सी नेटवर्क का उपयोग करना प्रतिबंधित है।"
      },
      {
        title: "6. ऑटोमेशन, बोट्स एवं स्क्रिप्टिंग प्रतिबंध",
        content: "टेस्ट इंटरफ़ेस में ऑटोमेटेड स्क्रिप्ट, बोट्स या ऑटो-क्लिकर चलाना पूरी तरह से प्रतिबंधित है।"
      },
      {
        title: "7. पेपर लीक एवं प्रश्न साझा करने का अपराध",
        content: "परीक्षा के दौरान टेलीग्राम, व्हाट्सएप या यूट्यूब पर स्क्रीनशॉट या प्रश्न साझा करना अवैध है।"
      },
      {
        title: "8. संचार एवं वॉयस सहायता प्रतिबंध",
        content: "परीक्षार्थी को शांत वातावरण में अकेले परीक्षा देनी होगी। ब्लूटूथ इयरफोन या स्मार्टवॉच प्रतिबंधित हैं।"
      },
      {
        title: "9. सांठगांठ (Collusion) एवं पैटर्न पहचान",
        content: "हमारा सिस्टम उम्मीदवारों के उत्तर सबमिशन समय और पैटर्न का विश्लेषण करता है। समूह में उत्तर साझा करने पर सभी खाते प्रतिबंधित होंगे।"
      },
      {
        title: "10. लीडरबोर्ड एवं स्कोर हेरफेर प्रतिबंध",
        content: "डेटाबेस रिकॉर्ड बदलने या स्कोर में हेरफेर करने का कोई भी प्रयास साइबर अपराध माना जाएगा।"
      },
      {
        title: "11. फॉरेंसिक पहचान एवं डिवाइस फिंगरप्रिंटिंग",
        content: "हमारा सुरक्षा सिस्टम परीक्षा के दौरान डिवाइस फिंगरप्रिंटिंग और माउस मूवमेंट का विश्लेषण करता है।"
      },
      {
        title: "12. चरणबद्ध दंड (Penalties) एवं प्रवर्तन",
        content: "उल्लङ्घन करने पर चेतावनी, परीक्षा रद्दीकरण, पुरस्कार जब्ती, और स्थायी प्रतिबंध लगाया जाएगा।"
      },
      {
        title: "13. औपचारिक अपील एवं विवाद निवारण प्रक्रिया",
        content: "तकनीकी त्रुटि के कारण खाता फ्लैग होने पर उम्मीदवार 48 घंटे के भीतर अपील दाखिल कर सकता है।"
      },
      {
        title: "14. भविष्य की रोकथाम एवं एंटी-चीट अपग्रेड",
        content: "रैंकर्स लीग ईमानदार छात्रों की सुरक्षा के लिए अपने सुरक्षा मॉडल को लगातार अपडेट करता है।"
      },
      {
        title: "15. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह फेयर प्ले नीति सभी प्रतिभागियों पर लागू होती है। कंप्यूटर धोखाधड़ी करने वालों के खिलाफ कानूनी कार्रवाई की जाएगी।"
      }
    ]
  },

  // ── 3. Prize Distribution Policy ─────────────────────────────────────────
  {
    slug: "prize-distribution",
    title: "Official Prize Distribution Policy",
    titleHi: "आधिकारिक पुरस्कार वितरण नीति (Prize Distribution Policy)",
    iconName: "Trophy",
    category: "Finance & Taxes",
    shortDescription: "Comprehensive rules governing Up To Prize Pools, 70% confirmation threshold, dynamic scaling, prize lock, rank ladders, tie math, TDS, and withdrawals.",
    shortDescriptionHi: "पुरस्कार राशि, 70% पुष्टि सीमा, डायनेमिक स्केलिंग, प्राइज लॉक, रैंक लेडर, टाई गणित, टीडीएस और विथड्रॉल से जुड़े व्यापक नियम।",
    lastUpdated: "August 2026",
    version: "v4.0",
    readTime: "14 min read",
    versionHistory: [
      { version: "v4.0", date: "August 2026", summary: "Added 70% minimum seat threshold rule, dynamic scaling formula, 60s prize lock, and tie prize distribution math." },
      { version: "v3.0", date: "August 2026", summary: "Automated wallet credit distribution post 2-hour proctor verification audit." }
    ],
    sections: [
      {
        title: "1. Prize Allocation & 'Up To' Pool Architecture",
        content: "Ranker's League hosts competitive mock examinations with structured monetary and credit reward allocations. Contests feature either an 'Up To' Dynamic Prize Pool (which scales based on final participant seat volume) or a Guaranteed Minimum Prize Pool.",
        bulletPoints: [
          "Up To Prize Pool: Represents the maximum aggregate reward pool achievable when an arena reaches 100% seat fill capacity.",
          "Guaranteed Prize Pool: Specific featured arenas guarantee a fixed minimum reward pool regardless of candidate seat volume.",
          "Transparency Guarantee: The exact Rank-Wise Payout Ladder is published on the contest page before registration opens."
        ]
      },
      {
        title: "2. 70% Minimum Participation Threshold Rule",
        content: "To preserve competitive integrity and guarantee robust percentile distribution, every contest arena requires a Minimum Participation Threshold of 70% seat capacity prior to launch.",
        bulletPoints: [
          "Confirmed Contest (≥70% Fill): If seat fill reaches 70% or higher at the 60-second cutoff, the contest is CONFIRMED and proceeds to launch.",
          "Cancelled Contest (<70% Fill): If seat fill is below 70% at the cutoff, the contest is automatically CANCELLED.",
          "Instant Wallet Refund: In the event of cancellation, 100% of paid entry fees are refunded to every contestant's wallet within 15 minutes."
        ]
      },
      {
        title: "3. Dynamic Prize Pool Scaling Formula",
        content: "For dynamic arenas, the final Prize Pool scales proportionately between the 70% threshold and 100% capacity according to the mathematical formula: Final Pool = (Base Pool) × (Confirmed Seats / Maximum Seats).",
        bulletPoints: [
          "At 70% Seat Fill: The Prize Pool equals exactly 70% of the maximum published 'Up To' Pool.",
          "At 100% Seat Fill: The Prize Pool scales up to 100% of the maximum published 'Up To' Pool.",
          "Every individual rank payout scales proportionally based on the final confirmed Prize Pool."
        ]
      },
      {
        title: "4. Contest Lock & 60-Second Prize Freeze",
        content: "At exactly 60 seconds prior to contest launch time, the system executes the Contest Lock and Prize Freeze protocol.",
        bulletPoints: [
          "Registration Freeze: Registrations and seat cancellations close permanently 60 seconds before launch.",
          "Prize Pool Freeze: The final Prize Pool and Rank Payout Table freeze permanently. No changes can occur thereafter."
        ]
      },
      {
        title: "5. Winner Percentage & Percentile Allocation",
        content: "Ranker's League distributes prize rewards across top-performing candidate percentiles to reward broad academic merit:",
        bulletPoints: [
          "Rank 1 National Topper: Receives the top-tier cash reward plus a physical Ranker's League Gold Trophy.",
          "Top 1% Rankers: Earn premium tier cash prizes credited directly to their winning wallet balance.",
          "Top 5%–10% Percentile: Receive tiered cash rewards.",
          "Top 20% Percentile: Earn bonus entry-credit cashbacks for future contest arenas."
        ]
      },
      {
        title: "6. Rank-Wise Payout Ladder Structure",
        content: "Each contest publishes an explicit Rank-Wise Payout Table specifying exact monetary amounts per rank slot prior to entry.",
        bulletPoints: [
          "Example 1,000-Seat Arena (₹1,000 Entry Fee, Total Pool ₹7,000,000 at 100% Fill):",
          "• Rank 1: ₹150,000 + Gold Trophy",
          "• Rank 2: ₹100,000 + Silver Trophy",
          "• Rank 3: ₹75,000 + Bronze Trophy",
          "• Ranks 4–10: ₹25,000 each",
          "• Ranks 11–50: ₹5,000 each",
          "• Ranks 51–200: ₹1,500 each"
        ]
      },
      {
        title: "7. Tie Prize Distribution Mathematics",
        content: "When two or more candidates finish a contest with identical raw scores and identical tie-breaker parameters, rank prizes for the tied positions are aggregated and divided equally among the tied candidates.",
        bulletPoints: [
          "Tie Math Formula: Tied Candidate Reward = (Sum of Payouts for Tied Rank Slots) / (Number of Tied Candidates).",
          "Example: If Candidate A and Candidate B tie for Rank 2 in an arena where Rank 2 pays ₹100,000 and Rank 3 pays ₹75,000:",
          "Combined Pool = ₹100,000 + ₹75,000 = ₹175,000.",
          "Final Payout: Candidate A receives ₹87,500 and Candidate B receives ₹87,500. The next candidate receives Rank 4."
        ]
      },
      {
        title: "8. Winner Freeze & Proctoring Audit Window",
        content: "Immediately following contest completion, all preliminary leaderboards enter a 2-Hour Winner Freeze & Audit Period.",
        bulletPoints: [
          "Forensic Review: Automated AI proctoring engines and compliance officers audit webcam snapshots, tab switches, and submission timing signals.",
          "Disqualification Sweep: Candidates confirmed for cheating are removed from standings, and lower-ranked candidates move up.",
          "Final Release: Upon completion of the 2-hour audit, winning wallet balances are credited automatically."
        ]
      },
      {
        title: "9. Contest Cancellation & 100% Refund Guarantee",
        content: "If a contest is cancelled due to un-filled 70% threshold, administrative decision, or major server disruption, 100% of paid entry fees are refunded instantly to candidate wallets without processing fees."
      },
      {
        title: "10. Statutory Tax & TDS Deductions (Section 194BA)",
        content: "In compliance with Section 194BA of the Indian Income Tax Act, Tax Deducted at Source (TDS) at the flat rate of 30% is deducted from Net Winnings upon withdrawal or financial year end.",
        bulletPoints: [
          "Net Winnings Definition: Total Winnings minus Total Entry Fees paid.",
          "Quarterly Form 16A: Issued to all verified candidates for seamless IT return filing.",
          "No TDS on Refunds: No tax is deducted on entry fee refunds or non-winning wallet deposits."
        ]
      },
      {
        title: "11. Wallet Credit & Instant Withdrawal Protocols",
        content: "Settled winning balances in your 'Available Balance' are eligible for instant bank or UPI withdrawal.",
        bulletPoints: [
          "Minimum Withdrawal Limit: ₹100 INR per transaction.",
          "Maximum Daily Instant Withdrawal: ₹50,000 INR.",
          "Supported Payout Channels: Instant UPI (GPay, PhonePe, Paytm), IMPS, NEFT."
        ]
      },
      {
        title: "12. Numerical Payout Calculation Examples",
        content: "To illustrate dynamic pool scaling: In a 500-seat arena with 'Up To' Pool of ₹350,000 (at 100% fill), if 350 candidates join (70% fill threshold): The contest is confirmed and final pool is set to exactly ₹245,000 (70% of maximum pool). All rank rewards scale by exactly 0.70x."
      },
      {
        title: "13. Frequently Asked Questions (Prize FAQs)",
        content: "Q: How long does payout take? A: Wallet credit occurs 2 hours post-contest; UPI withdrawals process instantly in <60 seconds.\nQ: What if I tie with another ranker? A: Payouts for the tied rank slots are summed and split equally."
      },
      {
        title: "14. Official Governance Legal Disclaimer",
        content: "Ranker's League prize distributions comply strictly with statutory laws governing skill-based competitive examinations in India. Payouts are subject to KYC verification and statutory tax regulations."
      }
    ],
    sectionsHi: [
      {
        title: "1. पुरस्कार आवंटन एवं 'Up To' पूल संरचना",
        content: "रैंकर्स लीग मौद्रिक और क्रेडिट पुरस्कारों के साथ प्रतियोगी मॉक परीक्षाएं आयोजित करता है। प्रतियोगिता में 'Up To' डायनेमिक पुरस्कार राशि या न्यूनतम गारंटीकृत पुरस्कार राशि होती है।",
        bulletPoints: [
          "Up To प्राइज पूल: 100% सीट भरने पर मिलने वाली अधिकतम पुरस्कार राशि।",
          "गारंटीकृत प्राइज पूल: सीट भरने की दर की परवाह किए बिना निश्चित पुरस्कार राशि।"
        ]
      },
      {
        title: "2. 70% न्यूनतम भागीदारी सीमा (70% Threshold Rule)",
        content: "प्रतियोगिता पुष्टि के लिए 70% सीट क्षमता भरना अनिवार्य है।",
        bulletPoints: [
          "पुष्टि (≥70% सीट): यदि 60 सेकंड पहले तक 70% सीट भर जाती है, तो प्रतियोगिता शुरू होगी।",
          "रद्दीकरण (<70% सीट): यदि सीट 70% से कम भरती है, तो परीक्षा रद्द हो जाती है और 100% रिफंड मिलता है।"
        ]
      },
      {
        title: "3. डायनेमिक प्राइज पूल स्केलिंग फॉर्मूला",
        content: "70% से 100% के बीच सीट भरने पर प्राइज पूल आनुपातिक रूप से (Proportionately) बढ़ता है।"
      },
      {
        title: "4. प्रतियोगिता लॉक एवं 60-सेकंड प्राइज फ्रिज",
        content: "शुरुआत से 60 सेकंड पहले पंजीकरण बंद हो जाता है और प्राइज पूल स्थायी रूप से फ्रिज हो जाता है।"
      },
      {
        title: "5. विजेता प्रतिशत एवं रैंक लेडर",
        content: "रैंक 1 टॉपर को नकद पुरस्कार के साथ गोल्ड ट्रॉफी मिलती है। शीर्ष 20% छात्रों को पुरस्कार और कैशबैक मिलता है।"
      },
      {
        title: "6. रैंक-वार भुगतान तालिका उदाहरण",
        content: "प्रत्येक प्रतियोगिता में पंजीकरण से पहले सटीक रैंक भुगतान तालिका दिखाई जाती है।"
      },
      {
        title: "7. टाई (समान अंक) पुरस्कार वितरण गणित",
        content: "समान अंक आने पर संबंधित रैंकों की पुरस्कार राशि को जोड़कर tied छात्रों में बराबर बांटा जाता है।"
      },
      {
        title: "8. विनर फ्रिज एवं 2-घंटे का प्रोक्टरिंग ऑडिट",
        content: "परीक्षा समाप्ति के बाद 2 घंटे का फॉरेंसिक ऑडिट होता है, जिसके बाद वॉलेट में राशि जमा होती है।"
      },
      {
        title: "9. प्रतियोगिता रद्दीकरण एवं 100% रिफंड गारंटी",
        content: "रद्द प्रतियोगिताओं पर 100% प्रवेश शुल्क तुरंत वॉलेट में वापस जमा कर दिया जाता है।"
      },
      {
        title: "10. वैधानिक टीडीएस (TDS) कटौती नियम (धारा 194BA)",
        content: "आयकर अधिनियम की धारा 194BA के तहत शुद्ध जीत पर 30% टीडीएस काटा जाता है।"
      },
      {
        title: "11. वॉलेट क्रेडिट एवं तत्काल निकासी (UPI/Bank)",
        content: "उपलब्ध शेष से न्यूनतम ₹100 और अधिकतम ₹50,000 दैनिक तत्काल UPI/बैंक निकासी की अनुमति है।"
      },
      {
        title: "12. प्राइज पूल गणना का व्यावहारिक उदाहरण",
        content: "350 सीट भरने पर 70% प्राइज पूल लागू होता है।"
      },
      {
        title: "13. अक्सर पूछे जाने वाले प्रश्न (Prize FAQs)",
        content: "प्र: पैसा कब मिलता है? उ: परीक्षा के 2 घंटे बाद वॉलेट में जमा होता है और 60 सेकंड में UPI में निकलता है।"
      },
      {
        title: "14. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह पुरस्कार नीति भारतीय कौशल-आधारित प्रतियोगी परीक्षा कानूनों के अनुसार है।"
      }
    ]
  },

  // ── 4. Refund Policy ──────────────────────────────────────────────────────
  {
    slug: "refund",
    title: "Official Refund & Fee Protection Policy",
    titleHi: "आधिकारिक रिफंड एवं शुल्क सुरक्षा नीति (Refund Policy)",
    iconName: "RotateCcw",
    category: "Finance & Taxes",
    shortDescription: "Comprehensive rules on 100% wallet refunds, contest cancellations, threshold failures, duplicate debits, technical crashes, and processing SLAs.",
    shortDescriptionHi: "100% वॉलेट रिफंड, प्रतियोगिता रद्दीकरण, सीट सीमा विफलता, दोहरा भुगतान, तकनीकी खराबी और समय सीमाओं से जुड़े स्पष्ट नियम।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "10 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Added 70% threshold cancellation refunds, duplicate payment auto-reconcile, and 15-min wallet SLA." },
      { version: "v2.1", date: "August 2026", summary: "Instant wallet credit reversal on 60-min prior cancellation." }
    ],
    sections: [
      {
        title: "1. Overview & 100% Fee Protection Guarantee",
        content: "Ranker's League is committed to absolute financial fairness. Our Refund & Fee Protection Policy ensures that candidates are 100% protected against platform cancellations, threshold failures, payment gateway errors, or technical disruptions.",
        bulletPoints: [
          "100% Refund Assurance: If a contest does not launch or is cancelled by the platform, candidates receive 100% of their entry fee back.",
          "No Hidden Deductions: Cancellations initiated by Ranker's League incur zero processing fees or service charges.",
          "Automated Crediting: Most refunds are processed automatically by system triggers without requiring manual support tickets."
        ]
      },
      {
        title: "2. Platform-Initiated Contest Cancellations",
        content: "If a scheduled contest arena is cancelled or postponed by Ranker's League due to administrative reasons, emergency server maintenance, or national connectivity outages, 100% of entry fees are refunded.",
        bulletPoints: [
          "Processing Time: Refunds are credited to the candidate's wallet balance within 15 minutes of official cancellation.",
          "Notification: Candidates receive instant SMS, email, and in-app notifications detailing the cancellation refund."
        ]
      },
      {
        title: "3. Minimum Participation Threshold (70% Rule) Refunds",
        content: "Every contest arena requires a Minimum Participation Threshold of 70% seat capacity prior to launch.",
        bulletPoints: [
          "Threshold Failure: If an arena fills less than 70% of its capped seat volume at the 60-second cutoff, the contest is automatically cancelled.",
          "Automatic Refund: 100% of entry fee credits are reversed instantly to all registered candidates' wallet balances."
        ]
      },
      {
        title: "4. Duplicate & Double Payment Resolutions",
        content: "In the event of network disruption or gateway glitches resulting in double debits for a single contest registration:",
        bulletPoints: [
          "Auto-Reconciliation: Banking systems automatically detect duplicate transactions within 24 hours.",
          "Source Payout: The duplicate debited amount is refunded directly back to the original bank account or UPI source within 3–5 business days."
        ]
      },
      {
        title: "5. Technical Infrastructure & Server Crash Handling",
        content: "If a major server crash, database outage, or platform disruption renders a live examination unattemptable for candidates:",
        bulletPoints: [
          "Session Invalidation: The affected contest session is declared invalid by the Compliance Officer.",
          "Full Refund: Entry fees paid by all affected contestants are refunded to their wallets within 1 hour.",
          "Rescheduled Arena: Candidates are granted priority registration access for the rescheduled test session."
        ]
      },
      {
        title: "6. Payment Gateway Failures & Pending Transactions",
        content: "If money is debited from your bank account/UPI wallet but your contest seat is not confirmed due to gateway timeout:",
        bulletPoints: [
          "Pending Debits: Payment gateways automatically resolve pending debits within 24 hours.",
          "Seat Allocation / Refund: If seats remain available, your registration is confirmed. Otherwise, 100% of funds return to your bank account."
        ]
      },
      {
        title: "7. Candidate-Initiated Un-Registration Terms",
        content: "Candidates may choose to un-register from an upcoming scheduled contest according to the following time-window rules:",
        bulletPoints: [
          "More Than 60 Minutes Before Start: 100% of the entry fee is credited back to your wallet instantly.",
          "Within 60 Minutes of Start (Contest Lock Window): Un-registrations are strictly non-refundable as seats are locked."
        ]
      },
      {
        title: "8. Refund Speed SLAs & Payout Timelines",
        content: "Ranker's League operates strict Service Level Agreements (SLAs) for refund processing:",
        bulletPoints: [
          "Wallet Credit Refund: Processed automatically in <15 minutes (Instant for candidate un-registrations >60 mins prior).",
          "Original Payment Source (Bank/UPI): Processed by banking partners within 3 to 5 business days."
        ]
      },
      {
        title: "9. Refund Method & Destination Destination Protocols",
        content: "Refund destinations depend strictly on the transaction nature:",
        bulletPoints: [
          "Contest Entry Cancellations: Refunded as usable wallet balance credits.",
          "Duplicate Payment Debits: Refunded to the original bank account, credit card, or UPI VPA."
        ]
      },
      {
        title: "10. Exceptional Medical & Force Majeure Cases",
        content: "In documented cases of sudden medical emergency or natural disaster preventing contest participation, candidates may submit medical certificates to support@rankersleague.com for discretionary wallet credit review."
      },
      {
        title: "11. Disqualification & Non-Refund Enforcement",
        content: "Candidates disqualified for violating the Fair Play Policy (cheating, AI tool usage, tab switches, proxy test-taking, or multi-account operation) are strictly ineligible for refunds. All associated entry fees and wallet balances are forfeited."
      },
      {
        title: "12. Step-by-Step Refund Dispute Support Process",
        content: "If a refund is not reflected within the published SLA window, follow these resolution steps:",
        bulletPoints: [
          "Step 1: Check your Ranker's League Passbook / Transaction Log.",
          "Step 2: If unfulfilled after SLA, email payments@rankersleague.com with your Transaction Reference ID.",
          "Step 3: Our Finance Desk will resolve and credit your funds within 24 hours."
        ]
      },
      {
        title: "13. Official Governance Legal Disclaimer",
        content: "This Refund Policy is governed by statutory consumer protection and banking laws in India. Ranker's League is not liable for candidate-side hardware or local internet failure."
      }
    ],
    sectionsHi: [
      {
        title: "1. 100% शुल्क सुरक्षा गारंटी का अवलोकन",
        content: "रैंकर्स लीग पूर्ण वित्तीय निष्पक्षता के लिए प्रतिबद्ध है। हमारी रिफंड नीति यह सुनिश्चित करती है कि छात्र प्रतियोगिता रद्दीकरण, तकनीकी खराबी या गेटवे त्रुटियों से 100% सुरक्षित हैं।",
        bulletPoints: [
          "100% रिफंड आश्वासन: यदि प्लेटफॉर्म द्वारा परीक्षा रद्द की जाती है, तो 100% प्रवेश शुल्क वापस मिलता है।",
          "कोई छिपा हुआ शुल्क नहीं: रद्दीकरण पर कोई प्रोसेसिंग शुल्क नहीं काटा जाता है।"
        ]
      },
      {
        title: "2. प्लेटफॉर्म द्वारा प्रतियोगिता रद्दीकरण",
        content: "यदि सर्वर खराबी या प्रशासनिक कारणों से प्रतियोगिता रद्द होती है, तो 100% प्रवेश शुल्क 15 मिनट के भीतर वॉलेट में वापस जमा कर दिया जाता है।"
      },
      {
        title: "3. 70% न्यूनतम भागीदारी सीमा (70% Threshold) रिफंड",
        content: "यदि 60 सेकंड पहले तक 70% सीट नहीं भरती है, तो प्रतियोगिता रद्द हो जाती है और सभी छात्रों को 100% रिफंड मिलता है।"
      },
      {
        title: "4. दोहरा (Duplicate) भुगतान समाधान",
        content: "एक ही सीट के लिए गलती से दो बार पैसे कट जाने पर, अतिरिक्त राशि 3-5 कार्य दिवसों में मूल बैंक खाते में वापस आ जाती है।"
      },
      {
        title: "5. सर्वर खराबी एवं तकनीकी व्यवधान",
        content: "परीक्षा के दौरान मुख्य सर्वर क्रैश होने पर परीक्षा रद्द कर दी जाती है और 1 घंटे के भीतर पूरा रिफंड मिलता है।"
      },
      {
        title: "6. पेमेंट गेटवे विफलता (Pending Payment)",
        content: "पैसे कट जाने पर यदि सीट बुक नहीं होती, तो बैंक 24 घंटे में ऑटो-रिफंड कर देता है।"
      },
      {
        title: "7. छात्र द्वारा पंजीकरण रद्द करना",
        content: "परीक्षा शुरू होने से 60 मिनट पहले तक रद्द करने पर 100% रिफंड मिलता है। 60 मिनट से कम समय रहने पर रिफंड नहीं मिलता।"
      },
      {
        title: "8. रिफंड प्रसंस्करण समय सीमा (SLAs)",
        content: "वॉलेट रिफंड 15 मिनट में होता है; बैंक/UPI रिफंड में 3-5 दिन का समय लगता है।"
      },
      {
        title: "9. रिफंड का तरीका (Wallet vs Bank)",
        content: "प्रतियोगिता रद्दीकरण का रिफंड वॉलेट में और दोहरा भुगतान बैंक खाते में जाता है।"
      },
      {
        title: "10. असाधारण आपातकालीन मामले",
        content: "चिकित्सा आपात स्थिति के प्रमाण जमा करने पर विशेष रिफंड की समीक्षा की जाती है।"
      },
      {
        title: "11. अयोग्यता (Disqualification) पर गैर-रिफंड नियम",
        content: "धोखाधड़ी या फेयर प्ले नियमों का उल्लंघन करने वाले छात्रों को कोई रिफंड नहीं दिया जाएगा।"
      },
      {
        title: "12. चरणबद्ध रिफंड सहायता प्रक्रिया",
        content: "समस्या होने पर payments@rankersleague.com पर ट्रांजैक्शन आईडी के साथ ईमेल करें।"
      },
      {
        title: "13. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह रिफंड नीति भारतीय उपभोक्ता संरक्षण कानूनों के अनुसार है।"
      }
    ]
  },

  // ── 4B. Official Payment & Transaction Processing Policy ───────────────────
  {
    slug: "payment",
    title: "Official Payment & Transaction Processing Policy",
    titleHi: "आधिकारिक भुगतान एवं लेन-देन प्रसंस्करण नीति (Payment Policy)",
    iconName: "CreditCard",
    category: "Finance & Taxes",
    shortDescription: "Comprehensive rules on UPI, cards, net banking, payment gateway failures, pending transactions, duplicate debits, digital receipts, GST, and PCI-DSS security.",
    shortDescriptionHi: "यूपीआई, बैंक कार्ड, नेट बैंकिंग, पेमेंट गेटवे विफलता, पेंडिंग भुगतान, दोहरा डेबिट, डिजिटल रसीदों, जीएसटी और सुरक्षा के स्पष्ट नियम।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master payment policy overhaul detailing supported RBI gateways, UPI/Card/NetBanking processing, failure auto-reconciliation, duplicate debits, and GST receipts." },
      { version: "v2.0", date: "August 2026", summary: "Rules governing payment methods, gateway failures, pending transactions, and receipts." }
    ],
    sections: [
      {
        title: "1. Overview & RBI-Regulated Gateway Framework",
        content: "Ranker's League Technologies Private Limited integrates exclusively with Reserve Bank of India (RBI) regulated commercial payment gateway aggregators (Razorpay, Cashfree, Paytm Payment Gateway) to process financial deposits, wallet top-ups, and contest registrations. We enforce a strict zero-surcharge policy—Ranker's League absorbs all payment processing fees on deposits.",
        bulletPoints: [
          "Zero Surcharge Guarantee: Candidates pay exactly the face-value amount added to their wallet with 0% gateway processing surcharges.",
          "RBI Statutory Compliance: Payment processing complies with RBI directives on tokenization, 2-Factor Authentication, and merchant settlement."
        ]
      },
      {
        title: "2. Supported Payment Methods & Channels",
        content: "Candidates can top-up their Unused Deposit Balance using any of the following verified payment channels:",
        bulletPoints: [
          "Unified Payments Interface (UPI): Google Pay, PhonePe, Paytm UPI, BHIM, Amazon Pay, and custom bank VPAs (Instant processing).",
          "Credit & Debit Cards: Visa, Mastercard, RuPay, and Maestro (PCI-DSS tokenized processing; 0% raw card storage).",
          "Net Banking: Direct integration with 50+ Indian commercial and cooperative banks (SBI, HDFC, ICICI, Axis, Kotak, PNB, etc.).",
          "Virtual Wallet Balance: Internal sub-ledger debits from your Ranker's League Deposit or Bonus Balance."
        ]
      },
      {
        title: "3. Payment Gateway Failures & Pending Transactions",
        content: "Network latency or banking timeouts may occasionally cause pending transactions where funds are debited from your bank but delayed in gateway confirmation:",
        bulletPoints: [
          "Automated Bank Reconciliation: Payment gateways automatically reconcile pending debits within 24 hours.",
          "Seat Allotment / Refund Resolution: If contest seat capacity remains open, your registration is confirmed. If the arena filled during the timeout, 100% of funds return to your bank account."
        ]
      },
      {
        title: "4. Duplicate Debits & Double Payment Adjustments",
        content: "In the event of browser refreshment or connection glitches resulting in double debits for a single transaction:",
        bulletPoints: [
          "Auto-Detection Sweep: Gateway reconciliation systems detect duplicate transaction reference IDs within 24 hours.",
          "Original Source Payout: The duplicate debited amount is dispatched back to your original bank account or UPI source within 3–5 business days."
        ]
      },
      {
        title: "5. Refund Protocols & Source Reversals",
        content: "Refunds for cancelled contests, minimum participation threshold failures (70% rule), or candidate un-registrations (>60 mins prior) follow strict destination rules:",
        bulletPoints: [
          "Wallet Deposits: Contest refunds credit back to your Ranker's League Wallet within 15 minutes.",
          "Gateway Error Reversals: Failed bank deposits return directly to your original bank account or UPI VPA."
        ]
      },
      {
        title: "6. Digital Payment Receipts & GST Invoices",
        content: "Every financial transaction generates a verifiable digital invoice accessible 24/7 in your Profile > Transaction History tab.",
        bulletPoints: [
          "GST-Compliant Receipts: Invoices detail transaction date, unique reference ID, gross amount, GST breakdown, and payment mode.",
          "PDF Download Option: Candidates can download official PDF receipts for accounting records."
        ]
      },
      {
        title: "7. Statutory Taxes & GST Compliance",
        content: "All payments and financial transactions comply strictly with Goods & Services Tax (GST) laws and Ministry of Finance regulations governing online skill platforms in India."
      },
      {
        title: "8. PCI-DSS Level 1 Security & 2FA Protections",
        content: "Transactions are protected using bank-grade cybersecurity infrastructure:",
        bulletPoints: [
          "TLS 1.3 Transport Encryption: End-to-end SSL encryption secures all payment data transmission.",
          "Mandatory 2-Factor Authentication: Card and bank payments require mandatory 3D-Secure OTPs or UPI PIN clearance.",
          "Zero Card Storage: Raw card numbers, CVVs, and net-banking passwords are NEVER stored on Ranker's League servers."
        ]
      },
      {
        title: "9. Real-World Practical Scenarios",
        content: "Scenario A (UPI Gateway Timeout): Candidate pays ₹100 via PhonePe, money debited but screen shows pending -> Gateway reconciles in 45 minutes -> Contest seat confirmed automatically.\n" +
          "Scenario B (Double Payment): Candidate clicks pay twice during network glitch -> ₹200 debited -> Primary ₹100 contest seat confirmed -> Duplicate ₹100 refunded to bank account in 3 days."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Payment Policy is governed by the laws of India. For payment queries or gateway receipts, contact payments@rankersleague.com with your transaction ID."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं आरबीआई (RBI) गेटवे ढांचा",
        content: "रैंकर्स लीग केवल आरबीआई (RBI) द्वारा विनियमित लाइसेंस प्राप्त बैंक गेटवे (Razorpay, Cashfree, Paytm) का उपयोग करता है। पैसे जमा करने पर 0% अतिरिक्त शुल्क लगता है।",
        bulletPoints: [
          "शून्य अतिरिक्त शुल्क (Zero Surcharge): छात्र को जमा राशि पर कोई अतिरिक्त गेटवे शुल्क नहीं देना पड़ता।",
          "आरबीआई वैधानिक अनुपालन: सभी भुगतान आरबीआई के 2-फैक्टर प्रमाणीकरण नियमों का पालन करते हैं।"
        ]
      },
      {
        title: "2. स्वीकृत भुगतान के तरीके (Payment Methods)",
        content: "छात्र UPI (Google Pay, PhonePe, Paytm), क्रेडिट/डेबिट कार्ड (Visa, Mastercard, RuPay) या नेट बैंकिंग (50+ भारतीय बैंक) से पैसे जमा कर सकते हैं।"
      },
      {
        title: "3. पेमेंट गेटवे विफलता (Pending Payment)",
        content: "पैसे कट जाने पर यदि सीट बुक नहीं होती, तो बैंक गेटवे 24 घंटे में ऑटो-सत्यापन करता है। यदि सीट उपलब्ध है तो सीट बुक हो जाती है, अन्यथा पैसे वापस बैंक में आ जाते हैं।"
      },
      {
        title: "4. दोहरा भुगतान (Duplicate Debit) सुधार",
        content: "नेटवर्क की खराबी से दो बार पैसे कटने पर दूसरा डेबिट 3-5 दिनों में आपके मूल बैंक खाते में ऑटो-रिफंड कर दिया जाता है।"
      },
      {
        title: "5. रिफंड प्रोटोकॉल (Refund Rules)",
        content: "प्रतियोगिता रद्दीकरण का रिफंड 15 मिनट में वॉलेट में और गेटवे त्रुटियों का रिफंड सीधे मूल बैंक खाते में जाता है।"
      },
      {
        title: "6. डिजिटल रसीदें (Digital Receipts) एवं जीएसटी",
        content: "प्रत्येक लेन-देन के लिए जीएसटी-अनुपालन डिजिटल रसीद जनरेट होती है जिसे प्रोफ़ाइल से डाउनलोड किया जा सकता है।"
      },
      {
        title: "7. वैधानिक कर एवं जीएसटी (GST) अनुपालन",
        content: "सभी लेन-देन भारतीय जीएसटी कानूनों और वित्त मंत्रालय के नियमों के अनुसार संसाधित होते हैं।"
      },
      {
        title: "8. PCI-DSS बैंक सुरक्षा एवं एन्क्रिप्शन",
        content: "सभी भुगतान TLS 1.3 एन्क्रिप्शन और 2-फैक्टर ओटीपी/यूपीआई पिन से 100% सुरक्षित हैं।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: नेटवर्क खराबी से कटे दोहरे भुगतान की दूसरी राशि 3 दिनों में बैंक खाते में ऑटो-रिफंड हो जाती है।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह भुगतान नीति भारत के कानूनों के अनुसार शासित है। सहायता के लिए संपर्क करें: payments@rankersleague.com।"
      }
    ]
  },

  // ── 5. Withdrawal Policy ──────────────────────────────────────────────────
  {
    slug: "withdrawal",
    title: "Official Prize Withdrawal Policy",
    titleHi: "आधिकारिक पुरस्कार निकासी नीति (Withdrawal Policy)",
    iconName: "Wallet",
    category: "Finance & Taxes",
    shortDescription: "Comprehensive rules governing wallet balance categorization, KYC thresholds, instant UPI/bank payouts, daily limits, AML security, and fraud checks.",
    shortDescriptionHi: "वॉलेट शेष विभाजन, केवाईसी सीमाएं, तत्काल यूपीआई/बैंक विथड्रॉल, दैनिक सीमाएं, एएमएल सुरक्षा और बोगस खाते प्रतिबंध।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "10 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Added instant UPI/IMPS payout (<60s SLA), PAN card KYC mandatory threshold (₹10,000), and AML fraud check rules." },
      { version: "v2.5", date: "August 2026", summary: "Added instant UPI payout integration with automated TDS deduction." }
    ],
    sections: [
      {
        title: "1. Wallet Balance Categorization & Payout Scope",
        content: "Ranker's League maintains a transparent, tri-segmented user wallet system to separate entry funds from contest winnings:",
        bulletPoints: [
          "Winning Balance (Withdrawable): Net prize money earned from contest standings. 100% eligible for instant bank/UPI withdrawal.",
          "Deposit Balance (Non-Withdrawable): Monies added to fund contest entry fees. Reserved strictly for contest registrations.",
          "Bonus / Credit Cashback (Non-Withdrawable): Promotional entry credits earned via referral or top 20% cashback rewards."
        ]
      },
      {
        title: "2. Supported Payout Channels & Banking Gateways",
        content: "Candidates can withdraw settled winning balances directly to verified Indian banking channels:",
        bulletPoints: [
          "Instant UPI: Google Pay, PhonePe, Paytm, BHIM, and bank VPAs (Virtual Payment Addresses).",
          "Immediate Payment Service (IMPS): Direct instant bank account transfer.",
          "National Electronic Funds Transfer (NEFT): Batch transfer for high-volume winnings."
        ]
      },
      {
        title: "3. Processing Timelines & Speed SLAs",
        content: "Ranker's League enforces strict processing Speed SLAs for prize payouts:",
        bulletPoints: [
          "Instant UPI / IMPS Payouts: Processed automatically in <60 seconds upon request.",
          "NEFT & High-Volume Transfers: Processed within 24 to 48 hours following standard banking hours.",
          "Proctor Audit Delay: Withdrawals requested during an active 2-hour post-contest audit are held until standings are verified."
        ]
      },
      {
        title: "4. Statutory KYC & Identity Verification Mandatory Rules",
        content: "In compliance with Indian Income Tax Act regulations and Anti-Money Laundering (AML) directives, mandatory identity verification applies:",
        bulletPoints: [
          "PAN Card Verification: Mandatory for candidates whose cumulative lifetime withdrawals exceed ₹10,000 INR.",
          "Name Mismatch Prohibition: The bank account / UPI VPA holder name must match the candidate's verified identity name 100%.",
          "Third-Party Payout Restriction: Transferring winnings to unverified third-party bank accounts or family members is prohibited."
        ]
      },
      {
        title: "5. Minimum & Maximum Withdrawal Financial Thresholds",
        content: "Ranker's League sets clear transaction boundaries to ensure banking stability and safety:",
        bulletPoints: [
          "Minimum Single Withdrawal Amount: ₹100 INR.",
          "Maximum Single Transaction Limit: ₹25,000 INR.",
          "Maximum Daily Cumulative Instant Payout Limit: ₹50,000 INR."
        ]
      },
      {
        title: "6. Pending & On-Hold Withdrawal Protocol",
        content: "Withdrawal requests may enter a temporary 'Pending' state under specific system conditions:",
        bulletPoints: [
          "Banking Server Downtime: Interbank UPI/IMPS network downtime automatically queues transactions for retry.",
          "Proctor Security Flag: Account undergoing a 2-hour forensic proctor audit delays payout until clearance."
        ]
      },
      {
        title: "7. Rejected & Failed Payout Resolutions",
        content: "If a withdrawal fails or is rejected by the candidate's receiving bank:",
        bulletPoints: [
          "Rejection Triggers: Invalid UPI VPA, closed bank account, inactive IFSC code, or bank name mismatch.",
          "Immediate Reversal: Unfulfilled withdrawal funds are automatically credited back to the candidate's Winning Wallet within 15 minutes."
        ]
      },
      {
        title: "8. PCI-DSS Banking Security & Tokenization",
        content: "All financial transaction routes are protected with enterprise-grade security protocols:",
        bulletPoints: [
          "AES-256 Bit Encryption: Bank credentials and UPI VPAs are tokenized and encrypted at rest.",
          "PCI-DSS Level 1 Compliance: Processed via RBI-licensed scheduled commercial banks and NPCI-certified UPI gateways."
        ]
      },
      {
        title: "9. Fraud Detection & Anti-Money Laundering (AML)",
        content: "Our automated fraud prevention architecture monitors every withdrawal request in real-time:",
        bulletPoints: [
          "Velocity Checks: Rapid consecutive withdrawal requests from identical IP ranges trigger automated manual review.",
          "Deposit Rotation Ban: Depositing funds and requesting immediate withdrawal without participating in contests is banned under AML rules."
        ]
      },
      {
        title: "10. Account Restrictions & Withdrawal Freeze Enforcement",
        content: "Withdrawal capabilities are immediately suspended if an account is flagged for Fair Play Policy infractions, multi-account abuse, or fraudulent chargebacks."
      },
      {
        title: "11. Dedicated Withdrawal Support Desk",
        content: "If a withdrawal remains pending past published SLA timelines, contact our Payout Help Desk: withdrawals@rankersleague.com (24/7 ticket resolution within 12 hours)."
      },
      {
        title: "12. Official Governance Legal Disclaimer",
        content: "All prize withdrawals on Ranker's League are subject to statutory Income Tax (TDS) deductions under Section 194BA and verified candidate KYC compliance."
      }
    ],
    sectionsHi: [
      {
        title: "1. वॉलेट शेष विभाजन एवं विथड्रॉल का दायरा",
        content: "रैंकर्स लीग एक पारदर्शी 3-स्तरीय वॉलेट सिस्टम संचालित करता है:",
        bulletPoints: [
          "जीतने की राशि (Winning Balance): प्रतियोगिता से जीती गई शुद्ध राशि। 100% तुरंत बैंक/UPI में निकालने योग्य।",
          "जमा राशि (Deposit Balance): परीक्षा शुल्क के लिए जोड़ी गई राशि। निकाली नहीं जा सकती।",
          "बोनस/कैशबैक (Bonus Credit): प्रोमोशनल क्रेडिट। निकाला नहीं जा सकता।"
        ]
      },
      {
        title: "2. समर्थित भुगतान माध्यम (UPI & Bank)",
        content: "छात्र अपनी जीत की राशि निम्नलिखित माध्यमों से निकाल सकते हैं:",
        bulletPoints: [
          "तत्काल UPI: Google Pay, PhonePe, Paytm, BHIM UPI.",
          "IMPS: तत्काल बैंक खाता हस्तांतरण।",
          "NEFT: उच्च-राशि विथड्रॉल।"
        ]
      },
      {
        title: "3. विथड्रॉल प्रसंस्करण समय सीमा (SLA)",
        content: "तत्काल UPI/IMPS विथड्रॉल <60 सेकंड में संसाधित होता है; NEFT में 24-48 घंटे लगते हैं।"
      },
      {
        title: "4. अनिवार्य पैन कार्ड (PAN) एवं KYC नियम",
        content: "कुल विथड्रॉल ₹10,000 से अधिक होने पर पैन कार्ड सत्यापन अनिवार्य है। बैंक खाते का नाम छात्र के नाम से 100% मेल खाना चाहिए।"
      },
      {
        title: "5. न्यूनतम एवं अधिकतम विथड्रॉल सीमाएं",
        content: "न्यूनतम विथड्रॉल: ₹100; अधिकतम दैनिक विथड्रॉल: ₹50,000; अधिकतम एकल लेन-देन: ₹25,000।"
      },
      {
        title: "6. लंबित (Pending) विथड्रॉल नियम",
        content: "बैंक सर्वर बंद होने या प्रोक्टर ऑडिट के दौरान विथड्रॉल अस्थायी रूप से पेंडिंग हो सकता है।"
      },
      {
        title: "7. विफल विथड्रॉल एवं रिफंड रिवर्सल",
        content: "गलत UPI ID या बैंक नाम मेल न खाने पर पैसा 15 मिनट में वॉलेट में वापस आ जाता है।"
      },
      {
        title: "8. बैंकिंग सुरक्षा एवं एन्क्रिप्शन",
        content: "सभी लेन-देन AES-256 बिट एन्क्रिप्शन और RBI-लाइसेंस प्राप्त गेटवे से सुरक्षित हैं।"
      },
      {
        title: "9. धोखाधड़ी पहचान एवं मनी लॉन्ड्रिंग-रोधी नियम (AML)",
        content: "बिना परीक्षा खेले पैसे डालकर तुरंत विथड्रॉल करने का प्रयास AML नियमों के तहत प्रतिबंधित है।"
      },
      {
        title: "10. खाता प्रतिबंध एवं विथड्रॉल रोक",
        content: "फेयर प्ले नियम तोड़ने पर विथड्रॉल सुविधा रोक दी जाएगी।"
      },
      {
        title: "11. विथड्रॉल सहायता डेस्क",
        content: "समस्या होने पर withdrawals@rankersleague.com पर संपर्क करें।"
      },
      {
        title: "12. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "सभी विथड्रॉल धारा 194BA के तहत टीडीएस कटौती के अधीन हैं।"
      }
    ]
  },

  // ── 5B. Official Wallet, Balances & Sub-Ledger Policy ──────────────────────
  {
    slug: "wallet",
    title: "Official Wallet, Balances & Sub-Ledger Policy",
    titleHi: "आधिकारिक वॉलेट, बैलेंस एवं सब-लेजर नीति (Wallet Policy)",
    iconName: "CreditCard",
    category: "Finance & Taxes",
    shortDescription: "Comprehensive rules governing tri-segmented wallet balances (Deposit, Winnings, Bonus), deposit limits, entry fee debits, 60-day bonus expiry, refunds, AML controls, and security.",
    shortDescriptionHi: "त्रि-स्तरीय वॉलेट बैलेंस (डिपॉजिट, विनिंग्स, बोनस), जमा सीमाओं, फीस कटौती क्रम, 60-दिन बोनस समाप्ति, रिफंड और एएमएल सुरक्षा के स्पष्ट नियम।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master wallet policy overhaul detailing tri-segmented sub-ledgers, entry fee debit hierarchy, 60-day promotional credit expiry, and AML security controls." },
      { version: "v2.0", date: "August 2026", summary: "Rules governing wallet deposits, entry fee debits, bonus credits, and balance security." }
    ],
    sections: [
      {
        title: "1. Overview & Tri-Segmented Wallet Sub-Ledger Architecture",
        content: "Ranker's League Technologies Private Limited operates a transparent, tri-segmented virtual wallet system. User wallet balances are partitioned into 3 distinct sub-ledger buckets to separate unplayed entry deposits from meritocratic contest winnings and promotional rewards:",
        bulletPoints: [
          "1. Unused Deposit Balance: Monies deposited by the candidate to register for contest entry fees. Reserved strictly for contest registrations.",
          "2. Settled Winning Balance: Net prize money won from meritocratic contest ranks. 100% eligible for instant bank/UPI withdrawal upon identity clearance.",
          "3. Promotional / Bonus Credit Balance: Non-withdrawable promotional entry credits earned via referral bonuses, platform sign-up rewards, or contest cashbacks."
        ]
      },
      {
        title: "2. Deposit Rules & Payment Gateway Processing",
        content: "Candidates can add funds to their Unused Deposit Balance via certified, RBI-regulated payment gateways:",
        bulletPoints: [
          "Supported Gateway Channels: Razorpay, Cashfree, Paytm Payment Gateway, Instant UPI, Net Banking, and Debit/Credit Cards.",
          "Zero Processing Surcharges: Ranker's League absorbs all payment gateway processing fees on deposits.",
          "Financial Deposit Boundaries: Minimum single deposit: ₹10 INR | Maximum daily cumulative deposit cap: ₹25,000 INR."
        ]
      },
      {
        title: "3. Contest Entry Fee Debit Hierarchy & Priority",
        content: "When a candidate registers for a contest arena, entry fees are debited automatically according to a strict sub-ledger priority sequence:",
        bulletPoints: [
          "Step 1 — Promotional Bonus Credit Cap: Bonus credits are debited first up to the allowed cap specified on the contest card (e.g. up to 10% of entry fee).",
          "Step 2 — Unused Deposit Balance: The remaining entry fee is debited next from your Unused Deposit Balance.",
          "Step 3 — Settled Winning Balance: If deposit balance is insufficient, any remaining fee balance is debited from your Settled Winning Balance."
        ]
      },
      {
        title: "4. Refund Credits & 100% Fee Protection Guarantee",
        content: "Entry fee refunds resulting from platform contest cancellations, threshold failures (70% rule), or candidate un-registrations (>60 mins prior) are processed instantly (<15 mins):",
        bulletPoints: [
          "Exact Bucket Credit Reversal: Refunded entry fees are credited back to the exact sub-ledger bucket from which they were debited (e.g. Deposit portion returns to Deposit Balance; Bonus portion returns to Bonus Balance)."
        ]
      },
      {
        title: "5. Withdrawal Rules & Eligibility Criteria",
        content: "Withdrawals are strictly governed by financial regulations:",
        bulletPoints: [
          "Withdrawable Balance Scope: Withdrawals are permitted ONLY from the Settled Winning Balance.",
          "Non-Withdrawable Funds: Unused Deposit Balances and Promotional Bonus Credits CANNOT be withdrawn directly as cash under Anti-Money Laundering (AML) laws; they must be utilized to join contest arenas."
        ]
      },
      {
        title: "6. Promotional Bonus Credits & 60-Day Expiry Rules",
        content: "Promotional Bonus Credits are subject to specific usage windows:",
        bulletPoints: [
          "60-Day Expiry Window: Promotional Bonus Credits expire automatically after 60 days of account inactivity unless utilized in active contests.",
          "Non-Transferable: Bonus credits cannot be transferred to other candidates or converted directly to cash."
        ]
      },
      {
        title: "7. Statutory KYC & Financial Security Safeguards",
        content: "To maintain financial integrity and comply with Indian Income Tax laws and Anti-Money Laundering (AML) directives:",
        bulletPoints: [
          "PAN Verification Threshold: Mandatory for candidates whose cumulative lifetime prize withdrawals exceed ₹10,000 INR.",
          "Anti-P2P Transfer Rule: Peer-to-peer (P2P) wallet balance transfers between candidate accounts are strictly prohibited.",
          "AML Safeguard: Depositing money and attempting immediate withdrawal without playing contests is flagged as suspicious financial laundering."
        ]
      },
      {
        title: "8. Wallet Restrictions & Account Freezing Conditions",
        content: "Wallet balances may be temporarily frozen or locked under specific compliance conditions:",
        bulletPoints: [
          "Proctor Audit Lock: Wallet withdrawals requested during an active 2-hour post-contest audit are held until final standings are verified.",
          "Fraud Investigation Lock: Confirmed cheating, fake KYC documents, or multi-account sweeps trigger instant wallet freezing."
        ]
      },
      {
        title: "9. Step-by-Step Practical Numerical Examples",
        content: "Scenario A (Entry Fee Debit): Candidate has ₹500 Deposit Balance, ₹50 Bonus Credits. Registers for ₹100 contest (10% bonus cap) -> ₹10 debited from Bonus, ₹90 debited from Deposit Balance. Remaining: ₹410 Deposit, ₹40 Bonus.\n" +
          "Scenario B (Winning Payout): Candidate wins Rank 1 (₹5,000 prize) -> ₹5,000 credited to Settled Winning Balance -> Candidate requests instant UPI withdrawal.\n" +
          "Scenario C (Unplayed Deposit Reversal): Candidate deposits ₹1,000, changes mind without playing -> Cannot withdraw directly as Winnings under AML -> Must contact support for source payment reversal audit."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Wallet Policy is governed by Indian financial laws and IT Act 2000 regulations. Ranker's League is not a bank or micro-finance institution; wallet balances represent virtual pre-paid educational contest entry credits."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं त्रि-स्तरीय वॉलेट सब-लेजर वास्तुकला",
        content: "रैंकर्स लीग एक पारदर्शी, त्रि-स्तरीय वॉलेट प्रणाली संचालित करता है। वॉलेट शेष 3 भागों में विभाजित है:",
        bulletPoints: [
          "1. अनयूज्ड डिपॉजिट बैलेंस (Deposit Balance): परीक्षा में भाग लेने के लिए जमा की गई राशि (Non-Withdrawable)।",
          "2. सेटल्ड विनिंग्स बैलेंस (Winning Balance): परीक्षाओं में जीती गई शुद्ध पुरस्कार राशि। 100% बैंक/यूपीआई विथड्रॉल योग्य (Withdrawable)।",
          "3. प्रोमोशनल / बोनस क्रेडिट बैलेंस (Bonus Credit): रेफरल या साइन-अप पर मिला बोनस। केवल फीस छूट के लिए उपयोग।"
        ]
      },
      {
        title: "2. जमा (Deposit) नियम एवं बैंक गेटवे",
        content: "छात्र Razorpay, Cashfree, Paytm, UPI या बैंक कार्ड से पैसे जमा कर सकते हैं। जमा पर कोई अतिरिक्त शुल्क नहीं लगता। न्यूनतम जमा: ₹10 | अधिकतम दैनिक जमा: ₹25,000।"
      },
      {
        title: "3. प्रतियोगिता फीस कटौती का नियम (Debit Priority)",
        content: "फीस की कटौती का क्रम: 1. प्रोमोशनल बोनस (स्वीकृत सीमा तक, जैसे 10%) -> 2. डिपॉजिट बैलेंस -> 3. विनिंग्स बैलेंस।"
      },
      {
        title: "4. 100% फीस सुरक्षा एवं रिफंड नियम",
        content: "परीक्षा रद्द होने पर रिफंड 15 मिनट के भीतर उसी वॉलेट सब-लेजर में वापस जमा कर दिया जाता है जहां से वह कटा था।"
      },
      {
        title: "5. विथड्रॉल (निकासी) के नियम",
        content: "विथड्रॉल केवल 'Winning Balance' से किया जा सकता है। डिपॉजिट या बोनस राशि को सीधे नकद नहीं निकाला जा सकता (AML कानूनों के अनुसार)।"
      },
      {
        title: "6. प्रोमोशनल बोनस क्रेडिट एवं 60-दिन समाप्ति नियम",
        content: "प्रोमोशनल बोनस क्रेडिट 60 दिनों तक उपयोग न करने पर अपने आप समाप्त (Expire) हो जाता है।"
      },
      {
        title: "7. वैधानिक केवाईसी (KYC) एवं वित्तीय सुरक्षा",
        content: "कुल विथड्रॉल ₹10,000 से अधिक होने पर पैन कार्ड सत्यापन अनिवार्य है। पीयर-टू-पीयर (P2P) ट्रांसफर प्रतिबंधित है।"
      },
      {
        title: "8. वॉलेट फ्रीज और खाता रोक",
        content: "नकल या फॉरेंसिक जांच के दौरान वॉलेट बैलेंस अस्थायी रूप से फ्रीज किया जा सकता है।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: ₹100 की फीस वाली प्रतियोगिता में ₹10 बोनस से और ₹90 डिपॉजिट बैलेंस से कटते हैं।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह वॉलेट नीति भारतीय वित्तीय कानूनों के अनुसार शासित है।"
      }
    ]
  },

  // ── 6. Tax & TDS Policy ───────────────────────────────────────────────────
  {
    slug: "tax-tds",
    title: "Official Tax & Statutory Deductions Policy",
    titleHi: "आधिकारिक कर एवं टीडीएस (TDS) कटौती नीति",
    iconName: "Receipt",
    category: "Finance & Taxes",
    shortDescription: "Dynamic statutory compliance governing Tax Deducted at Source (TDS), net winnings calculation, PAN verification, Form 16A, and CBDT regulations.",
    shortDescriptionHi: "भारतीय आयकर अधिनियम, शुद्ध जीत गणना, पैन कार्ड सत्यापन, फॉर्म 16A और सीबीडीटी नियमों के तहत वैधानिक कर कटौती नीति।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "10 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Dynamic statutory tax compliance framework updated per prevailing CBDT and Indian Income Tax Act guidelines." },
      { version: "v2.2", date: "August 2026", summary: "Automated Form 16A quarterly generation update." }
    ],
    sections: [
      {
        title: "1. Overview & Dynamic Statutory Tax Framework",
        content: "Ranker's League strictly adheres to the tax laws of India and official directives issued by the Ministry of Finance and Central Board of Direct Taxes (CBDT). All taxes and statutory deductions (including Tax Deducted at Source / TDS) are automatically computed and deducted according to applicable Indian laws and prevailing tax rates in effect at the exact time of payout or financial year end.",
        bulletPoints: [
          "Dynamic Compliance: Statutory tax rates and calculation methodologies automatically adapt to prevailing Indian Income Tax Acts.",
          "Legal Deductions: Ranker's League remits all withheld TDS directly to the Income Tax Department under the candidate's verified PAN.",
          "Full Transparency: Breakdown of Gross Winnings, Entry Fee Offset, Statutory TDS, and Net Payable Amount is shown prior to withdrawal execution."
        ]
      },
      {
        title: "2. Net Winnings & Net Payable Calculation Concept",
        content: "Under statutory Indian tax guidelines governing online skill contest platforms, Tax Deducted at Source (TDS) is calculated strictly on Net Winnings, defined as:",
        bulletPoints: [
          "Net Winnings Formula: Net Winnings = (Total Winnings Withdrawn + Year-End Closing Wallet Balance) - (Total Entry Fees Paid for Non-Refunded Contests + Opening Wallet Balance).",
          "Net Payable Formula: Net Payable to Bank Account = Gross Withdrawal Amount - Applicable Statutory TDS.",
          "Entry Fee Tax Offset: Paid entry fees directly reduce taxable net winnings, ensuring candidates are never taxed on principal deposits."
        ]
      },
      {
        title: "3. Mandatory KYC & PAN Verification Protocol",
        content: "To comply with statutory Income Tax regulations, candidates must complete Permanent Account Number (PAN) KYC verification:",
        bulletPoints: [
          "PAN Verification Mandate: Mandatory prior to processing any prize payout withdrawal or exceeding statutory cumulative thresholds.",
          "26AS & AIS Integration: Valid PAN linking ensures all deducted TDS credits reflect accurately in the candidate's Form 26AS and Annual Information Statement (AIS).",
          "Invalid PAN Penalty: Submitting an invalid or unlinked PAN may attract higher statutory withholding rates as mandated by law."
        ]
      },
      {
        title: "4. Timing of Tax Deductions (Withdrawal vs. Year-End)",
        content: "Statutory TDS deductions occur at two specific financial triggers:",
        bulletPoints: [
          "Upon Withdrawal Request: TDS is calculated and deducted on the net winnings portion being withdrawn.",
          "Financial Year End (March 31st): Any un-withdrawn accumulated net winnings remaining in the user wallet at midnight on March 31st undergo automatic year-end TDS deduction."
        ]
      },
      {
        title: "5. Zero Tax on Non-Winning Balances & Refunds",
        content: "TDS applies strictly to net prize winnings earned from contest performance:",
        bulletPoints: [
          "Principal Deposits: Money deposited to fund contest entries carries 0% TDS deduction.",
          "Contest Refunds: Entry fee refunds issued due to cancelled contests or 70% threshold failure carry 0% TDS deduction.",
          "Promotional Credits: Bonus credits and cashback rewards carry 0% TDS until converted into realized net winnings."
        ]
      },
      {
        title: "6. Quarterly Form 16A TDS Certificates",
        content: "Ranker's League files official quarterly TRACES TDS returns (Form 26Q) with the Income Tax Department of India.",
        bulletPoints: [
          "Automated Issuance: Quarterly Form 16A certificates are generated for all candidates who undergo TDS deductions.",
          "Download Portal: Form 16A certificates can be downloaded directly from the candidate's Financial Center dashboard for seamless IT return filing."
        ]
      },
      {
        title: "7. Candidate Statutory Tax Responsibility",
        content: "While Ranker's League deducts and deposits applicable TDS at source, final income tax liability remains the individual responsibility of the candidate based on their total annual income slab under Indian Income Tax Act rules."
      },
      {
        title: "8. Step-by-Step Numerical Calculation Examples",
        content: "Example A (Standard Withdrawal): A candidate wins ₹10,000 in a contest with an entry fee of ₹2,000. Net Winnings = ₹8,000. Under prevailing 30% statutory rate, Statutory TDS = ₹2,400. Net Payable to Bank = ₹7,600.\nExample B (100% Refund): A candidate pays ₹1,000 entry fee for a contest cancelled due to <70% threshold. Refund = ₹1,000 (0% TDS)."
      },
      {
        title: "9. Frequently Asked Questions (Tax & TDS FAQs)",
        content: "Q: Is TDS deducted if I don't withdraw money? A: TDS is deducted at withdrawal or on remaining net winnings on March 31st.\nQ: Can I claim a tax refund for deducted TDS? A: Yes, candidates can claim refunds when filing annual Income Tax Returns (ITR) if their total income falls below taxable slabs."
      },
      {
        title: "10. Statutory Goods and Services Tax (GST) Compliance",
        content: "Ranker's League complies fully with applicable Goods and Services Tax (GST) regulations on platform entry fee transactions as prescribed by the Central Board of Indirect Taxes and Customs (CBIC)."
      },
      {
        title: "11. Official Governance Legal & Regulatory Disclaimer",
        content: "Tax laws, TDS rates, and statutory guidelines are subject to periodic amendments by the Government of India and Parliament. Ranker's League reserves the right to adjust withholding practices immediately upon statutory notification."
      }
    ],
    sectionsHi: [
      {
        title: "1. 1. डायनेमिक वैधानिक कर ढांचे का अवलोकन",
        content: "रैंकर्स लीग भारत के आयकर कानूनों और केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT) के दिशानिर्देशों का सख्ती से पालन करता है। सभी कर और वैधानिक कटौती (TDS सहित) निकासी के समय लागू भारतीय कानूनों के अनुसार स्वचालित रूप से काटी जाती हैं।",
        bulletPoints: [
          "डायनेमिक अनुपालन: कर दरें लागू भारतीय आयकर अधिनियम के अनुसार स्वचालित रूप से अपडेट होती हैं।",
          "पूर्ण पारदर्शिता: विथड्रॉल से पहले कुल जीत, प्रवेश शुल्क छूट, टीडीएस और शुद्ध देय राशि दिखाई जाती है।"
        ]
      },
      {
        title: "2. शुद्ध जीत (Net Winnings) एवं शुद्ध देय राशि गणना",
        content: "भारतीय आयकर नियमों के अनुसार, टीडीएस केवल शुद्ध जीत (Net Winnings) पर लागू होता है:",
        bulletPoints: [
          "शुद्ध जीत सूत्र: शुद्ध जीत = (निकाली गई कुल जीत) - (गैर-रिफंड प्रतियोगिताओं के लिए दिया गया कुल प्रवेश शुल्क)।",
          "शुद्ध देय राशि: बैंक में मिलने वाली राशि = कुल विथड्रॉल - वैधानिक टीडीएस।"
        ]
      },
      {
        title: "3. अनिवार्य पैन (PAN) कार्ड सत्यापन",
        content: "जीत की राशि निकालने के लिए पैन कार्ड सत्यापन अनिवार्य है ताकि काटा गया टीडीएस छात्र के फॉर्म 26AS में दिखाई दे।"
      },
      {
        title: "4. टीडीएस कटौती का समय (विथड्रॉल एवं 31 मार्च)",
        content: "टीडीएस विथड्रॉल के समय या 31 मार्च को वित्तीय वर्ष के अंत में वॉलेट में बची शुद्ध जीत पर काटा जाता है।"
      },
      {
        title: "5. जमा राशि एवं रिफंड पर शून्य (0%) कर",
        content: "मूल जमा राशि, प्रवेश शुल्क रिफंड और बोनस क्रेडिट पर कोई टीडीएस नहीं काटा जाता है।"
      },
      {
        title: "6. त्रैमासिक फॉर्म 16A प्रमाणपत्र",
        content: "रैंकर्स लीग आईटीआर दाखिल करने के लिए त्रैमासिक फॉर्म 16A डाउनलोड करने की सुविधा प्रदान करता है।"
      },
      {
        title: "7. छात्र की व्यक्तिगत कर जिम्मेदारी",
        content: "अंतिम आयकर दायित्व भारतीय आयकर कानूनों के अनुसार छात्र की कुल वार्षिक आय पर निर्भर करता है।"
      },
      {
        title: "8. व्यावहारिक गणना के उदाहरण",
        content: "उदाहरण: ₹10,000 जीत पर ₹2,000 प्रवेश शुल्क घटाकर ₹8,000 शुद्ध जीत बनती है। 30% टीडीएस (₹2,400) काटकर बैंक में ₹7,600 मिलते हैं।"
      },
      {
        title: "9. कर एवं टीडीएस से जुड़े अक्सर पूछे जाने वाले प्रश्न",
        content: "प्र: क्या मैं टीडीएस रिफंड का दावा कर सकता हूं? उ: हां, यदि आपकी कुल आय कर योग्य सीमा से कम है तो आप आईटीआर दाखिल करके रिफंड का दावा कर सकते हैं।"
      },
      {
        title: "10. वैधानिक जीएसटी (GST) अनुपालन",
        content: "रैंकर्स लीग भारत सरकार द्वारा निर्धारित माल एवं सेवा कर (GST) नियमों का पूर्ण अनुपालन करता है।"
      },
      {
        title: "11. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "कर नियम भारत सरकार और संसद के संशोधनों के अधीन हैं।"
      }
    ]
  },
  // ── 18. Account Suspension Policy ────────────────────────────────────────
  {
    slug: "account-suspension",
    title: "Official Account Suspension & Termination Policy",
    titleHi: "आधिकारिक खाता निलंबन एवं समाप्ति नीति (Account Suspension Policy)",
    iconName: "UserX",
    category: "Platform & Security",
    shortDescription: "Comprehensive rules governing temporary suspensions, permanent lifetime bans, grounds for action, prize forfeiture, re-KYC clearance, and appeals.",
    shortDescriptionHi: "अस्थायी निलंबन, स्थायी आजीवन प्रतिबंध, कार्रवाई के आधार, पुरस्कार जब्ती, री-केवाईसी और अपील प्रक्रिया को नियंत्रित करने वाले नियम।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Comprehensive account suspension overhaul detailing temporary locks, permanent bans, multi-account forfeiture, re-KYC protocols, and 48-hr appeals." },
      { version: "v2.0", date: "August 2026", summary: "Conditions under which user accounts may be warned, locked, or terminated." }
    ],
    sections: [
      {
        title: "1. Overview & Enforcement Mandate",
        content: "Ranker's League Technologies Private Limited maintains rigorous compliance standards to ensure 100% fair play, secure financial transactions, and accurate All India Ranks (AIR). To protect honest contestants and platform integrity, Ranker's League reserves the right to issue warnings, enforce temporary account suspensions, or impose permanent lifetime bans on accounts violating platform policies.",
        bulletPoints: [
          "Meritocracy Protection: Enforced to shield honest students against academic fraud, multi-account abuse, and system manipulation.",
          "Objective Evidence Standard: Disciplinary actions are backed by digital audit trails, proctoring telemetry, and forensic log records."
        ]
      },
      {
        title: "2. Grounds & Categorized Reasons for Account Action",
        content: "Account actions are triggered based on specific violations categorized into 4 core compliance tiers:",
        bulletPoints: [
          "Category A — Cheating & Proctor Lockdown Breaches: Utilizing AI solvers (ChatGPT, Gemini), remote desktop tools (AnyDesk, RDP), proxy test candidates, or exceeding 3 tab-switch warnings.",
          "Category B — Payment Fraud & KYC Misrepresentation: Submitting forged/altered government IDs, initiating fraudulent payment chargebacks, or utilizing stolen UPI/Bank credentials.",
          "Category C — Multiple Account & Sybil Violations: Creating or operating duplicate accounts to enter the same contest arena or exploit promotional entry rewards.",
          "Category D — Severe Harassment & Threats: Abusing customer support executives, issuing physical violence threats, or engaging in hate speech across community channels."
        ]
      },
      {
        title: "3. Temporary Account Suspension Framework",
        content: "Temporary suspensions restrict candidate access for a designated duration while compliance investigations are conducted:",
        bulletPoints: [
          "Suspension Duration: Ranging from 7 Days to 90 Days based on infraction severity.",
          "Restricted Privileges: During temporary suspension, candidates cannot enter contest arenas, send community messages, or process wallet withdrawals.",
          "Investigation Freeze: Active wallet balances remain frozen pending final audit clearance."
        ]
      },
      {
        title: "4. Permanent Lifetime Ban Banishment",
        content: "Permanent lifetime banishment is an irrevocable termination reserved for severe, intentional infractions:",
        bulletPoints: [
          "Lifetime Banishment Scope: Permanent removal of the candidate's profile, phone number, email address, PAN card, and hardware device fingerprint from Ranker's League.",
          "Blacklist Registry: Banned credentials are permanently blacklisted to prevent re-registration across all future competition arenas."
        ]
      },
      {
        title: "5. Prize Money Cancellation & Wallet Forfeiture Protocol",
        content: "In cases of confirmed cheating, fraudulent payment, or multi-account abuse:",
        bulletPoints: [
          "100% Prize Forfeiture: Unwithdrawn prize earnings, tournament bonuses, and contest ranks earned through prohibited means are cancelled 100%.",
          "Wallet Balance Seizure: Funds accumulated via fraudulent registrations or illegal multi-account pooling are forfeited to the platform legal cell.",
          "Leaderboard Adjustment: Contested rank standings automatically adjust to promote lower-ranked honest candidates."
        ]
      },
      {
        title: "6. Mandatory Re-KYC Clearance & Identity Verification",
        content: "To lift temporary suspensions or resolve identity flags, candidates must complete re-verification:",
        bulletPoints: [
          "Original ID Verification: Submission of original, unedited government photo IDs (Aadhaar / PAN Card / Passport).",
          "Live Video KYC: Candidate must complete a 60-second live video verification call with a compliance officer."
        ]
      },
      {
        title: "7. Account Reactivation SLAs",
        content: "Accounts subject to temporary suspension automatically restore access upon expiration of the lock period, provided all re-KYC requirements and compliance conditions are satisfied."
      },
      {
        title: "8. Appeals & Compliance Dispute Resolution",
        content: "Candidates who believe their account was suspended in error may submit a formal appeal within 48 hours to `appeals@rankersleague.com` or `suspension@rankersleague.com`. An independent review board audits raw telemetry and issues binding rulings."
      },
      {
        title: "9. Real-World Practical Scenarios",
        content: "Scenario A (Minor Infraction): Candidate exceeds tab-switch limits during a test -> 7-day contest chat mute + system warning.\n" +
          "Scenario B (Multi-Account Fraud): Candidate uses 3 SIMs to enter a prize arena -> Automated hardware sweep detects device hash -> All 3 accounts permanently banned, wallet balances forfeited.\n" +
          "Scenario C (ISP Network Drop Appeal): Candidate disconnected mid-test due to power grid outage, submits ISP outage certificate -> Appeals board verifies log gap -> Account reinstated within 24 hours."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Account Suspension Policy forms an integral part of our Terms & Conditions. Severe offenses involving commercial test syndicates or system hacking will be reported for criminal prosecution under the Indian IT Act, 2000."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं अनुपालन जनादेश",
        content: "रैंकर्स लीग 100% निष्पक्ष प्रतिस्पर्धा और वास्तविक ऑल इंडिया रैंक (AIR) सुनिश्चित करने के लिए सख्त सुरक्षा नियम लागू करता है। नियम तोड़ने वाले खातों को निलंबित या स्थायी रूप से प्रतिबंधित किया जा सकता है।",
        bulletPoints: [
          "ईमानदार छात्रों की सुरक्षा: अकादमिक धोखाधड़ी और कई खाते बनाने वालों के खिलाफ कार्रवाई।",
          "डिजिटल साक्ष्य: सभी कार्रवाइयां प्रोक्टरिंग लॉग और फॉरेंसिक साक्ष्यों पर आधारित होती हैं।"
        ]
      },
      {
        title: "2. खाता निलंबन के मुख्य कारण",
        content: "निम्नलिखित उल्लंघनों पर खाता निलंबित किया जा सकता है:",
        bulletPoints: [
          "श्रेणी 1 — नकल एवं एआई उपयोग: ChatGPT, रिमोट स्क्रीन शेयरिंग या प्रॉक्सी परीक्षार्थी का उपयोग।",
          "श्रेणी 2 — वित्तीय धोखाधड़ी एवं फर्जी केवाईसी: फर्जी सरकारी आईडी जमा करना या गलत बैंक विवरण।",
          "श्रेणी 3 — मल्टी-अकाउंट (कई खाते): एक छात्र द्वारा पुरस्कार जीतने के लिए कई खाते बनाना।",
          "श्रेणी 4 — अभद्र व्यवहार: सहायता कर्मचारियों से दुर्व्यवहार या हिंसात्मक धमकियां देना।"
        ]
      },
      {
        title: "3. अस्थायी खाता निलंबन (Temporary Suspension)",
        content: "अस्थायी निलंबन 7 दिन से 90 दिन तक हो सकता है। इस दौरान विथड्रॉल और परीक्षा में भाग लेना बंद रहता है।"
      },
      {
        title: "4. स्थायी आजीवन प्रतिबंध (Permanent Lifetime Ban)",
        content: "गंभीर मामलों में छात्र का खाता, मोबाइल नंबर, पैन कार्ड और डिवाइस फॉरेंसिक हेश हमेशा के लिए ब्लैकलिस्ट कर दिया जाता है।"
      },
      {
        title: "5. पुरस्कार रद्दीकरण एवं वॉलेट जब्ती",
        content: "धोखाधड़ी से जीते गए सभी पुरस्कार 100% रद्द कर दिए जाते हैं और वॉलेट शेष जब्त कर लिया जाता है।"
      },
      {
        title: "6. अनिवार्य री-केवाईसी (Re-KYC) सत्यापन",
        content: "निलंबन हटाने के लिए मूल सरकारी आईडी और लाइव वीडियो केवाईसी सत्यापन अनिवार्य है।"
      },
      {
        title: "7. खाता पुनर्सक्रियण (Reactivation)",
        content: "अस्थायी निलंबन अवधि पूरी होने और केवाईसी पास होने पर खाता अपने आप चालू हो जाता है।"
      },
      {
        title: "8. अपील प्रक्रिया एवं अनुपालन बोर्ड",
        content: "गलत निलंबन के खिलाफ 48 घंटे के भीतर appeals@rankersleague.com पर अपील दाखिल की जा सकती है।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: कई खाते बनाने पर ऑटोमेटेड सिस्टम द्वारा सभी खाते स्थायी रूप से प्रतिबंधित कर दिए जाते हैं।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह नीति हमारे एंटरप्राइज नियमों एवं शर्तों का अभिन्न अंग है।"
      }
    ]
  },

  // ── 19. Appeal Policy ─────────────────────────────────────────────────────
  {
    slug: "appeal",
    title: "Official Appeals & Dispute Resolution Policy",
    titleHi: "आधिकारिक अपील एवं विवाद निवारण नीति (Appeals Policy)",
    iconName: "HelpCircle",
    category: "Platform & Security",
    shortDescription: "Formal compliance procedure governing contest disruption appeals, answer key challenges, prize payout disputes, suspension appeals, evidence submission, and review SLAs.",
    shortDescriptionHi: "प्रतियोगिता अपील, उत्तर कुंजी चुनौतियों, पुरस्कार विवादों, निलंबन अपीलों, साक्ष्य सबमिशन और समीक्षा समय सीमाओं को नियंत्रित करने वाली औपचारिक प्रक्रिया।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Comprehensive appeals policy overhaul covering contest outages, answer key challenges, prize disputes, evidence standards, 48-hr SLAs, and review board." },
      { version: "v1.7", date: "August 2026", summary: "Procedure for candidates to challenge disqualifications or score discrepancies." }
    ],
    sections: [
      {
        title: "1. Overview & Candidate Right to Fair Hearing",
        content: "Ranker's League Technologies Private Limited guarantees every candidate the statutory right to a fair, transparent, and impartial appeal process. If you believe your contest score, All India Rank (AIR), prize payout, or account status was affected by technical disruption, scoring error, or unjust proctoring flagging, you have the right to submit a formal appeal.",
        bulletPoints: [
          "Zero Bias Mandate: Appeals are evaluated independently by a dedicated Compliance Review Board comprising Senior Compliance Officers, Lead Forensic Engineers, and Subject Matter Experts (SMEs).",
          "Binding Transparency: Audit logs, proctoring telemetry, and answer key databases are cross-verified against submitted candidate evidence."
        ]
      },
      {
        title: "2. The 4 Primary Appeal Categories",
        content: "Candidates may file an appeal under 4 distinct compliance categories:",
        bulletPoints: [
          "1. Contest Outage & Technical Disruption Appeals: Server disconnection, platform-wide outages, local power grid failures, or payment gateway debits without seat allocation.",
          "2. Result, Scoring & Answer Key Challenges: Disputing an official answer key, reporting ambiguous question options, or requesting raw score recalculation.",
          "3. Prize Money, Tax & Payout Appeals: Discrepancies in prize pool allocation, TDS tax calculation disputes, or payout settlement delays.",
          "4. Account Suspension & Disqualification Appeals: Challenging tab-switch warnings, alleged AI tool usage flags, or automated multi-account bans."
        ]
      },
      {
        title: "3. Mandatory Appeal Filing Window & Timelines",
        content: "To ensure timely contest resolution and leaderboard finalization:",
        bulletPoints: [
          "48-Hour Filing Window: All formal appeals must be submitted within 48 hours of contest completion or suspension notice issuance.",
          "Answer Key Challenge Window: Answer key challenges must be filed within 2 hours of contest completion during the live audit window."
        ]
      },
      {
        title: "4. Evidence Submission Guidelines & Acceptable Proof",
        content: "Appeals must be accompanied by verifiable, authentic digital evidence:",
        bulletPoints: [
          "Technical Disruption Proof: ISP broadband outage certificates, electricity board fault notices, network latency logs, or screen recordings.",
          "Answer Key Challenge Proof: Standardized textbook references (NCERT, standard academic publications) or step-by-step mathematical proofs.",
          "Identity & Suspension Proof: Original government photo IDs (Aadhaar / PAN Card) for identity clearance."
        ]
      },
      {
        title: "5. Independent Compliance Review Board & Review SLA",
        content: "Upon appeal submission, an independent 3-member panel investigates raw telemetry:",
        bulletPoints: [
          "Review Speed SLA: Standard appeals are audited and resolved within 24 to 48 hours of submission.",
          "Emergency Audit Resolution: Answer key challenges during live audits are resolved within 2 hours prior to final prize release."
        ]
      },
      {
        title: "6. Decision Evaluation & Investigation Process",
        content: "The review panel executes a thorough 4-step forensic investigation:\n" +
          "Step 1: Verification of candidate evidence against raw server interaction logs (`YYYY-MM-DD HH:MM:SS.mmm`).\n" +
          "Step 2: Analysis of proctoring webcam snapshots, keystroke dynamics, and tab-switch event timestamps.\n" +
          "Step 3: Academic verification by Subject Matter Experts (SMEs) for question challenges.\n" +
          "Step 4: Issuance of a formal written ruling."
      },
      {
        title: "7. Binding Final Rulings & Remedies",
        content: "If an appeal is upheld, Ranker's League executes appropriate remedial actions:",
        bulletPoints: [
          "Score Correction: All India Ranks (AIR) and percentiles recalculate automatically across the entire leaderboard.",
          "Wallet Credit Refund: 100% entry fee is credited back to the candidate's wallet in cases of technical disruption.",
          "Account Reinstatement: Suspended accounts are un-frozen instantly and wallet balances restored."
        ]
      },
      {
        title: "8. Comprehensive Real-World Practical Scenarios",
        content: "Scenario A (Answer Key Challenge Upheld): Candidate challenges Question 14 in JEE Physics Arena with NCERT proof -> SME verifies option B is correct -> Question updated -> Candidate receives +4 marks, AIR updates from 12 to 4.\n" +
          "Scenario B (ISP Outage Upheld): Candidate disconnected mid-test, submits ISP outage ticket -> Log audit confirms 12-minute gap -> 100% entry fee refunded to wallet.\n" +
          "Scenario C (AI Tool Ban Rejected): Candidate appeals 90-day ban -> Forensic log confirms 100% text copy-paste to ChatGPT window -> Appeal rejected, ban sustained."
      },
      {
        title: "9. Frequently Asked Questions (Appeals FAQs)",
        content: "Q: Is there a fee to file an appeal? A: No, filing an appeal or answer key challenge is 100% free.\nQ: Where do I file an appeal? A: Submit via Legal Center Appeals portal or email `appeals@rankersleague.com`."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "Rulings issued by the Chief Compliance Officer and Review Board are final and binding. Unsubstantiated or frivolous spam appeals may result in temporary appeal submission limits."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं निष्पक्ष सुनवाई का अधिकार",
        content: "रैंकर्स लीग प्रत्येक छात्र को निष्पक्ष, पारदर्शी और स्वतंत्र अपील प्रक्रिया का वैधानिक अधिकार देता है। यदि आपको लगता है कि आपका परिणाम, स्कोर या खाता स्थिति गलत तरीके से प्रभावित हुई है, तो आप अपील कर सकते हैं।",
        bulletPoints: [
          "शून्य पक्षपात: अपीलों की समीक्षा एक स्वतंत्र अनुपालन बोर्ड (Compliance Review Board) द्वारा की जाती है।",
          "पूर्ण पारदर्शिता: सर्वर लॉग्स और वेबकैम स्नैपशॉट से साक्ष्यों का मिलान किया जाता है।"
        ]
      },
      {
        title: "2. अपीलों की 4 मुख्य श्रेणियां",
        content: "छात्र 4 श्रेणियों के तहत अपील दाखिल कर सकते हैं:",
        bulletPoints: [
          "1. तकनीकी खराबी और आउटेज अपील: सर्वर डिस्कनेक्शन, पावर ग्रिड विफलता या भुगतान के बाद सीट न मिलना।",
          "2. उत्तर कुंजी (Answer Key) एवं अंक चुनौती: उत्तर कुंजी पर आपत्ति या अंकों की पुनर्गणना।",
          "3. पुरस्कार एवं टीडीएस टैक्स अपील: पुरस्कार राशि में विसंगति या टीडीएस कटौती संबंधी पूछताछ।",
          "4. खाता निलंबन एवं अयोग्यता अपील: टैब-स्विच अलर्ट, एआई उपयोग या मल्टी-अकाउंट निलंबन को चुनौती।"
        ]
      },
      {
        title: "3. अनिवार्य समय सीमा (48-Hour Filing SLA)",
        content: "परीक्षा समाप्त होने या निलंबन नोटिस जारी होने के 48 घंटे के भीतर अपील दाखिल करना अनिवार्य है। उत्तर कुंजी चुनौतियां 2 घंटे के भीतर दर्ज की जानी चाहिए।"
      },
      {
        title: "4. साक्ष्य प्रस्तुत करने के नियम (Acceptable Proof)",
        content: "अपील के साथ मान्य डिजिटल साक्ष्य जैसे आईएसपी आउटेज प्रमाण पत्र, स्क्रीन रिकॉर्डिंग, एनसीईआरटी पाठ्यपुस्तक संदर्भ या मूल आईडी जमा करें।"
      },
      {
        title: "5. स्वतंत्र अनुपालन समीक्षा बोर्ड एवं समय सीमा",
        content: "अपीलों का निपटारा 24 से 48 घंटे के भीतर किया जाता है। उत्तर कुंजी चुनौतियों का हल 2 घंटे में दिया जाता है।"
      },
      {
        title: "6. जांच और साक्ष्य मूल्यांकन प्रक्रिया",
        content: "अनुपालन बोर्ड सर्वर लॉग, वेबकैम फोटो और उत्तर कुंजी डेटाबेस की 4-चरणीय फॉरेंसिक जांच करता है।"
      },
      {
        title: "7. अंतिम निर्णय एवं निवारण (Remedies)",
        content: "अपील स्वीकार होने पर अंक और रैंक सुधारे जाते हैं, वॉलेट में 100% फीस रिफंड दी जाती है या खाता तुरंत चालू कर दिया जाता है।"
      },
      {
        title: "8. व्यावहारिक उदाहरण",
        content: "उदाहरण: उत्तर कुंजी में त्रुटि साबित होने पर छात्र को +4 अंक देकर रैंक 12 से सुधारकर 4 की जाती है।"
      },
      {
        title: "9. अक्सर पूछे जाने वाले प्रश्न",
        content: "प्र: क्या अपील दाखिल करने की कोई फीस है? उ: नहीं, अपील प्रक्रिया 100% मुफ़्त है।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "मुख्य अनुपालन अधिकारी और समीक्षा बोर्ड द्वारा जारी निर्णय अंतिम और बाध्यकारी होंगे।"
      }
    ]
  },

  {
    slug: "contact-support",
    title: "Official Contact, Legal Support & Grievance Policy",
    titleHi: "आधिकारिक संपर्क, कानूनी सहायता एवं शिकायत निवारण नीति (Legal Support)",
    iconName: "Mail",
    category: "Platform & Security",
    shortDescription: "Official legal directory, Grievance Officer details under IT Rules 2021, response SLAs, escalation matrix, tax support, and court notice channels.",
    shortDescriptionHi: "आधिकारिक कानूनी निर्देशिका, आईटी नियम 2021 के तहत शिकायत अधिकारी, रिस्पांस समय सीमा, एस्केलेशन और कोर्ट नोटिस चैनल।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "8 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Comprehensive legal support overhaul detailing Grievance Officer under IT Rules 2021, response SLAs, escalation matrix, tax desk, and notice service." },
      { version: "v1.0", date: "August 2026", summary: "Direct contact channels for legal notices, regulatory inquiries, and privacy officers." }
    ],
    sections: [
      {
        title: "1. Overview & Official Legal Directory",
        content: "Ranker's League Technologies Private Limited provides dedicated single-window communication channels for legal inquiries, statutory notices, regulatory communications, consumer complaints, and policy clarifications. All communications are logged and handled by our specialized compliance teams.",
        bulletPoints: [
          "General Legal Inquiries: legal@rankersleague.com",
          "Data Privacy & DPO Desk: privacy@rankersleague.com | dpo@rankersleague.com",
          "Statutory Tax & TDS Support: tax@rankersleague.com",
          "Contest Appeals & Audit Desk: appeals@rankersleague.com",
          "Trust, Safety & Fair Play: trust@rankersleague.com",
          "Statutory Grievance Desk: grievance@rankersleague.com"
        ]
      },
      {
        title: "2. Response Speed SLAs & Service Timelines",
        content: "We operate strict Service Level Agreements (SLAs) to ensure prompt resolution:",
        bulletPoints: [
          "Emergency Contest & Audit Queries: Responded to within 2 Hours during live contest audit windows.",
          "Standard Policy & Account Inquiries: Responded to within 24 Hours.",
          "Formal Legal Notices & Statutory Communications: Acknowledged within 48 Hours; substantive response issued within 7 Business Days."
        ]
      },
      {
        title: "3. Policy & Terms Inquiries Desk",
        content: "For questions or clarifications regarding our Enterprise Terms & Conditions, Privacy Policy, Fair Play Policy, or Eligibility criteria, candidates can submit inquiries directly to `legal@rankersleague.com`. Clear legal explanations are provided by our compliance counsel."
      },
      {
        title: "4. Contest & Examination Helpdesk",
        content: "If you have questions regarding contest rules, seat capacity thresholds (70% rule), 1v1 speed duel mechanics, tie-breaking algorithms, or All India Rank (AIR) calculations, our technical helpdesk provides 24/7 assistance."
      },
      {
        title: "5. Statutory Tax, TDS & Financial Desk",
        content: "For assistance regarding Tax Deducted at Source (TDS) calculations, Form 16A quarterly tax certificates, PAN card verification, CBDT regulations, or withdrawal settlements, reach our finance legal desk at `tax@rankersleague.com`."
      },
      {
        title: "6. Multi-Tier Escalation Matrix",
        content: "If your inquiry or grievance is not resolved to your satisfaction, follow our 3-tier escalation process:\n" +
          "Tier 1: Customer Support Desk (support@rankersleague.com) — Initial response within 12 hours.\n" +
          "Tier 2: Legal & Compliance Cell (legal@rankersleague.com) — Escalation review within 24 hours.\n" +
          "Tier 3: Statutory Grievance Officer (grievance@rankersleague.com) — Final executive resolution within 7 business days."
      },
      {
        title: "7. Statutory Grievance Officer (IT Rules 2021 & Consumer Protection)",
        content: "In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and Consumer Protection (E-Commerce) Rules, 2020, our designated Statutory Grievance Officer is:\n" +
          "Statutory Grievance Officer: Adv. Rajendra Sharma (Chief Compliance Officer)\n" +
          "Email: grievance@rankersleague.com\n" +
          "Physical Address: Ranker's League Technologies Private Limited, Legal Cell, Tech Park, New Delhi - 110001, India."
      },
      {
        title: "8. Consumer Complaints & Redressal Protocol",
        content: "Consumer grievances regarding platform services, wallet refunds, or payout settlements submitted to the Grievance Officer are acknowledged within 48 hours and fully redressed within 15 days per statutory consumer protection rules."
      },
      {
        title: "9. Service of Formal Legal Notices & Court Communications",
        content: "All formal legal notices, court summons, statutory agency demands, or Intellectual Property (IP) infringement claims must be served in writing via registered post/courier to our physical corporate office in New Delhi and copied via email to `legal@rankersleague.com`."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Contact & Legal Support Policy guarantees open communication. Frivolous legal threats or spam communications to statutory email channels may result in administrative account restrictions."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं आधिकारिक कानूनी निर्देशिका",
        content: "रैंकर्स लीग कानूनी पूछताछ, वैधानिक नोटिस, उपभोक्ता शिकायतों और नीतिगत प्रश्नों के लिए समर्पित चैनल प्रदान करता है।",
        bulletPoints: [
          "सामान्य कानूनी पूछताछ: legal@rankersleague.com",
          "डेटा गोपनीयता (DPO): privacy@rankersleague.com",
          "कर एवं टीडीएस सपोर्ट: tax@rankersleague.com",
          "प्रतियोगिता अपील: appeals@rankersleague.com",
          "वैधानिक शिकायत अधिकारी: grievance@rankersleague.com"
        ]
      },
      {
        title: "2. उत्तर समय सीमा (Response SLAs)",
        content: "आपातकालीन परीक्षा प्रश्नों का उत्तर 2 घंटे में; सामान्य प्रश्नों का उत्तर 24 घंटे में; और औपचारिक कानूनी नोटिस का उत्तर 7 कार्य दिवसों में दिया जाता है।"
      },
      {
        title: "3. नीति एवं नियम प्रश्न सहायता",
        content: "नियमों एवं शर्तों, गोपनीयता नीति या पात्रता संबंधी प्रश्नों के लिए संपर्क करें: legal@rankersleague.com।"
      },
      {
        title: "4. प्रतियोगिता एवं परीक्षा सहायता डेस्क",
        content: "प्रतियोगिता नियमों, 70% सीट सीमा और टाई-ब्रेकिंग नियमों पर 24/7 सहायता।"
      },
      {
        title: "5. वैधानिक कर एवं टीडीएस सहायता डेस्क",
        content: "फॉर्म 16A टीडीएस प्रमाण पत्र, पैन कार्ड और आयकर नियमों से जुड़े प्रश्नों के लिए: tax@rankersleague.com।"
      },
      {
        title: "6. 3-स्तरीय एस्केलेशन मैट्रिक्स (Escalation)",
        content: "स्तर 1: सपोर्ट डेस्क -> स्तर 2: लीगल सेल -> स्तर 3: वैधानिक शिकायत अधिकारी (Grievance Officer)।"
      },
      {
        title: "7. वैधानिक शिकायत अधिकारी (IT Rules 2021)",
        content: "आईटी नियम 2021 के तहत नियुक्त शिकायत अधिकारी:\n" +
          "शिकायत अधिकारी: एडवोकेट राजेंद्र शर्मा (मुख्य अनुपालन अधिकारी)\n" +
          "ईमेल: grievance@rankersleague.com\n" +
          "पता: रैंकर्स लीग टेक्नोलॉजीज प्राइवेट लिमिटेड, लीगल सेल, टेक पार्क, नई दिल्ली - 110001, भारत।"
      },
      {
        title: "8. उपभोक्ता शिकायत निवारण प्रक्रिया",
        content: "उपभोक्ता शिकायतों की पावती 48 घंटे में दी जाती है और 15 दिनों के भीतर पूर्ण निवारण किया जाता है।"
      },
      {
        title: "9. कोर्ट नोटिस एवं कानूनी पत्राचार",
        content: "सभी कोर्ट समन और कानूनी नोटिस लिखित रूप में हमारे नई दिल्ली कॉर्पोरेट कार्यालय में भेजे जाने चाहिए।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह नीति पारदर्शी और त्वरित सहायता की गारंटी देती है।"
      }
    ]
  },

  // ── 21. Official Intellectual Property & Copyright Policy ─────────────────
  {
    slug: "intellectual-property",
    title: "Official Intellectual Property & Copyright Policy",
    titleHi: "आधिकारिक बौद्धिक संपदा एवं कॉपीराइट नीति (IP Policy)",
    iconName: "ShieldAlert",
    category: "Platform & Security",
    shortDescription: "Comprehensive legal rules governing question bank copyrights, mock test protection, website software IP, trademarks, Telegram piracy prohibitions, DMCA takedowns, and legal enforcement.",
    shortDescriptionHi: "प्रश्न बैंक कॉपीराइट, मॉक टेस्ट सुरक्षा, वेबसाइट सॉफ्टवेयर आईपी, ट्रेडमार्क, टेलीग्राम पाइरेसी प्रतिबंध, डीएमसीए टेकडाउन और कानूनी कार्रवाई के नियम।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master IP policy overhaul detailing question bank copyrights, website code IP, logo trademarks, Telegram piracy bans, DMCA 24-hr takedowns, and FIR criminal prosecution." },
      { version: "v2.0", date: "August 2026", summary: "Rules protecting proprietary questions, logos, website design, and trademark assets." }
    ],
    sections: [
      {
        title: "1. Overview & Exclusive Ownership Mandate",
        content: "Ranker's League Technologies Private Limited is the sole and exclusive owner of all intellectual property, original educational content, software algorithms, design assets, and question bank databases published on rankersleague.com and associated mobile applications. All rights are protected under the Indian Copyright Act 1957, Trade Marks Act 1999, and international IP treaties.",
        bulletPoints: [
          "Sole Ownership Mandate: All test items, solutions, platform code, and branding elements are the exclusive proprietary assets of Ranker's League.",
          "Statutory Protection: Protected by domestic copyright laws, trademark registries, and international intellectual property conventions."
        ]
      },
      {
        title: "2. Proprietary Question Bank & Mock Test Copyright",
        content: "Every exam question, solution key, hint explanation, subject blueprint, mathematical diagram, and mock test paper hosted on Ranker's League is an original literary and scientific work:",
        bulletPoints: [
          "Question Bank Ownership: Copyright covers all JEE, NEET, CUET, and SSC practice questions, step-by-step solutions, and answer key formulations.",
          "Extraction Prohibition: Copying, capturing screenshots, recording video streams, or extracting test items via OCR software is strictly prohibited."
        ]
      },
      {
        title: "3. Website UI/UX & Software Source Code IP",
        content: "The complete technical architecture of Ranker's League is protected software intellectual property:",
        bulletPoints: [
          "Software Source Code: Next.js frontend code, React components, Node.js backend engines, API endpoints, database schemas, and anti-cheat algorithms.",
          "UI/UX Design: Visual styling, neon dark mode themes, dashboard layouts, leadboards, and interactive arena interfaces."
        ]
      },
      {
        title: "4. Logos, Trademarks & Brand Asset Protection",
        content: "'Ranker's League', 'Rankers League', the Ranker's League logo crest, shield emblems, slogans, and trade dress are registered or pending trademarks of Ranker's League Technologies Private Limited:",
        bulletPoints: [
          "Trademark Protection: Unauthorized use of our brand name, logo, or trademark assets in domain names, mobile apps, or promotional ads is illegal.",
          "Impersonation Prohibition: Creating social media profiles, Telegram channels, or coaching portals using Ranker's League branding is strictly prohibited."
        ]
      },
      {
        title: "5. Strict Prohibition on Redistribution & Commercial Usage",
        content: "Content hosted on Ranker's League is provided strictly for personal academic preparation:",
        bulletPoints: [
          "Commercial Resale Ban: Selling, reselling, licensing, or bundling Ranker's League mock test series or PDFs is illegal.",
          "Telegram & Social Media Ban: Uploading question PDFs, test series screenshots, or answer keys to Telegram groups, WhatsApp channels, or YouTube videos is strictly forbidden."
        ]
      },
      {
        title: "6. Permitted Personal & Academic Usage License",
        content: "Registered candidates receive a limited, non-exclusive, non-transferable, revocable license to access test materials solely for personal non-commercial examination preparation within active browser sessions."
      },
      {
        title: "7. Prohibited IP Violations & Piracy Vectors",
        content: "The following activities constitute severe civil infringement and criminal piracy:\n" +
          "1. Telegram Piracy: Sharing PDF exports or screenshot collections on Telegram bots/channels.\n" +
          "2. Web Scraping & Crawling: Deploying automated scrapers, bots, or crawlers to extract question databases.\n" +
          "3. Reverse Engineering: Decompiling or reverse-engineering platform source code or proctoring SDKs.\n" +
          "4. Commercial Piracy: Selling compiled test series to offline coaching institutes."
      },
      {
        title: "8. DMCA & Copyright Take-Down Protocol (24-Hr SLA)",
        content: "We respond promptly to copyright infringement notices. If you believe your copyrighted work has been improperly posted on our platform, or if our content is being pirated on external channels, contact our IP Enforcement Desk:\n" +
          "IP Desk Email: copyright@rankersleague.com | ip@rankersleague.com\n" +
          "Take-Down SLA: External pirated channels are issued statutory DMCA take-down notices within 24 hours."
      },
      {
        title: "9. Legal Action, Criminal Prosecution & Statutory Damages",
        content: "Violators of our intellectual property rights face aggressive legal enforcement:",
        bulletPoints: [
          "Criminal Prosecution: Filing Police FIRs under Section 63/65 of the Indian Copyright Act 1957 (punishable by up to 3 years imprisonment and fine).",
          "Civil Lawsuits: Pursuing High Court injunctions and claiming statutory commercial damages up to ₹1,00,00,000 INR against pirate operations.",
          "Platform Termination: Instant permanent ban and forfeiture of wallet balances for candidates caught redistributing platform IP."
        ]
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Intellectual Property Policy is legally binding. All rights not expressly granted herein are reserved by Ranker's League Technologies Private Limited."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं सर्वाधिकार सुरक्षित (Sole Ownership)",
        content: "रैंकर्स लीग (Ranker's League Technologies Private Limited) वेबसाइट, मोबाइल ऐप, प्रश्न बैंक और सॉफ्टवेयर कोड की सभी बौद्धिक संपदा (IP) का एकमात्र और अनन्य मालिक है।",
        bulletPoints: [
          "कॉपीराइट अधिनियम 1957 एवं ट्रेडमार्क अधिनियम 1999 के तहत 100% कानूनी रूप से सुरक्षित।",
          "बिना अनुमति के हमारी सामग्री का उपयोग कानूनन अपराध है।"
        ]
      },
      {
        title: "2. प्रश्न बैंक एवं मॉक टेस्ट कॉपीराइट (Questions & Tests)",
        content: "सभी JEE, NEET, CUET प्रश्न, उत्तर कुंजी, व्याख्याएं और मॉक टेस्ट पेपर हमारी मूल बौद्धिक संपत्ति हैं। प्रश्न पत्रों के स्क्रीनशॉट लेना, स्क्रीन रिकॉर्डिंग करना या पीडीएफ बनाना सख्त मना है।"
      },
      {
        title: "3. वेबसाइट कोड एवं UI/UX डिजाइन (Software Code)",
        content: "वेबसाइट का स्रोत कोड (Source Code), एंटी-चीट एल्गोरिदम, डेटाबेस और डिजाइन थीम 100% कॉपीराइट सुरक्षित हैं।"
      },
      {
        title: "4. लोगो, ट्रेडमार्क एवं ब्रांड सुरक्षा (Logo & Trademark)",
        content: "'Ranker's League' नाम, लोगो, शील्ड प्रतीक और स्लोगन ट्रेडमार्क कानून द्वारा सुरक्षित हैं। नाम या लोगो का अनधिकृत उपयोग गैर-कानूनी है।"
      },
      {
        title: "5. टेलीग्राम पाइरेसी एवं व्यावसायिक पुनर्विक्रय पर पूर्ण प्रतिबंध",
        content: "सामग्री को टेलीग्राम ग्रुप, व्हाट्सएप, यूट्यूब या कोचिंग संस्थानों में बेचना या शेयर करना सख्त प्रतिबंधित है।"
      },
      {
        title: "6. व्यक्तिगत उपयोग की अनुमति (Personal License)",
        content: "छात्र केवल व्यक्तिगत पढ़ाई के लिए ही प्रश्न पत्रों का उपयोग कर सकते हैं।"
      },
      {
        title: "7. प्रतिबंधित गतिविधियां (Violations)",
        content: "वेब स्क्रैपिंग, टेलीग्राम शेयरिंग, स्क्रीन रिकॉर्डिंग, कोड रिवर्स इंजीनियरिंग और पीडीएफ बिक्री प्रतिबंधित है।"
      },
      {
        title: "8. DMCA एवं टेक-डाउन नोटिस (24-Hour SLA)",
        content: "पाइरेसी की शिकायत के लिए संपर्क करें: copyright@rankersleague.com। टेलीग्राम चैनलों पर 24 घंटे में कानूनी टेकडाउन भेजा जाता है।"
      },
      {
        title: "9. कानूनी कार्रवाई, एफआईआर (FIR) एवं जुर्माना",
        content: "कॉपीराइट अधिनियम की धारा 63 के तहत पुलिस FIR (3 साल तक की जेल) और ₹1 करोड़ तक का हर्जाना ठोका जाएगा।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह बौद्धिक संपदा नीति 100% कानूनी रूप से बाध्यकारी है।"
      }
    ]
  },

  // ── 22. Official DMCA & Copyright Infringement Policy ────────────────────
  {
    slug: "copyright",
    title: "Official DMCA & Copyright Infringement Policy",
    titleHi: "आधिकारिक डीएमसीए एवं कॉपीराइट उल्लंघन नीति (Copyright Policy)",
    iconName: "FileText",
    category: "Platform & Security",
    shortDescription: "Statutory DMCA takedown notice rules, Indian Copyright Act compliance, reporting procedures, 24-hr removal SLAs, counter-notices, licensing terms, and repeat infringer bans.",
    shortDescriptionHi: "वैधानिक DMCA टेकडाउन नोटिस नियम, भारतीय कॉपीराइट अधिनियम अनुपालन, 24-घंटे सामग्री हटाने की सीमा, काउंटर नोटिस और खाता समाप्ति नियम।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master Copyright & DMCA policy overhaul detailing DMCA notice requirements, 24-hr removal SLA, statutory counter-notices, repeat infringer bans, and educational licensing." },
      { version: "v2.0", date: "August 2026", summary: "Procedure for reporting copyright infringement and requesting DMCA takedowns." }
    ],
    sections: [
      {
        title: "1. Overview & Statutory Compliance Framework",
        content: "Ranker's League Technologies Private Limited respects the intellectual property rights of creators and educational publishers while maintaining safe-harbor compliance under Section 79 of the Indian Information Technology Act, 2000, the Indian Copyright Act, 1957 (Section 52 - Fair Dealing), and global Digital Millennium Copyright Act (DMCA - 17 U.S.C. § 512) standards.",
        bulletPoints: [
          "Statutory Safe Harbor: Ranker's League acts expeditiously to investigate and remove infringing content upon receipt of valid statutory notices.",
          "Dual Legal Protection: Governed by Indian copyright statutory laws and global DMCA notice protocols."
        ]
      },
      {
        title: "2. Copyright Ownership & Educational Content Rights",
        content: "All original test questions, solution blueprints, hint explanations, video modules, and subject matter frameworks hosted on Ranker's League are sole proprietary works of Ranker's League Technologies Private Limited:",
        bulletPoints: [
          "Proprietary Educational Material: Sole copyright over all original JEE, NEET, CUET, and SSC practice exams.",
          "User-Generated Content (UGC): Candidates retain copyright over original forum discussion posts but grant Ranker's League a perpetual worldwide distribution license."
        ]
      },
      {
        title: "3. End-User Personal Academic Licensing Terms",
        content: "Registered candidates receive a limited, revocable, non-exclusive, non-transferable license to access test papers and solutions strictly for personal non-commercial study inside active browser sessions."
      },
      {
        title: "4. Question Papers & Examination Asset Protections",
        content: "Official exam practice papers, answer keys, and solution manuals hosted on Ranker's League are protected literary and scientific works under Section 13 of the Indian Copyright Act, 1957. Unauthorized copying, PDF creation, or web scraping is illegal."
      },
      {
        title: "5. DMCA-Style Takedown Notice & Reporting Requirements",
        content: "Copyright owners or authorized agents may submit a formal written Takedown Notice containing the following mandatory elements:\n" +
          "1. Physical or electronic signature of the copyright owner or authorized agent.\n" +
          "2. Identification of the copyrighted work claimed to have been infringed.\n" +
          "3. Exact URL or specific location of the allegedly infringing material on Ranker's League.\n" +
          "4. Contact details of the complaining party (Full Name, Address, Phone, Email).\n" +
          "5. Statement of good-faith belief that the material is not authorized by the copyright owner.\n" +
          "6. Statement under penalty of perjury that the notice information is accurate.\n" +
          "Official DMCA Email: dmca@rankersleague.com | copyright@rankersleague.com"
      },
      {
        title: "6. Notice Review & Content Removal (24-Hour SLA)",
        content: "Upon receipt of a valid statutory Takedown Notice:",
        bulletPoints: [
          "24-Hour Removal SLA: Ranker's League Compliance Cell investigates and removes or disables access to the infringing material within 24 hours.",
          "Uploader Notification: The candidate or user who uploaded the material is notified immediately with details of the takedown notice."
        ]
      },
      {
        title: "7. Statutory Counter-Notice & Restoration Protocol",
        content: "If a user believes material was removed by mistake or misidentification, they may submit a formal Counter-Notice including:\n" +
          "1. Identification of the material removed and its prior location.\n" +
          "2. Statement under penalty of perjury of good-faith belief that removal was a mistake.\n" +
          "3. User's full name, address, phone number, and consent to legal jurisdiction.\n" +
          "Restoration Window: Material is restored in 10 to 14 business days unless the original copyright holder files a court action."
      },
      {
        title: "8. Repeat Infringer Permanent Termination Policy",
        content: "Ranker's League enforces a strict repeat infringer policy:",
        bulletPoints: [
          "2-Strike Rule: Accounts accruing 2 or more valid copyright takedown strikes within a 12-month period face permanent account banishment.",
          "Wallet Forfeiture: Account termination for copyright piracy results in immediate forfeiture of unwithdrawn wallet balances."
        ]
      },
      {
        title: "9. Real-World Practical Examples & Case Scenarios",
        content: "Scenario A (Telegram Piracy Takedown): Telegram channel redistributes pirated Ranker's League Physics PDF tests -> DMCA notice issued to Telegram Legal -> Channel disabled in 24 hours.\n" +
          "Scenario B (User Forum Upload): Student posts copyrighted textbook scan to arena chat -> DMCA notice received -> Post deleted in 4 hours, student receives Strike 1.\n" +
          "Scenario C (Counter-Notice Resolution): Student's self-authored handwritten notes flagged by automated filter -> Student files Counter-Notice -> Verified by Subject Matter Expert -> Notes restored."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Copyright Policy is legally binding under Indian IT Act 2000 and global DMCA standards. Submitting false DMCA notices carries statutory legal liability for damages."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं वैधानिक अनुपालन ढांचा",
        content: "रैंकर्स लीग भारतीय सूचना प्रौद्योगिकी अधिनियम 2000 की धारा 79 (Safe Harbor), भारतीय कॉपीराइट अधिनियम 1957 और वैश्विक DMCA मानकों का पूर्ण अनुपालन करता है।",
        bulletPoints: [
          "वैधानिक सेफ हार्बर: वैध शिकायत मिलने पर उल्लंघनकारी सामग्री को तुरंत हटाया जाता है।",
          "वैश्विक कॉपीराइट अनुपालन।"
        ]
      },
      {
        title: "2. कॉपीराइट स्वामित्व एवं शैक्षणिक सामग्री अधिकार",
        content: "सभी प्रश्न बैंक, मॉक टेस्ट, उत्तर कुंजी, व्याख्याएं और वीडियो सामग्री रैंकर्स लीग की अनन्य बौद्धिक संपत्ति हैं।"
      },
      {
        title: "3. छात्र उपयोग लाइसेंस (Academic License)",
        content: "छात्रों को केवल व्यक्तिगत पढ़ाई के लिए ही सामग्री तक पहुँचने का सीमित लाइसेंस दिया जाता है।"
      },
      {
        title: "4. प्रश्न पत्र एवं परीक्षा सामग्री सुरक्षा",
        content: "सभी परीक्षा प्रश्न पत्र भारतीय कॉपीराइट अधिनियम 1957 की धारा 13 के तहत साहित्यिक कृतियों के रूप में सुरक्षित हैं।"
      },
      {
        title: "5. DMCA टेकडाउन नोटिस प्रस्तुत करने के नियम",
        content: "कॉपीराइट स्वामी लिखित नोटिस ईमेल पर भेज सकते हैं: dmca@rankersleague.com। नोटिस में उल्लंघन सामग्री का सटीक URL और साक्ष्य होना अनिवार्य है।"
      },
      {
        title: "6. सामग्री हटाने की समय सीमा (24-Hour SLA)",
        content: "वैध शिकायत प्राप्त होने के 24 घंटे के भीतर उल्लंघनकारी सामग्री हटा दी जाती है।"
      },
      {
        title: "7. काउंटर नोटिस (Counter-Notice) प्रक्रिया",
        content: "गलती से सामग्री हटाए जाने पर छात्र 10 से 14 दिनों में सामग्री पुनर्स्थापित करने के लिए काउंटर नोटिस दाखिल कर सकता है।"
      },
      {
        title: "8. दोहरा उल्लंघन करने वालों का स्थायी प्रतिबंध (Repeat Infringers)",
        content: "12 महीने में 2 बार कॉपीराइट का उल्लंघन करने वाले छात्रों का खाता स्थायी रूप से बंद कर दिया जाता है।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: टेलीग्राम चैनल पर अनधिकृत पीडीएफ शेयर करने पर 24 घंटे में डीएमसीए टेकडाउन जारी किया जाता है।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "झूठी DMCA शिकायत प्रस्तुत करने पर कानूनी जुर्माना लगाया जा सकता है।"
      }
    ]
  },

  // ── 23. Official Question Paper, Content & Anti-Leakage Policy ────────────
  {
    slug: "question-paper",
    title: "Official Question Paper, Content & Anti-Leakage Policy",
    titleHi: "आधिकारिक प्रश्न पत्र, परीक्षा सामग्री एवं लीक-रोधी नीति (Question Paper Policy)",
    iconName: "FileCheck",
    category: "Platform & Security",
    shortDescription: "Comprehensive legal rules governing question ownership, anti-leakage security, screenshot prohibitions, Telegram piracy bans, commercial resale restrictions, and FIR penalties.",
    shortDescriptionHi: "प्रश्न पत्र कॉपीराइट स्वामित्व, लीक-रोधी सुरक्षा, स्क्रीनशॉट एवं स्क्रीन रिकॉर्डिंग प्रतिबंध, टेलीग्राम पाइरेसी बैन, व्यावसायिक बिक्री रोक और कानूनी एफआईआर पेनल्टी।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master Question Paper policy overhaul detailing question bank copyrights, screenshot/recording prohibitions, dynamic watermarking, anti-leakage vault security, and Police FIR prosecution." },
      { version: "v2.0", date: "August 2026", summary: "Rules protecting exam question papers, preventing screenshots, and restricting question distribution." }
    ],
    sections: [
      {
        title: "1. Overview & Educational Integrity Mandate",
        content: "Ranker's League Technologies Private Limited maintains strict institutional safeguards to protect the secrecy, integrity, and intellectual property of all examination question papers across competitive arenas (JEE Main/Advanced, NEET-UG, CUET-UG, SSC, Banking). Every question item is engineered to evaluate genuine merit and All India Ranks (AIR).",
        bulletPoints: [
          "Merit Protection Mandate: Safeguarding question papers ensures 100% fair competition for all honest candidates.",
          "Zero Leakage Guarantee: Encrypted vault architecture protects live test items prior to arena launch."
        ]
      },
      {
        title: "2. Proprietary Question Ownership & Copyright",
        content: "All exam questions, numerical problems, solution keys, step-by-step hint explanations, subject blueprints, and question formulations hosted on Ranker's League are the sole proprietary property of Ranker's League Technologies Private Limited under the Indian Copyright Act, 1957:",
        bulletPoints: [
          "Exclusive Copyright: Copyright covers all original question items, diagram formulations, and answer key databases.",
          "Non-Exclusive Student License: Candidates receive a temporary, non-transferable license to view questions strictly within active live exam sessions."
        ]
      },
      {
        title: "3. Prohibition on Question Reuse, Scraping & Extraction",
        content: "Candidates and third parties are strictly prohibited from copying, reusing, scraping, or extracting examination content:",
        bulletPoints: [
          "Automated Scraping Ban: Using web scrapers, bots, crawlers, or OCR tools to extract test items is illegal.",
          "Database Mining Ban: Extracting or saving question bank databases from network API payloads is strictly forbidden."
        ]
      },
      {
        title: "4. Prohibition on Public Distribution & Social Media Sharing",
        content: "Public distribution of Ranker's League exam questions, test PDFs, or answer keys is strictly forbidden across all public and private channels:",
        bulletPoints: [
          "Telegram & Social Media Ban: Uploading question PDFs, screenshots, or answer keys to Telegram groups, WhatsApp channels, YouTube videos, or Discord servers is strictly prohibited.",
          "Forum Redistribution Ban: Posting raw test items on external forums or coaching portals constitutes severe copyright infringement."
        ]
      },
      {
        title: "5. Anti-Leakage Cryptographic Vault Security",
        content: "To guarantee 100% pre-exam secrecy, Ranker's League employs AES-256 encrypted cryptographic vaults to store upcoming contest question papers:",
        bulletPoints: [
          "Pre-Contest Vault Secrecy: Test papers remain encrypted until exact contest start timestamps (`YYYY-MM-DD HH:MM:SS.mmm`).",
          "Anti-Leakage Prosecution: Attempting to leak, buy, sell, or solicit pre-contest test papers is treated as criminal academic fraud."
        ]
      },
      {
        title: "6. Prohibition on Screenshots, Screen Recording & Photography",
        content: "Taking screenshots, desktop video recordings, camera captures, or mobile photography during live tests or practice sessions is strictly prohibited:",
        bulletPoints: [
          "Proctoring Lockdown: Automated proctoring software blocks OS-level screenshot hotkeys (PrtScn, Win+Shift+S) and screen recorders.",
          "Dynamic Steganographic Watermarking: Test screens display invisible, dynamic candidate-specific telemetry watermarks. Any leaked screenshot automatically identifies the candidate's User ID, IP address, and device Hash."
        ]
      },
      {
        title: "7. Prohibition on Commercial Resale & Coaching Usage",
        content: "Ranker's League examination papers and question banks CANNOT be commercialized, packaged, or resold to third-party coaching institutes, tuition centers, or publishing houses."
      },
      {
        title: "8. Statutory Penalties & Enforcement Matrix",
        content: "Violations of our Question Paper Policy trigger severe disciplinary and legal consequences:\n" +
          "Tier 1 (Screenshot / Recording Attempt): Instant test disqualification + ₹1,000 wallet penalty + 30-day contest suspension.\n" +
          "Tier 2 (Telegram / Social Media Leak): Permanent lifetime account ban + 100% wallet forfeiture + Police FIR filing under Copyright Act Sec 63 & IT Act Sec 66.\n" +
          "Tier 3 (Pre-Contest Leakage / Commercial Sale): Permanent lifetime blacklist + Police FIR filing + Civil Lawsuit in High Court claiming statutory commercial damages up to ₹1,00,00,000 INR."
      },
      {
        title: "9. Real-World Practical Scenarios & Enforcement Cases",
        content: "Scenario A (Live Screen Recording Attempt): Candidate attempts screen recording during JEE Physics Arena -> Proctoring telemetry detects recording software -> Test auto-submitted with zero score, 30-day suspension issued.\n" +
          "Scenario B (Telegram Question PDF Sharing): Candidate exports test paper via browser DOM and posts to Telegram channel -> Dynamic steganographic watermark identifies candidate ID -> Account permanently banned, wallet balance forfeited, Police FIR lodged.\n" +
          "Scenario C (Commercial Coaching Sale): Private coaching institute buys test questions from candidate -> Injunction lawsuit filed in High Court + police complaint under IT Act."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Question Paper Policy is legally binding under the Indian Copyright Act 1957, Information Technology Act 2000, and Indian Penal Code (IPC). All rights reserved."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं शैक्षणिक अखंडता जनादेश",
        content: "रैंकर्स लीग प्रतियोगी परीक्षाओं (JEE, NEET, CUET, SSC) के प्रश्न पत्रों की गोपनीयता, सुरक्षा और बौद्धिक संपदा की रक्षा के लिए 100% प्रतिबद्ध है।",
        bulletPoints: [
          "निष्पक्ष प्रतियोगिता जनादेश: प्रश्न पत्रों की सुरक्षा सभी ईमानदार छात्रों के लिए 100% निष्पक्षता सुनिश्चित करती है।",
          "शून्य लीक गारंटी: एन्क्रिप्टेड वॉल्ट वास्तुकला परीक्षा शुरू होने से पहले प्रश्नों को सुरक्षित रखती है।"
        ]
      },
      {
        title: "2. प्रश्न पत्र कॉपीराइट स्वामित्व (Question Ownership)",
        content: "सभी प्रश्न, संख्यात्मक समस्याएं, उत्तर कुंजी और व्याख्याएं भारतीय कॉपीराइट अधिनियम 1957 के तहत केवल रैंकर्स लीग की अनन्य बौद्धिक संपत्ति हैं।"
      },
      {
        title: "3. प्रश्न निष्कर्षण एवं वेब स्क्रैपिंग पर रोक (No Scraping)",
        content: "स्वचालित बॉट, स्क्रैपर या ओसीआर टूल से प्रश्न निकालने या कॉपी करने पर सख्त प्रतिबंध है।"
      },
      {
        title: "4. टेलीग्राम एवं सोशल मीडिया शेयरिंग पर प्रतिबंध (No Sharing)",
        content: "प्रश्न पत्रों, पीडीएफ या उत्तर कुंजियों को टेलीग्राम ग्रुप, व्हाट्सएप, यूट्यूब या डिस्कॉर्ड पर शेयर करना सख्त मना है।"
      },
      {
        title: "5. परीक्षा लीक-रोधी सुरक्षा (Anti-Leakage Security)",
        content: "परीक्षा शुरू होने से पहले प्रश्न पत्र एईएस-256 एन्क्रिप्टेड वॉल्ट में सुरक्षित रहते हैं। परीक्षा लीक करने या बेचने का प्रयास संगीन अपराध माना जाएगा।"
      },
      {
        title: "6. स्क्रीनशॉट एवं स्क्रीन रिकॉर्डिंग पर प्रतिबंध (No Screenshots)",
        content: "परीक्षा के दौरान स्क्रीनशॉट (PrtScn) या स्क्रीन रिकॉर्डिंग करना सख्त मना है। डायनेमिक वाटरमार्क से स्क्रीनशॉट लेने वाले छात्र की पहचान तुरंत हो जाती है।"
      },
      {
        title: "7. व्यावसायिक बिक्री पर पूर्ण प्रतिबंध (No Commercial Usage)",
        content: "प्रश्न पत्रों को कोचिंग संस्थानों या तीसरे पक्ष को बेचना या पैकेज करना सख्त गैर-कानूनी है।"
      },
      {
        title: "8. कानूनी पेनल्टी एवं एफआईआर (Penalties Matrix)",
        content: "नियम तोड़ने पर:\n" +
          "1. स्क्रीनशॉट प्रयास: परीक्षा से अयोग्यता + ₹1,000 पेनल्टी + 30 दिन का बैन।\n" +
          "2. टेलीग्राम लीक: स्थायी आजीवन बैन + वॉलेट जब्ती + पुलिस FIR।\n" +
          "3. व्यावसायिक बिक्री: पुलिस FIR (3 साल की जेल) + ₹1 करोड़ का हर्जाना।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: टेलीग्राम पर प्रश्न पत्र शेयर करने वाले छात्र के वाटरमार्क से उसकी पहचान कर खाता स्थायी रूप से बैन किया गया और पुलिस FIR दर्ज की गई।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह प्रश्न पत्र नीति भारतीय कॉपीराइट अधिनियम 1957 और आईटी अधिनियम 2000 के तहत 100% कानूनी रूप से बाध्यकारी है।"
      }
    ]
  },

  // ── 24. Official Artificial Intelligence (AI) Usage Policy ───────────────
  {
    slug: "ai-usage",
    title: "Official Artificial Intelligence (AI) Usage & Proctoring Policy",
    titleHi: "आधिकारिक कृत्रिम बुद्धिमत्ता (AI) उपयोग एवं प्रोक्टरिंग नीति (AI Policy)",
    iconName: "Cpu",
    category: "Platform & Security",
    shortDescription: "Comprehensive rules governing AI prohibitions during live contests, permitted post-test AI learning assistance, forensic AI detection engine, penalties, and FIR prosecution.",
    shortDescriptionHi: "लाइव परीक्षा के दौरान AI उपयोग पर पूर्ण प्रतिबंध, परीक्षा के बाद AI शिक्षण सहायता, फॉरेंसिक AI डिटेक्शन इंजन, पेनल्टी और कानूनी कार्रवाई।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master AI Policy overhaul detailing live contest AI bans (ChatGPT, Gemini), post-contest AI doubt solver permissions, keystroke forensic detection, 90-day bans, and Police FIR rules." },
      { version: "v2.0", date: "August 2026", summary: "Rules governing AI tool usage during tests, anti-cheat detection, and educational AI assistance." }
    ],
    sections: [
      {
        title: "1. Overview & Fair Play AI Mandate",
        content: "Ranker's League Technologies Private Limited enforces a strict human-meritocracy mandate across all competitive examination arenas (JEE Main/Advanced, NEET-UG, CUET-UG, SSC, Banking). To protect honest candidates and guarantee authentic All India Ranks (AIR), live contests evaluate 100% human intellectual problem-solving capability without artificial assistance.",
        bulletPoints: [
          "100% Human Merit Mandate: Prizes and national ranks are awarded exclusively based on human intellectual merit.",
          "Zero AI Tolerance During Tests: Utilizing AI tools or automated solvers during active contest timers constitutes academic cheating."
        ]
      },
      {
        title: "2. Strict Prohibition of AI Usage DURING Live Contests",
        content: "Candidates are strictly forbidden from utilizing any artificial intelligence (AI) tools, models, extensions, or applications while participating in live exam arenas:",
        bulletPoints: [
          "Prohibited LLMs & Chatbots: ChatGPT, Google Gemini, Claude, Perplexity AI, Microsoft Copilot, DeepSeek, or custom LLMs.",
          "Prohibited AI Extensions: Solvely, AnswerAI, Quizlet AI, CheatGPT, or browser DOM solvers.",
          "Secondary Device AI Apps: Photomath, Google Lens, Mathway, or mobile camera OCR solvers."
        ]
      },
      {
        title: "3. Permitted AI Usage AFTER Contests (Post-Exam Learning)",
        content: "Once a contest submission is complete, candidates are fully permitted and encouraged to utilize AI for educational learning:",
        bulletPoints: [
          "Ranker's League AI Tutor: Using our official AI Doubt Solver to review step-by-step explanations of incorrect questions.",
          "Post-Test Diagnostics: Utilizing AI-generated weakness analytics, time-per-question breakdowns, and concept revision plans."
        ]
      },
      {
        title: "4. AI-Driven Academic Learning Assistance Guidelines",
        content: "Outside live contest windows, AI serves as a powerful learning companion. Candidates may use AI for concept clarifications, formula derivations, practice problem generation, and mock test preparation."
      },
      {
        title: "5. Forbidden AI Exploitation & Evasion Vectors",
        content: "The following activities constitute deliberate academic cheating and AI exploitation:\n" +
          "1. Split-Screen LLMs: Running local LLMs (Ollama, LM Studio) or side-by-side browser windows.\n" +
          "2. OCR Camera Apps: Photographing contest screens using secondary smartphones.\n" +
          "3. Automated Mouse/Keystroke Bots: Scripting automated responses or web API scrapers.\n" +
          "4. Proxy AI Solvers: Transmitting question text to third-party solver services via Bluetooth/smartwatches."
      },
      {
        title: "6. Multi-Layered AI Forensic Detection Engine",
        content: "Ranker's League deploys an advanced 4-tier AI Forensic Detection Engine to catch AI cheating:",
        bulletPoints: [
          "1. Keystroke Dynamics & Rhythm Telemetry: Analyzes typing speed, keydown/keyup intervals (<20ms anomalies), and paste events.",
          "2. Answer Velocity Anomalies: Flags candidates solving complex multi-step numericals in sub-10-second intervals matching LLM response rates.",
          "3. AI Text Signature Matching: Cross-references free-form or numerical step inputs against known LLM text patterns.",
          "4. Proctoring Telemetry: Detects tab-switches, focus loss, secondary display connections, and clipboard events."
        ]
      },
      {
        title: "7. Statutory Penalties & Disciplinary Action Matrix",
        content: "Violations of our AI Usage Policy trigger immediate disciplinary enforcement:\n" +
          "Tier 1 (First AI/Tab-Switch Flag): Immediate contest disqualification + ₹1,000 wallet penalty + 30-day contest ban.\n" +
          "Tier 2 (Confirmed AI Tool Usage): 90-day account ban + 100% prize money forfeiture + All India Rank (AIR) cancellation.\n" +
          "Tier 3 (Repeat Infraction / AI Bot Exploitation): Permanent lifetime account ban + PAN/Aadhaar/Hardware blacklist + Police FIR filing under IT Act Sec 66D (Cheating by Personation)."
      },
      {
        title: "8. Real-World Practical Scenarios & Forensic Cases",
        content: "Scenario A (ChatGPT Extension Flag): Candidate uses browser extension to solve Physics numerical -> Anti-cheat telemetry detects extension DOM overlay & copy-paste event -> Test auto-submitted with 0 score, 90-day ban issued.\n" +
          "Scenario B (Secondary Phone Camera OCR): Candidate photographs laptop screen with mobile AI solver -> Keystroke dynamics & 45-second answer velocity spike triggers statistical anomaly flag -> Proctoring review confirms AI cheating -> Account suspended.\n" +
          "Scenario C (Post-Test AI Learning Allowed): Candidate completes test, opens Ranker's League AI Tutor to review incorrect Chemistry questions -> 100% permitted and rewarded with learning XP."
      },
      {
        title: "9. Appeals & Technical Forensic Audit Process",
        content: "Candidates who believe their account was falsely flagged for AI usage may submit a formal appeal within 48 hours to `appeals@rankersleague.com`. The Compliance Review Board audits raw keystroke telemetry, proctoring snapshots, and server logs before issuing a final ruling."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This AI Usage Policy is legally binding under the Indian Information Technology Act 2000 and Indian Penal Code. Human meritocracy is 100% non-negotiable."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं 100% मानव मेधा जनादेश (Human Meritocracy)",
        content: "रैंकर्स लीग 100% मानव मेधा (Human Meritocracy) का अनुपालन करता है। लाइव परीक्षाओं के दौरान केवल छात्र की बौद्धिक क्षमता का परीक्षण किया जाता है।",
        bulletPoints: [
          "100% मानव मेधा जनादेश: पुरस्कार और राष्ट्रीय रैंक केवल छात्र की स्वयं की क्षमता पर दिए जाते हैं।",
          "परीक्षा के दौरान AI पर शून्य सहनशीलता (Zero AI Tolerance)।"
        ]
      },
      {
        title: "2. लाइव परीक्षा के दौरान AI उपयोग पर पूर्ण प्रतिबंध (No AI During Test)",
        content: "परीक्षा के दौरान ChatGPT, Google Gemini, Claude, Solvely, Photomath, Google Lens या किसी भी AI टूल का उपयोग सख्त मना है।"
      },
      {
        title: "3. परीक्षा के बाद AI शिक्षण सहायता (Post-Test AI Allowed)",
        content: "परीक्षा समाप्त होने के बाद रैंकर्स लीग AI डाउट सोल्वर (AI Tutor) से गलत उत्तरों को समझना और पढ़ाई करना 100% स्वीकृत है।"
      },
      {
        title: "4. पढ़ाई में AI सहायता मार्गदर्शन (AI Learning Assistance)",
        content: "परीक्षा के अलावा सामान्य दिनों में अवधारणाओं (Concepts) को समझने के लिए AI का उपयोग एक अध्ययन साथी के रूप में किया जा सकता है।"
      },
      {
        title: "5. प्रतिबंधित AI धोखाधड़ी के तरीके (Forbidden AI Exploitation)",
        content: "स्प्लिट-स्क्रीन LLM, मोबाइल कैमरा OCR ऐप्स, ऑटोमेटेड बोट्स और एक्सटेंशन ओवरले द्वारा AI का उपयोग प्रतिबंधित है।"
      },
      {
        title: "6. फॉरेंसिक AI डिटेक्शन इंजन (AI Detection Engine)",
        content: "हमारा AI फॉरेंसिक सिस्टम टाइपिंग स्पीड (Keystroke Dynamics), उत्तर देने की गति (Answer Velocity) और AI सिग्नेचर मैचिंग से धोखाधड़ी तुरंत पकड़ लेता है।"
      },
      {
        title: "7. कानूनी पेनल्टी एवं एफआईआर (Penalties Matrix)",
        content: "नियम तोड़ने पर:\n" +
          "1. पहला अलर्ट: परीक्षा से अयोग्यता + ₹1,000 पेनल्टी + 30 दिन का बैन।\n" +
          "2. AI उपयोग साबित होना: 90 दिनों का खाता बैन + पुरस्कार राशि जब्ती + रैंक रद्द।\n" +
          "3. दोहरा अपराध: आजीवन प्रतिबंध + पुलिस FIR (IT Act Sec 66D)।"
      },
      {
        title: "8. व्यावहारिक उदाहरण",
        content: "उदाहरण: परीक्षा में ChatGPT एक्सटेंशन का उपयोग करने पर सिस्टम द्वारा धोखाधड़ी पकड़ी गई और छात्र पर 90 दिनों का बैन लगाया गया।"
      },
      {
        title: "9. अपील एवं फॉरेंसिक ऑडिट प्रक्रिया",
        content: "गलत फ्लैग लगने पर छात्र 48 घंटे के भीतर appeals@rankersleague.com पर अपील दाखिल कर सकता है।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह AI उपयोग नीति भारतीय सूचना प्रौद्योगिकी अधिनियम 2000 के तहत 100% कानूनी रूप से बाध्यकारी है।"
      }
    ]
  },

  // ── 25. Official Statutory Grievance Redressal Policy ──────────────────────
  {
    slug: "grievance-redressal",
    title: "Official Statutory Grievance Redressal Policy",
    titleHi: "आधिकारिक वैधानिक शिकायत निवारण नीति (Grievance Policy)",
    iconName: "ShieldCheck",
    category: "Platform & Security",
    shortDescription: "Statutory grievance mechanism under IT Rules 2021 & Consumer Protection Rules 2020, Grievance Officer details, 48-hr acknowledgement, 15-day redressal SLA, and escalation matrix.",
    shortDescriptionHi: "आईटी नियम 2021 एवं उपभोक्ता संरक्षण नियम 2020 के तहत वैधानिक शिकायत निवारण, शिकायत अधिकारी संपर्क, 48-घंटे पावती और 15-दिन निवारण समय सीमा।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master Grievance Policy overhaul detailing IT Rules 2021 compliance, Grievance Officer directory, 48-hr acknowledgement SLA, 15-day resolution SLA, and Consumer Protection rights." },
      { version: "v2.0", date: "August 2026", summary: "Statutory procedure for filing grievances, escalation matrix, and officer contacts." }
    ],
    sections: [
      {
        title: "1. Overview & Statutory Mandate",
        content: "Ranker's League Technologies Private Limited is committed to transparent, fair, and accountable user grievance resolution. This policy is promulgated in strict compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and Rule 5(3) of the Consumer Protection (E-Commerce) Rules, 2020.",
        bulletPoints: [
          "Statutory Compliance Mandate: Enforces consumer rights under the Consumer Protection Act, 2019, and IT Rules 2021.",
          "Single-Window Redressal: Guaranteed executive resolution for all candidate disputes, financial grievances, or platform issues."
        ]
      },
      {
        title: "2. Designated Statutory Grievance Officer Directory",
        content: "In compliance with Indian statutory requirements, our designated Statutory Grievance Officer is details below:\n" +
          "Statutory Grievance Officer: Adv. Rajendra Sharma (Chief Compliance & Grievance Officer)\n" +
          "Official Email: grievance@rankersleague.com\n" +
          "Physical Office Address: Ranker's League Technologies Private Limited, Legal Cell, Tech Park, New Delhi - 110001, India.\n" +
          "Helpline Telephone: +91-11-4098-7600 (Mon–Fri, 10:00 AM – 6:00 PM IST)."
      },
      {
        title: "3. Formal Complaint Filing Procedure",
        content: "Candidates or consumers may lodge a formal grievance by submitting a written complaint containing:\n" +
          "1. Registered Candidate Full Name & User ID / Registered Phone Number.\n" +
          "2. Specific Grievance Category & Contest Reference ID (if applicable).\n" +
          "3. Chronological description of the issue or dispute.\n" +
          "4. Verifiable supporting evidence (Transaction IDs, Screenshots, Bank Statements, ISP logs).\n" +
          "Filing Channels: Email to `grievance@rankersleague.com` or registered post to our New Delhi corporate office."
      },
      {
        title: "4. Categorized Grievance Classes",
        content: "Grievances are processed under 5 distinct compliance classes:",
        bulletPoints: [
          "1. Contest & Examination Disruption: Scoring errors, answer key challenges, server disconnections, All India Rank (AIR) disputes.",
          "2. Financial, Wallet & Payout Grievances: Wallet top-up failures, TDS calculation disputes, delayed UPI/bank payouts, duplicate debits.",
          "3. Account Suspension & Disqualification: Challenging tab-switch warnings, alleged AI tool flags, or multi-account locks.",
          "4. Data Privacy & DPDP Grievances: Data deletion requests, privacy policy clarifications, unauthorized account access.",
          "5. Community & Harassment Grievances: Cyberbullying, abusive chat messages, impersonation, hate speech."
        ]
      },
      {
        title: "5. Statutory Timeframes & Speed SLAs",
        content: "We operate under strict statutory timelines to guarantee prompt grievance resolution:",
        bulletPoints: [
          "48-Hour Acknowledgement SLA: Formal written receipt with a unique Grievance Tracking Ticket ID is issued within 48 Hours.",
          "15-Day Redressal SLA: Full executive investigation and final written resolution issued within 15 Days per IT Rules 2021.",
          "Emergency Contest Outage SLA: Live contest disruption disputes resolved within 48 Hours prior to final prize settlement."
        ]
      },
      {
        title: "6. Executive Investigation & Audit Process",
        content: "The Grievance Officer executes a thorough 4-step investigation workflow:\n" +
          "Step 1: Verification of complaint validity and generation of Tracking Ticket ID.\n" +
          "Step 2: Technical audit of raw server telemetry logs (`YYYY-MM-DD HH:MM:SS.mmm`), bank gateway API responses, or proctoring snapshots.\n" +
          "Step 3: Executive evaluation by the Compliance Review Board and Subject Matter Experts (SMEs).\n" +
          "Step 4: Delivery of a formal written ruling and execution of binding remedial action."
      },
      {
        title: "7. Multi-Tier Escalation Hierarchy",
        content: "If your grievance is not resolved to your satisfaction, follow our 3-tier escalation structure:\n" +
          "Tier 1: Customer Helpdesk (support@rankersleague.com) — Initial response within 12 hours.\n" +
          "Tier 2: Legal Cell (legal@rankersleague.com) — Escalation review within 24 hours.\n" +
          "Tier 3: Statutory Grievance Officer (grievance@rankersleague.com) — Final executive order within 15 days."
      },
      {
        title: "8. Statutory Consumer Protection Rights & Legal Remedies",
        content: "This policy does not restrict a consumer's statutory rights under the Consumer Protection Act, 2019. If a candidate remains dissatisfied with the final order of the Grievance Officer, they retain the right to approach competent Consumer Disputes Redressal Commissions (District, State, or National Commissions)."
      },
      {
        title: "9. Real-World Practical Scenarios & Redressal Cases",
        content: "Scenario A (Payout Delay Redressal): Candidate files grievance regarding UPI withdrawal pending >24h -> Grievance Officer tracks bank API queue -> Payment re-processed & credited within 12 hours.\n" +
          "Scenario B (Answer Key Dispute Redressal): Candidate challenges answer key for JEE Mathematics question -> Grievance Officer routes to Subject Matter Expert -> Error verified, +4 marks awarded, rank updated.\n" +
          "Scenario C (Unjust Suspension Clearance): Candidate flagged by automated proctoring due to internet drop -> Grievance Officer reviews raw ISP logs -> Account un-frozen within 24 hours."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Statutory Grievance Redressal Policy is legally binding under Indian IT Rules 2021 and Consumer Protection Rules 2020. Frivolous or abusive complaints may be dismissed after administrative review."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं वैधानिक अनुपालन जनादेश",
        content: "रैंकर्स लीग सूचना प्रौद्योगिकी नियम 2021 (Rule 3(2)) और उपभोक्ता संरक्षण (ई-कॉमर्स) नियम 2020 (Rule 5(3)) का पूर्ण अनुपालन करता है।",
        bulletPoints: [
          "उपभोक्ता अधिकारों का संरक्षण: उपभोक्ता संरक्षण अधिनियम 2019 के तहत 100% सुरक्षा।",
          "एकल-खिड़की शिकायत निवारण।"
        ]
      },
      {
        title: "2. वैधानिक शिकायत अधिकारी निर्देशिका (Grievance Officer)",
        content: "आईटी नियम 2021 के तहत नियुक्त शिकायत अधिकारी:\n" +
          "शिकायत अधिकारी: एडवोकेट राजेंद्र शर्मा (मुख्य अनुपालन अधिकारी)\n" +
          "ईमेल: grievance@rankersleague.com\n" +
          "पता: रैंकर्स लीग टेक्नोलॉजीज प्राइवेट लिमिटेड, लीगल सेल, टेक पार्क, नई दिल्ली - 110001, भारत।\n" +
          "फोन: +91-11-4098-7600 (सोम-शुक्र, सुबह 10 से शाम 6 बजे)।"
      },
      {
        title: "3. शिकायत दर्ज करने की औपचारिक प्रक्रिया (Filing Rules)",
        content: "शिकायत दर्ज करने के लिए Candidate ID, शिकायत का विवरण और साक्ष्य ईमेल पर भेजें: grievance@rankersleague.com।"
      },
      {
        title: "4. शिकायतों की 5 मुख्य श्रेणियां (Complaint Categories)",
        content: "1. परीक्षा खराबी एवं स्कोर विवाद | 2. वॉलेट एवं टीडीएस भुगतान | 3. खाता निलंबन | 4. डेटा गोपनीयता | 5. उत्पीड़न एवं अभद्र भाषा।"
      },
      {
        title: "5. अनिवार्य समय सीमा (Statutory Timelines SLA)",
        content: "पावती (Acknowledgement): 48 घंटे के भीतर टिकट ID प्राप्त होती है। | पूर्ण निवारण (Redressal): 15 दिनों के भीतर अंतिम लिखित निर्णय।"
      },
      {
        title: "6. जांच और साक्ष्य मूल्यांकन प्रक्रिया (Investigation)",
        content: "शिकायत अधिकारी सर्वर लॉग्स, बैंक एपीआई और प्रोक्टरिंग डेटा की 4-चरणीय फॉरेंसिक जांच करता है।"
      },
      {
        title: "7. 3-स्तरीय एस्केलेशन मैट्रिक्स (Escalation Matrix)",
        content: "स्तर 1: सपोर्ट हेल्पडेस्क -> स्तर 2: लीगल सेल -> स्तर 3: वैधानिक शिकायत अधिकारी (Grievance Officer)।"
      },
      {
        title: "8. उपभोक्ता संरक्षण अधिकार (Consumer Legal Rights)",
        content: "यदि छात्र आंतरिक निर्णय से संतुष्ट नहीं है, तो उसे उपभोक्ता अदालत (Consumer Forum) जाने का वैधानिक अधिकार है।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: विथड्रॉल में देरी की शिकायत मिलने पर शिकायत अधिकारी ने बैंक एपीआई जांच कर 12 घंटे में भुगतान पूरा कराया।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह शिकायत निवारण नीति भारतीय आईटी नियम 2021 के तहत 100% कानूनी रूप से बाध्यकारी है।"
      }
    ]
  },

  // ── 26. Official Platform Transparency, Auditability & User Trust Policy ──
  {
    slug: "transparency",
    title: "Official Platform Transparency, Auditability & User Trust Policy",
    titleHi: "आधिकारिक मंच पारदर्शिता, अंकेक्षण एवं उपयोगकर्ता विश्वास नीति (Transparency Policy)",
    iconName: "Eye",
    category: "Platform & Security",
    shortDescription: "Comprehensive rules on contest execution transparency, mathematical prize calculations, 70% threshold disclosures, result verification, refund logs, platform updates, and policy version history.",
    shortDescriptionHi: "प्रतियोगिता निष्पादन पारदर्शिता, गणितीय पुरस्कार गणना, 70% सीट सीमा नियम, परिणाम सत्यापन, रिफंड लॉग और नीति संस्करण इतिहास।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "9 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Master Transparency Policy overhaul detailing contest process openness, 70% dynamic prize formulas, 2-hr audit window result verification, refund logs, platform change logs, and policy versioning." },
      { version: "v2.0", date: "August 2026", summary: "Rules governing platform transparency, prize pool calculations, and user trust disclosures." }
    ],
    sections: [
      {
        title: "1. Overview & Core Principles of Platform Transparency",
        content: "Ranker's League Technologies Private Limited is built on an unshakeable foundation of absolute transparency, mathematical predictability, and user trust. We operate zero hidden rules, zero fine print tricks, and 100% auditable contest systems across all competitive arenas (JEE, NEET, CUET, SSC, Banking).",
        bulletPoints: [
          "Zero Hidden Fees: Every fee, margin percentage, and prize breakdown is displayed upfront before candidate registration.",
          "Mathematical Auditability: All prize pools and All India Ranks (AIR) follow open, verifiable mathematical formulas."
        ]
      },
      {
        title: "2. Contest Process & Execution Transparency",
        content: "Every contest arena hosted on Ranker's League displays full real-time operational parameters prior to registration:",
        bulletPoints: [
          "Open Seat Capacity: Total seat cap (e.g. 500 seats) and live real-time candidate registration counters.",
          "Registration Timestamps: Clear display of registration open, registration close, and live exam start timestamps.",
          "Exam Blueprint Disclosure: Subject breakdown, question counts, marking scheme (+4/-1), and duration published upfront."
        ]
      },
      {
        title: "3. Mathematical Prize Calculation & 70% Threshold Transparency",
        content: "Prize pools calculate dynamically based on verified seat participation according to strict mathematical rules:",
        bulletPoints: [
          "70% Minimum Seat Capacity Rule: If a contest receives between 70% and 100% seat entries, the contest runs smoothly. The prize pool scales proportionally to actual candidate registrations.",
          "Threshold Cancellation Refund: If seat participation falls below 70% at registration close, the contest cancels automatically. 100% of candidate entry fees are refunded to wallets within 15 minutes.",
          "Rank-Wise Prize Matrix: Exact percentage and rupee allocations for Rank 1, Top 10, Top 50, and Top 20% are displayed on contest cards."
        ]
      },
      {
        title: "4. Result Verification, Scorecard Audit & Leaderboard Finalization",
        content: "Ranker's League operates a 2-hour live post-contest audit window to verify all candidate standings before releasing prize money:",
        bulletPoints: [
          "Itemized Scorecards: Candidates receive detailed scorecards detailing raw score, correct/incorrect responses, and exact time taken per question (`mm:ss`).",
          "Public Leaderboards: Top rankers' scores and percentiles are published openly for community verification.",
          "Proctor Audit Transparency: Proctoring flags and webcam telemetry are cross-audited before locking final All India Ranks."
        ]
      },
      {
        title: "5. Refund Transparency & Real-Time Wallet Logs",
        content: "Every financial transaction, debit, credit, and refund generates a real-time immutable wallet transaction log accessible 24/7 in Profile > Transaction History. Refund processing SLAs (15 minutes for wallet; 3-5 days for bank) are tracked transparently."
      },
      {
        title: "6. Platform Feature Updates & Algorithm Change Disclosures",
        content: "We publish clear Release Notes and candidate announcements prior to launching new features, UI modifications, anti-cheat proctoring upgrades, or scoring algorithm adjustments."
      },
      {
        title: "7. Policy Updates, Version History & Change Log Transparency",
        content: "To guarantee legal transparency, every Legal Center policy maintains an immutable Version History log (`v1.0`, `v2.0`, `v3.0`) displaying last update dates and summary of changes. Candidates are notified 15 days in advance of major legal terms updates."
      },
      {
        title: "8. User Trust, Open Governance & Independent Audits",
        content: "Ranker's League subjects its platform architecture to independent third-party cybersecurity audits, financial TDS compliance verification, and open candidate feedback forums."
      },
      {
        title: "9. Real-World Practical Scenarios & Transparency Cases",
        content: "Scenario A (Dynamic Prize Pool Scaling): Arena receives 400 entries out of 500 seats (80% filled) -> System scales prize pool dynamically for 400 seats -> Payouts distributed transparently.\n" +
          "Scenario B (Threshold Cancellation Refund): Arena receives 300 entries out of 500 seats (60% filled, below 70%) -> System cancels contest 15 mins prior -> 100% entry fee refunded to all 300 wallets instantly.\n" +
          "Scenario C (Scorecard Audit Verification): Candidate inspects post-contest scorecard -> Reviews exact question-by-question breakdown, time spent, and response key -> Verifies AIR calculation."
      },
      {
        title: "10. Official Governance Legal Disclaimer",
        content: "This Transparency Policy ensures open, honorable governance. Ranker's League guarantees zero hidden clauses or arbitrary score manipulation."
      }
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं मंच पारदर्शिता के मुख्य सिद्धांत",
        content: "रैंकर्स लीग 100% पूर्ण पारदर्शिता, गणितीय शुद्धता और छात्र विश्वास की नींव पर निर्मित है। हमारे प्लेटफॉर्म पर कोई छिपे हुए नियम नहीं हैं।",
        bulletPoints: [
          "शून्य छिपे हुए शुल्क (Zero Hidden Fees): पंजीकरण से पहले हर फीस और पुरस्कार राशि स्पष्ट रूप से दिखाई जाती है।",
          "गणितीय अंकेक्षण: सभी पुरस्कार पूल और ऑल इंडिया रैंक खुली गणितीय प्रणालियों पर आधारित हैं।"
        ]
      },
      {
        title: "2. प्रतियोगिता प्रक्रिया एवं निष्पादन पारदर्शिता",
        content: "हर परीक्षा में सीट क्षमता (जैसे 500 सीट), लाइव पंजीकरण काउंटर और परीक्षा शुरू होने का समय पारदर्शी रूप से दिखाया जाता है।"
      },
      {
        title: "3. गणितीय पुरस्कार गणना एवं 70% सीट सीमा नियम (Dynamic Prize Pool)",
        content: "पुरस्कार पूल की गणना पारदर्शी गणितीय नियमों पर आधारित है:\n" +
          "1. 70% से 100% सीट भरने पर: परीक्षा सफलतापूर्वक आयोजित होती है और पुरस्कार पूल कुल पंजीकृत छात्रों के अनुसार गतिशील रूप से (Dynamically) तय होता है।\n" +
          "2. 70% से कम सीट भरने पर: परीक्षा अपने आप रद्द हो जाती है और सभी छात्रों की 100% फीस 15 मिनट के भीतर वॉलेट में रिफंड कर दी जाती है।"
      },
      {
        title: "4. परिणाम सत्यापन एवं 2-घंटे का अंकेक्षण समय (Result Verification)",
        content: "परीक्षा समाप्त होने के बाद 2 घंटे का लाइव फॉरेंसिक ऑडिट होता है जिसके बाद विस्तृत स्कोरकार्ड (अंक, समय, प्रतिशतता) जारी किए जाते हैं।"
      },
      {
        title: "5. रिफंड पारदर्शिता एवं वॉलेट लॉग्स (Refund Logs)",
        content: "प्रत्येक रिफंड और लेन-देन का विवरण रियल-टाइम वॉलेट लॉग्स में 24/7 उपलब्ध रहता है। रिफंड 15 मिनट में वॉलेट में जमा होता है।"
      },
      {
        title: "6. प्लेटफॉर्म अपडेट एवं नई सुविधा प्रकटीकरण (Platform Updates)",
        content: "किसी भी नई सुविधा, यूआई बदलाव या एंटी-चीट अपडेट से पहले सार्वजनिक रिलीज नोट्स जारी किए जाते हैं।"
      },
      {
        title: "7. नीति अद्यतन एवं संस्करण इतिहास (Version History)",
        content: "कानूनी केंद्र (Legal Center) के हर दस्तावेज़ पर संस्करण इतिहास (v1.0, v2.0, v3.0) और बदलावों का सारांश दिखाया जाता है।"
      },
      {
        title: "8. छात्र विश्वास एवं स्वतंत्र अनुपालन ऑडिट (User Trust)",
        content: "रैंकर्स लीग तीसरे पक्ष के सुरक्षा ऑडिट और वैधानिक टीडीएस रिपोर्टों का नियमित पालन करता है।"
      },
      {
        title: "9. व्यावहारिक उदाहरण",
        content: "उदाहरण: 60% सीट भरने पर प्रणाली परीक्षा रद्द करके 15 मिनट में 100% फीस रिफंड कर देती है।"
      },
      {
        title: "10. आधिकारिक शासकीय कानूनी अस्वीकरण",
        content: "यह पारदर्शिता नीति 100% कानूनी रूप से बाध्यकारी है।"
      }
    ]
  }
];







