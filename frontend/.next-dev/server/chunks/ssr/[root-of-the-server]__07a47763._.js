module.exports = [
"[project]/frontend/.next-internal/server/app/contests/[slug]/register/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/frontend/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/frontend/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://bgsdovlumtjwvcwzjnnn.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_YSeECVTNhPL63VEU5GSi2Q_TZHs7md2");
const createClient = async ()=>{
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
};
}),
"[project]/frontend/content/contest-details.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eligibilityByContest",
    ()=>eligibilityByContest,
    "overviewOverview",
    ()=>overviewOverview,
    "structureByContest",
    ()=>structureByContest,
    "syllabusByContest",
    ()=>syllabusByContest
]);
const eligibilityByContest = {
    "upsc-elite": "Open to all candidates preparing for the UPSC Civil Services Examination. No age restriction, but recommended for serious aspirants who have completed basic graduation modules. The calibration matches actual Civil Services Prelims complexity parameters.",
    "jee-advanced": "Open to engineering aspirants preparing for JEE Advanced. Ideally suited for students in Grade 12 or drop years targeting Top 500 IIT ranks. Analytical complexity requires deep calculus and logical deduction capacity.",
    "neet-prime": "Open to medical aspirants preparing for NEET-UG. suited for Grade 12 or dropper candidates looking to verify their Speed-Accuracy coefficient across Biology, Chemistry, and Physics."
};
const structureByContest = {
    "upsc-elite": [
        "General Studies Paper I: 100 Objective Questions | 200 Marks | 2-hour duration.",
        "Negative marking applies: -0.66 marks for every wrong response.",
        "Questions span Current Affairs, Indian History, Geography, Polity, Economics, and Environmental Science.",
        "Proctored lockdown protocol requires active webcam connection throughout."
    ],
    "jee-advanced": [
        "Combined PC&M Paper: Physics, Chemistry, and Mathematics sections.",
        "Total Questions: 54 (18 questions per subject) | 180 Marks | 3-hour duration.",
        "Marking scheme features single correct options, multiple correct options (with partial marking), and numerical values.",
        "Sandboxed virtual calculator provided."
    ],
    "neet-prime": [
        "Single Paper: Physics (50 questions), Chemistry (50 questions), Botany (50 questions), and Zoology (50 questions).",
        "Total of 200 questions out of which 180 must be answered.",
        "Standard marking: +4 for correct option, -1 for incorrect option.",
        "Duration: 3 hours and 20 minutes."
    ]
};
const syllabusByContest = {
    "upsc-elite": [
        {
            subject: "Indian Polity & Governance",
            chapters: [
                {
                    name: "Constitutional Framework",
                    topics: [
                        "Fundamental Rights",
                        "Directive Principles",
                        "Amendments"
                    ],
                    weightage: 35,
                    difficulty: "Hard"
                },
                {
                    name: "System of Government",
                    topics: [
                        "Parliamentary System",
                        "Federal Structure",
                        "Centre-State Relations"
                    ],
                    weightage: 30,
                    difficulty: "Medium"
                },
                {
                    name: "Judiciary & Panchayati Raj",
                    topics: [
                        "Supreme Court",
                        "High Courts",
                        "73rd and 74th Amendments"
                    ],
                    weightage: 35,
                    difficulty: "Medium"
                }
            ],
            difficultyDistribution: {
                Easy: 20,
                Medium: 50,
                Hard: 30
            }
        },
        {
            subject: "Indian History & National Movement",
            chapters: [
                {
                    name: "Modern History",
                    topics: [
                        "1857 Revolt",
                        "Indian National Congress",
                        "Gandhian Era"
                    ],
                    weightage: 50,
                    difficulty: "Hard"
                },
                {
                    name: "Ancient & Medieval India",
                    topics: [
                        "Indus Valley",
                        "Mauryas & Guptas",
                        "Mughal Empire"
                    ],
                    weightage: 30,
                    difficulty: "Medium"
                },
                {
                    name: "Art & Culture",
                    topics: [
                        "Temple Architecture",
                        "Classical Dances",
                        "Literature"
                    ],
                    weightage: 20,
                    difficulty: "Hard"
                }
            ],
            difficultyDistribution: {
                Easy: 10,
                Medium: 40,
                Hard: 50
            }
        },
        {
            subject: "Geography & Ecology",
            chapters: [
                {
                    name: "Physical Geography",
                    topics: [
                        "Geomorphology",
                        "Climatology",
                        "Oceanography"
                    ],
                    weightage: 40,
                    difficulty: "Medium"
                },
                {
                    name: "Ecology & Climate Change",
                    topics: [
                        "Biodiversity",
                        "International Conventions",
                        "Pollution Control"
                    ],
                    weightage: 60,
                    difficulty: "Hard"
                }
            ],
            difficultyDistribution: {
                Easy: 30,
                Medium: 30,
                Hard: 40
            }
        }
    ],
    "jee-advanced": [
        {
            subject: "Physics",
            chapters: [
                {
                    name: "Mechanics",
                    topics: [
                        "Rotational Dynamics",
                        "Gravitation",
                        "Fluid Mechanics"
                    ],
                    weightage: 40,
                    difficulty: "Hard"
                },
                {
                    name: "Electromagnetism",
                    topics: [
                        "Electrostatics",
                        "Electromagnetic Induction",
                        "AC Circuits"
                    ],
                    weightage: 40,
                    difficulty: "Hard"
                },
                {
                    name: "Modern Physics",
                    topics: [
                        "Photoelectric Effect",
                        "Radioactivity",
                        "Bohr Model"
                    ],
                    weightage: 20,
                    difficulty: "Medium"
                }
            ],
            difficultyDistribution: {
                Easy: 10,
                Medium: 30,
                Hard: 60
            }
        },
        {
            subject: "Mathematics",
            chapters: [
                {
                    name: "Calculus",
                    topics: [
                        "Limits & Continuity",
                        "Definite Integration",
                        "Differential Equations"
                    ],
                    weightage: 45,
                    difficulty: "Hard"
                },
                {
                    name: "Algebra & Probability",
                    topics: [
                        "Matrices & Determinants",
                        "Probability Distributions",
                        "Complex Numbers"
                    ],
                    weightage: 35,
                    difficulty: "Hard"
                },
                {
                    name: "Coordinate Geometry",
                    topics: [
                        "Conic Sections",
                        "Straight Lines",
                        "Hyperbola"
                    ],
                    weightage: 20,
                    difficulty: "Medium"
                }
            ],
            difficultyDistribution: {
                Easy: 15,
                Medium: 25,
                Hard: 60
            }
        }
    ]
};
const overviewOverview = "This is a premium, proctored competition. Participants must abide by all integrity rules.";
}),
"[project]/frontend/content/contest-rules.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generalContestRules",
    ()=>generalContestRules,
    "rulesByContest",
    ()=>rulesByContest
]);
const generalContestRules = [
    {
        title: "System Parameters & Integrity",
        description: "Every participant must meet these standard system requirements to participate in active leagues.",
        points: [
            "Operating System must be Windows, macOS, or Linux (mobile and tablets are not supported for Elite/Apex leagues).",
            "Latest version of Google Chrome, Brave, or Safari is required.",
            "Active webcam and microphone access is mandatory for proctoring verification."
        ]
    },
    {
        title: "Active Lockdown Protocol",
        description: "The championship environment enforces a strict lockdown window to ensure absolute fairness.",
        points: [
            "Any tab switch, window minimization, or secondary screen activity will trigger a warning.",
            "Receiving more than 2 warning flags results in automatic disqualification with a status of 'Failed'.",
            "Keyboard shortcuts like Ctrl+C, Ctrl+V, Alt+Tab, and right-click menus are disabled."
        ]
    },
    {
        title: "Timings & Submission Rules",
        description: "Strict adherence to schedule parameters is expected from all participants.",
        points: [
            "Join the arena at least 15 minutes before the scheduled start time for verification setup.",
            "No late entries are permitted after the countdown timer hits 00:00:00.",
            "Automated submission is triggered exactly at the scheduled end time. Leftover questions will not be evaluated."
        ]
    }
];
const rulesByContest = {
    "upsc-elite": [
        {
            title: "UPSC Standard Rules",
            description: "Additional instructions calibrated to UPSC standards.",
            points: [
                "Negative marking is applied: 1/3rd (0.66 marks for Paper I) penalty per incorrect choice.",
                "Both Paper I (GS) and Paper II (CSAT) must be completed to qualify for the verified leaderboard standings.",
                "Minimum qualifying mark for CSAT is 33% (66.67 marks)."
            ]
        }
    ],
    "jee-advanced": [
        {
            title: "JEE Advanced Specific Rules",
            description: "Calibrated marking instructions for JEE Apex competitions.",
            points: [
                "Single-correct, Multiple-correct, and Numerical value questions are present in random distributions.",
                "Negative marking applies to single-correct questions (-1 mark).",
                "Partial marking (+1 or +2) is awarded for multiple-correct questions based on the correctness ratio."
            ]
        }
    ]
};
}),
"[project]/frontend/content/contest-rewards.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "globalRewardsTransparencyNote",
    ()=>globalRewardsTransparencyNote,
    "rewardsByContest",
    ()=>rewardsByContest
]);
const globalRewardsTransparencyNote = "All cash rewards, credit distributions, and certificate issuances are processed through verified standing calculations and audits. Any user flagged for integrity violations will have their rewards frozen pending a manual audit review.";
const rewardsByContest = {
    "upsc-elite": [
        {
            rank: "Rank 1",
            prize: "₹1,50,000 Cash Reward",
            recognition: "National Champion Gold Trophy",
            achievementBadge: "UPSC Supreme Master",
            pointsReward: 10000
        },
        {
            rank: "Rank 2 - 3",
            prize: "₹75,000 Cash Reward",
            recognition: "National Elite Silver Medal",
            achievementBadge: "UPSC Grandmaster",
            pointsReward: 5000
        },
        {
            rank: "Rank 4 - 10",
            prize: "₹25,000 Cash Reward",
            recognition: "National Distinguished Bronze Medal",
            achievementBadge: "UPSC Master",
            pointsReward: 2500
        },
        {
            rank: "Top 1% Percentile",
            prize: "₹5,000 Cash Reward",
            recognition: "Verified Standing Certificate of Excellence",
            achievementBadge: "1st Percentile Club",
            pointsReward: 1000
        },
        {
            rank: "Top 5% Percentile",
            prize: "₹1,000 Credits Package",
            recognition: "Verified Academic Standing Certificate",
            achievementBadge: "5th Percentile Club",
            pointsReward: 500
        }
    ],
    "jee-advanced": [
        {
            rank: "Rank 1",
            prize: "₹2,000,00 Cash Reward",
            recognition: "IIT JEE Apex Champion Trophy",
            achievementBadge: "Apex Scholar Gold",
            pointsReward: 15000
        },
        {
            rank: "Rank 2 - 5",
            prize: "₹1,00,000 Cash Reward",
            recognition: "Apex Scholar Silver Medal",
            achievementBadge: "Apex Scholar Silver",
            pointsReward: 7500
        },
        {
            rank: "Rank 6 - 20",
            prize: "₹30,000 Cash Reward",
            recognition: "Apex Scholar Bronze Medal",
            achievementBadge: "Apex Scholar Bronze",
            pointsReward: 3000
        },
        {
            rank: "Top 1% Percentile",
            prize: "₹5,000 Cash Reward",
            recognition: "Verified Apex Standing Certificate",
            achievementBadge: "Apex 1% Club",
            pointsReward: 1500
        }
    ],
    "neet-prime": [
        {
            rank: "Rank 1",
            prize: "₹1,50,000 Cash Reward",
            recognition: "NEET Prime Cup Gold Trophy",
            achievementBadge: "Med Supreme Gold",
            pointsReward: 12000
        },
        {
            rank: "Rank 2 - 3",
            prize: "₹75,000 Cash Reward",
            recognition: "Med Prime Silver Medal",
            achievementBadge: "Med Supreme Silver",
            pointsReward: 6000
        },
        {
            rank: "Rank 4 - 10",
            prize: "₹20,000 Cash Reward",
            recognition: "Med Prime Bronze Medal",
            achievementBadge: "Med Supreme Bronze",
            pointsReward: 2500
        }
    ]
};
}),
"[project]/frontend/content/contest-schedule.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "globalScheduleGuidelines",
    ()=>globalScheduleGuidelines,
    "scheduleByContest",
    ()=>scheduleByContest
]);
const globalScheduleGuidelines = "Leagues commence dynamically on the specified starting second. Make sure to log in 15 minutes early to finalize camera verification parameters and browser lockdown permissions.";
const scheduleByContest = {
    "upsc-elite": [
        {
            step: "Arena Check-In & Identity Verification",
            time: "09:15 AM",
            description: "Lockdown engine activates. Webcam, browser focus check, and identity verification modules are initialized.",
            status: "completed"
        },
        {
            step: "Paper I (General Studies) Release",
            time: "09:30 AM",
            description: "General Studies question bank unlocked. Timing countdown triggers. 100 high-fidelity UPSC Preliminary questions are loaded.",
            status: "active"
        },
        {
            step: "Mid-Term Review & Integrity Validation",
            time: "10:30 AM",
            description: "Webcam parameters validated. Standing snapshot verification checks completed.",
            status: "upcoming"
        },
        {
            step: "Paper I Completed & Automatic Upload",
            time: "11:30 AM",
            description: "Submission window closes. Answer scripts are archived, and RLS keys locked down.",
            status: "upcoming"
        }
    ],
    "jee-advanced": [
        {
            step: "Identity Verification & Setup Check",
            time: "01:45 PM",
            description: "Browser sandbox mode initializes. Keyboard shortcut inhibitors checked.",
            status: "completed"
        },
        {
            step: "IIT JEE Advanced Apex Arena Launch",
            time: "02:00 PM",
            description: "Official contest workspace unlocked. Numerical response variables and multi-correct choice sections active.",
            status: "active"
        },
        {
            step: "Automated Evaluation & Standing Process",
            time: "05:00 PM",
            description: "Testing concludes. Evaluators and standing generators compute marks and partial-marks allocations.",
            status: "upcoming"
        }
    ],
    "neet-prime": [
        {
            step: "Medical Prime Proctored Portal Access",
            time: "09:45 AM",
            description: "Biometric and identity checks. Zoom / proctor camera feed checked.",
            status: "completed"
        },
        {
            step: "Biology, Physics & Chemistry Cup Commences",
            time: "10:00 AM",
            description: "200 medical objective questions unlocked. Answer panels initialized.",
            status: "active"
        },
        {
            step: "Championship Window Closed",
            time: "01:20 PM",
            description: "All candidate scripts stored. RLS security locked.",
            status: "upcoming"
        }
    ]
};
}),
"[project]/frontend/content/contest-faq.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contestSpecificFAQs",
    ()=>contestSpecificFAQs,
    "globalFAQContent",
    ()=>globalFAQContent
]);
const globalFAQContent = [
    {
        question: "What is a Championship on Ranker's League?",
        answer: "A Championship is a scheduled, high-fidelity competitive arena replicating the exact rules, syllabus boundaries, and difficulty thresholds of national competitive examinations. Participants compete simultaneously under active proctoring lockdown protocols to establish verified percentiles.",
        category: "General"
    },
    {
        question: "How is Row-Level Security (RLS) and data privacy maintained?",
        answer: "Every query from our frontend and API server layers goes through strict security parameter verification against Supabase. RLS policies are enabled by default across all standing tables, ensuring user data can only be modified by authentic verified sessions while public records remain transparently auditable.",
        category: "Security"
    },
    {
        question: "What are the rules regarding lockdown mode?",
        answer: "To ensure absolute academic integrity and trust, our competition interface enforces full browser lockdown. Switching tabs, opening dev tools, or losing screen focus for more than 3 seconds triggers an automatic verification flag, and repeated violations lead to immediate disqualified standing status.",
        category: "Integrity"
    },
    {
        question: "How are the rewards distributed?",
        answer: "Rewards are automatically calculated and processed via our backend standing adapter within 24 hours of contest completion. Top ranks receive direct prize pools, gold/silver certificates, and verified standing credentials visible on their public profiles.",
        category: "Rewards"
    }
];
const contestSpecificFAQs = {
    "upsc-elite": [
        {
            question: "Is there negative marking in the Civil Services Elite League?",
            answer: "Yes, exactly like the actual UPSC CSE Prelims. A penalty of 1/3rd of the marks assigned to that question is deducted for every incorrect response.",
            category: "Syllabus & Rules"
        },
        {
            question: "Are calculator modules permitted?",
            answer: "Calculators are strictly prohibited. External aids of any kind will result in instant disqualification.",
            category: "Guidelines"
        }
    ],
    "jee-advanced": [
        {
            question: "How does partial marking work in the IIT JEE Advanced Apex Championship?",
            answer: "We support precise partial marking rules for multi-correct choice questions. If a question has options A, B, and C correct, selecting only A and B awards partial positive marks, provided no incorrect options are marked.",
            category: "Syllabus & Rules"
        },
        {
            question: "Is there a virtual calculator provided?",
            answer: "Yes, a standardized virtual calculator matching the IIT JEE Advanced interface will be available inside the lock-in exam terminal.",
            category: "Guidelines"
        }
    ]
};
}),
"[project]/frontend/content/contests.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contestsContent",
    ()=>contestsContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contest-details.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contest-rules.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rewards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contest-rewards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$schedule$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contest-schedule.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contest-faq.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const contestsContent = [
    {
        id: "upsc-elite",
        slug: "upsc-elite",
        title: "Civil Services Elite League",
        exam: "UPSC CSE Prelims",
        category: "Civil Services",
        entryFee: 499,
        prizePool: 500000,
        participants: 38492,
        maxParticipants: 50000,
        difficulty: "Elite",
        date: "July 12, 2026",
        time: "09:30 AM",
        duration: "2h 00m",
        seatsAvailable: 11508,
        status: "upcoming",
        bannerGradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
        language: "English",
        country: "India",
        isFeatured: true,
        isTrending: true,
        registrationDeadline: "July 11, 2026 11:59 PM",
        overview: "A high-fidelity replication of the UPSC Civil Services Preliminary examination. This championship features paper sets calibrated to replicate actual UPSC complexity parameters to help candidates verify their national standing percentile.",
        eligibility: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eligibilityByContest"]["upsc-elite"],
        structure: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["structureByContest"]["upsc-elite"],
        syllabus: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syllabusByContest"]["upsc-elite"],
        rewards: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rewards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rewardsByContest"]["upsc-elite"],
        rules: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generalContestRules"][1].points,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rulesByContest"]["upsc-elite"][0].points
        ],
        timeline: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$schedule$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scheduleByContest"]["upsc-elite"],
        faq: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["globalFAQContent"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contestSpecificFAQs"]["upsc-elite"]
        ]
    },
    {
        id: "jee-advanced",
        slug: "jee-advanced",
        title: "IIT JEE Advanced Apex Championship",
        exam: "JEE Advanced",
        category: "Engineering",
        entryFee: 349,
        prizePool: 750000,
        participants: 52100,
        maxParticipants: 80000,
        difficulty: "Apex",
        date: "July 15, 2026",
        time: "02:00 PM",
        duration: "3h 00m",
        seatsAvailable: 27900,
        status: "upcoming",
        bannerGradient: "from-violet-500/20 via-purple-500/10 to-transparent",
        language: "English & Hindi",
        country: "India",
        isFeatured: true,
        isTrending: true,
        registrationDeadline: "July 14, 2026 11:59 PM",
        overview: "Engineering entrance championship built to evaluate analytical capacity under strict time frames. Questions are drafted by experienced IIT educators to simulate authentic JEE Advanced constraints.",
        eligibility: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eligibilityByContest"]["jee-advanced"],
        structure: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["structureByContest"]["jee-advanced"],
        syllabus: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syllabusByContest"]["jee-advanced"],
        rewards: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rewards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rewardsByContest"]["jee-advanced"],
        rules: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generalContestRules"][1].points,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rulesByContest"]["jee-advanced"][0].points
        ],
        timeline: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$schedule$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scheduleByContest"]["jee-advanced"],
        faq: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["globalFAQContent"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contestSpecificFAQs"]["jee-advanced"]
        ]
    },
    {
        id: "neet-prime",
        slug: "neet-prime",
        title: "NEET Medical Prime Cup",
        exam: "NEET UG",
        category: "Medical Sciences",
        entryFee: 299,
        prizePool: 600000,
        participants: 45900,
        maxParticipants: 60000,
        difficulty: "Prime",
        date: "July 18, 2026",
        time: "10:00 AM",
        duration: "3h 20m",
        seatsAvailable: 14100,
        status: "upcoming",
        bannerGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
        language: "English",
        country: "India",
        isFeatured: true,
        isTrending: false,
        registrationDeadline: "July 17, 2026 11:59 PM",
        overview: "Medical sciences entrance replica evaluating speed, recall depth, and precision parameters across Biology, Chemistry, and Physics subjects.",
        eligibility: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eligibilityByContest"]["neet-prime"],
        structure: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$details$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["structureByContest"]["neet-prime"],
        syllabus: [],
        rewards: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rewards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rewardsByContest"]["neet-prime"],
        rules: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generalContestRules"][1].points
        ],
        timeline: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$schedule$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scheduleByContest"]["neet-prime"],
        faq: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["globalFAQContent"]
    },
    {
        id: "finance-league",
        slug: "finance-league",
        title: "Quantitative Finance League Arena",
        exam: "Financial Risk Manager (FRM)",
        category: "Finance & Accounting",
        entryFee: 0,
        prizePool: 250000,
        participants: 8400,
        maxParticipants: 10000,
        difficulty: "Challenger",
        date: "July 20, 2026",
        time: "04:00 PM",
        duration: "1h 30m",
        seatsAvailable: 1600,
        status: "upcoming",
        bannerGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
        language: "English",
        country: "International",
        isFeatured: false,
        isTrending: true,
        registrationDeadline: "July 19, 2026 11:59 PM",
        overview: "A specialized risk assessment league evaluating portfolio management, options pricing, and actuarial probability theory under high pressure.",
        eligibility: "Finance students, MBA graduates, and CFA/FRM candidates.",
        structure: [
            "50 Quantitative Multiple Choice Questions.",
            "No negative marking.",
            "Proctored zoom feed not required, sandbox lockdown active."
        ],
        syllabus: [],
        rewards: [
            {
                rank: "Rank 1",
                prize: "₹50,000 Credits Package",
                recognition: "Gold Portfolio manager badge"
            },
            {
                rank: "Top 5%",
                prize: "₹5,000 Credits Package",
                recognition: "Verified Risk specialist standing"
            }
        ],
        rules: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generalContestRules"][1].points
        ],
        timeline: [
            {
                step: "Lockdown validation",
                time: "03:45 PM",
                description: "Verification check",
                status: "completed"
            },
            {
                step: "Quantitative Finance release",
                time: "04:00 PM",
                description: "Exam commencing",
                status: "active"
            }
        ],
        faq: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["globalFAQContent"]
    },
    {
        id: "law-jurisprudence",
        slug: "law-jurisprudence",
        title: "Constitutional Law Jurisprudence Challenge",
        exam: "CLAT PG",
        category: "Law",
        entryFee: 199,
        prizePool: 300000,
        participants: 4100,
        maxParticipants: 5000,
        difficulty: "Prime",
        date: "July 05, 2026",
        time: "11:00 AM",
        duration: "2h 00m",
        seatsAvailable: 0,
        status: "completed",
        bannerGradient: "from-blue-500/20 via-sky-500/10 to-transparent",
        language: "English",
        country: "India",
        isFeatured: false,
        isTrending: false,
        registrationDeadline: "July 04, 2026 11:59 PM",
        overview: "Comprehensive law league focusing on constitutional jurisprudence, legal reasoning, case analysis, and judicial interpretations.",
        eligibility: "LLB / LLM students or candidates preparing for CLAT PG.",
        structure: [
            "120 questions split into objective law queries.",
            "Negative marking of 0.25 penalty per wrong option."
        ],
        syllabus: [],
        rewards: [
            {
                rank: "Rank 1",
                prize: "₹50,000 Cash Reward",
                recognition: "Supreme Advocate Gold Certificate"
            }
        ],
        rules: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$rules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generalContestRules"][1].points
        ],
        timeline: [
            {
                step: "Championship Completed",
                time: "01:00 PM",
                description: "Evaluated successfully and standings posted.",
                status: "completed"
            }
        ],
        faq: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contest$2d$faq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["globalFAQContent"]
    }
];
}),
"[project]/frontend/utils/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://bgsdovlumtjwvcwzjnnn.supabase.co");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const createAdminClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}),
"[project]/frontend/services/auth/walletService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "walletService",
    ()=>walletService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/admin.ts [app-rsc] (ecmascript)");
;
;
const walletService = {
    // Get wallet balance summary
    async getWalletBalances (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("wallet_balances").select("*").eq("wallet_id", userId).single();
        if (error || !data) {
            // Return default fallbacks
            return {
                wallet_id: userId,
                available_balance: 0.00,
                pending_rewards: 0.00,
                processing_rewards: 0.00,
                contest_entry_balance: 0.00,
                lifetime_earnings: 0.00,
                lifetime_withdrawals: 0.00,
                updated_at: new Date().toISOString()
            };
        }
        return {
            wallet_id: data.wallet_id,
            available_balance: Number(data.available_balance),
            pending_rewards: Number(data.pending_rewards),
            processing_rewards: Number(data.processing_rewards),
            contest_entry_balance: Number(data.contest_entry_balance),
            lifetime_earnings: Number(data.lifetime_earnings),
            lifetime_withdrawals: Number(data.lifetime_withdrawals),
            updated_at: data.updated_at
        };
    },
    // Get filtered transaction history
    async getTransactions (userId, filters = {}) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        let query = supabase.from("wallet_transactions").select("*").eq("wallet_id", userId);
        if (filters.type && filters.type !== "all") {
            query = query.eq("type_id", filters.type);
        }
        if (filters.status && filters.status !== "all") {
            query = query.eq("status_id", filters.status);
        }
        if (filters.startDate) {
            query = query.gte("created_at", filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte("created_at", filters.endDate);
        }
        const { data, error } = await query.order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        let transactions = data;
        // Frontend search filter
        if (filters.search) {
            const term = filters.search.toLowerCase();
            transactions = transactions.filter((t)=>t.reference_number.toLowerCase().includes(term) || t.contest_name && t.contest_name.toLowerCase().includes(term) || t.description && t.description.toLowerCase().includes(term));
        }
        return transactions;
    },
    // Get specific transaction detail
    async getTransactionDetail (userId, transactionId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("wallet_transactions").select("*").eq("wallet_id", userId).eq("id", transactionId).single();
        if (error || !data) return null;
        return data;
    },
    // Manage bank accounts
    async getBankAccounts (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("bank_accounts").select("*").eq("user_id", userId).order("is_primary", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    async addBankAccount (userId, account) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Check if it's the first account, make it primary
        const existing = await this.getBankAccounts(userId);
        const isPrimary = existing.length === 0;
        const { data, error } = await supabase.from("bank_accounts").insert({
            user_id: userId,
            account_holder: account.account_holder,
            account_number: account.account_number,
            ifsc: account.ifsc,
            bank_name: account.bank_name,
            branch: account.branch,
            is_primary: isPrimary || account.is_primary,
            is_verified: true
        }).select().single();
        if (error) return {
            data: null,
            error: error.message
        };
        // If marked primary, update others
        if (account.is_primary && existing.length > 0) {
            await supabase.from("bank_accounts").update({
                is_primary: false
            }).eq("user_id", userId).neq("id", data.id);
        }
        return {
            data: data,
            error: null
        };
    },
    async deleteBankAccount (userId, accountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("bank_accounts").delete().eq("user_id", userId).eq("id", accountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    async setPrimaryBankAccount (userId, accountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Set all to false first
        await supabase.from("bank_accounts").update({
            is_primary: false
        }).eq("user_id", userId);
        // Set targeted to true
        const { error } = await supabase.from("bank_accounts").update({
            is_primary: true
        }).eq("user_id", userId).eq("id", accountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    // Manage UPI accounts
    async getUpiAccounts (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("upi_accounts").select("*").eq("user_id", userId).order("is_primary", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    async addUpiAccount (userId, upiId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const existing = await this.getUpiAccounts(userId);
        const isPrimary = existing.length === 0;
        const { data, error } = await supabase.from("upi_accounts").insert({
            user_id: userId,
            upi_id: upiId,
            is_primary: isPrimary,
            is_verified: true
        }).select().single();
        if (error) return {
            data: null,
            error: error.message
        };
        return {
            data: data,
            error: null
        };
    },
    async deleteUpiAccount (userId, upiAccountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("upi_accounts").delete().eq("user_id", userId).eq("id", upiAccountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    async setPrimaryUpiAccount (userId, upiAccountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        await supabase.from("upi_accounts").update({
            is_primary: false
        }).eq("user_id", userId);
        const { error } = await supabase.from("upi_accounts").update({
            is_primary: true
        }).eq("user_id", userId).eq("id", upiAccountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    // Withdrawal Request Flow
    async requestWithdrawal (userId, amount, method, accountId) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // 1. Double submission protection: Check for any processing withdrawal transaction in last 30 seconds
        const thirtySecAgo = new Date(Date.now() - 30000).toISOString();
        const { data: recentTx, error: txCheckError } = await supabase.from("wallet_transactions").select("id").eq("wallet_id", userId).eq("type_id", "withdrawal").eq("status_id", "processing").gte("created_at", thirtySecAgo);
        if (txCheckError) return {
            success: false,
            error: "System check failed. Please try again."
        };
        if (recentTx && recentTx.length > 0) {
            return {
                success: false,
                error: "A withdrawal request is already processing. Please wait a moment."
            };
        }
        // 2. Fetch current wallet balance to double check available limits
        const balances = await this.getWalletBalances(userId);
        if (amount < 100) return {
            success: false,
            error: "Minimum withdrawal limit is ₹100.00."
        };
        if (amount > 50000) return {
            success: false,
            error: "Maximum withdrawal limit per transaction is ₹50,000.00."
        };
        if (amount > balances.available_balance) {
            return {
                success: false,
                error: "Insufficient funds in Available Balance."
            };
        }
        // 3. Initiate the payout transaction
        const referenceNumber = "TXN-WDL-" + Math.floor(10000000 + Math.random() * 90000000);
        const description = `Withdrawal payout via ${method === "upi" ? "UPI" : "Bank Transfer"}`;
        const { data: tx, error: txError } = await supabase.from("wallet_transactions").insert({
            wallet_id: userId,
            type_id: "withdrawal",
            status_id: "processing",
            amount: -amount,
            reference_number: referenceNumber,
            description
        }).select().single();
        if (txError || !tx) {
            return {
                success: false,
                error: txError?.message || "Failed to create withdrawal transaction."
            };
        }
        // 4. Create matching withdrawal request record
        const { error: wdlError } = await supabase.from("withdrawal_requests").insert({
            wallet_id: userId,
            amount,
            method_id: method,
            status_id: "processing",
            bank_account_id: method === "bank_account" ? accountId : null,
            upi_account_id: method === "upi" ? accountId : null,
            reference_number: referenceNumber,
            estimated_processing_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        if (wdlError) {
            // Revert transaction state to failed to restore user's balance
            await supabase.from("wallet_transactions").update({
                status_id: "failed"
            }).eq("id", tx.id);
            return {
                success: false,
                error: wdlError.message
            };
        }
        return {
            success: true,
            error: null
        };
    },
    // Payout history list
    async getPayoutHistory (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("withdrawal_requests").select("*").eq("wallet_id", userId).order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    // Insights / Metrics calculations
    async getFinancialInsights (userId) {
        const transactions = await this.getTransactions(userId, {
            status: "completed"
        });
        let totalPrizeEarned = 0;
        let totalEntryFeesPaid = 0;
        let totalRefunds = 0;
        let largestPrize = 0;
        let prizeCount = 0;
        const monthlyMap = {};
        transactions.forEach((tx)=>{
            const amt = Math.abs(tx.amount);
            const date = new Date(tx.created_at);
            const monthKey = date.toLocaleString("default", {
                month: "short",
                year: "numeric"
            });
            if (tx.type_id === "prize_credit") {
                totalPrizeEarned += amt;
                prizeCount++;
                if (amt > largestPrize) largestPrize = amt;
                // Map monthly earnings
                monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + amt;
            } else if (tx.type_id === "contest_entry") {
                totalEntryFeesPaid += amt;
            } else if (tx.type_id === "contest_refund") {
                totalRefunds += amt;
            }
        });
        const averagePrize = prizeCount > 0 ? totalPrizeEarned / prizeCount : 0;
        // Convert monthly data map to array
        const monthlyEarnings = Object.entries(monthlyMap).map(([month, amount])=>({
                month,
                amount
            }));
        return {
            totalPrizeEarned,
            totalEntryFeesPaid,
            totalRefunds,
            averagePrize,
            largestPrize,
            monthlyEarnings
        };
    }
};
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/frontend/services/auth/contestRegistrationService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contestRegistrationService",
    ()=>contestRegistrationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/walletService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
const contestRegistrationService = {
    // Get active registration for user and contest
    async getRegistration (userId, contestId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("contest_registrations").select("*").eq("user_id", userId).eq("contest_id", contestId).maybeSingle();
        if (error || !data) return null;
        return data;
    },
    // Check seat counts
    async getSeatsDetails (contestId, maxSeats) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { count, error } = await supabase.from("contest_registrations").select("*", {
            count: "exact",
            head: true
        }).eq("contest_id", contestId).in("status", [
            "registered",
            "confirmed",
            "completed"
        ]);
        const registeredCount = error || count === null ? 0 : count;
        const seatsAvailable = Math.max(0, maxSeats - registeredCount);
        let status = "open";
        if (seatsAvailable === 0) {
            status = "sold_out";
        } else if (seatsAvailable < 20) {
            status = "closing_soon";
        }
        return {
            registeredCount,
            seatsAvailable,
            status
        };
    },
    // Complete checkout & process payment deduction
    async checkoutAndRegister (userId, contestId, contestName, entryFee, language) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // 1. Check duplicate registration
        const existing = await this.getRegistration(userId, contestId);
        if (existing) {
            return {
                success: false,
                error: "You are already registered for this contest."
            };
        }
        // 2. Wallet checks (only if entry fee > 0)
        let transactionId = null;
        if (entryFee > 0) {
            const balanceObj = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["walletService"].getWalletBalances(userId);
            if (!balanceObj || balanceObj.available_balance < entryFee) {
                return {
                    success: false,
                    error: "Insufficient wallet balance. Please add funds to your wallet."
                };
            }
            // Create a unique reference
            const refNo = `TXN-REG-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(4).toString("hex").toUpperCase()}`;
            // Insert transaction into wallet_transactions to trigger deduction
            const { data: txn, error: txnErr } = await supabase.from("wallet_transactions").insert({
                wallet_id: userId,
                type_id: "contest_entry",
                status_id: "completed",
                amount: -entryFee,
                reference_number: refNo,
                contest_name: contestName,
                description: `Registration fee for ${contestName}`
            }).select("id").single();
            if (txnErr || !txn) {
                return {
                    success: false,
                    error: "Payment transaction processing failed. Try again."
                };
            }
            transactionId = txn.id;
        }
        // 3. Create registration row
        const regNo = `RL-REG-${contestId.replace("-live", "").toUpperCase()}-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(3).toString("hex").toUpperCase()}`;
        const { data: reg, error: regErr } = await supabase.from("contest_registrations").insert({
            user_id: userId,
            contest_id: contestId,
            registration_number: regNo,
            selected_language: language,
            status: "confirmed",
            payment_status: entryFee > 0 ? "paid" : "waived",
            entry_fee_paid: entryFee
        }).select("id").single();
        if (regErr || !reg) {
            // Rollback payment transaction if possible (manual correction since no pg tx block here, or log critical)
            console.error("Critical: Payment succeeded but registration table row insert failed!", regErr);
            return {
                success: false,
                error: "Registration record creation failed. Contact support with transaction ID."
            };
        }
        // 4. Create participant record (seat number and mock reporting time)
        const seatNo = `SEAT-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(2).toString("hex").toUpperCase()}`;
        const reportingTime = new Date();
        reportingTime.setDate(reportingTime.getDate() + 3); // Mock date: 3 days in future
        await supabase.from("contest_participants").insert({
            registration_id: reg.id,
            seat_number: seatNo,
            reporting_time: reportingTime.toISOString(),
            verification_status: "pending"
        });
        // 5. Create payment receipt entry
        await supabase.from("contest_payments").insert({
            registration_id: reg.id,
            wallet_transaction_id: transactionId,
            amount: entryFee,
            payment_method: entryFee > 0 ? "wallet" : "free_tier",
            payment_status: "completed"
        });
        // 6. Log audit trail
        await supabase.from("contest_audit_logs").insert({
            user_id: userId,
            action: "CONTEST_REGISTERED",
            details: {
                contestId,
                registrationNumber: regNo,
                amount: entryFee
            }
        });
        return {
            success: true,
            registrationId: reg.id,
            registrationNumber: regNo
        };
    },
    // Generate Digital Admit Card info
    async getAdmitCard (userId, contestId, contestDetails) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // 1. Fetch user registration
        const { data: reg, error: regErr } = await supabase.from("contest_registrations").select("id, registration_number, selected_language, status").eq("user_id", userId).eq("contest_id", contestId).maybeSingle();
        if (regErr || !reg) return null;
        // 2. Fetch associated participant credentials
        const { data: part } = await supabase.from("contest_participants").select("seat_number, reporting_time, verification_status").eq("registration_id", reg.id).maybeSingle();
        // 3. Fetch profile
        const { data: profile } = await supabase.from("profiles").select("full_name, username, phone_number").eq("id", userId).single();
        // Clean dates formatting
        const rawRepTime = part?.reporting_time ? new Date(part.reporting_time) : new Date();
        const cleanRepStr = rawRepTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        }) + ", " + rawRepTime.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
        // Mask phone number
        const rawPhone = profile?.phone_number || "9876543210";
        const maskedPhone = rawPhone.substring(0, 3) + "•••••" + rawPhone.substring(rawPhone.length - 2);
        return {
            participantName: profile?.full_name || "Aspirant Candidate",
            username: profile?.username || "aspirant",
            maskedMobile: maskedPhone,
            contestName: contestDetails.title,
            contestCategory: contestDetails.category,
            contestDate: contestDetails.date,
            reportingTime: cleanRepStr,
            contestStartTime: contestDetails.time,
            contestDuration: contestDetails.duration,
            selectedLanguage: reg.selected_language,
            registrationNumber: reg.registration_number,
            registrationStatus: reg.status,
            seatNumber: part?.seat_number || "SEAT-102",
            verificationStatus: part?.verification_status || "pending",
            reportingTimestamp: part?.reporting_time || new Date().toISOString(),
            startTimestamp: new Date().toISOString() // will handle countdowns
        };
    },
    // Verification device service (generating hashed verification code)
    async generateVerificationCode (userId, contestId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric
        const hashed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(code).digest("hex");
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expires in 10 minutes
        // Write to database
        await supabase.from("contest_verification_codes").insert({
            user_id: userId,
            contest_id: contestId,
            code_hash: hashed,
            expires_at: expiresAt.toISOString()
        });
        return code; // Return plain-text code so caller can simulate SMS/WhatsApp delivery (log output)
    },
    // Validate verification code
    async verifyDeviceCode (userId, contestId, plainCode, fingerprint, deviceName) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const hashed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(plainCode).digest("hex");
        const { data: record, error } = await supabase.from("contest_verification_codes").select("*").eq("user_id", userId).eq("contest_id", contestId).eq("code_hash", hashed).eq("is_used", false).gt("expires_at", new Date().toISOString()).maybeSingle();
        if (error || !record) return false;
        // Mark code as used
        await supabase.from("contest_verification_codes").update({
            is_used: true
        }).eq("id", record.id);
        // Save device to trusted devices catalog
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + 30); // Valid for 30 days
        await supabase.from("trusted_devices").insert({
            user_id: userId,
            device_fingerprint: fingerprint,
            device_name: deviceName,
            expires_at: expDate.toISOString()
        });
        return true;
    },
    // Check if device is trusted
    async isDeviceTrusted (userId, fingerprint) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("trusted_devices").select("id").eq("user_id", userId).eq("device_fingerprint", fingerprint).gt("expires_at", new Date().toISOString()).maybeSingle();
        return !error && !!data;
    },
    // Get user registration history
    async getRegistrationHistory (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("contest_registrations").select(`
        id,
        contest_id,
        registration_number,
        selected_language,
        status,
        payment_status,
        created_at
      `).eq("user_id", userId).order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    }
};
}),
"[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx <module evaluation>", "default");
}),
"[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx", "default");
}),
"[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$contests$2f5b$slug$5d2f$register$2f$RegisterFormClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$contests$2f5b$slug$5d2f$register$2f$RegisterFormClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$contests$2f5b$slug$5d2f$register$2f$RegisterFormClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/app/contests/[slug]/register/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContestRegisterPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contests$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contests.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$contestRegistrationService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/contestRegistrationService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$contests$2f5b$slug$5d2f$register$2f$RegisterFormClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/contests/[slug]/register/RegisterFormClient.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function ContestRegisterPage({ params }) {
    const { slug } = await params;
    const contest = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contests$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contestsContent"].find((c)=>c.slug === slug);
    if (!contest) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/auth/login?redirect=/contests/${slug}/register`);
    }
    // 1. Check if user is already registered
    // Note: in DB we have contest_id as 'upsc-elite-live' etc. so let's match appropriately
    const dbContestId = contest.id === "upsc-elite" ? "upsc-elite-live" : contest.id === "jee-advanced" ? "jee-advanced-live" : `${contest.id}-live`;
    const existingReg = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$contestRegistrationService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contestRegistrationService"].getRegistration(user.id, dbContestId);
    if (existingReg) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/contests/${slug}/admit-card`);
    }
    // 2. Fetch seats details
    const seatsDetails = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$contestRegistrationService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contestRegistrationService"].getSeatsDetails(dbContestId, contest.maxParticipants);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$contests$2f5b$slug$5d2f$register$2f$RegisterFormClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            contest: contest,
            seatsDetails: seatsDetails
        }, void 0, false, {
            fileName: "[project]/frontend/app/contests/[slug]/register/page.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/contests/[slug]/register/page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
const dynamic = "force-dynamic";
}),
"[project]/frontend/app/contests/[slug]/register/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/contests/[slug]/register/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07a47763._.js.map