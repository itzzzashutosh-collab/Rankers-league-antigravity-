export type ExamRegion = "India" | "International" | "Both";

export interface Exam {
  id: string;
  name: string;
  shortName?: string;
  category: ExamCategory;
  region: ExamRegion;
  conductingBody?: string;
  educationLevel?: string;
  difficulty?: "Foundation" | "Intermediate" | "Advanced" | "Expert";
  description: string;
  slug: string;
}

export type ExamCategory =
  | "Engineering"
  | "Medical"
  | "Management"
  | "Law"
  | "Design"
  | "Commerce"
  | "Government"
  | "Defence"
  | "Olympiads"
  | "School"
  | "English"
  | "Programming"
  | "Finance"
  | "Graduate"
  | "Hiring";

export interface CategoryMeta {
  id: ExamCategory;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  count?: number;
}

export const categoryMeta: CategoryMeta[] = [
  { id: "Engineering",  label: "Engineering",          emoji: "⚙️",  color: "blue",   bg: "bg-blue-500/10",    border: "border-blue-500/30",    text: "text-blue-500" },
  { id: "Medical",      label: "Medical",              emoji: "🩺",  color: "emerald", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-500" },
  { id: "Management",   label: "Management",           emoji: "📊",  color: "amber",  bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-500" },
  { id: "Law",          label: "Law",                  emoji: "⚖️",  color: "red",    bg: "bg-red-500/10",     border: "border-red-500/30",     text: "text-red-500" },
  { id: "Design",       label: "Design",               emoji: "🎨",  color: "pink",   bg: "bg-pink-500/10",    border: "border-pink-500/30",    text: "text-pink-500" },
  { id: "Commerce",     label: "Commerce",             emoji: "💹",  color: "violet", bg: "bg-violet-500/10",  border: "border-violet-500/30",  text: "text-violet-500" },
  { id: "Government",   label: "Government",           emoji: "🏛️",  color: "slate",  bg: "bg-slate-500/10",   border: "border-slate-500/30",   text: "text-slate-400" },
  { id: "Defence",      label: "Defence",              emoji: "🎖️",  color: "indigo", bg: "bg-indigo-500/10",  border: "border-indigo-500/30",  text: "text-indigo-500" },
  { id: "Olympiads",    label: "Olympiads",            emoji: "🏅",  color: "yellow", bg: "bg-yellow-500/10",  border: "border-yellow-500/30",  text: "text-yellow-500" },
  { id: "School",       label: "School",               emoji: "🏫",  color: "teal",   bg: "bg-teal-500/10",    border: "border-teal-500/30",    text: "text-teal-500" },
  { id: "English",      label: "English Proficiency",  emoji: "🔤",  color: "rose",   bg: "bg-rose-500/10",    border: "border-rose-500/30",    text: "text-rose-500" },
  { id: "Programming",  label: "Programming & CS",     emoji: "💻",  color: "cyan",   bg: "bg-cyan-500/10",    border: "border-cyan-500/30",    text: "text-cyan-500" },
  { id: "Finance",      label: "Finance",              emoji: "💰",  color: "green",  bg: "bg-green-500/10",   border: "border-green-500/30",   text: "text-green-500" },
  { id: "Graduate",     label: "Graduate Admissions",  emoji: "🎓",  color: "orange", bg: "bg-orange-500/10",  border: "border-orange-500/30",  text: "text-orange-500" },
  { id: "Hiring",       label: "Hiring Assessments",   emoji: "🏢",  color: "sky",    bg: "bg-sky-500/10",     border: "border-sky-500/30",     text: "text-sky-500" },
];

export const exams: Exam[] = [
  // ── Engineering ──────────────────────────────────────────────────────────────
  { id: "jee-main",       name: "JEE Main",                        category: "Engineering", region: "India",         conductingBody: "NTA",           difficulty: "Advanced",      description: "National level engineering entrance for NITs, IIITs & GFTIs.", slug: "jee-main" },
  { id: "jee-advanced",   name: "JEE Advanced",                    category: "Engineering", region: "India",         conductingBody: "IITs",          difficulty: "Expert",        description: "Gateway to 23 IITs — one of the toughest undergraduate exams.", slug: "jee-advanced" },
  { id: "bitsat",         name: "BITSAT",                          category: "Engineering", region: "India",         conductingBody: "BITS Pilani",   difficulty: "Advanced",      description: "BITS Pilani admission test for engineering programs.", slug: "bitsat" },
  { id: "viteee",         name: "VITEEE",                          category: "Engineering", region: "India",         conductingBody: "VIT",           difficulty: "Intermediate",  description: "VIT Engineering Entrance Exam for all VIT campuses.", slug: "viteee" },
  { id: "srmjeee",        name: "SRMJEEE",                         category: "Engineering", region: "India",         conductingBody: "SRM University", difficulty: "Intermediate", description: "SRM Joint Engineering Entrance Examination.", slug: "srmjeee" },
  { id: "comedk",         name: "COMEDK UGET",                     category: "Engineering", region: "India",         conductingBody: "COMEDK",        difficulty: "Intermediate",  description: "Karnataka engineering entrance for private colleges.", slug: "comedk-uget" },
  { id: "wbjee",          name: "WBJEE",                           category: "Engineering", region: "India",         conductingBody: "WBJEEB",        difficulty: "Intermediate",  description: "West Bengal Joint Entrance Examination for engineering.", slug: "wbjee" },
  { id: "mht-cet",        name: "MHT CET",                         category: "Engineering", region: "India",         conductingBody: "Maharashtra",   difficulty: "Intermediate",  description: "Maharashtra Common Entrance Test for engineering.", slug: "mht-cet" },
  { id: "kcet",           name: "KCET",                            category: "Engineering", region: "India",         conductingBody: "KEA",           difficulty: "Intermediate",  description: "Karnataka CET for engineering & medical admissions.", slug: "kcet" },
  { id: "ap-eamcet",      name: "AP EAMCET",                       category: "Engineering", region: "India",         conductingBody: "JNTU",          difficulty: "Intermediate",  description: "Andhra Pradesh engineering & medical entrance exam.", slug: "ap-eamcet" },
  { id: "ts-eamcet",      name: "TS EAMCET",                       category: "Engineering", region: "India",         conductingBody: "JNTU",          difficulty: "Intermediate",  description: "Telangana State engineering & medical entrance.", slug: "ts-eamcet" },
  { id: "keam",           name: "KEAM",                            category: "Engineering", region: "India",         conductingBody: "CEE Kerala",    difficulty: "Intermediate",  description: "Kerala Engineering Architecture Medical entrance.", slug: "keam" },
  { id: "gujcet",         name: "GUJCET",                          category: "Engineering", region: "India",         conductingBody: "GSEB",          difficulty: "Intermediate",  description: "Gujarat Common Entrance Test for engineering.", slug: "gujcet" },
  { id: "bcece",          name: "BCECE",                           category: "Engineering", region: "India",         conductingBody: "BCECEB",        difficulty: "Intermediate",  description: "Bihar CET for engineering, agriculture & pharmacy.", slug: "bcece" },
  { id: "ojee",           name: "OJEE",                            category: "Engineering", region: "India",         conductingBody: "OJEE Board",    difficulty: "Intermediate",  description: "Odisha Joint Entrance Examination for engineering.", slug: "ojee" },
  { id: "cusat",          name: "CUSAT CAT",                       category: "Engineering", region: "India",         conductingBody: "CUSAT",         difficulty: "Intermediate",  description: "Cochin University of Science & Technology entrance.", slug: "cusat-cat" },
  { id: "iat-iiser",      name: "IAT (IISER Aptitude Test)",        category: "Engineering", region: "India",         conductingBody: "IISERs",        difficulty: "Advanced",      description: "Admission test for Indian Institutes of Science Education.", slug: "iat-iiser" },
  { id: "nest",           name: "NEST",                            category: "Engineering", region: "India",         conductingBody: "NISER/CEBS",    difficulty: "Advanced",      description: "National Entrance Screening Test for NISER Bhubaneswar.", slug: "nest" },
  { id: "sat",            name: "SAT",                             category: "Engineering", region: "Both",          conductingBody: "College Board", difficulty: "Intermediate",  description: "Standardized test for US & global university admissions.", slug: "sat" },
  { id: "act",            name: "ACT",                             category: "Engineering", region: "Both",          conductingBody: "ACT Inc.",      difficulty: "Intermediate",  description: "College readiness assessment accepted worldwide.", slug: "act" },
  { id: "gaokao",         name: "Gaokao",                          category: "Engineering", region: "International", conductingBody: "China MOE",     difficulty: "Expert",        description: "China's national college entrance exam.", slug: "gaokao" },
  { id: "a-level-eng",    name: "A-Level Engineering Entrance",    category: "Engineering", region: "International", conductingBody: "Cambridge",     difficulty: "Advanced",      description: "A-Level based engineering university entry.", slug: "a-level-engineering" },

  // ── Medical ────────────────────────────────────────────────────────────────
  { id: "neet-ug",        name: "NEET UG",                         category: "Medical", region: "India",         conductingBody: "NTA",           difficulty: "Expert",        description: "Single national entrance for MBBS/BDS/AYUSH admissions.", slug: "neet-ug" },
  { id: "neet-pg",        name: "NEET PG",                         category: "Medical", region: "India",         conductingBody: "NBE",           difficulty: "Expert",        description: "Postgraduate medical entrance for MD/MS programs.", slug: "neet-pg" },
  { id: "ini-cet",        name: "INI CET",                         category: "Medical", region: "India",         conductingBody: "AIIMS",         difficulty: "Expert",        description: "All India Institute of Medical Sciences PG entrance.", slug: "ini-cet" },
  { id: "aiims-nursing",  name: "AIIMS Nursing",                   category: "Medical", region: "India",         conductingBody: "AIIMS",         difficulty: "Intermediate",  description: "AIIMS BSc Nursing entrance examination.", slug: "aiims-nursing" },
  { id: "jipmer-nursing", name: "JIPMER Nursing",                  category: "Medical", region: "India",         conductingBody: "JIPMER",        difficulty: "Intermediate",  description: "JIPMER Puducherry BSc Nursing entrance.", slug: "jipmer-nursing" },
  { id: "fmge",           name: "FMGE",                            category: "Medical", region: "India",         conductingBody: "NBE",           difficulty: "Advanced",      description: "Foreign Medical Graduates Examination for India license.", slug: "fmge" },
  { id: "usmle",          name: "USMLE",                           category: "Medical", region: "International", conductingBody: "NBME/FSMB",     difficulty: "Expert",        description: "US Medical Licensing Examination (Steps 1, 2, 3).", slug: "usmle" },
  { id: "plab",           name: "PLAB",                            category: "Medical", region: "International", conductingBody: "GMC UK",        difficulty: "Advanced",      description: "UK Medical Licensing for international doctors.", slug: "plab" },
  { id: "mcat",           name: "MCAT",                            category: "Medical", region: "International", conductingBody: "AAMC",          difficulty: "Expert",        description: "Medical College Admission Test for US/Canada med schools.", slug: "mcat" },
  { id: "ucat",           name: "UCAT",                            category: "Medical", region: "International", conductingBody: "UCAT Consortium", difficulty: "Advanced",    description: "University Clinical Aptitude Test for UK/Australia med.", slug: "ucat" },
  { id: "bmat",           name: "BMAT",                            category: "Medical", region: "International", conductingBody: "Cambridge Assess.", difficulty: "Expert",     description: "BioMedical Admissions Test for Oxford/Cambridge/Imperial.", slug: "bmat" },

  // ── Management ─────────────────────────────────────────────────────────────
  { id: "cat",            name: "CAT",                             category: "Management", region: "India", conductingBody: "IIMs",          difficulty: "Expert",       description: "Common Admission Test for IIMs and top B-schools.", slug: "cat" },
  { id: "xat",            name: "XAT",                             category: "Management", region: "India", conductingBody: "XLRI",          difficulty: "Advanced",     description: "Xavier Aptitude Test for XLRI and 800+ B-schools.", slug: "xat" },
  { id: "snap",           name: "SNAP",                            category: "Management", region: "India", conductingBody: "Symbiosis",     difficulty: "Intermediate", description: "Symbiosis National Aptitude Test for MBA admissions.", slug: "snap" },
  { id: "nmat",           name: "NMAT",                            category: "Management", region: "India", conductingBody: "GMAC",          difficulty: "Intermediate", description: "NMAT by GMAC for NMIMS and partner B-schools.", slug: "nmat" },
  { id: "mat",            name: "MAT",                             category: "Management", region: "India", conductingBody: "AIMA",          difficulty: "Intermediate", description: "Management Aptitude Test — conducted 4 times yearly.", slug: "mat" },
  { id: "cmat",           name: "CMAT",                            category: "Management", region: "India", conductingBody: "NTA",           difficulty: "Intermediate", description: "Common Management Admission Test for AICTE colleges.", slug: "cmat" },
  { id: "iift",           name: "IIFT",                            category: "Management", region: "India", conductingBody: "NTA/IIFT",      difficulty: "Advanced",     description: "IIFT entrance for International Business MBA.", slug: "iift" },
  { id: "tissnet",        name: "TISSNET",                         category: "Management", region: "India", conductingBody: "TISS",          difficulty: "Advanced",     description: "TISS National Entrance Test for social science programs.", slug: "tissnet" },
  { id: "gmat",           name: "GMAT",                            category: "Management", region: "Both",  conductingBody: "GMAC",          difficulty: "Advanced",     description: "Global MBA admissions test — accepted in 100+ countries.", slug: "gmat" },
  { id: "gre",            name: "GRE",                             category: "Management", region: "Both",  conductingBody: "ETS",           difficulty: "Advanced",     description: "Graduate Record Exam for global graduate admissions.", slug: "gre" },

  // ── Law ────────────────────────────────────────────────────────────────────
  { id: "clat",           name: "CLAT",                            category: "Law", region: "India",         conductingBody: "Consortium of NLUs", difficulty: "Advanced", description: "Common Law Admission Test for 22 National Law Universities.", slug: "clat" },
  { id: "ailet",          name: "AILET",                           category: "Law", region: "India",         conductingBody: "NLU Delhi",     difficulty: "Expert",       description: "National Law University Delhi's independent entrance.", slug: "ailet" },
  { id: "lsat-india",     name: "LSAT India",                      category: "Law", region: "India",         conductingBody: "LSAC",          difficulty: "Intermediate", description: "Law School Admission Test adapted for Indian law schools.", slug: "lsat-india" },
  { id: "mh-cet-law",     name: "MH CET Law",                     category: "Law", region: "India",         conductingBody: "Maharashtra",   difficulty: "Intermediate", description: "Maharashtra law entrance for 3-year & 5-year LLB.", slug: "mh-cet-law" },
  { id: "lnat",           name: "LNAT",                            category: "Law", region: "International", conductingBody: "LNAT Consortium", difficulty: "Advanced",   description: "Law National Aptitude Test for UK law schools.", slug: "lnat" },
  { id: "lsat",           name: "LSAT",                            category: "Law", region: "International", conductingBody: "LSAC",          difficulty: "Expert",       description: "Law School Admission Test for US/Canada law schools.", slug: "lsat" },

  // ── Design ─────────────────────────────────────────────────────────────────
  { id: "nid-dat",        name: "NID DAT",                         category: "Design", region: "India", conductingBody: "NID",           difficulty: "Advanced",     description: "National Institute of Design aptitude test.", slug: "nid-dat" },
  { id: "uceed",          name: "UCEED",                           category: "Design", region: "India", conductingBody: "IIT Bombay",    difficulty: "Advanced",     description: "Undergraduate Common Entrance Exam for Design at IITs.", slug: "uceed" },
  { id: "ceed",           name: "CEED",                            category: "Design", region: "India", conductingBody: "IIT Bombay",    difficulty: "Advanced",     description: "Common Entrance Exam for Design — M.Des admissions.", slug: "ceed" },
  { id: "nift",           name: "NIFT Entrance",                   category: "Design", region: "India", conductingBody: "NIFT",          difficulty: "Intermediate", description: "National Institute of Fashion Technology entrance.", slug: "nift-entrance" },
  { id: "pearl",          name: "Pearl Academy",                   category: "Design", region: "India", conductingBody: "Pearl Academy", difficulty: "Intermediate", description: "Pearl Academy design, fashion & media entrance.", slug: "pearl-academy" },
  { id: "sat-art",        name: "SAT Art Portfolio",               category: "Design", region: "Both",  conductingBody: "College Board", difficulty: "Intermediate", description: "SAT subject portfolio for arts & design university entry.", slug: "sat-art-portfolio" },

  // ── Commerce ───────────────────────────────────────────────────────────────
  { id: "ca-foundation",  name: "CA Foundation",                   category: "Commerce", region: "India", conductingBody: "ICAI", difficulty: "Foundation",   description: "Entry-level CA exam — first stage of Chartered Accountancy.", slug: "ca-foundation" },
  { id: "ca-inter",       name: "CA Intermediate",                 category: "Commerce", region: "India", conductingBody: "ICAI", difficulty: "Intermediate", description: "Second stage of CA — Group I and Group II papers.", slug: "ca-intermediate" },
  { id: "ca-final",       name: "CA Final",                        category: "Commerce", region: "India", conductingBody: "ICAI", difficulty: "Expert",       description: "Final stage of Chartered Accountancy qualification.", slug: "ca-final" },
  { id: "cma-foundation", name: "CMA Foundation",                  category: "Commerce", region: "India", conductingBody: "ICMAI", difficulty: "Foundation",  description: "Cost & Management Accounting foundation level.", slug: "cma-foundation" },
  { id: "cma-inter",      name: "CMA Intermediate",                category: "Commerce", region: "India", conductingBody: "ICMAI", difficulty: "Intermediate", description: "CMA Intermediate — 8 subjects across 2 groups.", slug: "cma-intermediate" },
  { id: "cma-final",      name: "CMA Final",                       category: "Commerce", region: "India", conductingBody: "ICMAI", difficulty: "Expert",       description: "Final stage of Cost & Management Accountancy.", slug: "cma-final" },
  { id: "cseet",          name: "CS Executive Entrance Test",       category: "Commerce", region: "India", conductingBody: "ICSI",  difficulty: "Foundation",   description: "Entry-level exam for Company Secretary program.", slug: "cseet" },
  { id: "cs-executive",   name: "CS Executive",                    category: "Commerce", region: "India", conductingBody: "ICSI",  difficulty: "Intermediate", description: "Second stage of the Company Secretary program.", slug: "cs-executive" },
  { id: "cs-professional", name: "CS Professional",                category: "Commerce", region: "India", conductingBody: "ICSI",  difficulty: "Expert",       description: "Final stage of Company Secretary qualification.", slug: "cs-professional" },
  { id: "acca",           name: "ACCA",                            category: "Commerce", region: "Both",  conductingBody: "ACCA",  difficulty: "Advanced",     description: "Global finance & accounting qualification — 13 papers.", slug: "acca" },
  { id: "cpa-usa",        name: "CPA (USA)",                       category: "Commerce", region: "International", conductingBody: "AICPA", difficulty: "Expert", description: "US Certified Public Accountant — 4 sections.", slug: "cpa-usa" },
  { id: "cfa-1",          name: "CFA Level I",                     category: "Commerce", region: "Both",  conductingBody: "CFA Institute", difficulty: "Advanced", description: "Chartered Financial Analyst Level I — investment tools.", slug: "cfa-level-1" },
  { id: "cfa-2",          name: "CFA Level II",                    category: "Commerce", region: "Both",  conductingBody: "CFA Institute", difficulty: "Expert", description: "CFA Level II — asset valuation & analysis.", slug: "cfa-level-2" },
  { id: "cfa-3",          name: "CFA Level III",                   category: "Commerce", region: "Both",  conductingBody: "CFA Institute", difficulty: "Expert", description: "CFA Level III — portfolio management & wealth planning.", slug: "cfa-level-3" },

  // ── Government ─────────────────────────────────────────────────────────────
  { id: "upsc-cse",       name: "UPSC CSE",                        category: "Government", region: "India", conductingBody: "UPSC",  difficulty: "Expert",       description: "Civil Services Exam — IAS, IPS, IFS and 24 other services.", slug: "upsc-cse" },
  { id: "upsc-cds",       name: "UPSC CDS",                        category: "Government", region: "India", conductingBody: "UPSC",  difficulty: "Advanced",     description: "Combined Defence Services — Army, Navy, Air Force entry.", slug: "upsc-cds" },
  { id: "upsc-nda",       name: "UPSC NDA",                        category: "Government", region: "India", conductingBody: "UPSC",  difficulty: "Intermediate", description: "National Defence Academy entrance for 10+2 students.", slug: "upsc-nda" },
  { id: "upsc-capf",      name: "UPSC CAPF",                       category: "Government", region: "India", conductingBody: "UPSC",  difficulty: "Advanced",     description: "Central Armed Police Forces — CRPF, BSF, CISF etc.", slug: "upsc-capf" },
  { id: "ssc-cgl",        name: "SSC CGL",                         category: "Government", region: "India", conductingBody: "SSC",   difficulty: "Advanced",     description: "Combined Graduate Level — Group B & C central govt posts.", slug: "ssc-cgl" },
  { id: "ssc-chsl",       name: "SSC CHSL",                        category: "Government", region: "India", conductingBody: "SSC",   difficulty: "Intermediate", description: "Combined Higher Secondary Level — LDC, DEO, PA/SA posts.", slug: "ssc-chsl" },
  { id: "ssc-mts",        name: "SSC MTS",                         category: "Government", region: "India", conductingBody: "SSC",   difficulty: "Foundation",   description: "Multi-Tasking Staff for Group C non-gazetted posts.", slug: "ssc-mts" },
  { id: "ssc-gd",         name: "SSC GD",                          category: "Government", region: "India", conductingBody: "SSC",   difficulty: "Foundation",   description: "SSC GD Constable for CAPFs, NIA, SSF and more.", slug: "ssc-gd" },
  { id: "ssc-cpo",        name: "SSC CPO",                         category: "Government", region: "India", conductingBody: "SSC",   difficulty: "Intermediate", description: "Central Police Organisations — SI, ASI roles.", slug: "ssc-cpo" },
  { id: "rrb-ntpc",       name: "RRB NTPC",                        category: "Government", region: "India", conductingBody: "RRB",   difficulty: "Intermediate", description: "Non-Technical Popular Categories — 35,000+ railway posts.", slug: "rrb-ntpc" },
  { id: "rrb-group-d",    name: "RRB Group D",                     category: "Government", region: "India", conductingBody: "RRB",   difficulty: "Foundation",   description: "Railway Level 1 posts — track maintainer, helper, porter.", slug: "rrb-group-d" },
  { id: "ibps-po",        name: "IBPS PO",                         category: "Government", region: "India", conductingBody: "IBPS",  difficulty: "Intermediate", description: "Public Sector Bank Probationary Officer recruitment.", slug: "ibps-po" },
  { id: "sbi-po",         name: "SBI PO",                          category: "Government", region: "India", conductingBody: "SBI",   difficulty: "Advanced",     description: "State Bank of India Probationary Officer exam.", slug: "sbi-po" },
  { id: "rbi-b",          name: "RBI Grade B",                     category: "Government", region: "India", conductingBody: "RBI",   difficulty: "Expert",       description: "Reserve Bank of India officer in Grade B recruitment.", slug: "rbi-grade-b" },
  { id: "lic-aao",        name: "LIC AAO",                         category: "Government", region: "India", conductingBody: "LIC",   difficulty: "Intermediate", description: "LIC Assistant Administrative Officer recruitment exam.", slug: "lic-aao" },
  { id: "state-psc",      name: "State PSC Exams",                 category: "Government", region: "India", conductingBody: "State PSCs", difficulty: "Advanced", description: "State-level civil services — PCS, HCS, MPSC, BPSC etc.", slug: "state-psc" },

  // ── Defence ────────────────────────────────────────────────────────────────
  { id: "nda",            name: "NDA",                             category: "Defence", region: "India", conductingBody: "UPSC",         difficulty: "Intermediate", description: "National Defence Academy entrance for Army/Navy/Air Force.", slug: "nda" },
  { id: "cds",            name: "CDS",                             category: "Defence", region: "India", conductingBody: "UPSC",         difficulty: "Advanced",     description: "Combined Defence Services for commission in armed forces.", slug: "cds" },
  { id: "afcat",          name: "AFCAT",                           category: "Defence", region: "India", conductingBody: "Indian Air Force", difficulty: "Advanced", description: "Air Force Common Admission Test for officer entry.", slug: "afcat" },
  { id: "agniveer",       name: "Agniveer",                        category: "Defence", region: "India", conductingBody: "MoD",          difficulty: "Foundation",   description: "Short-term military service scheme — Army/Navy/Air Force.", slug: "agniveer" },
  { id: "navy-ssr",       name: "Indian Navy SSR",                 category: "Defence", region: "India", conductingBody: "Indian Navy",  difficulty: "Intermediate", description: "Senior Secondary Recruit — sailor entry into Indian Navy.", slug: "navy-ssr" },
  { id: "navy-aa",        name: "Indian Navy AA",                  category: "Defence", region: "India", conductingBody: "Indian Navy",  difficulty: "Intermediate", description: "Artificer Apprentice entry into Indian Navy.", slug: "navy-aa" },
  { id: "coast-guard",    name: "Indian Coast Guard",              category: "Defence", region: "India", conductingBody: "ICG",          difficulty: "Intermediate", description: "Indian Coast Guard Navik/Yantrik recruitment exam.", slug: "indian-coast-guard" },

  // ── Olympiads ──────────────────────────────────────────────────────────────
  { id: "ioqm",           name: "IOQM",                            category: "Olympiads", region: "India", conductingBody: "HBCSE",   difficulty: "Advanced",     description: "Indian Olympiad Qualifier in Mathematics.", slug: "ioqm" },
  { id: "inmo",           name: "INMO",                            category: "Olympiads", region: "India", conductingBody: "HBCSE",   difficulty: "Expert",       description: "Indian National Mathematical Olympiad.", slug: "inmo" },
  { id: "inpho",          name: "INPhO",                           category: "Olympiads", region: "India", conductingBody: "HBCSE",   difficulty: "Expert",       description: "Indian National Physics Olympiad.", slug: "inpho" },
  { id: "incho",          name: "INChO",                           category: "Olympiads", region: "India", conductingBody: "HBCSE",   difficulty: "Expert",       description: "Indian National Chemistry Olympiad.", slug: "incho" },
  { id: "inbo",           name: "INBO",                            category: "Olympiads", region: "India", conductingBody: "HBCSE",   difficulty: "Expert",       description: "Indian National Biology Olympiad.", slug: "inbo" },
  { id: "inao",           name: "INAO",                            category: "Olympiads", region: "India", conductingBody: "HBCSE",   difficulty: "Expert",       description: "Indian National Astronomy Olympiad.", slug: "inao" },
  { id: "inoi",           name: "INOI",                            category: "Olympiads", region: "India", conductingBody: "IARCS",   difficulty: "Expert",       description: "Indian National Olympiad in Informatics.", slug: "inoi" },
  { id: "sof-imo",        name: "SOF IMO",                         category: "Olympiads", region: "Both",  conductingBody: "SOF",     difficulty: "Foundation",   description: "Science Olympiad Foundation International Math Olympiad.", slug: "sof-imo" },
  { id: "sof-nso",        name: "SOF NSO",                         category: "Olympiads", region: "Both",  conductingBody: "SOF",     difficulty: "Foundation",   description: "National Science Olympiad by Science Olympiad Foundation.", slug: "sof-nso" },
  { id: "sof-ieo",        name: "SOF IEO",                         category: "Olympiads", region: "Both",  conductingBody: "SOF",     difficulty: "Foundation",   description: "International English Olympiad by SOF.", slug: "sof-ieo" },
  { id: "sof-igko",       name: "SOF IGKO",                        category: "Olympiads", region: "Both",  conductingBody: "SOF",     difficulty: "Foundation",   description: "International General Knowledge Olympiad by SOF.", slug: "sof-igko" },
  { id: "sof-nco",        name: "SOF NCO",                         category: "Olympiads", region: "Both",  conductingBody: "SOF",     difficulty: "Foundation",   description: "National Cyber Olympiad by Science Olympiad Foundation.", slug: "sof-nco" },
  { id: "imo-intl",       name: "International Mathematical Olympiad (IMO)", category: "Olympiads", region: "Both", conductingBody: "IMU", difficulty: "Expert", description: "World's premier mathematics competition for high schoolers.", slug: "imo-international" },
  { id: "ipho",           name: "International Physics Olympiad (IPhO)",     category: "Olympiads", region: "Both", conductingBody: "IPhO", difficulty: "Expert", description: "Annual physics competition between high school students.", slug: "icho-international" },
  { id: "icho",           name: "International Chemistry Olympiad (IChO)",   category: "Olympiads", region: "Both", conductingBody: "IChO", difficulty: "Expert", description: "World's top chemistry competition for pre-university students.", slug: "icho" },
  { id: "ibo-intl",       name: "International Biology Olympiad (IBO)",       category: "Olympiads", region: "Both", conductingBody: "IBO",  difficulty: "Expert", description: "Global competition testing biology knowledge & lab skills.", slug: "ibo-international" },
  { id: "ioi",            name: "International Olympiad in Informatics (IOI)", category: "Olympiads", region: "Both", conductingBody: "IOI", difficulty: "Expert", description: "World's top competitive programming event for school students.", slug: "ioi" },
  { id: "iao",            name: "International Astronomy Olympiad",           category: "Olympiads", region: "Both", conductingBody: "IAO",  difficulty: "Expert", description: "Global astronomy competition for secondary school students.", slug: "international-astronomy-olympiad" },

  // ── School ─────────────────────────────────────────────────────────────────
  { id: "cbse-10",        name: "CBSE Class 10",                   category: "School", region: "India",         conductingBody: "CBSE",      difficulty: "Foundation",   description: "CBSE Board Examination for Class 10 students.", slug: "cbse-class-10" },
  { id: "cbse-12",        name: "CBSE Class 12",                   category: "School", region: "India",         conductingBody: "CBSE",      difficulty: "Intermediate", description: "CBSE Board Examination for Class 12 — gateway to entrance exams.", slug: "cbse-class-12" },
  { id: "icse-10",        name: "ICSE Class 10",                   category: "School", region: "India",         conductingBody: "CISCE",     difficulty: "Intermediate", description: "Indian Certificate of Secondary Education for Class 10.", slug: "icse-class-10" },
  { id: "isc-12",         name: "ISC Class 12",                    category: "School", region: "India",         conductingBody: "CISCE",     difficulty: "Intermediate", description: "Indian School Certificate for Class 12.", slug: "isc-class-12" },
  { id: "state-10",       name: "State Board Class 10",            category: "School", region: "India",         conductingBody: "State Boards", difficulty: "Foundation", description: "Various state board Class 10 examinations across India.", slug: "state-board-10" },
  { id: "state-12",       name: "State Board Class 12",            category: "School", region: "India",         conductingBody: "State Boards", difficulty: "Intermediate", description: "State board Class 12 — basis for all entrance examinations.", slug: "state-board-12" },
  { id: "gcse",           name: "GCSE",                            category: "School", region: "International", conductingBody: "Ofqual UK", difficulty: "Foundation",   description: "General Certificate of Secondary Education — UK standard.", slug: "gcse" },
  { id: "igcse",          name: "IGCSE",                           category: "School", region: "Both",          conductingBody: "Cambridge", difficulty: "Foundation",   description: "International GCSE accepted globally including India.", slug: "igcse" },
  { id: "ib-diploma",     name: "IB Diploma",                      category: "School", region: "Both",          conductingBody: "IBO",       difficulty: "Advanced",     description: "International Baccalaureate Diploma — globally recognised.", slug: "ib-diploma" },
  { id: "a-levels",       name: "A Levels",                        category: "School", region: "Both",          conductingBody: "Cambridge/Edexcel", difficulty: "Intermediate", description: "Advanced Level qualifications for UK and global universities.", slug: "a-levels" },

  // ── English Proficiency ────────────────────────────────────────────────────
  { id: "ielts",          name: "IELTS",                           category: "English", region: "Both", conductingBody: "IDP/British Council", difficulty: "Intermediate", description: "International English Language Testing System — academic & general.", slug: "ielts" },
  { id: "toefl",          name: "TOEFL",                           category: "English", region: "Both", conductingBody: "ETS",              difficulty: "Intermediate", description: "Test of English as a Foreign Language for US university entry.", slug: "toefl" },
  { id: "pte",            name: "PTE Academic",                    category: "English", region: "Both", conductingBody: "Pearson",          difficulty: "Intermediate", description: "Pearson Test of English — computer-based language assessment.", slug: "pte-academic" },
  { id: "duolingo",       name: "Duolingo English Test",           category: "English", region: "Both", conductingBody: "Duolingo",         difficulty: "Foundation",   description: "Online English proficiency test — affordable & convenient.", slug: "duolingo-english" },
  { id: "cambridge",      name: "Cambridge English",               category: "English", region: "Both", conductingBody: "Cambridge Assess.", difficulty: "Intermediate", description: "Cambridge C1 Advanced & C2 Proficiency certifications.", slug: "cambridge-english" },

  // ── Programming / CS ──────────────────────────────────────────────────────
  { id: "icpc",           name: "ICPC",                            category: "Programming", region: "Both", conductingBody: "ICPC Foundation", difficulty: "Expert",     description: "International Collegiate Programming Contest — world's oldest.", slug: "icpc" },
  { id: "gcj",            name: "Google Code Jam (Archived)",      category: "Programming", region: "Both", conductingBody: "Google",          difficulty: "Expert",     description: "Google's algorithmic coding competition (archived 2023).", slug: "google-code-jam" },
  { id: "hacker-cup",     name: "Meta Hacker Cup",                 category: "Programming", region: "Both", conductingBody: "Meta",            difficulty: "Expert",     description: "Annual coding competition by Meta (Facebook).", slug: "meta-hacker-cup" },
  { id: "codeforces",     name: "Codeforces Rounds",               category: "Programming", region: "Both", conductingBody: "Codeforces",      difficulty: "Advanced",   description: "Regular competitive programming rounds — Div 1/2/3/4.", slug: "codeforces-rounds" },
  { id: "leetcode",       name: "LeetCode Weekly Contest",         category: "Programming", region: "Both", conductingBody: "LeetCode",        difficulty: "Advanced",   description: "Weekly & biweekly algorithmic contests on LeetCode.", slug: "leetcode-weekly" },
  { id: "atcoder",        name: "AtCoder Contest",                 category: "Programming", region: "Both", conductingBody: "AtCoder",         difficulty: "Advanced",   description: "Japanese competitive programming platform — ABC/ARC/AGC.", slug: "atcoder-contest" },
  { id: "hackerrank",     name: "HackerRank Contest",              category: "Programming", region: "Both", conductingBody: "HackerRank",      difficulty: "Intermediate", description: "Skill-based coding challenges — used in hiring & contests.", slug: "hackerrank-contest" },
  { id: "advent-code",    name: "Advent of Code",                  category: "Programming", region: "Both", conductingBody: "AoC",             difficulty: "Advanced",   description: "Annual December coding puzzle series — 25 days.", slug: "advent-of-code" },

  // ── Finance ────────────────────────────────────────────────────────────────
  { id: "frm-1",          name: "FRM Part I",                      category: "Finance", region: "Both", conductingBody: "GARP", difficulty: "Advanced", description: "Financial Risk Manager — quantitative analysis & tools.", slug: "frm-part-1" },
  { id: "frm-2",          name: "FRM Part II",                     category: "Finance", region: "Both", conductingBody: "GARP", difficulty: "Expert",   description: "FRM Part II — market, credit & operational risk.", slug: "frm-part-2" },
  { id: "cfa-finance",    name: "CFA",                             category: "Finance", region: "Both", conductingBody: "CFA Institute", difficulty: "Expert", description: "Chartered Financial Analyst — gold standard in investment.", slug: "cfa" },
  { id: "cfp",            name: "CFP",                             category: "Finance", region: "Both", conductingBody: "CFP Board", difficulty: "Advanced", description: "Certified Financial Planner — personal finance & wealth mgmt.", slug: "cfp" },

  // ── Graduate ───────────────────────────────────────────────────────────────
  { id: "gate",           name: "GATE",                            category: "Graduate", region: "India", conductingBody: "IITs/IISc", difficulty: "Expert",     description: "Graduate Aptitude Test in Engineering for M.Tech/PSU jobs.", slug: "gate" },
  { id: "csir-net",       name: "CSIR NET",                        category: "Graduate", region: "India", conductingBody: "NTA",       difficulty: "Expert",     description: "CSIR National Eligibility Test — JRF & Lectureship.", slug: "csir-net" },
  { id: "ugc-net",        name: "UGC NET",                         category: "Graduate", region: "India", conductingBody: "NTA",       difficulty: "Advanced",   description: "UGC National Eligibility Test for Assistant Professor.", slug: "ugc-net" },
  { id: "iit-jam",        name: "IIT JAM",                         category: "Graduate", region: "India", conductingBody: "IITs",      difficulty: "Advanced",   description: "Joint Admission Test for M.Sc at IITs and IISc.", slug: "iit-jam" },
  { id: "cuet-ug",        name: "CUET UG",                         category: "Graduate", region: "India", conductingBody: "NTA",       difficulty: "Intermediate", description: "Common University Entrance Test for central university UG.", slug: "cuet-ug" },
  { id: "cuet-pg",        name: "CUET PG",                         category: "Graduate", region: "India", conductingBody: "NTA",       difficulty: "Intermediate", description: "Common University Entrance Test for central university PG.", slug: "cuet-pg" },
  { id: "gre-grad",       name: "GRE",                             category: "Graduate", region: "Both",  conductingBody: "ETS",       difficulty: "Advanced",   description: "Graduate Record Exam — required for US/global MS/PhD programs.", slug: "gre-graduate" },
  { id: "gmat-grad",      name: "GMAT",                            category: "Graduate", region: "Both",  conductingBody: "GMAC",      difficulty: "Advanced",   description: "Graduate Management Admission Test for global MBA programs.", slug: "gmat-graduate" },

  // ── Hiring Assessments ─────────────────────────────────────────────────────
  { id: "amazon-oa",      name: "Amazon OA",                       category: "Hiring", region: "Both",  conductingBody: "Amazon",    difficulty: "Advanced",   description: "Amazon Online Assessment for SDE/DS roles globally.", slug: "amazon-oa" },
  { id: "google-oa",      name: "Google OA",                       category: "Hiring", region: "Both",  conductingBody: "Google",    difficulty: "Expert",     description: "Google Online Assessment for software engineering roles.", slug: "google-oa" },
  { id: "microsoft-oa",   name: "Microsoft OA",                    category: "Hiring", region: "Both",  conductingBody: "Microsoft", difficulty: "Advanced",   description: "Microsoft Online Assessment for SWE/BI roles.", slug: "microsoft-oa" },
  { id: "meta-oa",        name: "Meta OA",                         category: "Hiring", region: "Both",  conductingBody: "Meta",      difficulty: "Expert",     description: "Meta Online Assessment for software engineering positions.", slug: "meta-oa" },
  { id: "tcs-nqt",        name: "TCS NQT",                         category: "Hiring", region: "India", conductingBody: "TCS",       difficulty: "Intermediate", description: "TCS National Qualifier Test — cognitive & technical skills.", slug: "tcs-nqt" },
  { id: "infosys-oa",     name: "Infosys InfyTQ",                  category: "Hiring", region: "India", conductingBody: "Infosys",   difficulty: "Intermediate", description: "Infosys talent assessment platform for campus hiring.", slug: "infosys-infytq" },
  { id: "wipro-oa",       name: "Wipro Elite NTH",                 category: "Hiring", region: "India", conductingBody: "Wipro",     difficulty: "Intermediate", description: "Wipro National Talent Hunt for engineering campus hiring.", slug: "wipro-elite-nth" },
];
