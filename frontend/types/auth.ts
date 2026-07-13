import { User, Session } from "@supabase/supabase-js";

export type ExamCategory =
  | "JEE_MAIN" | "JEE_ADVANCED" | "NEET_UG" | "NEET_PG" | "CUET_UG"
  | "BITSAT" | "VITEEE" | "SRMJEEE" | "MHT_CET" | "WBJEE" | "GATE"
  | "CAT" | "XAT" | "GMAT" | "GRE" | "SAT" | "ACT"
  | "CLAT" | "AILET" | "LSAT"
  | "UPSC_CSE" | "SSC_CGL" | "SSC_CHSL" | "NDA" | "CDS" | "AFCAT"
  | "RRB_NTPC" | "SBI_PO" | "SBI_CLERK" | "RBI_GRADE_B" | "UGC_NET"
  | "NIFT" | "UCEED" | "IELTS" | "TOEFL";

export type AcademicLevel =
  | "class_9" | "class_10" | "class_11" | "class_12"
  | "graduate" | "post_graduate" | "working_professional" | "other";

export type GenderType = "male" | "female" | "non_binary" | "prefer_not_to_say";
export type ProfileStatus = "incomplete" | "complete" | "suspended";
export type PreferredLang = "en" | "hi";
export type SessionStatus = "active" | "expired" | "logged_out";

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  date_of_birth: string | null;
  gender: GenderType | null;
  country: string | null;
  state: string | null;
  city: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  is_in_coaching: boolean;
  coaching_name: string | null;
  school_name: string | null;
  preferred_language: PreferredLang;
  primary_exam_category: ExamCategory | null;
  academic_level: AcademicLevel | null;
  target_exam_year: number | null;
  avatar_url: string | null;
  profile_status: ProfileStatus;
  aura_points: number;
  national_rank: number | null;
  total_contests_joined: number;
  joined_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  device_name: string | null;
  browser: string | null;
  operating_system: string | null;
  ip_address: string | null;
  country_code: string | null;
  status: SessionStatus;
  last_active_at: string;
  created_at: string;
  expires_at: string | null;
}

export interface UserPreferences {
  user_id: string;
  theme: "dark" | "light";
  email_notifications: boolean;
  contest_reminders: boolean;
  result_alerts: boolean;
  prize_alerts: boolean;
}

export interface ParticipantIdentity {
  id: string;
  user_id: string;
  participant_id: string;
  public_profile_url: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

export interface LoginFormData {
  phone: string;
}

export interface RegisterFormData {
  phone: string;
}

export interface OtpFormData {
  otp: string;
}

export interface ProfileFormData {
  full_name: string;
  username: string;
  date_of_birth: string;
  gender: GenderType;
  country: string;
  state: string;
  city: string;
  preferred_language: PreferredLang;
  primary_exam_category: ExamCategory;
  academic_level: AcademicLevel;
  target_exam_year: number;
}

// Exam category display labels
export const EXAM_CATEGORY_LABELS: Record<ExamCategory, string> = {
  JEE_MAIN: "JEE Main",
  JEE_ADVANCED: "JEE Advanced",
  NEET_UG: "NEET UG",
  NEET_PG: "NEET PG",
  CUET_UG: "CUET UG",
  BITSAT: "BITSAT",
  VITEEE: "VITEEE",
  SRMJEEE: "SRMJEEE",
  MHT_CET: "MHT CET",
  WBJEE: "WBJEE",
  GATE: "GATE",
  CAT: "CAT",
  XAT: "XAT",
  GMAT: "GMAT",
  GRE: "GRE",
  SAT: "SAT",
  ACT: "ACT",
  CLAT: "CLAT",
  AILET: "AILET",
  LSAT: "LSAT",
  UPSC_CSE: "UPSC CSE",
  SSC_CGL: "SSC CGL",
  SSC_CHSL: "SSC CHSL",
  NDA: "NDA",
  CDS: "CDS",
  AFCAT: "AFCAT",
  RRB_NTPC: "RRB NTPC",
  SBI_PO: "SBI PO",
  SBI_CLERK: "SBI Clerk",
  RBI_GRADE_B: "RBI Grade B",
  UGC_NET: "UGC NET",
  NIFT: "NIFT",
  UCEED: "UCEED",
  IELTS: "IELTS",
  TOEFL: "TOEFL",
};

export const ACADEMIC_LEVEL_LABELS: Record<AcademicLevel, string> = {
  class_9: "Class 9",
  class_10: "Class 10",
  class_11: "Class 11",
  class_12: "Class 12",
  graduate: "Graduate (UG)",
  post_graduate: "Post Graduate (PG)",
  working_professional: "Working Professional",
  other: "Other",
};
