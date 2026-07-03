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

const TABS = ['Adapters Status', 'Publication Package', 'Manifest JSON'];

export default function PublishingAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Adapters Status');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/publishing/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          blog_id: blogId, 
          topic,
          config: { target_adapters: ['html', 'markdown', 'json', 'wordpress', 'nextjs', 'headless-cms'], auto_publish: false }
        }),
      });
      setResult(await res.json());
      setActiveTab('Adapters Status');
    } finally { setLoading(false); }
  }

  const report = result?.report;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🚀 Publishing Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Empacota e exporta o conteúdo final para múltiplos destinos via Adapters.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Gerar Pacote de Publicação
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
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #ef4444, #f87171)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(239,68,68,0.35)',
            }}>
              {loading ? '🚀 Exportando...' : '🚀 Gerar & Exportar'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!result && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🚀</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Publishing Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>Os resultados dos Adapters aparecerão aqui</div>
            </div>
          )}

          {result && !result.error && report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px', borderLeft: `4px solid #ef4444` }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#e2e8f0' }}>Publication Package ({report.package.id})</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Slug: <span style={{ color: '#ef4444' }}>{report.package.slug}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge('#ef4444')}>PACOTE GERADO</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#ef4444' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── ADAPTERS TAB ── */}
              {activeTab === 'Adapters Status' && (
                <div style={card()}>
                  <div style={labelStyle}>Adapter Export Status</div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                    O Publishing Agent invocou todos os adapters configurados.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {report.exports.map((ex: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', border: '1px solid #1d2133' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>{ex.adapter}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                            {ex.url ? `URL: ${ex.url}` : 'Nenhuma URL gerada'}
                          </div>
                        </div>
                        <div>
                          {ex.status === 'success' 
                            ? <span style={badge('#10b981')}>SUCESSO</span>
                            : <span style={badge('#f43f5e')}>FALHA</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PACKAGE TAB ── */}
              {activeTab === 'Publication Package' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={card()}>
                    <div style={labelStyle}>Integridade</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>Checksum (Hash)</div>
                        <div style={{ fontSize: '12px', color: '#10b981', fontFamily: 'monospace' }}>{report.package.checksum}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>Versão</div>
                        <div style={{ fontSize: '12px', color: '#e2e8f0' }}>{report.package.version}</div>
                      </div>
                    </div>
                  </div>
                  <div style={card()}>
                    <div style={labelStyle}>Assets Contidos</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginTop: '12px' }}>
                      <span style={badge('#3b82f6')}>HTML</span>
                      <span style={badge('#8b5cf6')}>Markdown</span>
                      <span style={badge('#f59e0b')}>JSON Payload</span>
                      <span style={badge('#10b981')}>Metadata</span>
                      <span style={badge('#ec4899')}>Schema JSON-LD</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MANIFEST TAB ── */}
              {activeTab === 'Manifest JSON' && (
                <div style={card()}>
                  <div style={labelStyle}>Package JSON Preview (Headless CMS Ready)</div>
                  <pre style={{ backgroundColor: '#080b10', padding: '16px', borderRadius: '8px', fontSize: '12px', color: '#f87171', overflowX: 'auto' }}>
                    {JSON.stringify(report.package, null, 2)}
                  </pre>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
