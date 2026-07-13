'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
}

export default function ChapterConceptsPage({
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

  const DIFFICULTY_COLORS: Record<string, string> = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444',
    pro: '#8b5cf6',
    legend: '#ec4899',
  };

  return (
    <>
      <style>{`
        .chapter-detail-wrap {
          min-height: 100vh;
          background: #0a0a0f;
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
          padding: 40px 24px 80px;
        }
        .breadcrumb {
          display: flex; gap: 8px; font-size: 0.85rem; color: #64748b; margin-bottom: 24px;
        }
        .breadcrumb a { color: #818cf8; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }

        .chapter-header {
          margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 24px;
        }
        .chapter-title {
          font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .chapter-sub { color: #64748b; margin-top: 4px; font-size: 0.95rem; }

        .layout-grid { display: grid; grid-template-columns: 280px 1fr; gap: 32px; }
        
        .sidebar {
          background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 16px; align-self: start;
        }
        .sidebar-title { font-size: 0.78rem; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 700; }
        .sidebar-list { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-item {
          text-align: left; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem;
          color: #94a3b8; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          background: transparent; outline: none;
        }
        .sidebar-item:hover { background: rgba(255,255,255,0.03); color: #f1f5f9; }
        .sidebar-item.active {
          background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.2); color: #a5b4fc; font-weight: 600;
        }

        .content-area { display: flex; flex-direction: column; gap: 24px; }
        .concept-title { font-size: 1.5rem; font-weight: 800; color: #f1f5f9; margin-bottom: 8px; }

        .template-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 24px; position: relative;
        }
        .template-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .difficulty-badge {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
          padding: 3px 10px; border-radius: 999px;
        }
        .template-type { font-size: 0.82rem; color: #64748b; font-family: monospace; }
        
        .stem-box {
          background: rgba(0,0,0,0.2); border-left: 3px solid #6366f1;
          padding: 16px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; margin-bottom: 16px;
        }
        
        .latex-formula { font-size: 1rem; color: #a5b4fc; margin-bottom: 16px; font-family: monospace; }

        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .option-item {
          background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px; padding: 12px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;
        }
        .option-item.correct { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); color: #4ade80; }

        .explanation-box {
          background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px; padding: 16px; font-size: 0.85rem; color: #94a3b8; line-height: 1.6;
        }

        .loader-wrap {
          display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh;
        }
        .spinner {
          width: 40px; height: 40px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .layout-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="chapter-detail-wrap">
        <div className="breadcrumb">
          <Link href="/concept-bank">Concept Template Bank</Link>
          <span>/</span>
          <Link href={`/concept-bank/${encodeURIComponent(examName)}`}>{examName}</Link>
          <span>/</span>
          <span>{chapterName}</span>
        </div>

        {loading ? (
          <div className="loader-wrap">
            <div className="spinner" />
            <p style={{ marginTop: 16, color: '#64748b' }}>Loading chapter blueprint maps…</p>
          </div>
        ) : (
          <>
            <header className="chapter-header">
              <h1 className="chapter-title">{chapterName}</h1>
              <p className="chapter-sub">
                {subjectName} — {Object.keys(conceptsMap).length} concepts mapped
              </p>
            </header>

            <div className="layout-grid">
              {/* Sidebar */}
              <aside className="sidebar">
                <div className="sidebar-title">Concepts</div>
                <div className="sidebar-list">
                  {Object.entries(conceptsMap).map(([id, concept]) => (
                    <button
                      key={id}
                      className={`sidebar-item ${activeConcept === id ? 'active' : ''}`}
                      onClick={() => setActiveConcept(id)}
                    >
                      {concept.name}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Content Area */}
              <main className="content-area">
                {activeConcept && conceptsMap[activeConcept] && (
                  <>
                    <h2 className="concept-title">{conceptsMap[activeConcept].name}</h2>
                    {conceptsMap[activeConcept].templates
                      .sort((a, b) => a.difficulty_number - b.difficulty_number)
                      .map((t) => (
                        <div key={t.template_id} className="template-card">
                          <div className="template-header">
                            <span className="template-type">Blueprint: {t.template_type}</span>
                            <span
                              className="difficulty-badge"
                              style={{
                                color: DIFFICULTY_COLORS[t.difficulty_level],
                                border: `1px solid ${DIFFICULTY_COLORS[t.difficulty_level]}`,
                                background: `${DIFFICULTY_COLORS[t.difficulty_level]}10`,
                              }}
                            >
                              Level {t.difficulty_number}: {t.difficulty_level}
                            </span>
                          </div>

                          {t.formula_latex && (
                            <div className="latex-formula">
                              Formula: <code>{t.formula_latex}</code>
                            </div>
                          )}

                          <div className="stem-box">{t.stem_template}</div>

                          {t.option_a && (
                            <div className="options-grid">
                              <div className={`option-item ${t.correct_answer === 'Option A' ? 'correct' : ''}`}>
                                <strong>A.</strong> {t.option_a}
                              </div>
                              <div className={`option-item ${t.correct_answer === 'Option B' ? 'correct' : ''}`}>
                                <strong>B.</strong> {t.option_b}
                              </div>
                              <div className={`option-item ${t.correct_answer === 'Option C' ? 'correct' : ''}`}>
                                <strong>C.</strong> {t.option_c}
                              </div>
                              <div className={`option-item ${t.correct_answer === 'Option D' ? 'correct' : ''}`}>
                                <strong>D.</strong> {t.option_d}
                              </div>
                            </div>
                          )}

                          {t.explanation && (
                            <div className="explanation-box">
                              <strong>Pedagogical Explanation:</strong>
                              <p style={{ marginTop: 6 }}>{t.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </>
                )}
              </main>
            </div>
          </>
        )}
      </div>
    </>
  );
}
