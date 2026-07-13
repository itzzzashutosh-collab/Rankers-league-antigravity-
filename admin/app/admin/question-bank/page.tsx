"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Search, Plus, Trash2, ArrowUpRight, Cpu, Layers, HelpCircle,
  CheckCircle, ShieldAlert, Sparkles, Database, Save, RotateCcw, AlertTriangle,
  FolderTree, BookMarked, Settings, Keyboard, Info, CheckSquare, Edit3
} from "lucide-react";
import { questionService, QuestionListItem } from "@/services/questionService";
import { validationEngine, ValidationLog } from "@/services/validationEngine";
import { duplicateDetector, SimilarityReport } from "@/services/duplicateDetector";

export default function QuestionBankWorkspace() {
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionListItem | null>(null);
  
  // Library Search and Subjects
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Editor states
  const [statement, setStatement] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<any>("Medium");
  const [marks, setMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(-1);
  const [options, setOptions] = useState<any[]>([]);
  const [detailedSolution, setDetailedSolution] = useState("");
  
  // Tab switcher states (Right panel)
  const [rightTab, setRightTab] = useState<"metadata" | "validation" | "history" | "ai">("metadata");

  // Telemetry indicators
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);
  const [duplicateReports, setDuplicateReports] = useState<SimilarityReport[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Load initial questions
  useEffect(() => {
    async function load() {
      const data = await questionService.getQuestions();
      setQuestions(data);
      if (data.length > 0) {
        selectQuestion(data[0]);
      }
    }
    load();
  }, []);

  const selectQuestion = (q: QuestionListItem) => {
    setSelectedQuestion(q);
    setTitle(q.title);
    setStatement(q.statement);
    setDifficulty(q.difficulty);
    setMarks(q.marks);
    setNegativeMarks(q.negative_marks);
    setOptions(q.options);
    setDetailedSolution(q.solution?.detailed_solution || "");
  };

  // Run Realtime Audits (Validation & Duplicates check)
  useEffect(() => {
    if (!statement) return;

    // 1. Validation check
    const logs = validationEngine.validate({
      title,
      statement,
      marks,
      negative_marks: negativeMarks,
      options
    });
    setValidationLogs(logs);

    // 2. Duplicate Check
    const otherQuestions = questions.filter(q => q.id !== selectedQuestion?.id);
    const reports = duplicateDetector.detect(statement, otherQuestions);
    setDuplicateReports(reports);

    // 3. AI Suggestions
    if (statement.length > 10) {
      setAiSuggestions([
        `Suggested Tags: [${selectedSubject}, JEE, Class-12]`,
        `Difficulty check: Statement complexity points to "${difficulty}" difficulty.`,
        "Optimization: Adding a chemical diagram attachment increases accuracy rates."
      ]);
    } else {
      setAiSuggestions(["Start typing to generate AI metadata copilot tags..."]);
    }
  }, [statement, options, marks, negativeMarks, title]);

  const handleOptionChange = (idx: number, field: string, val: any) => {
    setOptions(prev => prev.map((o, i) => i === idx ? { ...o, [field]: val } : o));
  };

  const saveChanges = async () => {
    if (!selectedQuestion) return;
    const success = await questionService.updateQuestion(selectedQuestion.id, {
      ...selectedQuestion,
      title,
      statement,
      difficulty,
      marks,
      negative_marks: negativeMarks,
      options
    });
    if (success) {
      setQuestions(prev => prev.map(q => q.id === selectedQuestion.id ? { 
        ...q, title, statement, difficulty, marks, negative_marks: negativeMarks, options 
      } : q));
      alert("Workspace changes saved to question registry database.");
    }
  };

  const deleteQuestion = async () => {
    if (!selectedQuestion) return;
    const success = await questionService.deleteQuestion(selectedQuestion.id);
    if (success) {
      setQuestions(prev => prev.filter(q => q.id !== selectedQuestion.id));
      alert("Question soft-deleted and moved to trash folder.");
      if (questions.length > 1) {
        selectQuestion(questions[0]);
      } else {
        setSelectedQuestion(null);
      }
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          q.statement.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === "All" || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Upper header action controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-primary" />
            Knowledge Management Workspace
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            IDE question editor, formula renderer, syntax validator, and translation controls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/question-bank/import"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Bulk Import CSV/JSON
          </Link>
          <Link
            href="/admin/question-bank/review"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Review Queue
          </Link>
          <Link
            href="/admin/question-bank/duplicates"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Duplication Center
          </Link>
          <Link
            href="/admin/question-bank/trash"
            className="h-9 px-3 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive font-bold transition-all"
            title="Recycle bin trash"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main 3 Panels Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL 1: LEFT SIDEBAR - Question Library Tree (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card/25 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <FolderTree className="w-3.5 h-3.5" />
                Library Catalog
              </span>
            </div>

            {/* Search */}
            <div className="relative flex items-center text-xs">
              <Search className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
              <input
                type="text"
                placeholder="Search statement text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-background/50 placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>

            {/* Subject Selector tab pills */}
            <div className="flex flex-wrap gap-1.5 border-b border-border/20 pb-3">
              {["All", "Physics", "Chemistry", "Biology"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedSubject === sub 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Questions list selection tree */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto text-xs pr-1">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => selectQuestion(q)}
                    className={`w-full p-2.5 rounded-lg border text-left space-y-1 transition-all ${
                      isSelected 
                        ? "border-primary/50 bg-primary/5" 
                        : "border-border/60 hover:bg-card/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground/90 truncate block flex-1">{q.title}</span>
                      <span className="text-[8px] font-black uppercase text-muted-foreground/60">{q.difficulty}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate">{q.statement}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PANEL 2: CENTER - Text LaTeX Equation Editor (6 cols) */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-border bg-card/15 p-6 md:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">
                  Interactive IDE Text Editor
                </span>
                <h3 className="font-black text-sm text-foreground">
                  {title || "New Question Statement"}
                </h3>
              </div>

              {/* Editor action keys */}
              <div className="flex items-center gap-2">
                <button
                  onClick={saveChanges}
                  className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-primary-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>
                <button
                  onClick={deleteQuestion}
                  className="p-2 rounded-lg border border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors"
                  title="Move to Trash bin"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Question Statement rich markdown area */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-muted-foreground block">LaTeX Math Question Statement</label>
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={5}
                placeholder="Write question here. Use $ for math equations e.g. $F = q_1q_2/r^2$..."
                className="w-full p-3 rounded-xl border border-border bg-background/50 focus:outline-none font-mono text-[11px] leading-relaxed"
              />
            </div>

            {/* Mixed content Option Editor */}
            <div className="space-y-3">
              <label className="font-bold text-muted-foreground text-xs block">Options Choices Matrix</label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-background/20 p-2 border border-border/60 rounded-xl">
                    <span className="w-6 h-6 rounded-lg bg-muted/40 border border-border/80 flex items-center justify-center font-bold text-[10px] text-foreground font-mono">
                      {opt.option_index}
                    </span>
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) => handleOptionChange(idx, "content", e.target.value)}
                      className="flex-1 h-8 px-2 text-xs border-none bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground/60"
                      placeholder={`Option ${opt.option_index} details...`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Mark current correct, uncheck others for single choice logic
                        setOptions(prev => prev.map((o, i) => ({
                          ...o,
                          is_correct: i === idx ? !o.is_correct : false
                        })));
                      }}
                      className={`h-7 px-2.5 rounded-lg border text-[9px] font-black uppercase transition-all ${
                        opt.is_correct 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "border-border/80 hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {opt.is_correct ? "Correct" : "Incorrect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed solutions editor */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-muted-foreground block">Detailed Solved Explanation</label>
              <textarea
                value={detailedSolution}
                onChange={(e) => setDetailedSolution(e.target.value)}
                rows={3}
                placeholder="LaTeX solutions and shortcuts formulas summary..."
                className="w-full p-3 rounded-xl border border-border bg-background/50 focus:outline-none text-[11px]"
              />
            </div>
          </div>
        </section>

        {/* PANEL 3: RIGHT PANEL - Metadata, Validation, AI suggest, History (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card/25 p-4 space-y-4">
            
            {/* Tab selection links */}
            <div className="flex border-b border-border/20 text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-3">
              {[
                { key: "metadata", label: "Meta" },
                { key: "validation", label: "Audits" },
                { key: "ai", label: "AI suggestion" },
                { key: "history", label: "History" }
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setRightTab(t.key as any)}
                  className={`flex-1 pb-2 border-b-2 text-center transition-all ${
                    rightTab === t.key 
                      ? "border-primary text-foreground" 
                      : "border-transparent hover:text-foreground/80"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1 Content: Metadata inputs */}
            {rightTab === "metadata" && (
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Marks Weightage</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background/40 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Negative Marks Weightage</label>
                  <input
                    type="number"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background/40 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Difficulty Rating</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background/40 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Grandmaster">Grandmaster</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab 2 Content: Validation & Duplications Audits */}
            {rightTab === "validation" && (
              <div className="space-y-4 text-xs font-semibold">
                
                {/* Syntax check warnings */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Syntax Warnings</span>
                  {validationLogs.length > 0 ? (
                    validationLogs.map((log, i) => (
                      <div key={i} className={`p-2 rounded-lg border flex items-start gap-1.5 ${
                        log.severity === "Critical" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-amber-500/20 bg-amber-500/5 text-amber-300"
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="leading-snug text-[10px]">{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-muted-foreground/60 italic">No syntax errors flagged.</div>
                  )}
                </div>

                {/* Match duplications */}
                <div className="space-y-1.5 pt-2 border-t border-border/20">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Similarity Warns</span>
                  {duplicateReports.length > 0 ? (
                    duplicateReports.map((rep, i) => (
                      <div key={i} className="p-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black bg-amber-500/10 px-1 py-0.5 rounded text-amber-400">
                            {rep.score}% Similar
                          </span>
                        </div>
                        <p className="text-[9px] text-muted-foreground truncate leading-normal">
                          Matches: {rep.matchedText}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-muted-foreground/60 italic">No duplicates detected in dataset.</div>
                  )}
                </div>

              </div>
            )}

            {/* Tab 3 Content: AI suggestion tag picker */}
            {rightTab === "ai" && (
              <div className="space-y-2 text-xs font-semibold">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">AI Metadata Hints</span>
                {aiSuggestions.map((sug, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-primary flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="leading-normal text-[10px] text-foreground/90">{sug}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4 Content: Version Snaps history list */}
            {rightTab === "history" && (
              <div className="space-y-3.5 text-xs font-semibold">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Audit Version Logs</span>
                <div className="space-y-2.5">
                  {[
                    { version: `v${selectedQuestion?.version || 1}`, action: "Initial release", time: "Just now", admin: "Ashutosh Admin" }
                  ].map((ver, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-foreground text-[11px]">{ver.version} - {ver.action}</span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">by @{ver.admin} • {ver.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </div>
  );
}
