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

export const legalDocuments: LegalDocument[] = [
  // ── 1. Contest Rules & Regulations ───────────────────────────────────────
  {
    slug: "contest-rules",
    title: "Contest Rules & Regulations",
    titleHi: "प्रतियोगिता नियम एवं विनियम",
    iconName: "FileText",
    category: "Contests & Gameplay",
    shortDescription: "Official governing rules, timing protocols, submission parameters, and scoring mechanics across all mock contests.",
    shortDescriptionHi: "सभी मॉक प्रतियोगिताओं के लिए आधिकारिक शासकीय नियम, समय प्रोटोकॉल, उत्तर जमा करने के मानदंड और अंकन प्रणाली।",
    lastUpdated: "August 2026",
    version: "v3.1",
    readTime: "6 min read",
    versionHistory: [
      { version: "v3.1", date: "August 2026", summary: "Added partial marking guidelines & live camera proctoring updates." },
      { version: "v3.0", date: "June 2026", summary: "Integrated Row-Level Security evaluation and instant rank audit." },
      { version: "v2.0", date: "January 2026", summary: "Initial multi-exam standardization release." }
    ],
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
    ],
    sectionsHi: [
      {
        title: "1. अवलोकन एवं मानक प्रतियोगिता वातावरण",
        content: "रैंकर्स लीग आधिकारिक राष्ट्रीय प्रवेश परीक्षाओं (जैसे जेईई, नीट, यूपीएससी, कैट और गेट) की तर्ज पर प्रोक्टर्ड मॉक परीक्षाएं आयोजित करता है। सभी पंजीकृत प्रतिभागियों को पूरी परीक्षा अवधि के दौरान इन नियमों का पालन करना अनिवार्य है।",
        bulletPoints: [
          "प्रत्येक प्रतियोगिता सभी समय क्षेत्रों में सटीक निर्धारित समय पर शुरू और समाप्त होती है।",
          "शून्य बाहरी सहायता सुनिश्चित करने के लिए प्रश्न सक्रिय प्रोक्टरिंग लॉकडाउन में दिखाए जाते हैं।",
          "समय सीमा समाप्त होने के बाद सबमिशन सिस्टम द्वारा स्वचालित रूप से संसाधित किए जाते हैं।"
        ]
      },
      {
        title: "2. अंकन एवं मूल्यांकन मानदंड",
        content: "अंक आधिकारिक परीक्षा पैटर्न के अनुसार गिने जाते हैं। सही उत्तरों पर धनात्मक अंक और गलत उत्तरों पर ऋणात्मक अंक दिए जाते हैं।",
        bulletPoints: [
          "जेईई और नीट: सही उत्तर पर +4, गलत उत्तर पर -1 अंक।",
          "यूपीएससी जीएस-1: सही उत्तर पर +2, गलत उत्तर पर -0.66 अंक।",
          "बिना प्रयास किए गए प्रश्नों पर शून्य दंड।"
        ]
      },
      {
        title: "3. अयोग्यता एवं तकनीकी उल्लंघन",
        content: "ब्राउज़र फोकस बदलने, स्क्रैपर चलाने, स्क्रिप्ट इंजेक्ट करने या एआई सहायता लेने का कोई भी प्रयास स्वचालित चेतावनी और बिना रिफंड के अयोग्यता का कारण बनेगा।"
      }
    ]
  },

  // ── 2. Fair Play Policy ───────────────────────────────────────────────────
  {
    slug: "fair-play",
    title: "Fair Play Policy",
    titleHi: "फेयर प्ले (निष्पक्ष खेल) नीति",
    iconName: "Scale",
    category: "Conduct & Ethics",
    shortDescription: "Our zero-tolerance framework guaranteeing equal opportunity, anti-collusion, and genuine rank verification for every student.",
    shortDescriptionHi: "प्रत्येक छात्र के लिए समान अवसर, सांठगांठ-रोधी और वास्तविक रैंक सत्यापन की गारंटी देने वाला हमारा शून्य-सहनशीलता ढांचा।",
    lastUpdated: "August 2026",
    version: "v2.8",
    readTime: "5 min read",
    versionHistory: [
      { version: "v2.8", date: "August 2026", summary: "Added IP sequence anomaly monitoring and multi-account auto-blocking." },
      { version: "v2.0", date: "March 2026", summary: "Updated anti-collusion timestamp correlation models." }
    ],
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
    ],
    sectionsHi: [
      {
        title: "1. पूर्ण मेधावी सिद्धांत के प्रति प्रतिबद्धता",
        content: "रैंकर्स लीग ईमानदार छात्रों को सशक्त बनाने के लिए काम करता है। हमारी फेयर प्ले नीति यह सुनिश्चित करती है कि अर्जित प्रत्येक ऑल इंडिया रैंक प्रमाणपत्र और पुरस्कार वास्तविक व्यक्तिगत योग्यता को दर्शाता है।",
        bulletPoints: [
          "एकल-खाता नियम: प्रत्येक प्रतिभागी को केवल एक सत्यापित खाते की अनुमति है।",
          "साझा उपकरण प्रतिबंधित: एक ही समय में कई उपकरणों से लॉगिन करना प्रतिबंधित है।",
          "स्वच्छ वातावरण: कोई द्वितीयक स्क्रीन या संचार ऐप की अनुमति नहीं है।"
        ]
      },
      {
        title: "2. सांठगांठ-रोधी प्रवर्तन",
        content: "हमारा सिस्टम उम्मीदवारों के उत्तर सबमिशन समय और पैटर्न का विश्लेषण करता है। समूह में उत्तर साझा करने पर शामिल सभी खातों को स्थायी रूप से प्रतिबंधित कर दिया जाएगा।"
      }
    ]
  },

  // ── 3. Prize Distribution Policy ─────────────────────────────────────────
  {
    slug: "prize-distribution",
    title: "Prize Distribution Policy",
    titleHi: "पुरस्कार वितरण नीति",
    iconName: "Trophy",
    category: "Finance & Taxes",
    shortDescription: "Transparent guidelines on how contest prize pools, rank rewards, credit cashbacks, and physical trophies are distributed.",
    shortDescriptionHi: "प्रतियोगिता पुरस्कार राशि, रैंक पुरस्कार, क्रेडिट कैशबैक और भौतिक ट्रॉफियों के वितरण संबंधी पारदर्शी दिशानिर्देश।",
    lastUpdated: "August 2026",
    version: "v3.0",
    readTime: "7 min read",
    versionHistory: [
      { version: "v3.0", date: "August 2026", summary: "Automated wallet credit distribution post 2-hour proctor verification audit." }
    ],
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
    ],
    sectionsHi: [
      {
        title: "1. पुरस्कार आवंटन संरचना",
        content: "पुरस्कार राशि की गणना हमारी लेखापरीक्षित वितरण तालिका द्वारा की जाती है। पंजीकरण से पहले प्रत्येक प्रतियोगिता पृष्ठ पर सटीक रैंक भुगतान तालिका प्रकाशित की जाती है।",
        bulletPoints: [
          "रैंक 1 टॉपर्स को नकद पुरस्कार के साथ भौतिक ट्रॉफियां/पदक मिलते हैं।",
          "शीर्ष 1%-10% उम्मीदवारों को वॉलेट में सीधे जमा होने वाले नकद पुरस्कार मिलते हैं।",
          "शीर्ष 20% उम्मीदवार भविष्य की प्रविष्टियों के लिए क्रेडिट कैशबैक कमाते हैं।"
        ]
      },
      {
        title: "2. ऑडिट एवं सत्यापन अवधि",
        content: "पुरस्कार जारी करने से पहले सभी प्रतियोगिता रैंकिंग 2 घंटे के स्वचालित और मैनुअल प्रोक्टर ऑडिट से गुजरती हैं।"
      }
    ]
  },

  // ── 4. Refund Policy ──────────────────────────────────────────────────────
  {
    slug: "refund",
    title: "Refund Policy",
    titleHi: "रिफंड (धन वापसी) नीति",
    iconName: "RotateCcw",
    category: "Finance & Taxes",
    shortDescription: "Clear terms on entry fee refunds, contest cancellations, technical disruptions, and wallet credit reversals.",
    shortDescriptionHi: "प्रवेश शुल्क रिफंड, प्रतियोगिता रद्दीकरण, तकनीकी बाधाओं और वॉलेट क्रेडिट रिवर्सल की स्पष्ट शर्तें।",
    lastUpdated: "August 2026",
    version: "v2.1",
    readTime: "4 min read",
    versionHistory: [
      { version: "v2.1", date: "August 2026", summary: "Instant wallet credit reversal on 60-min prior cancellation." }
    ],
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
    ],
    sectionsHi: [
      {
        title: "1. प्रतियोगिता रद्दीकरण एवं पुनर्निर्धारण",
        content: "यदि सर्वर में व्यवधान या प्रशासनिक कारणों से रैंकर्स लीग द्वारा प्रतियोगिता रद्द की जाती है, तो 100% प्रवेश शुल्क तुरंत वॉलेट में वापस जमा कर दिया जाएगा।",
        bulletPoints: [
          "रद्दीकरण के 15 मिनट के भीतर स्वचालित 100% क्रेडिट रिफंड।",
          "प्लेटफॉर्म रद्दीकरण के लिए कोई टिकट उठाने की आवश्यकता नहीं है।"
        ]
      },
      {
        title: "2. उम्मीदवार द्वारा पंजीकरण रद्द करना",
        content: "उम्मीदवार निर्धारित समय से 1 घंटे पहले तक अपना पंजीकरण रद्द कर सकते हैं और पूर्ण रिफंड प्राप्त कर सकते हैं।"
      }
    ]
  },

  // ── 5. Withdrawal Policy ──────────────────────────────────────────────────
  {
    slug: "withdrawal",
    title: "Withdrawal Policy",
    titleHi: "निकासी (विथड्रॉल) नीति",
    iconName: "Wallet",
    category: "Finance & Taxes",
    shortDescription: "Step-by-step rules, minimum thresholds, processing timelines, and banking security for withdrawing prize winnings.",
    shortDescriptionHi: "पुरस्कार राशि निकालने के लिए चरण-दर-चरण नियम, न्यूनतम सीमा, प्रसंस्करण समय और बैंकिंग सुरक्षा।",
    lastUpdated: "August 2026",
    version: "v2.5",
    readTime: "5 min read",
    versionHistory: [
      { version: "v2.5", date: "August 2026", summary: "Added instant UPI payout integration with automated TDS deduction." }
    ],
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
    ],
    sectionsHi: [
      {
        title: "1. निकासी पात्रता",
        content: "केवल आपके 'उपलब्ध शेष' में संग्रहीत पुरस्कार राशि ही बैंक/UPI में निकालने के योग्य है। प्रवेश शुल्क के लिए आरक्षित राशि निकाली नहीं जा सकती।",
        bulletPoints: [
          "न्यूनतम निकासी राशि: ₹100 INR।",
          "अधिकतम दैनिक तत्काल निकासी सीमा: ₹50,000 INR।",
          "समर्थित भुगतान तरीके: तत्काल UPI, IMPS, NEFT।"
        ]
      },
      {
        title: "2. केवाईसी एवं खाता सत्यापन",
        content: "₹10,000 से अधिक की निकासी के लिए पैन कार्ड सत्यापन अनिवार्य है।"
      }
    ]
  },

  // ── 6. Tax & TDS Policy ───────────────────────────────────────────────────
  {
    slug: "tax-tds",
    title: "Tax & TDS Policy",
    titleHi: "कर एवं टीडीएस (TDS) नीति",
    iconName: "Receipt",
    category: "Finance & Taxes",
    shortDescription: "Compliance with Section 194BA of the Indian Income Tax Act regarding 30% TDS deduction on net contest winnings.",
    shortDescriptionHi: "भारतीय आयकर अधिनियम की धारा 194BA के तहत शुद्ध जीत पर 30% टीडीएस कटौती का अनुपालन।",
    lastUpdated: "August 2026",
    version: "v2.2",
    readTime: "6 min read",
    versionHistory: [
      { version: "v2.2", date: "August 2026", summary: "Automated Form 16A quarterly generation update." }
    ],
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
    ],
    sectionsHi: [
      {
        title: "1. वैधानिक टीडीएस जनादेश (धारा 194BA)",
        content: "भारतीय आयकर कानूनों के अनुसार, शुद्ध जीत पर 30% की दर से टीडीएस काटा जाता है।",
        bulletPoints: [
          "टीडीएस केवल शुद्ध जीत (कुल जीत घटाकर कुल प्रवेश शुल्क) पर लागू होता है।",
          "आईटीआर दाखिल करने के लिए त्रैमासिक फॉर्म 16A जारी किया जाता है।"
        ]
      }
    ]
  },

  // ── 7. Contest Eligibility Policy ─────────────────────────────────────────
  {
    slug: "eligibility",
    title: "Contest Eligibility Policy",
    titleHi: "प्रतियोगिता पात्रता नीति",
    iconName: "UserCheck",
    category: "Contests & Gameplay",
    shortDescription: "Age criteria, academic qualifications, regional participation rules, and verification requirements for contestants.",
    shortDescriptionHi: "प्रतिभोगियों के लिए आयु मानदंड, शैक्षणिक योग्यता, क्षेत्रीय भागीदारी नियम और सत्यापन आवश्यकताएं।",
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
    ],
    sectionsHi: [
      {
        title: "1. सामान्य पात्रता मानदंड",
        content: "रैंकर्स लीग प्रतियोगिताएं दुनिया भर के छात्रों और अभ्यर्थियों के लिए खुली हैं।",
        bulletPoints: [
          "स्कूल और ओलंपियाड: कक्षा 6 से 12 के छात्रों के लिए।",
          "यूजी प्रवेश (जेईई/नीट/क्लैट): कक्षा 11, 12 और ड्रॉपर छात्रों के लिए।",
          "पीजी और सरकारी परीक्षाएं: स्नातकों और पेशेवरों के लिए।"
        ]
      }
    ]
  },

  // ── 8. Tie Breaking Policy ────────────────────────────────────────────────
  {
    slug: "tie-breaking",
    title: "Tie Breaking Policy",
    titleHi: "टाई ब्रेकिंग (बराबरी टाई निपटान) नीति",
    iconName: "GitCommit",
    category: "Contests & Gameplay",
    shortDescription: "Mathematical algorithm used to determine exact standings when two or more contestants achieve identical raw scores.",
    shortDescriptionHi: "समान अंक प्राप्त करने वाले उम्मीदवारों की सटीक रैंक निर्धारित करने के लिए उपयोग किया जाने वाला गणितीय नियम।",
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
    ],
    sectionsHi: [
      {
        title: "1. मानक टाई-ब्रेक क्रम",
        content: "जब दो या दो से अधिक उम्मीदवार समान अंक प्राप्त करते हैं, तो निम्नलिखित क्रम में टाई तोड़ा जाता है:",
        bulletPoints: [
          "1. उच्च सटीकता प्रतिशत: कम गलत उत्तर देने वाला उम्मीदवार ऊपर रहेगा।",
          "2. विषय प्राथमिकता अंक: मुख्य विषयों में अधिक अंक।",
          "3. समय दक्षता: कम समय में परीक्षा पूरी करने वाला उम्मीदवार ऊपर रहेगा।"
        ]
      }
    ]
  },

  // ── 9. Anti-Cheating Policy ───────────────────────────────────────────────
  {
    slug: "anti-cheating",
    title: "Anti-Cheating Policy",
    titleHi: "धोखाधड़ी-रोधी (एंटी-चीटिंग) नीति",
    iconName: "ShieldAlert",
    category: "Conduct & Ethics",
    shortDescription: "Browser lockdown technology, tab-switch monitors, AI behavior analytics, and penalties for illicit assistance.",
    shortDescriptionHi: "ब्राउज़र लॉकडाउन तकनीक, टैब-स्विच मॉनिटर, एआई व्यवहार विश्लेषण और अनुचित साधनों के लिए दंड।",
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
    ],
    sectionsHi: [
      {
        title: "1. प्रोक्टरिंग लॉकडाउन तकनीक",
        content: "रैंकर्स लीग अनुचित लाभ को रोकने के लिए लाइव प्रतियोगिता के दौरान सक्रिय ब्राउज़र लॉकडाउन लागू करता है।",
        bulletPoints: [
          "टैब-स्विच पहचान: 3 से अधिक बार विंडो बदलने पर परीक्षा तुरंत समाप्त हो जाएगी।",
          "कॉपी-पेस्ट ब्लॉक: क्लिपबोर्ड फ़ंक्शन पूरी तरह से अक्षम हैं।"
        ]
      }
    ]
  },

  // ── 10. Honor Code ────────────────────────────────────────────────────────
  {
    slug: "honor-code",
    title: "Honor Code",
    titleHi: "ऑनर्स कोड (आचार संहिता संकल्प)",
    iconName: "Award",
    category: "Conduct & Ethics",
    shortDescription: "The pledge taken by every candidate to maintain academic honesty, integrity, and sportsmanship in the arena.",
    shortDescriptionHi: "प्रत्येक अभ्यर्थी द्वारा परीक्षा में शैक्षणिक ईमानदारी और अखंडता बनाए रखने की ली गई शपथ।",
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
    ],
    sectionsHi: [
      {
        title: "1. रैंकर्स लीग शपथ",
        content: "रैंकर्स लीग पर पंजीकरण करके, प्रत्येक छात्र यह प्रतिज्ञा करता है: 'मैं परीक्षा के सभी प्रश्नों को पूरी तरह से अपने ज्ञान और प्रयास से हल करूँगा।'",
        bulletPoints: [
          "प्रत्येक परीक्षा में ईमानदारी बनाए रखें।",
          "राष्ट्रीय लीडरबोर्ड पर साथी प्रतियोगियों का सम्मान करें।"
        ]
      }
    ]
  },

  // ── 11. Community Guidelines ──────────────────────────────────────────────
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    titleHi: "सामुदायिक दिशानिर्देश",
    iconName: "Users",
    category: "Conduct & Ethics",
    shortDescription: "Standards for respectful communication across discussion forums, mentor chats, and community study rooms.",
    shortDescriptionHi: "चर्चा मंचों, मेंटर चैट और अध्ययन कक्षों में सम्मानजनक संचार के मानक।",
    lastUpdated: "August 2026",
    version: "v2.1",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Respectful & Inclusive Environment",
        content: "Ranker's League community spaces are dedicated to academic growth. Hate speech, harassment, spam, self-promotion, or abusive language in mentor chats or leaderboards will result in immediate chat ban."
      }
    ],
    sectionsHi: [
      {
        title: "1. सम्मानजनक वातावरण",
        content: "रैंकर्स लीग के सामुदायिक स्थान अकादमिक विकास के लिए समर्पित हैं। दुर्व्यवहार करने पर चैट से तुरंत प्रतिबंधित कर दिया जाएगा।"
      }
    ]
  },

  // ── 12. Code of Conduct ───────────────────────────────────────────────────
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    titleHi: "आचरण संहिता",
    iconName: "CheckSquare",
    category: "Conduct & Ethics",
    shortDescription: "Expected behavior standards for students, mentors, platform administrators, and community moderators.",
    shortDescriptionHi: "छात्रों, सलाहकारों, प्रशासकों और परीक्षकों के लिए अपेक्षित व्यवहार मानक।",
    lastUpdated: "August 2026",
    version: "v2.0",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Professional Standards",
        content: "Both staff and platform users must maintain the highest standards of professional conduct, ensuring safety, privacy, and equality for all participants across India and globally."
      }
    ],
    sectionsHi: [
      {
        title: "1. पेशेवर मानक",
        content: "कर्मचारियों और उपयोगकर्ताओं दोनों को पेशेवर आचरण के उच्चतम मानकों को बनाए रखना चाहिए।"
      }
    ]
  },

  // ── 13. Terms & Conditions ────────────────────────────────────────────────
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    titleHi: "नियम एवं शर्तें",
    iconName: "FileCheck",
    category: "Platform & Security",
    shortDescription: "The master legal agreement governing your access to and use of Ranker's League website, apps, and services.",
    shortDescriptionHi: "रैंकर्स लीग वेबसाइट, ऐप और सेवाओं के आपके उपयोग को नियंत्रित करने वाला मुख्य कानूनी समझौता।",
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
    ],
    sectionsHi: [
      {
        title: "1. शर्तों से सहमति",
        content: "खाता बनाकर या रैंकर्स लीग का उपयोग करके, आप इन नियमों और शर्तों से बाध्य होने के लिए सहमत होते हैं।",
        bulletPoints: [
          "खाते गैर-हस्तांतरणीय हैं।",
          "सभी परीक्षण प्रश्न और सामग्री रैंकर्स लीग की बौद्धिक संपदा हैं।"
        ]
      }
    ]
  },

  // ── 14. Privacy Policy ────────────────────────────────────────────────────
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    titleHi: "गोपनीयता नीति (प्राइवेसी पॉलिसी)",
    iconName: "Lock",
    category: "Platform & Security",
    shortDescription: "How we collect, protect, encrypt, and handle your personal data, exam scores, and payment credentials.",
    shortDescriptionHi: "हम आपके व्यक्तिगत डेटा, परीक्षा अंकों और भुगतान क्रेडेंशियल्स को कैसे एकत्र, सुरक्षित और एन्क्रिप्ट करते हैं।",
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
    ],
    sectionsHi: [
      {
        title: "1. डेटा संग्रह एवं उपयोग",
        content: "हम अपनी शैक्षणिक सेवाएं देने के लिए आवश्यक न्यूनतम व्यक्तिगत डेटा एकत्र करते हैं।",
        bulletPoints: [
          "हम छात्र डेटा को कभी भी तीसरे पक्ष के विज्ञापनदाताओं को नहीं बेचते हैं।",
          "बैंक विवरण सुरक्षित भुगतान गेटवे के माध्यम से संसाधित किए जाते हैं।"
        ]
      }
    ]
  },

  // ── 15. Cookie Policy ─────────────────────────────────────────────────────
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    titleHi: "कुकी नीति",
    iconName: "Cookie",
    category: "Platform & Security",
    shortDescription: "Information on essential cookies, performance tracking, and how to manage your web browser preferences.",
    shortDescriptionHi: "आवश्यक कुकीज़, प्रदर्शन ट्रैकिंग और अपनी वेब ब्राउज़र प्राथमिकताओं को प्रबंधित करने की जानकारी।",
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
    titleHi: "सुरक्षा नीति",
    iconName: "Shield",
    category: "Platform & Security",
    shortDescription: "Encryption standards, SSL/TLS protocols, row-level database security, and bug bounty vulnerability reporting.",
    shortDescriptionHi: "एन्क्रिप्शन मानक, एसएसएल/टीएलएस प्रोटोकॉल, रो-लेवल डेटाबेस सुरक्षा और भेद्यता रिपोर्टिंग।",
    lastUpdated: "August 2026",
    version: "v2.9",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Platform Infrastructure Security",
        content: "Our infrastructure runs on enterprise cloud servers protected by end-to-end AES-256 encryption, Web Application Firewalls (WAF), and automated DDoS mitigation."
      }
    ]
  },

  // ── 17. Responsible Competition Policy ────────────────────────────────────
  {
    slug: "responsible-competition",
    title: "Responsible Competition Policy",
    titleHi: "जिम्मेदार प्रतियोगिता नीति",
    iconName: "HeartHandshake",
    category: "Conduct & Ethics",
    shortDescription: "Promoting healthy study habits, time limits, student mental wellness, and anti-burnout guidelines.",
    shortDescriptionHi: "स्वस्थ अध्ययन आदतों, समय सीमाओं और छात्र मानसिक कल्याण को बढ़ावा देना।",
    lastUpdated: "August 2026",
    version: "v1.4",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Student Mental Health & Balance",
        content: "Competitive prep should build confidence, not anxiety. We encourage healthy study breaks, adequate sleep, and positive learning mindset."
      }
    ]
  },

  // ── 18. Account Suspension Policy ────────────────────────────────────────
  {
    slug: "account-suspension",
    title: "Account Suspension Policy",
    titleHi: "खाता निलंबन नीति",
    iconName: "UserX",
    category: "Platform & Security",
    shortDescription: "Conditions under which user accounts may be warned, temporarily locked, or permanently terminated.",
    shortDescriptionHi: "वे स्थितियां जिनके तहत उपयोगकर्ता खातों को चेतावनी दी जा सकती है या निलंबित किया जा सकता है।",
    lastUpdated: "August 2026",
    version: "v2.0",
    readTime: "4 min read",
    sections: [
      {
        title: "1. Grounds for Account Action",
        content: "Account locks occur only in cases of confirmed Fair Play violations, multiple account creation, fraudulent payment chargebacks, or severe harassment."
      }
    ]
  },

  // ── 19. Appeal Policy ─────────────────────────────────────────────────────
  {
    slug: "appeal",
    title: "Appeal Policy",
    titleHi: "अपील (पुनर्विचार) नीति",
    iconName: "HelpCircle",
    category: "Platform & Security",
    shortDescription: "Formal procedure for candidates to challenge disqualifications, score discrepancies, or account suspensions.",
    shortDescriptionHi: "अयोग्यता, अंक विसंगतियों या खाता निलंबन को चुनौती देने की औपचारिक प्रक्रिया।",
    lastUpdated: "August 2026",
    version: "v1.7",
    readTime: "5 min read",
    sections: [
      {
        title: "1. Filing an Appeal",
        content: "If you believe your contest result or account status was affected by technical error or unjust flagging, you may submit a formal appeal within 48 hours."
      }
    ]
  },

  // ── 20. Contact & Legal Support ───────────────────────────────────────────
  {
    slug: "contact-support",
    title: "Contact & Legal Support",
    titleHi: "संपर्क एवं कानूनी सहायता",
    iconName: "Mail",
    category: "Platform & Security",
    shortDescription: "Direct contact channels for legal notices, regulatory inquiries, copyright claims, and privacy officers.",
    shortDescriptionHi: "कानूनी नोटिस, नियामक पूछताछ, कॉपीराइट दावों और प्राइवेसी अधिकारियों के लिए सीधा संपर्क।",
    lastUpdated: "August 2026",
    version: "v1.0",
    readTime: "3 min read",
    sections: [
      {
        title: "1. Official Legal Contact Details",
        content: "For legal inquiries, statutory communications, compliance requests, or IP infringement notices, reach our dedicated legal team: legal@rankersleague.com"
      }
    ]
  }
];
