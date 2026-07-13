"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Database, UploadCloud, Info, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { questionService } from "@/services/questionService";

export default function BulkImportWizard() {
  const router = useRouter();
  
  const [jsonText, setJsonText] = useState(`[
  {
    "title": "Coulombs Formula Check",
    "statement": "Identify Coulombs attraction force direction between positive protons",
    "difficulty": "Easy",
    "marks": 4,
    "negative_marks": -1,
    "options": [
      {"option_index": "A", "content": "Opposite direction (repulsive)", "is_correct": true},
      {"option_index": "B", "content": "Same direction (attractive)", "is_correct": false}
    ]
  }
]`);

  const [parsedRecords, setParsedRecords] = useState<any[]>([]);
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const parseData = () => {
    try {
      const records = JSON.parse(jsonText);
      if (!Array.isArray(records)) {
        alert("Root JSON must be an array of questions.");
        return;
      }
      setParsedRecords(records);
      setValidationLogs([]);
      alert("JSON records parsed successfully. Review spreadsheet below.");
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  const validateRecords = () => {
    const logs: string[] = [];
    parsedRecords.forEach((rec, idx) => {
      if (!rec.title) logs.push(`Row ${idx + 1}: Missing title field.`);
      if (!rec.statement) logs.push(`Row ${idx + 1}: Missing statement.`);
      if (!rec.options || rec.options.length < 2) {
        logs.push(`Row ${idx + 1}: Requires at least 2 options.`);
      }
      const correct = rec.options?.filter((o: any) => o.is_correct).length || 0;
      if (correct === 0) logs.push(`Row ${idx + 1}: Missing correct answer selection.`);
    });

    if (logs.length === 0) {
      setValidationLogs(["All records verified. Ready to commit."]);
    } else {
      setValidationLogs(logs);
    }
  };

  const handleImport = async () => {
    if (parsedRecords.length === 0) {
      alert("Parse JSON records first.");
      return;
    }

    setImporting(true);
    let successCount = 0;
    for (const rec of parsedRecords) {
      const success = await questionService.createQuestion({
        title: rec.title,
        statement: rec.statement,
        difficulty: rec.difficulty || "Medium",
        marks: rec.marks || 4,
        negative_marks: rec.negative_marks || -1,
        estimated_time: 120,
        options: rec.options,
        solution_text: rec.solution || "Detail solution summary.",
        tags: [rec.difficulty || "Medium"]
      });
      if (success) successCount++;
    }
    setImporting(false);

    alert(`Successfully imported ${successCount} questions into database bank!`);
    router.push("/admin/question-bank");
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/question-bank"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Bulk Import Wizard
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Upload spreadsheet CSV sheets or paste formatted JSON records arrays.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={parseData}
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground transition-colors"
          >
            Parse JSON
          </button>
          <button
            onClick={validateRecords}
            disabled={parsedRecords.length === 0}
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground transition-colors disabled:opacity-40"
          >
            Run Valider
          </button>
          <button
            onClick={handleImport}
            disabled={importing || parsedRecords.length === 0}
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-bold transition-colors disabled:opacity-40"
          >
            Save to Database
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Paste block */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              JSON Array Paste Block
            </h3>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-2xl border border-border bg-background/50 focus:outline-none font-mono text-[11px] leading-relaxed"
            />
          </div>
        </div>

        {/* Validation result details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Import Auditor Results
            </h3>

            <div className="space-y-2 text-xs font-semibold">
              {validationLogs.length > 0 ? (
                validationLogs.map((log, i) => (
                  <div key={i} className={`p-3 rounded-xl border flex items-start gap-2 ${
                    log.includes("verified") ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-destructive/20 bg-destructive/5 text-destructive"
                  }`}>
                    {log.includes("verified") ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{log}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground/60 italic p-4 text-center border border-dashed border-border rounded-xl">
                  Run validation tests to review record warnings.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
