'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ChapterStats {
  subject_name: string;
  chapter_name: string;
  total_concepts: number;
  concepts_with_templates: number;
  total_templates: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  pro_count: number;
  legend_count: number;
  coverage_percent: number;
}

export default function ExamDetailPage({ params }: { params: { examId: string } }) {
  const examName = decodeURIComponent(params.examId);
  const [chapters, setChapters] = useState<ChapterStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/concept-bank/coverage?exam=${encodeURIComponent(examName)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setChapters(res.chapter_detail || []);
        }
      })
      .finally(() => setLoading(false));
  }, [examName]);

  // Group chapters by subject
  const subjectsMap: Record<string, ChapterStats[]> = {};
  for (const c of chapters) {
    if (!subjectsMap[c.subject_name]) {
      subjectsMap[c.subject_name] = [];
    }
    subjectsMap[c.subject_name].push(c);
  }

  return (
    <>
      <style>{`
        .exam-detail-wrap {
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
        
        .exam-header {
          margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 24px;
        }
        .exam-title {
          font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .exam-sub { color: #64748b; margin-top: 4px; font-size: 0.95rem; }

        .subject-section { margin-bottom: 48px; }
        .subject-title {
          font-size: 1.3rem; font-weight: 700; color: #f1f5f9; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .subject-title::before {
          content: ''; display: inline-block; width: 4px; height: 16px; background: #6366f1; border-radius: 4px;
        }

        .chapter-table-wrap {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; overflow: hidden;
        }
        .chapter-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
        .chapter-table th {
          background: rgba(255,255,255,0.03); padding: 14px 20px; font-weight: 600; color: #94a3b8;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .chapter-table td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .chapter-name { font-weight: 600; color: #e2e8f0; text-decoration: none; }
        .chapter-name:hover { color: #818cf8; }

        .badge {
          display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 600;
        }
        .badge-easy { background: rgba(34,197,94,0.15); color: #4ade80; }
        .badge-medium { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .badge-hard { background: rgba(239,68,68,0.15); color: #f87171; }
        .badge-pro { background: rgba(139,92,246,0.15); color: #c084fc; }
        .badge-legend { background: rgba(236,72,153,0.15); color: #f472b6; }

        .diff-cells { display: flex; gap: 6px; }
        .diff-cell {
          flex: 1; text-align: center; border-radius: 6px; padding: 4px; font-weight: 700; font-size: 0.75rem;
          min-width: 40px;
        }

        .loader-wrap {
          display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh;
        }
        .spinner {
          width: 40px; height: 40px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="exam-detail-wrap">
        <div className="breadcrumb">
          <Link href="/concept-bank">Concept Template Bank</Link>
          <span>/</span>
          <span>{examName}</span>
        </div>

        {loading ? (
          <div className="loader-wrap">
            <div className="spinner" />
            <p style={{ marginTop: 16, color: '#64748b' }}>Analyzing blueprint and coverage metrics…</p>
          </div>
        ) : (
          <>
            <header className="exam-header">
              <h1 className="exam-title">{examName}</h1>
              <p className="exam-sub">Syllabus breakdown, concept coverage, and difficulty matrix</p>
            </header>

            {Object.entries(subjectsMap).map(([subject, chps]) => (
              <section key={subject} className="subject-section">
                <h2 className="subject-title">{subject}</h2>
                <div className="chapter-table-wrap">
                  <table className="chapter-table">
                    <thead>
                      <tr>
                        <th>Chapter</th>
                        <th>Concepts</th>
                        <th>Templates</th>
                        <th>Coverage</th>
                        <th>Difficulty Breakdown</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chps.map((c) => (
                        <tr key={c.chapter_name}>
                          <td>
                            <Link
                              href={`/concept-bank/${encodeURIComponent(examName)}/${encodeURIComponent(c.subject_name)}/${encodeURIComponent(c.chapter_name)}`}
                              className="chapter-name"
                            >
                              {c.chapter_name}
                            </Link>
                          </td>
                          <td>{c.total_concepts}</td>
                          <td>{c.total_templates}</td>
                          <td>
                            <span style={{ color: c.coverage_percent >= 80 ? '#4ade80' : '#fbbf24', fontWeight: 700 }}>
                              {c.coverage_percent.toFixed(0)}%
                            </span>
                          </td>
                          <td>
                            <div className="diff-cells">
                              <span className="badge badge-easy" title="Easy">
                                E: {c.easy_count}
                              </span>
                              <span className="badge badge-medium" title="Medium">
                                M: {c.medium_count}
                              </span>
                              <span className="badge badge-hard" title="Hard">
                                H: {c.hard_count}
                              </span>
                              <span className="badge badge-pro" title="Pro">
                                P: {c.pro_count}
                              </span>
                              <span className="badge badge-legend" title="Legend">
                                L: {c.legend_count}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </>
  );
}
