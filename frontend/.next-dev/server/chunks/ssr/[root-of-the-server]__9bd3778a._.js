module.exports = [
"[project]/frontend/.next-internal/server/app/contests/[slug]/confirmation/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/frontend/components/header.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/header.tsx <module evaluation>", "Header");
}),
"[project]/frontend/components/header.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/header.tsx", "Header");
}),
"[project]/frontend/components/header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/components/header.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/components/header.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/components/footer.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Footer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Footer() from the server but Footer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/footer.tsx <module evaluation>", "Footer");
}),
"[project]/frontend/components/footer.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Footer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Footer() from the server but Footer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/footer.tsx", "Footer");
}),
"[project]/frontend/components/footer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/components/footer.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/components/footer.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/components/ui/button.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Button = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Button() from the server but Button is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/ui/button.tsx <module evaluation>", "Button");
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call buttonVariants() from the server but buttonVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/ui/button.tsx <module evaluation>", "buttonVariants");
}),
"[project]/frontend/components/ui/button.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Button = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Button() from the server but Button is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/ui/button.tsx", "Button");
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call buttonVariants() from the server but buttonVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/ui/button.tsx", "buttonVariants");
}),
"[project]/frontend/components/ui/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/components/ui/button.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/components/ui/button.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/app/contests/[slug]/confirmation/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContestConfirmationPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-rsc] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.mjs [app-rsc] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-rsc] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contests$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/content/contests.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/footer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/ui/button.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
async function ContestConfirmationPage({ params, searchParams }) {
    const { slug } = await params;
    const { regNo } = await searchParams;
    const contest = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$content$2f$contests$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contestsContent"].find((c)=>c.slug === slug);
    if (!contest) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/auth/login?redirect=/contests/${slug}/confirmation`);
    }
    // Fetch profile name
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    const formatCurrency = (val)=>{
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen bg-background text-foreground",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-grow max-w-2xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full bg-card/25 border border-primary/20 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl shadow-primary/5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-primary/2 pointer-events-none"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-9 h-9"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[9px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 15
                                        }, this),
                                        "Reservation Secured"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-black text-foreground",
                                    children: "Registration Successful"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed",
                                    children: "Your seat reservation index has been compiled on proctor databases. Review details below."
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-b border-border/20 py-4 text-xs leading-relaxed space-y-2.5 max-w-md mx-auto text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Championship"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-foreground truncate max-w-[200px]",
                                            children: contest.title
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Registration Number"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono font-bold text-primary",
                                            children: regNo || "RL-REG-XXXXXX"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Participant"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-foreground",
                                            children: profile?.full_name || "Aspirant"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Scheduled Date"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 86,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-foreground",
                                            children: contest.date
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Scheduled Time"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-foreground",
                                            children: contest.time
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Entry Fee Paid"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-foreground",
                                            children: contest.entryFee > 0 ? formatCurrency(contest.entryFee) : "Free (Waived)"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center max-w-md mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/contests/${slug}/admit-card`,
                                    className: "w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "w-full py-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                                lineNumber: 103,
                                                columnNumber: 17
                                            }, this),
                                            " Download Admit Card"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/my-contests",
                                    className: "w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        className: "w-full py-6 font-bold text-xs border-border/60 hover:bg-muted/40 gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                className: "w-4 h-4 text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                                lineNumber: 108,
                                                columnNumber: 17
                                            }, this),
                                            " View Registered Contests"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/contests/[slug]/confirmation/page.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
const dynamic = "force-dynamic";
}),
"[project]/frontend/app/contests/[slug]/confirmation/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/contests/[slug]/confirmation/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9bd3778a._.js.map