"use client";
import React, { useState } from 'react';

const card = (style?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px',
  padding: '24px', ...style
});

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
  borderRadius: '999px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.4px',
  backgroundColor: color + '18', color: color, border: `1px solid ${color}30`
});

const priorityColor: Record<string,string> = {
  critical: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#64748b'
};

export default function DiscoveryAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [mode, setMode] = useState('mock');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/discovery/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic, mode, limit })
      });
      const data = await res.json();
      setReport(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const input: React.CSSProperties = {
    backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', width: '100%',
    outline: 'none', fontFamily: 'inherit'
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🤖 Discovery Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
            Primeiro agente autônomo do Epic 03 — detecta oportunidades editoriais priorizadas.
          </p>
        </div>
        <div style={{ ...badge('#10b981') as any, fontSize: '12px', padding: '6px 14px' }}>
          v1.0.0 — ACTIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <div style={card()}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 20px' }}>
            Configurar Execução
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blog ID</label>
              <input style={input} value={blogId} onChange={e => setBlogId(e.target.value)} placeholder="passacumaru" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Topic</label>
              <input style={input} value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mode</label>
              <select style={input} value={mode} onChange={e => setMode(e.target.value)}>
                <option value="mock">Mock (Dados Simulados)</option>
                <option value="manual">Manual (CSV)</option>
                <option value="pipeline">Pipeline</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Limit ({limit})</label>
              <input style={input} type="range" min={1} max={20} value={limit} onChange={e => setLimit(+e.target.value)} />
            </div>
            <button
              onClick={run}
              disabled={loading}
              style={{
                marginTop: '8px', width: '100%', padding: '12px',
                background: loading ? '#1d2133' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.3px', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)'
              }}>
              {loading ? '⚡ Analisando...' : '🚀 Executar Discovery'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {!report && !loading && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🤖</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Discovery Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>Os resultados aparecerão aqui</div>
            </div>
          )}

          {report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Total', value: report.summary.total_found, color: '#6366f1' },
                  { label: 'Critical', value: report.summary.critical, color: '#f43f5e' },
                  { label: 'High', value: report.summary.high, color: '#f59e0b' },
                  { label: 'Avg Score', value: report.summary.avg_score, color: '#10b981' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Opportunities List */}
              <div style={card()}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 20px' }}>
                  Oportunidades Descobertas ({report.opportunities.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {report.opportunities.map((opp: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: '#080b10', border: '1px solid #1d2133',
                      borderRadius: '12px', padding: '16px 20px',
                      borderLeft: `3px solid ${priorityColor[opp.priority]}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                            {opp.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{opp.reason}</div>
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                            <span style={badge(priorityColor[opp.priority])}>{opp.priority}</span>
                            <span style={badge('#64748b')}>{opp.type}</span>
                            <span style={badge('#818cf8')}>{opp.cluster}</span>
                          </div>
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6366f1', fontWeight: '600' }}>
                            → {opp.next_step}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '60px' }}>
                          <div style={{ fontSize: '28px', fontWeight: '900', color: opp.score >= 90 ? '#10b981' : opp.score >= 75 ? '#f59e0b' : '#64748b' }}>
                            {opp.score}
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>SCORE</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {report.warnings.length > 0 && (
                <div style={{ ...card({ borderColor: '#f59e0b30', borderLeft: '3px solid #f59e0b', padding: '16px 20px' }) }}>
                  {report.warnings.map((w: string, i: number) => (
                    <div key={i} style={{ fontSize: '13px', color: '#f59e0b', display: 'flex', gap: '8px' }}>
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
