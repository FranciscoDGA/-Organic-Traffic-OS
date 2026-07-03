"use client";
import React, { useState } from 'react';

const priorityColor: Record<string, string> = {
  critical: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#64748b',
};

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
  borderRadius: '999px', fontSize: '11px', fontWeight: '700',
  backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});

const TABS = ['Backlog', 'Calendário', 'Roadmap'];

export default function PlanningAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [weeks, setWeeks] = useState(8);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Backlog');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/planning/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic, weeks }),
      });
      setReport(await res.json());
      setActiveTab('Backlog');
    } finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '13px',
    width: '100%', outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px', color: '#64748b', fontWeight: '700', display: 'block',
    marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.6px',
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            📋 Planning Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Transforma oportunidades em backlog priorizado, calendário e roadmap editorial.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config Form ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Configurar Planning
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Blog ID</label>
              <input style={inputStyle} value={blogId} onChange={e => setBlogId(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Topic</label>
              <input style={inputStyle} value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Semanas: {weeks}</label>
              <input style={inputStyle} type="range" min={2} max={24} value={weeks} onChange={e => setWeeks(+e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#3d4461', marginTop: '4px' }}>
                <span>2 sem</span><span>24 sem</span>
              </div>
            </div>
            <button onClick={run} disabled={loading} style={{
              marginTop: '6px', width: '100%', padding: '12px',
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #6366f1, #818cf8)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
            }}>
              {loading ? '⚡ Planejando...' : '🗺️ Gerar Plano Editorial'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!report && !loading && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Planning Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>Backlog, Calendário e Roadmap aparecerão aqui</div>
            </div>
          )}

          {report && !report.error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Summary row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Backlog', value: report.summary.itens_backlog, color: '#6366f1' },
                  { label: 'Críticos', value: report.summary.criticos, color: '#f43f5e' },
                  { label: 'Clusters', value: report.summary.clusters_identificados, color: '#10b981' },
                  { label: 'Semanas', value: report.summary.semanas_estimadas, color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '8px', border: 'none', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#6366f1' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── BACKLOG ── */}
              {activeTab === 'Backlog' && (
                <div style={card()}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Backlog ({report.backlog.length} itens)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {report.backlog.map((item: any, i: number) => (
                      <div key={i} style={{
                        backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px',
                        padding: '14px 16px', borderLeft: `3px solid ${priorityColor[item.prioridade]}`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>{item.titulo}</div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                            <span style={badge(priorityColor[item.prioridade])}>{item.prioridade}</span>
                            <span style={badge('#64748b')}>{item.tipo}</span>
                            <span style={badge('#818cf8')}>{item.cluster}</span>
                            <span style={badge('#10b981')}>{item.estimativa_dias}d</span>
                          </div>
                          {item.dependencias.length > 0 && (
                            <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '6px' }}>
                              ⚠️ Depende de: {item.dependencias.join(', ')}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '52px' }}>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#64748b' }}>
                            {item.score}
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>SCORE</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CALENDAR ── */}
              {activeTab === 'Calendário' && (
                <div style={card()}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Calendário Editorial ({report.calendar.length} publicações)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {report.calendar.map((entry: any, i: number) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '110px 1fr auto',
                        backgroundColor: '#080b10', border: '1px solid #1d2133',
                        borderRadius: '8px', padding: '12px 16px', gap: '12px', alignItems: 'center',
                      }}>
                        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6366f1', fontWeight: '700' }}>
                          {entry.data_prevista}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>{entry.titulo}</div>
                          {entry.observacoes && (
                            <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '3px' }}>⚠️ {entry.observacoes}</div>
                          )}
                        </div>
                        <span style={badge(priorityColor[entry.prioridade])}>{entry.prioridade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ROADMAP ── */}
              {activeTab === 'Roadmap' && (
                <div style={card()}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                    Roadmap de Produção — {report.roadmap.semanas_totais} Semanas
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {report.roadmap.fases.map((fase: any, i: number) => {
                      const colors = ['#6366f1', '#10b981', '#f59e0b'];
                      return (
                        <div key={i} style={{
                          backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '12px',
                          padding: '16px 20px', borderTop: `3px solid ${colors[i] || '#64748b'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Fase {fase.fase}
                              </div>
                              <div style={{ fontSize: '16px', fontWeight: '800', color: '#e2e8f0', marginTop: '2px' }}>{fase.nome}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                                Sem {fase.semana_inicio} → {fase.semana_fim}
                              </div>
                              <div style={{ fontSize: '22px', fontWeight: '900', color: colors[i] || '#64748b', marginTop: '2px' }}>
                                {fase.itens.length}
                              </div>
                              <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>itens</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {report.roadmap.clusters.length > 0 && (
                    <div style={{ marginTop: '16px', padding: '14px 16px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Clusters</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                        {report.roadmap.clusters.map((c: string, i: number) => (
                          <span key={i} style={badge('#818cf8')}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Warnings */}
              {report.warnings?.length > 0 && (
                <div style={{ ...card({ borderLeft: '3px solid #f59e0b', padding: '14px 18px' }), display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {report.warnings.map((w: string, i: number) => (
                    <div key={i} style={{ fontSize: '12px', color: '#f59e0b', display: 'flex', gap: '8px' }}>
                      <span>⚠️</span><span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
