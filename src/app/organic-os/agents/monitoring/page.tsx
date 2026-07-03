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

const TABS = ['Health Score & Metrics', 'Recomendações', 'Feedback Loop (Discovery)'];

export default function MonitoringAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Health Score & Metrics');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/monitoring/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic }),
      });
      setResult(await res.json());
      setActiveTab('Health Score & Metrics');
    } finally { setLoading(false); }
  }

  const report = result?.report;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            📈 Monitoring Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Acompanhamento de performance, tendências e ciclo de feedback contínuo.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Analisar Performance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Blog ID</label>
              <input style={inputStyle} value={blogId} onChange={e => setBlogId(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Topic (Auto-Pipeline E2E)</label>
              <input style={inputStyle} value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <button onClick={run} disabled={loading} style={{
              marginTop: '6px', width: '100%', padding: '12px',
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(20,184,166,0.35)',
            }}>
              {loading ? '📈 Coletando...' : '📈 Iniciar Análise'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!result && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📈</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Monitoring Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>Insights e tendências aparecerão aqui</div>
            </div>
          )}

          {result && !result.error && report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px', borderLeft: `4px solid #14b8a6` }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#e2e8f0' }}>Monitoring Report ({report.id})</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Tendência detectada: <span style={{ color: '#14b8a6', textTransform: 'uppercase', fontWeight: 'bold' }}>{report.trend.replace('_', ' ')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge('#14b8a6')}>MONITORADO</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#14b8a6' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── HEALTH SCORE TAB ── */}
              {activeTab === 'Health Score & Metrics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={card({ padding: '32px', textAlign: 'center', background: 'radial-gradient(circle at 50% -20%, #1d2133, #0e1119)' })}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Health Score do Conteúdo</div>
                    <div style={{ fontSize: '72px', fontWeight: '900', color: report.health_score.pontuacao_final >= 80 ? '#10b981' : '#f59e0b', lineHeight: '1' }}>
                      {report.health_score.pontuacao_final}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Performance', value: report.health_score.performance },
                      { label: 'Atualidade', value: report.health_score.atualidade },
                      { label: 'Engajamento', value: report.health_score.engajamento },
                      { label: 'Conversão', value: report.health_score.conversao },
                    ].map((s, i) => (
                      <div key={i} style={{ ...card({ padding: '16px' }), display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{s.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: s.value >= 80 ? '#10b981' : '#f59e0b' }}>{s.value}</span>
                          <div style={{ height: '4px', flex: 1, backgroundColor: '#1d2133', borderRadius: '4px' }}>
                            <div style={{ height: '100%', width: `${s.value}%`, backgroundColor: s.value >= 80 ? '#10b981' : '#f59e0b', borderRadius: '4px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── RECOMMENDS TAB ── */}
              {activeTab === 'Recomendações' && (
                <div style={card()}>
                  <div style={labelStyle}>Plano de Ação Sugerido</div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                    O Monitoring Agent identificou as seguintes oportunidades de otimização contínua.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {report.recommendations.map((rec: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', borderLeft: `3px solid ${rec.prioridade === 'alta' ? '#ef4444' : '#f59e0b'}` }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', textTransform: 'capitalize' }}>
                            {rec.acao.replace('_', ' ')}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{rec.descricao}</div>
                        </div>
                        <span style={badge(rec.prioridade === 'alta' ? '#ef4444' : '#f59e0b')}>{rec.prioridade.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── FEEDBACK LOOP TAB ── */}
              {activeTab === 'Feedback Loop (Discovery)' && (
                <div style={card()}>
                  <div style={labelStyle}>Fechando o Ciclo</div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                    As sugestões abaixo foram automaticamente enviadas de volta para o **Discovery Agent**, reiniciando a máquina de produção.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {report.discovery_suggestions.length === 0 ? (
                      <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Nenhuma sugestão nova para o Discovery Agent no momento.</div>
                    ) : (
                      report.discovery_suggestions.map((sug: string, i: number) => (
                        <div key={i} style={{ backgroundColor: '#10b98110', padding: '16px', borderRadius: '8px', border: '1px solid #10b98130', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '20px' }}>🤖</div>
                          <div>
                            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginBottom: '2px' }}>ENVIADO PARA DISCOVERY BACKLOG</div>
                            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{sug}</div>
                          </div>
                        </div>
                      ))
                    )}
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
