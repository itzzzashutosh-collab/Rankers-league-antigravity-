"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Trophy, Settings, Calendar, Award, BookOpen, AlertCircle, 
  CheckCircle, ShieldAlert, Sparkles, HelpCircle, Save, Radio
} from "lucide-react";
import { prizeGenerator, PrizeBracketPreview } from "@/services/prizeGenerator";
import { contestService } from "@/services/contestService";

export default function CreateContestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: "11fa214d-bbbb-4d40-bbbb-11fa214dbbbb", // civil services default
    exam_name: "",
    description: "",
    short_description: "",
    difficulty: "Medium",
    languages: ["English"],
    thumbnail_url: "",
    banner_url: "",
    tags: [] as string[],
    visibility: "Public",
    status: "Draft",
    // Config
    contest_type: "Mega",
    entry_fee: 99,
    max_participants: 1000,
    min_participants: 10,
    platform_fee_percentage: 30,
    min_winner_percentage: 50,
    min_reward: 99,
    // Registration
    registration_opens: "",
    registration_closes: "",
    allow_waiting_list: true,
    max_entries: 1,
    refund_policy: "Refund permitted up to 24h prior to registration closing.",
    cancellation_rules: "Contest cancelled if minimum participants threshold is not met.",
    // Schedule
    contest_date: "",
    reporting_time: "",
    lobby_time: "",
    start_time: "",
    end_time: "",
    timezone: "Asia/Kolkata",
    // Prizes
    first_prize_multiplier: 1,
    distribution_curve: "Balanced" as "Balanced" | "Aggressive" | "Top Heavy" | "Flat",
    generated_prize_pool: 0,
    prize_matrix_json: [] as PrizeBracketPreview[],
    // Paper
    paper_id: "paper-jee-physics-01",
    negative_marking: true,
    total_questions: 90,
    total_marks: 360,
    duration_minutes: 180
  });

  // Load from template if templateId is provided
  useEffect(() => {
    if (templateId) {
      // Seed with template defaults
      setFormData(prev => ({
        ...prev,
        name: templateId.includes("upsc") ? "UPSC Mega Special Arena" : "JEE Physics Special Challenge",
        slug: templateId.includes("upsc") ? "upsc-mega-special-arena" : "jee-physics-special",
        entry_fee: templateId.includes("upsc") ? 499 : 99,
        max_participants: templateId.includes("upsc") ? 50000 : 5000,
        platform_fee_percentage: templateId.includes("upsc") ? 20 : 30,
        min_winner_percentage: 50,
        min_reward: templateId.includes("upsc") ? 499 : 99
      }));
    }
  }, [templateId]);

  // Automatically recalculate Prize Matrix when parameters change
  const runPrizeCalculation = () => {
    const result = prizeGenerator.calculateMatrix(
      Number(formData.max_participants),
      Number(formData.entry_fee),
      Number(formData.platform_fee_percentage),
      Number(formData.min_winner_percentage),
      formData.distribution_curve,
      Number(formData.first_prize_multiplier)
    );

    setFormData(prev => ({
      ...prev,
      generated_prize_pool: result.prize_pool,
      prize_matrix_json: result.brackets
    }));
  };

  useEffect(() => {
    runPrizeCalculation();
  }, [
    formData.entry_fee, 
    formData.max_participants, 
    formData.platform_fee_percentage, 
    formData.min_winner_percentage, 
    formData.distribution_curve, 
    formData.first_prize_multiplier
  ]);

  // Validation function
  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.name) errors.push("Contest Name is required.");
    if (!formData.slug) errors.push("Unique Contest Slug is required.");
    if (!formData.exam_name) errors.push("Target Exam Name is required.");
    if (Number(formData.entry_fee) < 0) errors.push("Entry fee must be positive.");
    if (Number(formData.max_participants) < Number(formData.min_participants)) {
      errors.push("Max seats must be greater than min seats.");
    }
    if (!formData.start_time || !formData.end_time) {
      errors.push("Contest start and end time schedule is required.");
    }
    return errors;
  };

  const saveDraft = async () => {
    setSaving(true);
    const success = await contestService.createContest({
      ...formData,
      status: "Draft"
    });
    setSaving(false);
    if (success) {
      alert("Contest draft stored in backend database.");
      router.push("/admin/contests");
    } else {
      alert("Failed to store draft. Check input formats.");
    }
  };

  const publishContest = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Cannot publish. Configuration has errors:\n${errors.join("\n")}`);
      return;
    }

    setSaving(true);
    const success = await contestService.createContest({
      ...formData,
      status: "Scheduled"
    });
    setSaving(false);
    if (success) {
      alert("Contest validated and scheduled live!");
      router.push("/admin/contests");
    } else {
      alert("Database error scheduling contest. Verify slug uniqueness.");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight">
            Create Competition Arena
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Build live tournament matrices step by step.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
          <button
            onClick={publishContest}
            disabled={saving}
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Validate & Publish
          </button>
        </div>
      </div>

      {/* Steps Navigation Stepper */}
      <div className="flex items-center justify-between overflow-x-auto gap-4 py-2 border-b border-border/20 text-xs">
        {[
          { step: 1, label: "General", icon: Trophy },
          { step: 2, label: "Configuration", icon: Settings },
          { step: 3, label: "Schedule", icon: Calendar },
          { step: 4, label: "Prize Curves", icon: Award },
          { step: 5, label: "Exam Paper", icon: BookOpen },
          { step: 6, label: "Review & Publish", icon: Sparkles }
        ].map((item) => (
          <button
            key={item.step}
            onClick={() => setStep(item.step)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 font-bold ${
              step === item.step
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main wizard step boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-border bg-card/15 p-6 md:p-8 space-y-6 min-h-[420px]">
            
            {/* STEP 1: General Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-black text-foreground">General Arena Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Contest Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. UPSC Prelims Elite Arena (GS-01)"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Contest Slug (Unique URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. upsc-prelims-elite"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Target Exam Name</label>
                    <input
                      type="text"
                      value={formData.exam_name}
                      onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                      placeholder="e.g. UPSC CSE Prelims"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Difficulty Level</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Grandmaster">Grandmaster</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-muted-foreground">Contest Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Enter detailed description of the contest parameters..."
                    className="w-full p-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Configuration */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-black text-foreground">Capacity & Revenue Configurations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Entry Fee (INR)</label>
                    <input
                      type="number"
                      value={formData.entry_fee}
                      onChange={(e) => setFormData({ ...formData, entry_fee: Math.max(0, Number(e.target.value)) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Maximum Seats Capacity</label>
                    <input
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: Math.max(1, Number(e.target.value)) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Platform Margin (%)</label>
                    <input
                      type="number"
                      value={formData.platform_fee_percentage}
                      onChange={(e) => setFormData({ ...formData, platform_fee_percentage: Math.min(100, Math.max(0, Number(e.target.value))) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Winning Bracket Percentage (%)</label>
                    <input
                      type="number"
                      value={formData.min_winner_percentage}
                      onChange={(e) => setFormData({ ...formData, min_winner_percentage: Math.min(100, Math.max(1, Number(e.target.value))) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Schedule & Registration */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Interactive Calendar Calendar picker */}
                  <div className="flex-1 space-y-3">
                    <label className="font-bold text-muted-foreground block">Select Contest Date (July 2026)</label>
                    <div className="border border-border/80 rounded-2xl p-4 bg-background/25">
                      <div className="flex items-center justify-between mb-3 border-b border-border/20 pb-2">
                        <span className="font-black text-foreground">July 2026</span>
                        <span className="text-[10px] text-muted-foreground/60">IST (Asia/Kolkata)</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-muted-foreground mb-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {/* Offset for Wednesday start in July 2026 (2 empty slots) */}
                        <div />
                        <div />
                        {Array.from({ length: 31 }, (_, i) => {
                          const day = i + 1;
                          const dayString = `2026-07-${day < 10 ? "0" + day : day}`;
                          const isSelected = formData.contest_date === dayString;
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setFormData({ ...formData, contest_date: dayString })}
                              className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all ${
                                isSelected 
                                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105" 
                                  : "hover:bg-muted/40 text-foreground"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Preset Time Slots */}
                  <div className="flex-1 space-y-3">
                    <label className="font-bold text-muted-foreground block">Time Slot Presets</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { label: "Morning Session", slot: "09:00 AM - 12:00 PM", start: "09:00", end: "12:00" },
                        { label: "Afternoon League", slot: "02:00 PM - 05:00 PM", start: "14:00", end: "17:00" },
                        { label: "Prime Time Arena", slot: "08:00 PM - 10:00 PM", start: "20:00", end: "22:00" }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={!formData.contest_date}
                          onClick={() => {
                            const date = formData.contest_date;
                            setFormData({
                              ...formData,
                              start_time: `${date}T${preset.start}`,
                              end_time: `${date}T${preset.end}`,
                              lobby_time: `${date}T${preset.start === "09:00" ? "08:30" : preset.start === "14:00" ? "13:30" : "19:30"}`,
                              reporting_time: `${date}T${preset.start === "09:00" ? "08:00" : preset.start === "14:00" ? "13:00" : "19:00"}`
                            });
                            alert(`Schedule slot presets initialized: ${preset.label}`);
                          }}
                          className="p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-all text-left space-y-1 disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                          <span className="font-bold text-foreground block group-hover:text-primary transition-colors">
                            {preset.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            {preset.slot}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct text inputs fallback for manual overrides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Registration Opens At</label>
                    <input
                      type="datetime-local"
                      value={formData.registration_opens}
                      onChange={(e) => setFormData({ ...formData, registration_opens: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Contest Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Contest End Time</label>
                    <input
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Contest Date (Selected)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.contest_date || "Please select a date on the calendar grid above"}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/30 text-muted-foreground focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Prize Curves */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-border/20 pb-3">
                  <h3 className="text-sm font-black text-foreground">Prize Matrix curves Generator</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    <Radio className="w-2.5 h-2.5 text-primary animate-pulse" />
                    Auto Solver Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Distribution Curve Curve</label>
                    <select
                      value={formData.distribution_curve}
                      onChange={(e) => setFormData({ ...formData, distribution_curve: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    >
                      <option value="Balanced">Balanced Decay</option>
                      <option value="Aggressive">Aggressive Steps</option>
                      <option value="Top Heavy">Top Heavy Rank 1 allocation</option>
                      <option value="Flat">Flat Equal Split</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">First Prize Multiplier Factor</label>
                    <select
                      value={formData.first_prize_multiplier}
                      onChange={(e) => setFormData({ ...formData, first_prize_multiplier: Number(e.target.value) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    >
                      <option value="1">1.0x Normal</option>
                      <option value="1.5">1.5x Premium Boost</option>
                      <option value="2">2.0x Double allocation</option>
                    </select>
                  </div>
                </div>

                {/* Brackets matrix viewer */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-muted-foreground block">
                    Dynamic Prize Ladder Brackets Previews
                  </span>
                  <div className="overflow-x-auto border border-border/60 rounded-xl bg-background/20 text-xs">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/80 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                          <th className="p-3">Rank Bracket</th>
                          <th className="p-3 text-center">Winners</th>
                          <th className="p-3">Reward / Winner</th>
                          <th className="p-3">Zone Type</th>
                          <th className="p-3 text-right">Total Allocated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-[11px] font-semibold">
                        {formData.prize_matrix_json.map((bracket, i) => (
                          <tr key={i} className="hover:bg-card/10 transition-colors">
                            <td className="p-3 font-mono">Rank {bracket.rank_start} - {bracket.rank_end}</td>
                            <td className="p-3 text-center text-muted-foreground">{bracket.winner_count}</td>
                            <td className="p-3 text-foreground">{formatCurrency(bracket.prize_amount)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                bracket.zone === "Winning Zone" ? "text-primary border-primary/20 bg-primary/5" :
                                bracket.zone === "Safe Zone" ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" :
                                "text-muted-foreground border-border/80 bg-muted/10"
                              }`}>
                                {bracket.zone}
                              </span>
                            </td>
                            <td className="p-3 text-right text-emerald-400">{formatCurrency(bracket.total_allocation)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Paper settings */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-black text-foreground">Attach Exam Paper Blueprints</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Exam Paper Blueprint</label>
                    <select
                      value={formData.paper_id}
                      onChange={(e) => setFormData({ ...formData, paper_id: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    >
                      <option value="paper-upsc-gs01">UPSC CSE GS-01 Blueprint 2026</option>
                      <option value="paper-jee-physics-01">JEE Advanced Physics Magnetism 2026</option>
                      <option value="paper-neet-biology-14">NEET Reproduction Speed Core 14</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">MCQs Total Questions</label>
                    <input
                      type="number"
                      value={formData.total_questions}
                      onChange={(e) => setFormData({ ...formData, total_questions: Number(e.target.value) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Passing Marks Threshold</label>
                    <input
                      type="number"
                      value={formData.total_marks}
                      onChange={(e) => setFormData({ ...formData, total_marks: Number(e.target.value) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground">Exam Duration (Minutes)</label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Review & Publish */}
            {step === 6 && (
              <div className="space-y-6 animate-fade-in text-xs">
                <h3 className="text-sm font-black text-foreground">Operations verification Checklist</h3>
                
                {/* Validation Warnings */}
                <div className="space-y-2">
                  {validateForm().length > 0 ? (
                    <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[11px] block">Configuration Validation Alerts</span>
                        <ul className="list-disc pl-4 mt-1.5 space-y-1">
                          {validateForm().map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">Contest details validated with all systems clear! Ready to publish.</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/60 rounded-2xl p-5 bg-background/10 font-semibold leading-relaxed">
                  <div>Contest: <strong className="text-foreground">{formData.name || "Untitled"}</strong></div>
                  <div>URL Slug: <strong className="text-foreground">/{formData.slug || "none"}</strong></div>
                  <div>Difficulty: <strong className="text-foreground">{formData.difficulty}</strong></div>
                  <div>Entry Fee: <strong className="text-foreground">{formatCurrency(formData.entry_fee)}</strong></div>
                  <div>Total Seats: <strong className="text-foreground">{formData.max_participants.toLocaleString()} seats</strong></div>
                  <div>Prize Pool: <strong className="text-emerald-400">{formatCurrency(formData.generated_prize_pool)}</strong></div>
                </div>
              </div>
            )}

          </div>

          {/* Stepper Buttons controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 text-xs font-bold text-foreground transition-all disabled:opacity-30"
            >
              Back
            </button>
            {step < 6 ? (
              <button
                onClick={() => setStep(prev => Math.min(6, prev + 1))}
                className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={publishContest}
                className="h-9 px-6 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
              >
                Launch Arena Live
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Calculator Details widgets */}
        <div className="lg:col-span-4 space-y-6 text-xs font-semibold">
          <section className="rounded-3xl border border-border bg-card/25 p-6 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Platform Revenue Solver
            </h3>
            <div className="space-y-2 border-b border-border/20 pb-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground/80">Total Collections</span>
                <span className="text-foreground font-black">
                  {formatCurrency(Number(formData.max_participants) * Number(formData.entry_fee))}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground/80">Platform Margin ({formData.platform_fee_percentage}%)</span>
                <span className="text-foreground font-black">
                  {formatCurrency((Number(formData.max_participants) * Number(formData.entry_fee)) * (Number(formData.platform_fee_percentage) / 100))}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-emerald-400 pt-1 font-bold">
              <span>Prize Pool Budget</span>
              <span className="font-black">{formatCurrency(formData.generated_prize_pool)}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
