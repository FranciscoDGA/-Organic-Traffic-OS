"use client";
import React, { useState } from 'react';

// ── Style Helpers ─────────────────────────────────────────────────────────────
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});
const inputStyle: React.CSSProperties = {
  backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px',
  padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', width: '100%',
  outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
  fontSize: '10px', color: '#64748b', fontWeight: '700', display: 'block',
  marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.6px',
};

const TABS = ['Quality Score', 'Checklist Editorial', 'Recomendações'];
const statusColor: Record<string, string> = { approved: '#10b981', revision_requested: '#f59e0b', rejected: '#f43f5e' };

export default function ReviewAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Quality Score');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/review/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic }),
      });
      setResult(await res.json());
      setActiveTab('Quality Score');
    } finally { setLoading(false); }
  }

  const report = result?.report;
  const scoreColor = report?.quality_score?.pontuacao_final >= 80 ? '#10b981' : '#f59e0b';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🔍 Review Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Avaliação editorial, conferência de checklist e Quality Score do rascunho.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Revisar Rascunho
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Blog ID</label>
              <input style={inputStyle} value={blogId} onChange={e => setBlogId(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Topic (Auto-Pipeline)</label>
              <input style={inputStyle} value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <button onClick={run} disabled={loading} style={{
              marginTop: '6px', width: '100%', padding: '12px',
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #a855f7, #c084fc)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(168,85,247,0.35)',
            }}>
              {loading ? '🔍 Revisando...' : '🔍 Iniciar Revisão'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!result && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🔍</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Review Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>O Review Report e o Quality Score aparecerão aqui</div>
            </div>
          )}

          {result && !result.error && report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px', borderLeft: `4px solid ${statusColor[report.status]}` }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#e2e8f0' }}>Review Report ({report.id})</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Revisando Draft: {report.draft_id}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge(statusColor[report.status])}>
                    {report.status === 'approved' ? 'APROVADO PARA PUBLICAÇÃO' : 'REVISÃO SOLICITADA'}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#a855f7' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── QUALITY SCORE TAB ── */}
              {activeTab === 'Quality Score' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={card({ padding: '32px', textAlign: 'center', background: 'radial-gradient(circle at 50% -20%, #1d2133, #0e1119)' })}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Pontuação Final</div>
                    <div style={{ fontSize: '72px', fontWeight: '900', color: scoreColor, lineHeight: '1' }}>
                      {report.quality_score.pontuacao_final}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Clareza', value: report.quality_score.clareza },
                      { label: 'Didática', value: report.quality_score.didatica },
                      { label: 'Fluidez', value: report.quality_score.fluidez },
                      { label: 'Organização', value: report.quality_score.organizacao },
                      { label: 'Cobertura', value: report.quality_score.cobertura_tema },
                      { label: 'Uso Fatos', value: report.quality_score.uso_fatos },
                      { label: 'Uso Fontes', value: report.quality_score.uso_fontes },
                      { label: 'Tom de Voz', value: report.quality_score.tom_voz },
                    ].map((s, i) => (
                      <div key={i} style={{ ...card({ padding: '16px' }), display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{s.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: s.value >= 90 ? '#10b981' : '#f59e0b' }}>{s.value}</span>
                          <div style={{ height: '4px', flex: 1, backgroundColor: '#1d2133', borderRadius: '4px' }}>
                            <div style={{ height: '100%', width: `${s.value}%`, backgroundColor: s.value >= 90 ? '#10b981' : '#f59e0b', borderRadius: '4px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CHECKLIST TAB ── */}
              {activeTab === 'Checklist Editorial' && (
                <div style={card()}>
                  <div style={labelStyle}>Requisitos Obrigatórios</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                    {Object.entries(report.checklist).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#080b10', borderRadius: '8px', border: '1px solid #1d2133' }}>
                        <div style={{ 
                          width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: value ? '#10b98120' : '#f43f5e20', color: value ? '#10b981' : '#f43f5e', fontSize: '12px'
                        }}>
                          {value ? '✓' : '✗'}
                        </div>
                        <span style={{ fontSize: '13px', color: value ? '#e2e8f0' : '#f43f5e', textTransform: 'capitalize' }}>
                          {key.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── RECOMMENDATIONS TAB ── */}
              {activeTab === 'Recomendações' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {report.warnings?.length > 0 && (
                    <div style={{ ...card({ borderLeft: '4px solid #f43f5e' }), backgroundColor: '#f43f5e10' }}>
                      <div style={{ ...labelStyle, color: '#f43f5e' }}>Warnings (Bloqueantes)</div>
                      <ul style={{ margin: '10px 0 0', paddingLeft: '20px', color: '#fca5a5', fontSize: '13px' }}>
                        {report.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}

                  <div style={card()}>
                    <div style={labelStyle}>Sugestões de Melhoria</div>
                    <ul style={{ margin: '10px 0 0', paddingLeft: '20px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                      {report.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
