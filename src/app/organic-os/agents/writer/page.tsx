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

const TABS = ['Rascunho (Preview)', 'SEO & Métricas', 'Fatos Integrados'];

export default function WriterAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Rascunho (Preview)');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/writer/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic }),
      });
      setReport(await res.json());
      setActiveTab('Rascunho (Preview)');
    } finally { setLoading(false); }
  }

  const draft = report?.draft_pack;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            ✍️ Writer Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Transforma o Evidence Pack em conteúdo otimizado e formatado.
          </p>
        </div>
        <span style={{ ...badge('#10b981'), fontSize: '12px', padding: '6px 14px' }}>v1.0.0 — ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Config ── */}
        <div style={card()}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Gerar Rascunho
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
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #10b981, #34d399)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(16,185,129,0.35)',
            }}>
              {loading ? '✍️ Escrevendo...' : '✍️ Gerar Rascunho'}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          {!report && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>✍️</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Writer Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px', color: '#2e3550' }}>O Rascunho (Draft Pack) será exibido aqui</div>
            </div>
          )}

          {report && !report.error && draft && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status Banner */}
              <div style={{ ...card({ padding: '14px 20px', borderLeft: `4px solid #10b981` }), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#e2e8f0' }}>Draft Pack ({draft.id})</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Baseado no Evidence Pack {draft.evidence_pack_id}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={badge('#10b981')}>RASCUNHO CONCLUÍDO</span>
                  <span style={badge('#3b82f6')}>{draft.metrics.word_count} palavras</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#10b981' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── PREVIEW TAB ── */}
              {activeTab === 'Rascunho (Preview)' && (
                <div style={{ ...card({ padding: '32px' }), backgroundColor: '#ffffff', color: '#1e293b' }}>
                  <div dangerouslySetInnerHTML={{ __html: draft.content_html }} style={{
                    fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8',
                    maxWidth: '800px', margin: '0 auto'
                  }} />
                </div>
              )}

              {/* ── SEO TAB ── */}
              {activeTab === 'SEO & Métricas' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Palavras', value: draft.metrics.word_count },
                      { label: 'Tempo Leitura', value: `${draft.metrics.reading_time_minutes} min` },
                      { label: 'Títulos (H1-H6)', value: draft.metrics.headings_count },
                      { label: 'Parágrafos', value: draft.metrics.paragraphs_count },
                    ].map((m, i) => (
                      <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#e2e8f0' }}>{m.value}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: '700' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={card()}>
                    <div style={labelStyle}>SEO Meta Data</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Meta Title</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6', textDecoration: 'underline' }}>{draft.seo_data.title}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Meta Description</div>
                        <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.5' }}>{draft.seo_data.meta_description}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Palavra-Chave Principal</div>
                        <span style={badge('#f59e0b')}>{draft.seo_data.focus_keyword}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Palavras Secundárias (Entidades)</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {draft.seo_data.secondary_keywords.map((k: string, i: number) => (
                            <span key={i} style={badge('#64748b')}>{k}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── FATOS TAB ── */}
              {activeTab === 'Fatos Integrados' && (
                <div style={card()}>
                  <div style={labelStyle}>Fatos Aprovados Utilizados no Texto</div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', marginBottom: '16px' }}>
                    O Writer Agent garantiu que as seguintes informações validadas fossem incluídas na redação:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {draft.content_markdown.split('\\n').filter((l: string) => l.startsWith('- ')).map((f: string, i: number) => (
                      <div key={i} style={{ backgroundColor: '#080b10', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #10b981', fontSize: '13px', color: '#e2e8f0' }}>
                        {f.replace('- ', '')}
                      </div>
                    ))}
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
