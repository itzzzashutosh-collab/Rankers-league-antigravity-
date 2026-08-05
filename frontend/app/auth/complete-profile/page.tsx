"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, BookOpen, ChevronRight, Check, School, Building2 } from "lucide-react";
import { AvatarUpload } from "@/components/auth/AvatarUpload";
import { UsernameField } from "@/components/auth/UsernameField";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { EXAM_CATEGORY_LABELS, ACADEMIC_LEVEL_LABELS, ExamCategory, AcademicLevel, GenderType } from "@/types/auth";

const STEPS = ["Personal Info", "Education & Contact", "Exam Profile"];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [userId, setUserId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitLoading, setIsInitLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = React.useState(false);

  // Step 1 — Personal Info
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [gender, setGender] = React.useState<GenderType | "">("");

  // Step 2 — Education & Contact
  const [phone, setPhone] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [sameAsPhone, setSameAsPhone] = React.useState(false);
  const [isInCoaching, setIsInCoaching] = React.useState<boolean | null>(null);
  const [coachingName, setCoachingName] = React.useState("");
  const [schoolName, setSchoolName] = React.useState("");

  // Step 3 — Exam Profile
  const [examCategory, setExamCategory] = React.useState<ExamCategory | "">("");
  const [academicLevel, setAcademicLevel] = React.useState<AcademicLevel | "">("");
  const [targetYear, setTargetYear] = React.useState("");
  const [preferredLang, setPreferredLang] = React.useState<"en" | "hi">("en");

  // Sync WhatsApp = phone if checkbox is checked
  React.useEffect(() => {
    if (sameAsPhone) setWhatsapp(phone);
  }, [sameAsPhone, phone]);

  React.useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }
      setUserId(user.id);

      // Check if profile is already complete — if so, redirect away
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile?.profile_status === "complete" && profile?.username) {
        // Profile already done — send to dashboard or home
        router.replace("/dashboard");
        return;
      }

      // Pre-fill existing partial data
      if (profile) {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.username) setUsername(profile.username);
        if (profile.phone_number) setPhone(profile.phone_number);
        if (profile.whatsapp_number) setWhatsapp(profile.whatsapp_number);
        if (profile.date_of_birth) setDob(profile.date_of_birth);
        if (profile.gender) setGender(profile.gender);
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        if (profile.is_in_coaching !== null && profile.is_in_coaching !== undefined) {
          setIsInCoaching(profile.is_in_coaching);
        }
        if (profile.coaching_name) setCoachingName(profile.coaching_name);
        if (profile.school_name) setSchoolName(profile.school_name);
        if (profile.primary_exam_category) setExamCategory(profile.primary_exam_category);
        if (profile.academic_level) setAcademicLevel(profile.academic_level);
        if (profile.target_exam_year) setTargetYear(String(profile.target_exam_year));
        if (profile.preferred_language) setPreferredLang(profile.preferred_language);
      }
      setIsInitLoading(false);
    };
    init();
  }, [router]);

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    try {
      const res = await fetch("/api/auth/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setAvatarUrl(data.url);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    await fetch("/api/auth/avatar", { method: "DELETE" });
    setAvatarUrl(null);
  };

  // ── Step validation ──────────────────────────────────────────────
  const validateStep1 = () => {
    if (!fullName.trim() || fullName.trim().length < 2) return "Please enter your full name.";
    if (!username || username.length < 3) return "Please choose a username.";
    if (!dob) return "Please enter your date of birth.";
    if (!gender) return "Please select your gender.";
    return null;
  };

  const validateStep2 = () => {
    if (!phone || phone.length < 7) return "Please enter a valid phone number.";
    if (isInCoaching === null) return "Please tell us if you are in a coaching institute.";
    if (isInCoaching && !coachingName.trim()) return "Please enter the name of your coaching institute.";
    if (!isInCoaching && !schoolName.trim()) return "Please enter the name of your school or college.";
    return null;
  };

  // ── Step 1 → Step 2 ─────────────────────────────────────────────
  const handleStep1Next = async () => {
    const validationError = validateStep1();
    if (validationError) { setError(validationError); return; }
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      try {
        const res = await fetch(`/api/auth/check-username?username=${username}`);
        const { available, message } = await res.json();
        if (!available) {
          const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).single();
          if (profile?.username !== username) { setError(message); setIsLoading(false); return; }
        }
      } catch {}

      try {
        await supabase.from("profiles").update({
          full_name: fullName.trim(),
          username: username.toLowerCase(),
          date_of_birth: dob,
          gender,
          avatar_url: avatarUrl,
        }).eq("id", userId);
      } catch {}

      setStep(1);
    } catch {
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2 → Step 3 ─────────────────────────────────────────────
  const handleStep2Next = async () => {
    const validationError = validateStep2();
    if (validationError) { setError(validationError); return; }
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      try {
        await supabase.from("profiles").update({
          phone_number: phone,
          whatsapp_number: whatsapp || null,
          is_in_coaching: isInCoaching,
          coaching_name: isInCoaching ? coachingName.trim() : null,
          school_name: !isInCoaching ? schoolName.trim() : null,
        }).eq("id", userId);
      } catch {}

      setStep(2);
    } catch {
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3 Final Submit ──────────────────────────────────────────
  const handleFinalSubmit = async () => {
    if (!examCategory) { setError("Please select your primary exam."); return; }
    if (!academicLevel) { setError("Please select your academic level."); return; }
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      try {
        await supabase.from("profiles").update({
          primary_exam_category: examCategory,
          academic_level: academicLevel,
          target_exam_year: targetYear ? parseInt(targetYear) : null,
          preferred_language: preferredLang,
          profile_status: "complete",
        }).eq("id", userId);

        // Mirror core identity into users table for fast dashboard reads
        await supabase.from("users").upsert({
          id: userId,
          full_name: fullName.trim(),
          username: username.toLowerCase(),
          avatar_url: avatarUrl,
          primary_exam_category: examCategory,
          phone_number: phone,
          academic_level: academicLevel,
          target_exam_year: targetYear ? parseInt(targetYear) : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

        await fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, userId }),
        });
      } catch {}

      document.cookie = "profile_completed=true; path=/; max-age=31536000";
      window.location.href = "/dashboard?onboarded=1";
    } catch {
      document.cookie = "profile_completed=true; path=/; max-age=31536000";
      window.location.href = "/dashboard?onboarded=1";
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear + i);

  // Loading state while checking if profile is complete
  if (isInitLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all duration-300",
                i < step ? "bg-emerald-500 border-emerald-500 text-white" :
                i === step ? "bg-primary border-primary text-primary-foreground" :
                "border-border/40 text-muted-foreground"
              )}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-xs font-bold",
                  i === step ? "text-foreground" : i < step ? "text-emerald-500" : "text-muted-foreground"
                )}>{s}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-border/40 mx-1" />
              )}
            </div>
          ))}
        </div>
        <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl shadow-black/20">

        {/* ── STEP 0: Personal Info ── */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-1 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-2">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-black">Personal Information</h2>
              <p className="text-xs text-muted-foreground">Tell us about yourself</p>
            </div>

            <AvatarUpload
              currentUrl={avatarUrl}
              onUpload={handleAvatarUpload}
              onRemove={handleAvatarRemove}
              isLoading={avatarUploading}
            />

            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Username *</label>
              <UsernameField
                value={username}
                onChange={setUsername}
                disabled={isLoading}
              />
            </div>

            {/* DOB */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Date of Birth *</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Gender *</label>
              <div className="grid grid-cols-2 gap-2">
                {(["male", "female", "non_binary", "prefer_not_to_say"] as GenderType[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={cn(
                      "py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                      gender === g
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border/40 text-muted-foreground hover:border-border"
                    )}
                  >
                    {g === "male" ? "Male" : g === "female" ? "Female" : g === "non_binary" ? "Non-Binary" : "Prefer not to say"}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <button
              type="button"
              onClick={handleStep1Next}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {/* ── STEP 1: Education & Contact ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-1 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-2">
                <School className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-black">Education & Contact</h2>
              <p className="text-xs text-muted-foreground">Your learning environment & contact info</p>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Mobile Number *</label>
              <PhoneInput
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  if (sameAsPhone) setWhatsapp(val);
                }}
                disabled={isLoading}
                placeholder="Your mobile number"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">WhatsApp Number <span className="text-muted-foreground font-normal">(optional)</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary rounded"
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">Same as mobile</span>
                </label>
              </div>
              <PhoneInput
                value={whatsapp}
                onChange={setWhatsapp}
                disabled={isLoading || sameAsPhone}
                placeholder="WhatsApp number"
              />
            </div>

            {/* Coaching or School */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground">Are you enrolled in a coaching institute? *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsInCoaching(true)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                    isInCoaching === true
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  )}
                >
                  <Building2 className="w-4 h-4" />
                  Yes, I am
                </button>
                <button
                  type="button"
                  onClick={() => setIsInCoaching(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                    isInCoaching === false
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  )}
                >
                  <School className="w-4 h-4" />
                  No, self-study
                </button>
              </div>

              {isInCoaching === true && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Coaching Institute Name *</label>
                  <input
                    type="text"
                    value={coachingName}
                    onChange={(e) => setCoachingName(e.target.value)}
                    placeholder="e.g. Allen, Aakash, FIITJEE..."
                    maxLength={100}
                    className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}

              {isInCoaching === false && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">School / College Name *</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. DPS, IIT Bombay..."
                    maxLength={100}
                    className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setStep(0); setError(""); }}
                className="flex-1 py-3.5 rounded-xl border-2 border-border/50 text-sm font-bold text-muted-foreground hover:border-border hover:text-foreground transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Exam Profile ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-2">
                <BookOpen className="w-6 h-6 text-violet-500" />
              </div>
              <h2 className="text-xl font-black">Exam Profile</h2>
              <p className="text-xs text-muted-foreground">Personalize your contest experience</p>
            </div>

            {/* Primary Exam */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Primary Exam Target *</label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value as ExamCategory)}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select your exam</option>
                {Object.entries(EXAM_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Academic Level *</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select academic level</option>
                {Object.entries(ACADEMIC_LEVEL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Target Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Target Exam Year <span className="text-muted-foreground font-normal">(optional)</span></label>
              <div className="grid grid-cols-4 gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setTargetYear(String(y))}
                    className={cn(
                      "py-2 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                      targetYear === String(y)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border/40 text-muted-foreground hover:border-border"
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Preferred Language</label>
              <div className="grid grid-cols-2 gap-2">
                {(["en", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreferredLang(lang)}
                    className={cn(
                      "py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-200",
                      preferredLang === lang
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border/40 text-muted-foreground hover:border-border"
                    )}
                  >
                    {lang === "en" ? "🇬🇧 English" : "🇮🇳 हिन्दी"}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setStep(1); setError(""); }}
                className="flex-1 py-3.5 rounded-xl border-2 border-border/50 text-sm font-bold text-muted-foreground hover:border-border hover:text-foreground transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  "🎉 Complete Profile"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
