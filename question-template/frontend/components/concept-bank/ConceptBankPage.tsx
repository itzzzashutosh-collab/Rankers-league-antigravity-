'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExamSummary {
  exam_name: string;
  total_concepts: number;
  concepts_with_templates: number;
  total_templates: number;
  coverage_percent: number;
  by_difficulty: { easy: number; medium: number; hard: number; pro: number; legend: number };
}

// ─── Exam Category Config ────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { icon: string; color: string; gradient: string }> = {
  Engineering:     { icon: '⚙️', color: '#6366f1', gradient: 'from-indigo-500 to-violet-600' },
  Medical:         { icon: '🧬', color: '#ec4899', gradient: 'from-pink-500 to-rose-600' },
  Law:             { icon: '⚖️', color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  'Government/Defence': { icon: '🛡️', color: '#10b981', gradient: 'from-emerald-500 to-teal-600' },
  Banking:         { icon: '🏦', color: '#3b82f6', gradient: 'from-blue-500 to-cyan-600' },
  Management:      { icon: '📊', color: '#8b5cf6', gradient: 'from-purple-500 to-fuchsia-600' },
  Foreign:         { icon: '🌍', color: '#14b8a6', gradient: 'from-teal-500 to-green-600' },
  General:         { icon: '🎓', color: '#f97316', gradient: 'from-orange-500 to-red-600' },
  Design:          { icon: '🎨', color: '#e11d48', gradient: 'from-rose-500 to-pink-600' },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   '#22c55e',
  medium: '#f59e0b',
  hard:   '#ef4444',
  pro:    '#8b5cf6',
  legend: '#ec4899',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── Coverage Bar ─────────────────────────────────────────────────────────────
function CoverageBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="coverage-bar-wrap">
      <div className="coverage-bar-track">
        <div className="coverage-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="coverage-pct" style={{ color }}>{pct.toFixed(0)}%</span>
    </div>
  );
}

// ─── Exam Card ────────────────────────────────────────────────────────────────
function ExamCard({ exam, catMeta }: { exam: ExamSummary; catMeta: typeof CATEGORY_META[string] }) {
  return (
    <Link href={`/concept-bank/${encodeURIComponent(exam.exam_name)}`} className="exam-card-link">
      <div className="exam-card">
        <div className={`exam-card-header bg-gradient-to-br ${catMeta?.gradient || 'from-slate-600 to-slate-800'}`}>
          <span className="exam-icon">{catMeta?.icon || '📚'}</span>
          <h3 className="exam-name">{exam.exam_name}</h3>
        </div>
        <div className="exam-card-body">
          <div className="exam-stats-row">
            <span>{exam.total_concepts.toLocaleString()} concepts</span>
            <span>{exam.total_templates.toLocaleString()} templates</span>
          </div>
          <CoverageBar pct={exam.coverage_percent} />
          <div className="difficulty-dots">
            {Object.entries(exam.by_difficulty).map(([lvl, cnt]) => (
              <div key={lvl} className="diff-dot-wrap" title={`${lvl}: ${cnt}`}>
                <div className="diff-dot" style={{ background: DIFFICULTY_COLORS[lvl] }} />
                <span className="diff-dot-label">{cnt > 999 ? `${(cnt/1000).toFixed(1)}k` : cnt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ConceptBankPage() {
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [totals, setTotals] = useState({ exams: 0, concepts: 0, templates: 0 });

  // Fetch coverage data
  useEffect(() => {
    fetch('/api/concept-bank/coverage')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setExams(res.exam_summary || []);
          const t = (res.exam_summary || []).reduce(
            (acc: typeof totals, e: ExamSummary) => ({
              exams: acc.exams + 1,
              concepts: acc.concepts + e.total_concepts,
              templates: acc.templates + e.total_templates,
            }),
            { exams: 0, concepts: 0, templates: 0 }
          );
          setTotals(t);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter exams
  const filtered = exams.filter((e) => {
    const matchSearch = e.exam_name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const categories = ['All', ...Object.keys(CATEGORY_META)];

  return (
    <>
      <style>{`
        .concept-bank-wrap {
          min-height: 100vh;
          background: #0a0a0f;
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
        }

        /* ── Hero ── */
        .cb-hero {
          position: relative;
          padding: 80px 24px 60px;
          text-align: center;
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.25), transparent);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .cb-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }
        .cb-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 999px; padding: 4px 14px;
          font-size: 12px; color: #a5b4fc; margin-bottom: 20px;
          letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600;
        }
        .cb-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 50%, #818cf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 16px; line-height: 1.1;
        }
        .cb-subtitle {
          font-size: 1.05rem; color: #94a3b8;
          max-width: 560px; margin: 0 auto 40px; line-height: 1.6;
        }

        /* ── Stats Strip ── */
        .stats-strip {
          display: flex; justify-content: center; gap: 24px;
          flex-wrap: wrap; margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px 32px;
          text-align: center; transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .stat-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-2px); }
        .stat-icon { font-size: 1.5rem; margin-bottom: 6px; }
        .stat-value { font-size: 1.75rem; font-weight: 800; color: #f1f5f9; }
        .stat-label { font-size: 0.78rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

        /* ── Search ── */
        .search-wrap { position: relative; max-width: 480px; margin: 0 auto; }
        .search-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          padding: 14px 20px 14px 48px; color: #f1f5f9; font-size: 0.95rem;
          outline: none; transition: border-color 0.2s;
        }
        .search-input:focus { border-color: rgba(99,102,241,0.5); }
        .search-input::placeholder { color: #475569; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1rem; color: #475569; }

        /* ── Category Tabs ── */
        .cat-tabs {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; padding: 32px 24px 0;
        }
        .cat-tab {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px; padding: 6px 16px; font-size: 0.82rem;
          color: #94a3b8; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .cat-tab:hover { background: rgba(255,255,255,0.08); color: #f1f5f9; }
        .cat-tab.active {
          background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4);
          color: #a5b4fc; font-weight: 600;
        }

        /* ── Exam Grid ── */
        .cb-main { max-width: 1280px; margin: 0 auto; padding: 40px 24px 80px; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .section-title { font-size: 1.1rem; font-weight: 600; color: #94a3b8; }
        .exam-count { font-size: 0.85rem; color: #475569; }

        .exam-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .exam-card-link { text-decoration: none; }
        .exam-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer;
        }
        .exam-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15);
        }
        .exam-card-header {
          padding: 24px 20px 20px;
          display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
        }
        .exam-icon { font-size: 1.8rem; }
        .exam-name {
          font-size: 1.1rem; font-weight: 700; color: rgba(255,255,255,0.95);
          margin: 0;
        }
        .exam-card-body { padding: 16px 20px 20px; }
        .exam-stats-row {
          display: flex; justify-content: space-between;
          font-size: 0.78rem; color: #64748b; margin-bottom: 12px;
        }
        .coverage-bar-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .coverage-bar-track { flex: 1; height: 5px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
        .coverage-bar-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
        .coverage-pct { font-size: 0.75rem; font-weight: 700; min-width: 34px; text-align: right; }

        .difficulty-dots { display: flex; gap: 12px; }
        .diff-dot-wrap { display: flex; align-items: center; gap: 4px; }
        .diff-dot { width: 8px; height: 8px; border-radius: 50%; }
        .diff-dot-label { font-size: 0.7rem; color: #475569; }

        /* ── Loading ── */
        .cb-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 40vh; gap: 16px;
        }
        .spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(99,102,241,0.2);
          border-top-color: #6366f1;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { color: #64748b; font-size: 0.9rem; }

        /* ── Empty ── */
        .cb-empty { text-align: center; padding: 60px 24px; color: #475569; }
        .cb-empty-icon { font-size: 3rem; margin-bottom: 12px; }

        /* ── Legend ── */
        .difficulty-legend {
          display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
          padding: 16px 24px; background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 0.75rem; color: #64748b;
        }
        .legend-item { display: flex; align-items: center; gap: 6px; }

        @media (max-width: 640px) {
          .stats-strip { gap: 12px; }
          .stat-card { padding: 14px 20px; }
          .exam-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="concept-bank-wrap">
        {/* Hero */}
        <section className="cb-hero">
          <div className="cb-badge">⚡ Phase 1 — Concept Template Bank</div>
          <h1 className="cb-title">The Blueprint Library</h1>
          <p className="cb-subtitle">
            Every exam. Every subject. Every concept. Parameterized templates across
            5 difficulty levels — the foundation that generates unlimited unique questions.
          </p>

          {/* Stats */}
          <div className="stats-strip">
            <StatCard value={loading ? '…' : totals.exams.toString()} label="Exams" icon="🎯" />
            <StatCard value={loading ? '…' : totals.concepts.toLocaleString()} label="Concepts" icon="💡" />
            <StatCard value={loading ? '…' : totals.templates.toLocaleString()} label="Templates" icon="📋" />
            <StatCard value="5" label="Difficulty Levels" icon="🏆" />
            <StatCard value="200K+" label="Target Templates" icon="🚀" />
          </div>

          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search exams (JEE, NEET, UPSC…)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Difficulty Legend */}
        <div className="difficulty-legend">
          {Object.entries(DIFFICULTY_COLORS).map(([lvl, color]) => (
            <div key={lvl} className="legend-item">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              <span style={{ textTransform: 'capitalize' }}>{lvl}</span>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="cat-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_META[cat]?.icon} {cat}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <main className="cb-main">
          <div className="section-header">
            <span className="section-title">Competitive Exams</span>
            <span className="exam-count">{filtered.length} exams</span>
          </div>

          {loading ? (
            <div className="cb-loading">
              <div className="spinner" />
              <p className="loading-text">Loading concept template bank…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="cb-empty">
              <div className="cb-empty-icon">🔍</div>
              <p>No exams found for "{search}"</p>
            </div>
          ) : (
            <div className="exam-grid">
              {filtered.map((exam) => {
                // Try to match category from exam — for now use fallback
                const catKey = Object.keys(CATEGORY_META)[
                  Math.abs(exam.exam_name.charCodeAt(0)) % Object.keys(CATEGORY_META).length
                ];
                return (
                  <ExamCard key={exam.exam_name} exam={exam} catMeta={CATEGORY_META[catKey]} />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
