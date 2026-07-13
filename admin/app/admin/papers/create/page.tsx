"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  BookOpen, Layers, Plus, Save, CheckCircle, ShieldAlert, Cpu, 
  Trash2, Copy, Play, ArrowLeft, Activity, Star, Info, Settings
} from "lucide-react";
import { paperService } from "@/services/paperService";
import { qualityEngine, QualityScoreReport } from "@/services/qualityEngine";
import { blueprintEngine } from "@/services/blueprintEngine";
import { questionService, QuestionListItem } from "@/services/questionService";

export default function AssemblePaperStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [saving, setSaving] = useState(false);
  const [approvedQuestions, setApprovedQuestions] = useState<QuestionListItem[]>([]);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);

  // Form State
  const [name, setName] = useState("JEE Standard Mock Challenge 01");
  const [code, setCode] = useState("JEE-2026-MOCK-A");
  const [examName, setExamName] = useState("JEE Main");
  const [duration, setDuration] = useState(180);
  const [maxMarks, setMaxMarks] = useState(360);
  const [instructions, setInstructions] = useState("Solve all multiple choice questions. Correct: +4, Incorrect: -1.");
  
  // Sections and Allocated Questions
  const [sections, setSections] = useState<any[]>([
    { name: "Physics Section A", marks: 4, negative_marks: -1, order: 0, questions: [] },
    { name: "Chemistry Section A", marks: 4, negative_marks: -1, order: 1, questions: [] }
  ]);

  // Quality score & verification states
  const [qualityScore, setQualityScore] = useState<QualityScoreReport>({
    difficulty_balance_score: 100,
    chapter_coverage_score: 100,
    topic_diversity_score: 100,
    exposure_risk_score: 0,
    overall_quality_score: 100
  });

  const [validationLogs, setValidationLogs] = useState<string[]>([]);

  // Load approved questions catalog
  useEffect(() => {
    async function load() {
      const data = await questionService.getQuestions();
      setApprovedQuestions(data.filter(q => q.status === "Approved"));
    }
    load();
  }, []);

  // Prepopulate if template selected
  useEffect(() => {
    if (templateId) {
      if (templateId.includes("upsc")) {
        setName("UPSC CSE Prelims Arena Series");
        setCode("UPSC-2026-GS-A");
        setExamName("UPSC CSE");
        setDuration(120);
        setMaxMarks(200);
        setSections([{ name: "General Studies Section A", marks: 2, negative_marks: -0.66, order: 0, questions: [] }]);
      } else if (templateId.includes("neet")) {
        setName("NEET Biology Complete Sprint");
        setCode("NEET-2026-BIO-A");
        setExamName("NEET UG");
        setDuration(180);
        setMaxMarks(720);
        setSections([
          { name: "Botany", marks: 4, negative_marks: -1, order: 0, questions: [] },
          { name: "Zoology", marks: 4, negative_marks: -1, order: 1, questions: [] }
        ]);
      }
    }
  }, [templateId]);

  // Calculate dynamic Quality Metrics whenever allocated questions mutate
  useEffect(() => {
    const allAllocated: any[] = [];
    sections.forEach(sec => {
      allAllocated.push(...sec.questions);
    });

    const report = qualityEngine.calculateScore(allAllocated);
    setQualityScore(report);

    // Audit logs validation warnings
    const logs: string[] = [];
    if (allAllocated.length === 0) {
      logs.push("Validation critical: Allocation requires questions.");
    }
    sections.forEach((sec, idx) => {
      if (sec.questions.length === 0) {
        logs.push(`Section "${sec.name}" is currently empty.`);
      }
    });

    // Check duplicate questions
    const questionIds = allAllocated.map(q => q.id);
    const uniqueIds = new Set(questionIds);
    if (uniqueIds.size < questionIds.length) {
      logs.push("Warning: Same question allocated multiple times across sections.");
    }

    setValidationLogs(logs);
  }, [sections]);

  const addSection = () => {
    setSections([...sections, {
      name: `New Section ${sections.length + 1}`,
      marks: 4,
      negative_marks: -1,
      order: sections.length,
      questions: []
    }]);
  };

  const removeSection = (idx: number) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  const removeQuestionFromSection = (secIdx: number, qIdx: number) => {
    setSections(prev => prev.map((sec, sI) => {
      if (sI === secIdx) {
        const newQs = sec.questions.filter((_: any, qI: number) => qI !== qIdx);
        return { ...sec, questions: newQs };
      }
      return sec;
    }));
  };

  const openPicker = (idx: number) => {
    setActiveSectionIdx(idx);
    setShowQuestionPicker(true);
  };

  const allocateQuestion = (q: QuestionListItem) => {
    setSections(prev => prev.map((sec, sI) => {
      if (sI === activeSectionIdx) {
        // Prevent duplicate allocation inside the same section
        if (sec.questions.some((x: any) => x.id === q.id)) return sec;
        return { ...sec, questions: [...sec.questions, q] };
      }
      return sec;
    }));
    setShowQuestionPicker(false);
  };

  const savePaperBlueprint = async (status = "Draft") => {
    setSaving(true);
    const success = await paperService.createPaper({
      name,
      code,
      exam_name: examName,
      duration,
      max_marks: maxMarks,
      instructions,
      status,
      sections,
      quality_score: qualityScore.overall_quality_score
    });
    setSaving(false);

    if (success) {
      alert(`Paper blueprint stored in status: ${status}`);
      router.push("/admin/papers");
    } else {
      alert("Database error. Verify uniqueness of Paper Code.");
    }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/papers"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight">
              Exam Assembly Studio
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Lock layouts, configure sections, and validates weightages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => savePaperBlueprint("Draft")}
            disabled={saving}
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            Save Blueprint Draft
          </button>
          <button
            onClick={() => savePaperBlueprint("Review")}
            disabled={saving || validationLogs.some(l => l.includes("critical"))}
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            Validate & Launch Review
          </button>
        </div>
      </div>

      {/* Workspace Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Sections List & Blueprint rules (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card/25 p-4 space-y-4 text-xs font-semibold">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block">
              Blueprint sections
            </span>

            <div className="space-y-2">
              {sections.map((sec, i) => (
                <div key={i} className="p-3 rounded-xl border border-border/80 bg-background/50 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-foreground block">{sec.name}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{sec.questions.length} allocated</span>
                  </div>
                  <button
                    onClick={() => removeSection(i)}
                    className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addSection}
              className="w-full h-8 border border-dashed border-border hover:border-primary hover:text-primary transition-all rounded-lg font-bold flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subsection Section
            </button>
          </div>
        </aside>

        {/* CENTER PANEL: Canvas Editor (6 cols) */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-border bg-card/15 p-6 md:p-8 space-y-6 min-h-[420px]">
            <h2 className="text-sm font-black text-foreground border-b border-border/20 pb-2">
              Paper Canvas Viewport
            </h2>

            {sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-3.5 p-5 border border-border/60 bg-background/25 rounded-2xl">
                <div className="flex justify-between items-center border-b border-border/20 pb-2 flex-wrap gap-2">
                  <span className="font-black text-xs text-foreground">{sec.name}</span>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
                    <span>Marks: +{sec.marks} / {sec.negative_marks}</span>
                    <button
                      onClick={() => openPicker(secIdx)}
                      className="px-2 py-1 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[9px] font-black rounded uppercase transition-all"
                    >
                      Allocate Question
                    </button>
                  </div>
                </div>

                {/* List allocated questions */}
                {sec.questions.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {sec.questions.map((q: QuestionListItem, qIdx: number) => (
                      <div key={q.id} className="p-3.5 rounded-xl border border-border/80 bg-background/50 flex justify-between items-center gap-4">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <span className="font-bold text-foreground block truncate">{q.title}</span>
                          <span className="text-[10px] text-muted-foreground block truncate">{q.statement}</span>
                        </div>
                        <button
                          onClick={() => removeQuestionFromSection(secIdx, qIdx)}
                          className="p-1 rounded text-destructive hover:bg-destructive/10 shrink-0 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground/60 italic text-[11px] border border-dashed border-border rounded-xl">
                    No questions allocated. Click "Allocate Question" above.
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT PANEL: Stats, Validation, Quality Score (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card/25 p-4 space-y-4 text-xs font-semibold">
            
            {/* Quality Score metrics */}
            <div className="space-y-3.5 pb-4 border-b border-border/20">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Paper Quality Score Card
              </span>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground/80">Overall score compliance:</span>
                <span className="text-base font-black text-emerald-400">
                  {qualityScore.overall_quality_score}%
                </span>
              </div>
              <div className="space-y-1.5 pt-2 font-bold leading-normal">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground/60">Difficulty Curve:</span>
                  <span className="text-foreground">{qualityScore.difficulty_balance_score}/100</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground/60">Coverage ratio:</span>
                  <span className="text-foreground">{qualityScore.chapter_coverage_score}/100</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground/60">Exposure Index:</span>
                  <span className="text-foreground">{qualityScore.exposure_risk_score}% Risk</span>
                </div>
              </div>
            </div>

            {/* Validation warning logs */}
            <div className="space-y-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Audit Warning Logs
              </span>
              {validationLogs.length > 0 ? (
                <div className="space-y-2">
                  {validationLogs.map((log, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-300 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-snug text-[10px]">{log}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  All configurations validated.
                </div>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* Dynamic Pop-up Picker list displaying Approved questions */}
      {showQuestionPicker && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full max-h-[480px] overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <h3 className="font-black text-sm text-foreground">Allocate Approved Questions</h3>
              <button
                onClick={() => setShowQuestionPicker(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {approvedQuestions.length > 0 ? (
                approvedQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => allocateQuestion(q)}
                    className="w-full p-3 rounded-xl border border-border bg-background/50 hover:bg-muted/40 transition-colors text-left space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground truncate block flex-1">{q.title}</span>
                      <span className="text-[8px] font-black uppercase text-muted-foreground/60">{q.difficulty}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate">{q.statement}</span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground/60 italic">
                  No approved questions found. Approve drafts first.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
