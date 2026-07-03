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

const TABS = ['Visibility Score', 'Schema & Metadata', 'Entidades', 'Snippets Sugeridos'];

export default function VisibilityAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Visibility Score');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/visibility/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic }),
      });
      setResult(await res.json());
      setActiveTab('Visibility Score');
    } finally { setLoading(false); }
  }

  const report = result?.report;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            👁️ Visibility Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Otimização técnica, formatação de Schema e Entity Coverage.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Otimizar Rascunho
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
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
            }}>
              {loading ? '👁️ Otimizando...' : '👁️ Iniciar Otimização'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!result && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>👁️</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Visibility Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>Relatórios de Visibilidade e Schema aparecerão aqui</div>
            </div>
          )}

          {result && !result.error && report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px', borderLeft: `4px solid #0ea5e9` }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#e2e8f0' }}>Visibility Report ({report.id})</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Avaliando Draft: {report.draft_id}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge('#0ea5e9')}>PRONTO PARA PUBLICAÇÃO</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#0ea5e9' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── SCORE TAB ── */}
              {activeTab === 'Visibility Score' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={card({ padding: '32px', textAlign: 'center', background: 'radial-gradient(circle at 50% -20%, #1d2133, #0e1119)' })}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Visibilidade Global</div>
                    <div style={{ fontSize: '72px', fontWeight: '900', color: '#0ea5e9', lineHeight: '1' }}>
                      {report.score.pontuacao_final}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'SEO Técnico', value: report.score.seo_tecnico },
                      { label: 'Legibilidade', value: report.score.legibilidade },
                      { label: 'Semântica', value: report.score.cobertura_semantica },
                      { label: 'Schema Readiness', value: report.score.schema_readiness },
                      { label: 'AI Readability', value: report.score.ai_readability },
                    ].map((s, i) => (
                      <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: s.value >= 90 ? '#10b981' : '#0ea5e9' }}>{s.value}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SCHEMA & METADATA TAB ── */}
              {activeTab === 'Schema & Metadata' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={card()}>
                    <div style={labelStyle}>Schema Markup (JSON-LD)</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {report.schema.types.map((t: string) => <span key={t} style={badge('#3b82f6')}>{t}</span>)}
                    </div>
                    <pre style={{ backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#34d399', overflowX: 'auto' }}>
                      {JSON.stringify(JSON.parse(report.schema.json_ld), null, 2)}
                    </pre>
                  </div>
                  
                  <div style={card()}>
                    <div style={labelStyle}>Metadata Preparada</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>Canonical URL</div>
                        <div style={{ fontSize: '12px', color: '#0ea5e9' }}>{report.metadata.canonical}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>Robots</div>
                        <div style={{ fontSize: '12px', color: '#e2e8f0' }}>{report.metadata.robots}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>Open Graph / Twitter Card</div>
                        <div style={{ fontSize: '12px', color: '#e2e8f0' }}>Prontos (Article / Summary_Large_Image)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ENTITIES TAB ── */}
              {activeTab === 'Entidades' && (
                <div style={card()}>
                  <div style={labelStyle}>Entity Coverage Analysis</div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                    Validação das entidades críticas exigidas pelo motor de IA.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginBottom: '6px' }}>Obrigatórias Encontradas</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                        {report.entity_coverage.obrigatorias.map((e: string) => <span key={e} style={badge('#10b981')}>{e}</span>)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '700', marginBottom: '6px' }}>Secundárias Otimizadas</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                        {report.entity_coverage.secundarias.map((e: string) => <span key={e} style={badge('#3b82f6')}>{e}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SNIPPETS TAB ── */}
              {activeTab === 'Snippets Sugeridos' && (
                <div style={card()}>
                  <div style={labelStyle}>Snippet Readiness</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                    <div style={{ backgroundColor: '#080b10', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>Featured Snippet (Posição Zero)</div>
                      <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{report.snippets.featured_snippet}</div>
                    </div>
                    <div style={{ backgroundColor: '#080b10', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6', marginBottom: '6px' }}>Resumo Executivo para IA</div>
                      <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{report.snippets.resumo_ia}</div>
                    </div>
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
