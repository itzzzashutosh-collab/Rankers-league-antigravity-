'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, Trash, Check, AlertTriangle, HelpCircle } from 'lucide-react';

interface Template {
  template_id: string;
  concept_id: string;
  concept_name: string;
  template_type: string;
  difficulty_level: string;
  difficulty_number: number;
  stem_template: string;
  formula_latex: string;
  variables: any[];
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  status: string;
}

export default function ConceptTemplatesEditor({
  params,
}: {
  params: { examId: string; subjectId: string; chapterId: string };
}) {
  const examName = decodeURIComponent(params.examId);
  const subjectName = decodeURIComponent(params.subjectId);
  const chapterName = decodeURIComponent(params.chapterId);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  // Form State
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [validationResult, setValidationResult] = useState<{ success: boolean; valid?: boolean; error?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `/api/concept-bank/templates?exam=${encodeURIComponent(examName)}&subject=${encodeURIComponent(
        subjectName
      )}&chapter=${encodeURIComponent(chapterName)}`
    )
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setTemplates(res.data || []);
          if (res.data && res.data.length > 0) {
            setActiveConcept(res.data[0].concept_id);
          }
        }
      })
      .catch((err) => console.error('Error fetching templates:', err))
      .finally(() => setLoading(false));
  }, [examName, subjectName, chapterName]);

  // Group templates by concept
  const conceptsMap: Record<string, { name: string; templates: Template[] }> = {};
  for (const t of templates) {
    if (!conceptsMap[t.concept_id]) {
      conceptsMap[t.concept_id] = { name: t.concept_name, templates: [] };
    }
    conceptsMap[t.concept_id].templates.push(t);
  }

  // Set active editing template when active concept changes
  useEffect(() => {
    if (activeConcept && conceptsMap[activeConcept]) {
      setEditingTemplate(conceptsMap[activeConcept].templates[0] || null);
      setValidationResult(null);
    }
  }, [activeConcept]);

  const handleValidate = async () => {
    if (!editingTemplate) return;
    try {
      const res = await fetch('/api/concept-bank/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stem_template: editingTemplate.stem_template,
          variables: editingTemplate.variables,
        }),
      });
      const result = await res.json();
      setValidationResult(result);
    } catch (err: any) {
      setValidationResult({ success: false, error: err.message });
    }
  };

  const handleSave = async () => {
    if (!editingTemplate) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/concept-bank/templates/${editingTemplate.template_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate),
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('Success');
        // Update local template array
        setTemplates((prev) =>
          prev.map((t) => (t.template_id === editingTemplate.template_id ? editingTemplate : t))
        );
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus(`Error: ${result.error}`);
      }
    } catch (err: any) {
      setSaveStatus(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Template, value: any) => {
    if (!editingTemplate) return;
    setEditingTemplate((prev) => (prev ? { ...prev, [field]: value } : null));
    setValidationResult(null);
  };

  const updateVariable = (index: number, key: string, value: any) => {
    if (!editingTemplate || !editingTemplate.variables) return;
    const newVars = [...editingTemplate.variables];
    newVars[index] = { ...newVars[index], [key]: value };
    updateField('variables', newVars);
  };

  const addVariable = () => {
    if (!editingTemplate) return;
    const currentVars = editingTemplate.variables || [];
    const newVar = { symbol: 'x', meaning: 'New Variable', unit: 'SI', range: '1-10', latex: 'x' };
    updateField('variables', [...currentVars, newVar]);
  };

  const removeVariable = (index: number) => {
    if (!editingTemplate || !editingTemplate.variables) return;
    const newVars = editingTemplate.variables.filter((_, i) => i !== index);
    updateField('variables', newVars);
  };

  const DIFFICULTY_COLORS: Record<string, string> = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444',
    pro: '#8b5cf6',
    legend: '#ec4899',
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        <Link href="/admin/concept-templates" className="hover:text-foreground">
          Template Bank
        </Link>
        <span>/</span>
        <Link href={`/admin/concept-templates/${encodeURIComponent(examName)}`} className="hover:text-foreground">
          {examName}
        </Link>
        <span>/</span>
        <span className="text-foreground">{chapterName}</span>
      </div>

      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">{chapterName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{subjectName}</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-semibold">Configuring Blueprint Editor...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Concepts */}
          <aside className="bg-card border border-border/40 rounded-2xl p-4 space-y-4 self-start">
            <div className="text-xs text-muted-foreground font-bold tracking-wider uppercase">Concepts list</div>
            <div className="flex flex-col gap-1.5">
              {Object.entries(conceptsMap).map(([id, concept]) => (
                <button
                  key={id}
                  onClick={() => setActiveConcept(id)}
                  className={`text-left text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${activeConcept === id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  {concept.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Editor Workspace */}
          <main className="lg:col-span-3 space-y-6">
            {activeConcept && conceptsMap[activeConcept] && (
              <div className="space-y-6">
                {/* Concept Heading & Levels Selector */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border/40 p-6 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">{conceptsMap[activeConcept].name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Edit template blueprints per difficulty level.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {conceptsMap[activeConcept].templates
                      .sort((a, b) => a.difficulty_number - b.difficulty_number)
                      .map((t) => (
                        <button
                          key={t.template_id}
                          onClick={() => setEditingTemplate(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${editingTemplate?.template_id === t.template_id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted/40 hover:bg-muted text-muted-foreground'}`}
                        >
                          L{t.difficulty_number}: {t.difficulty_level}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Main Blueprint Form */}
                {editingTemplate && (
                  <div className="bg-card border border-border/40 rounded-2xl p-8 space-y-6 shadow-sm">
                    {/* Level Meta info */}
                    <div className="flex justify-between items-center border-b border-border/40 pb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                          style={{
                            color: DIFFICULTY_COLORS[editingTemplate.difficulty_level],
                            borderColor: DIFFICULTY_COLORS[editingTemplate.difficulty_level],
                            background: `${DIFFICULTY_COLORS[editingTemplate.difficulty_level]}10`,
                          }}
                        >
                          Level {editingTemplate.difficulty_number} {editingTemplate.difficulty_level}
                        </span>
                        <span className="text-xs text-muted-foreground">ID: {editingTemplate.template_id}</span>
                      </div>

                      {/* Template Status */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status:</label>
                        <select
                          value={editingTemplate.status}
                          onChange={(e) => updateField('status', e.target.value)}
                          className="bg-background border border-border text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="stub">Stub</option>
                          <option value="draft">Draft</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>
                    </div>

                    {/* Template Type & Formula */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Template Type</label>
                        <select
                          value={editingTemplate.template_type}
                          onChange={(e) => updateField('template_type', e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="direct_substitution">Direct Substitution</option>
                          <option value="formula_rearrangement">Formula Rearrangement</option>
                          <option value="logical_trap">Logical Trap</option>
                          <option value="multi_concept">Multi Concept</option>
                          <option value="reverse_thinking">Reverse Thinking</option>
                          <option value="hyper_local_daily_life">Hyper Local Daily Life</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">LaTeX Formula</label>
                        <input
                          type="text"
                          value={editingTemplate.formula_latex || ''}
                          onChange={(e) => updateField('formula_latex', e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                          placeholder="e.g. E = mc^2"
                        />
                      </div>
                    </div>

                    {/* Question Stem Text Area */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Question Stem Template</label>
                        <button
                          onClick={handleValidate}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Validate Parameters
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={editingTemplate.stem_template}
                        onChange={(e) => updateField('stem_template', e.target.value)}
                        className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="Use variable parameters in curly braces, e.g.: A smartphone of mass {m} kg slides off a table of height {h} m..."
                      />

                      {/* Real-time Validation Message */}
                      {validationResult && (
                        <div
                          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${validationResult.valid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}
                        >
                          {validationResult.valid ? (
                            <>
                              <Check className="w-4 h-4" /> Parameter validation passed successfully!
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4" /> {validationResult.error}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Variables Blueprint table */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Variables Mapping Blueprint</label>
                        <button
                          onClick={addVariable}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Variable
                        </button>
                      </div>

                      <div className="border border-border/40 rounded-xl overflow-hidden">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                              <th className="p-3">Symbol</th>
                              <th className="p-3">Meaning / Label</th>
                              <th className="p-3">Unit</th>
                              <th className="p-3">Range</th>
                              <th className="p-3">LaTeX</th>
                              <th className="p-3 text-right">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(editingTemplate.variables || []).map((v, i) => (
                              <tr key={i} className="border-b border-border/40">
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={v.symbol}
                                    onChange={(e) => updateVariable(i, 'symbol', e.target.value)}
                                    className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-center font-bold"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={v.meaning}
                                    onChange={(e) => updateVariable(i, 'meaning', e.target.value)}
                                    className="w-full bg-background border border-border rounded px-1.5 py-0.5"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={v.unit}
                                    onChange={(e) => updateVariable(i, 'unit', e.target.value)}
                                    className="w-16 bg-background border border-border rounded px-1.5 py-0.5 text-center"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={v.range}
                                    onChange={(e) => updateVariable(i, 'range', e.target.value)}
                                    className="w-20 bg-background border border-border rounded px-1.5 py-0.5 text-center"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={v.latex}
                                    onChange={(e) => updateVariable(i, 'latex', e.target.value)}
                                    className="w-16 bg-background border border-border rounded px-1.5 py-0.5 font-mono text-center"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <button
                                    onClick={() => removeVariable(i)}
                                    className="p-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 cursor-pointer"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Legacy Options Mapping (for backward compatibility / preview data) */}
                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Legacy Sample Options (MCQ)</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold">Option A</label>
                          <input
                            type="text"
                            value={editingTemplate.option_a || ''}
                            onChange={(e) => updateField('option_a', e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold">Option B</label>
                          <input
                            type="text"
                            value={editingTemplate.option_b || ''}
                            onChange={(e) => updateField('option_b', e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold">Option C</label>
                          <input
                            type="text"
                            value={editingTemplate.option_c || ''}
                            onChange={(e) => updateField('option_c', e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold">Option D</label>
                          <input
                            type="text"
                            value={editingTemplate.option_d || ''}
                            onChange={(e) => updateField('option_d', e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold">Correct Option</label>
                          <select
                            value={editingTemplate.correct_answer || ''}
                            onChange={(e) => updateField('correct_answer', e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="">Select answer</option>
                            <option value="Option A">Option A</option>
                            <option value="Option B">Option B</option>
                            <option value="Option C">Option C</option>
                            <option value="Option D">Option D</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold">Pedagogical Explanation</label>
                          <input
                            type="text"
                            value={editingTemplate.explanation || ''}
                            onChange={(e) => updateField('explanation', e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions and Save status */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-primary-foreground font-semibold text-xs px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Blueprint'}
                      </button>

                      {saveStatus && (
                        <span
                          className={`text-xs font-semibold ${saveStatus.includes('Error') ? 'text-rose-500' : 'text-emerald-500'}`}
                        >
                          {saveStatus}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
