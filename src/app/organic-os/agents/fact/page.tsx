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

const TABS = ['Evidence Pack', 'Fatos Aprovados', 'Conflitos', 'Métricas de Confiança'];
const statusColor: Record<string, string> = { approved: '#10b981', pending: '#f59e0b', rejected: '#f43f5e' };
const gradeColor: Record<string, string> = { A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#f43f5e' };

export default function FactAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Evidence Pack');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/fact/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic }),
      });
      setReport(await res.json());
      setActiveTab('Evidence Pack');
    } finally { setLoading(false); }
  }

  const ep = report?.evidence_pack;
  const conf = report?.confidence;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            ⚖️ Fact Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Valida informações, consolida evidências e identifica conflitos.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Validar Fatos
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
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #6366f1, #818cf8)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
            }}>
              {loading ? '⚖️ Validando...' : '⚖️ Executar Validação'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!report && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>⚖️</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Fact Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>Relatório de Validação e Conflitos aparecerão aqui</div>
            </div>
          )}

          {report && !report.error && ep && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Summary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {[
                  { label: 'Grade', value: conf.grade, color: gradeColor[conf.grade] || '#64748b' },
                  { label: 'Aprovados', value: conf.aprovados, color: '#10b981' },
                  { label: 'Pendentes', value: conf.pendentes, color: '#f59e0b' },
                  { label: 'Conflitos', value: conf.conflitos_abertos, color: conf.conflitos_abertos > 0 ? '#f43f5e' : '#64748b' },
                  { label: 'Confiança Media', value: conf.confianca_media + '%', color: '#6366f1' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '14px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px', borderLeft: `4px solid ${ep.status === 'approved' ? '#10b981' : '#f59e0b'}` }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#e2e8f0' }}>Evidence Pack ({ep.id})</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Baseado no Research Pack {ep.research_pack_id}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge(ep.status === 'approved' ? '#10b981' : '#f59e0b')}>{ep.status === 'approved' ? 'PACK APROVADO' : 'VALIDAÇÃO PARCIAL'}</span>
                  <span style={badge('#64748b')}>v{ep.versao}</span>
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

              {/* ── EVIDENCE PACK TAB ── */}
              {activeTab === 'Evidence Pack' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={card()}>
                    <div style={labelStyle}>Resumo das Evidências</div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.7' }}>{ep.observacoes}</p>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={card()}>
                      <div style={{ ...labelStyle, color: '#10b981' }}>Fatos Aprovados ({ep.fatos_aprovados.length})</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {ep.fatos_aprovados.map((f: any, i: number) => (
                          <div key={i} style={{ fontSize: '12px', color: '#e2e8f0', padding: '10px', backgroundColor: '#080b10', borderRadius: '6px', borderLeft: '2px solid #10b981' }}>
                            <div style={{ marginBottom: '4px' }}>{f.descricao}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>Confiança: {f.nivel_de_confianca}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div style={card()}>
                      <div style={{ ...labelStyle, color: '#f59e0b' }}>Fatos Pendentes ({ep.fatos_pendentes.length})</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {ep.fatos_pendentes.map((f: any, i: number) => (
                          <div key={i} style={{ fontSize: '12px', color: '#e2e8f0', padding: '10px', backgroundColor: '#080b10', borderRadius: '6px', borderLeft: '2px solid #f59e0b' }}>
                            <div style={{ marginBottom: '4px' }}>⏳ {f.descricao}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>Aguardando validação da fonte</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── FATOS APROVADOS TAB ── */}
              {activeTab === 'Fatos Aprovados' && (
                <div style={card()}>
                  <div style={labelStyle}>Listagem Completa de Fatos Aprovados ({ep.fatos_aprovados.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {ep.fatos_aprovados.map((f: any, i: number) => (
                      <div key={i} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>{f.descricao}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '8px' }}>
                          <span style={badge('#10b981')}>Confiança {f.nivel_de_confianca}%</span>
                          <span style={badge('#64748b')}>Origem: {f.origem}</span>
                        </div>
                        {f.evidencias.length > 0 && (
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            Evidências: {f.evidencias.join(' · ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CONFLITOS TAB ── */}
              {activeTab === 'Conflitos' && (
                <div style={card()}>
                  <div style={labelStyle}>Relatório de Conflitos ({ep.conflitos.length})</div>
                  {ep.conflitos.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      Nenhum conflito detectado entre as fontes.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                      {ep.conflitos.map((c: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px', padding: '16px', borderLeft: '3px solid #f43f5e' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>Conflito: {c.fato}</div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>{c.descricao_do_conflito}</div>
                            </div>
                            <span style={badge('#f43f5e')}>{c.status}</span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '10px', padding: '10px', backgroundColor: '#0e1119', borderRadius: '6px' }}>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>FONTES CONFLITANTES:</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {c.fontes_conflitantes.map((fc: string, j: number) => (
                                <span key={j} style={badge('#64748b')}>{fc}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div style={{ marginTop: '12px', fontSize: '12px', color: '#f59e0b', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span>⚠️ Ação Recomendada:</span>
                            <span style={{ fontWeight: '600' }}>{c.acao_recomendada}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── CONFIANÇA TAB ── */}
              {activeTab === 'Métricas de Confiança' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={card({ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade de Confiança</div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Nota final baseada na rastreabilidade e autoridades das fontes.</div>
                      </div>
                      <div style={{ fontSize: '64px', fontWeight: '900', color: gradeColor[conf.grade], lineHeight: 1 }}>{conf.grade}</div>
                    </div>
                    
                    <div style={card({ padding: '24px' })}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Rastreabilidade Global</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '42px', fontWeight: '900', color: '#3b82f6' }}>{conf.rastreabilidade_pct}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#1d2133', borderRadius: '99px', overflow: 'hidden', marginTop: '12px' }}>
                        <div style={{ height: '100%', width: `${conf.rastreabilidade_pct}%`, backgroundColor: '#3b82f6', borderRadius: '99px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {report.warnings?.length > 0 && (
                <div style={{ ...card({ borderLeft: '3px solid #f43f5e', padding: '14px 18px' }), display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {report.warnings.map((w: string, i: number) => (
                    <div key={i} style={{ fontSize: '12px', color: '#f43f5e', display: 'flex', gap: '8px' }}>
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
