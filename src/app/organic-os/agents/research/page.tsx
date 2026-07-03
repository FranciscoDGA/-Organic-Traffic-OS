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

const TABS = ['Research Pack', 'Entidades', 'Perguntas', 'Referências', 'Sumário'];
const confColor: Record<string, string> = { high: '#10b981', medium: '#f59e0b', low: '#f43f5e', unverified: '#64748b' };
const importColor: Record<string, string> = { critical: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#64748b' };

export default function ResearchAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [itemIndex, setItemIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Research Pack');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/research/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic, item_index: itemIndex }),
      });
      setReport(await res.json());
      setActiveTab('Research Pack');
    } finally { setLoading(false); }
  }

  const pack = report?.pack;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🔬 Research Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Monta Research Packs completos — Knowledge, Entidades, Perguntas e Referências.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Configurar Research
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
              <label style={labelStyle}>Item do Backlog (índice: {itemIndex})</label>
              <input style={inputStyle} type="range" min={0} max={7} value={itemIndex} onChange={e => setItemIndex(+e.target.value)} />
              <div style={{ fontSize: '10px', color: '#3d4461', marginTop: '4px', textAlign: 'center' }}>
                Item #{itemIndex + 1} do backlog gerado
              </div>
            </div>
            <button onClick={run} disabled={loading} style={{
              marginTop: '6px', width: '100%', padding: '12px',
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #6366f1, #818cf8)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
            }}>
              {loading ? '⚡ Pesquisando...' : '🔬 Gerar Research Pack'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!report && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🔬</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Research Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>Research Pack, Entidades e Perguntas aparecerão aqui</div>
            </div>
          )}

          {report && !report.error && pack && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Summary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {[
                  { label: 'Fatos', value: report.summary.total_fatos, color: '#6366f1' },
                  { label: 'Validados', value: report.summary.fatos_validados, color: '#10b981' },
                  { label: 'Pendentes', value: report.summary.fatos_pendentes, color: '#f59e0b' },
                  { label: 'Entidades', value: report.summary.total_entidades, color: '#818cf8' },
                  { label: 'Cobertura', value: report.summary.cobertura_pct + '%', color: report.summary.cobertura_pct >= 70 ? '#10b981' : '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '14px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px' }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{pack.titulo}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge(pack.status === 'complete' ? '#10b981' : '#f59e0b')}>{pack.status}</span>
                  <span style={badge('#64748b')}>v{pack.versao}</span>
                  <span style={badge('#818cf8')}>{pack.cluster}</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#6366f1' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── RESEARCH PACK ── */}
              {activeTab === 'Research Pack' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Summary */}
                  <div style={card()}>
                    <div style={labelStyle}>Resumo Executivo</div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.7' }}>{pack.resumo_executivo}</p>
                  </div>
                  {/* Main topics */}
                  <div style={card()}>
                    <div style={labelStyle}>Principais Tópicos</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pack.principais_topicos.map((t: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                          <span style={{ color: '#6366f1', fontWeight: '700', fontSize: '11px' }}>0{i + 1}</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Facts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={card()}>
                      <div style={{ ...labelStyle, color: '#10b981' }}>Fatos Conhecidos ({pack.fatos_conhecidos.length})</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {pack.fatos_conhecidos.map((f: string, i: number) => (
                          <div key={i} style={{ fontSize: '12px', color: '#94a3b8', padding: '6px 10px', backgroundColor: '#080b10', borderRadius: '6px', borderLeft: '2px solid #10b981' }}>
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={card()}>
                      <div style={{ ...labelStyle, color: '#f59e0b' }}>Fatos Pendentes ({pack.fatos_pendentes.length})</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {pack.fatos_pendentes.map((f: string, i: number) => (
                          <div key={i} style={{ fontSize: '12px', color: '#94a3b8', padding: '6px 10px', backgroundColor: '#080b10', borderRadius: '6px', borderLeft: '2px solid #f59e0b' }}>
                            ⏳ {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Links */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={card()}>
                      <div style={labelStyle}>Links Internos Sugeridos</div>
                      {pack.links_internos_sugeridos.map((l: string, i: number) => (
                        <div key={i} style={{ fontSize: '12px', color: '#818cf8', marginTop: '6px', fontFamily: 'monospace' }}>→ {l}</div>
                      ))}
                    </div>
                    <div style={card()}>
                      <div style={labelStyle}>Links Externos Sugeridos</div>
                      {pack.links_externos_sugeridos.map((l: string, i: number) => (
                        <div key={i} style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontFamily: 'monospace' }}>↗ {l}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ENTIDADES ── */}
              {activeTab === 'Entidades' && (
                <div style={card()}>
                  <div style={labelStyle}>Entity Map — {pack.entidades_obrigatorias.length} entidades</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {pack.entidades_obrigatorias.map((e: any, i: number) => (
                      <div key={i} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>{e.nome}</div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                            <span style={badge(importColor[e.importancia])}>{e.importancia}</span>
                            <span style={badge('#64748b')}>{e.tipo}</span>
                            {e.obrigatoria && <span style={badge('#f43f5e')}>obrigatória</span>}
                          </div>
                          {e.relacionamentos.length > 0 && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                              Relacionamentos: {e.relacionamentos.join(' · ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PERGUNTAS ── */}
              {activeTab === 'Perguntas' && (
                <div style={card()}>
                  <div style={labelStyle}>Question Map — {pack.perguntas_obrigatorias.length} perguntas</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {pack.perguntas_obrigatorias.map((q: any, i: number) => (
                      <div key={i} style={{
                        backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px',
                        padding: '14px 16px', borderLeft: `3px solid ${q.respondida ? '#10b981' : importColor[q.prioridade]}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>{q.pergunta}</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <span style={badge(importColor[q.prioridade])}>{q.prioridade}</span>
                              <span style={badge('#64748b')}>{q.origem}</span>
                            </div>
                            {q.resposta && (
                              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', padding: '6px 10px', backgroundColor: '#10b98110', borderRadius: '6px' }}>
                                ✓ {q.resposta}
                              </div>
                            )}
                          </div>
                          <span style={badge(q.respondida ? '#10b981' : '#f59e0b')}>
                            {q.respondida ? '✓ respondida' : '⏳ pendente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── REFERÊNCIAS ── */}
              {activeTab === 'Referências' && (
                <div style={card()}>
                  <div style={labelStyle}>Reference List — {pack.fontes_consultadas.length} fontes</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {pack.fontes_consultadas.map((r: any, i: number) => (
                      <div key={i} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>{r.titulo}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>{r.fonte}</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <span style={badge('#64748b')}>{r.tipo}</span>
                              <span style={badge(confColor[r.confianca])}>confiança: {r.confianca}</span>
                            </div>
                            {r.url && <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '6px', fontFamily: 'monospace' }}>↗ {r.url}</div>}
                          </div>
                          <span style={badge(r.status === 'validado' ? '#10b981' : '#f59e0b')}>{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SUMÁRIO ── */}
              {activeTab === 'Sumário' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Fatos Validados', value: report.summary.fatos_validados, total: report.summary.total_fatos, color: '#10b981' },
                      { label: 'Perguntas Respondidas', value: report.summary.perguntas_respondidas, total: report.summary.total_perguntas, color: '#6366f1' },
                      { label: 'Referências Validadas', value: report.summary.referencias_validadas, total: report.summary.total_referencias, color: '#818cf8' },
                      { label: 'Entidades Obrigatórias', value: report.summary.entidades_obrigatorias, total: report.summary.total_entidades, color: '#f59e0b' },
                    ].map((m, i) => (
                      <div key={i} style={card({ padding: '20px' })}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>{m.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '32px', fontWeight: '900', color: m.color }}>{m.value}</span>
                          <span style={{ fontSize: '14px', color: '#64748b' }}>/ {m.total}</span>
                        </div>
                        <div style={{ height: '4px', backgroundColor: '#1d2133', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: (m.total ? (m.value / m.total * 100) : 0) + '%', backgroundColor: m.color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={card()}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>Cobertura Geral</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '48px', fontWeight: '900', color: report.summary.cobertura_pct >= 70 ? '#10b981' : '#f59e0b' }}>
                        {report.summary.cobertura_pct}%
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: '8px', backgroundColor: '#1d2133', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: report.summary.cobertura_pct + '%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '99px' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                          {report.summary.cobertura_pct >= 70 ? '✓ Research Pack pronto para produção' : '⚠️ Completar lacunas antes da redação'}
                        </div>
                      </div>
                    </div>
                  </div>
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
