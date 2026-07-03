"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});
const scoreGauge = (value: number, label: string, color: string) => (
  <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }), flex: 1, minWidth: '120px' }}>
    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 8px' }}>
      <svg viewBox="0 0 36 36" style={{ width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1d2133" strokeWidth="3" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${value}, 100`} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '18px', fontWeight: '900', color }}>{value}</div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
  </div>
);
const inputStyle: React.CSSProperties = {
  backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px',
  padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', width: '100%',
  outline: 'none', fontFamily: 'inherit',
};
const btnPrimary: React.CSSProperties = {
  width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
};
const TABS = ['Overview', 'Recomendações', 'Conteúdo Crítico', 'Conteúdo Promissor', 'Análise'];

export default function ContentIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [inputJson, setInputJson] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/content-intelligence');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch {}
  }, []);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/content-intelligence/scores');
      const data = await res.json();
      if (data.success) setScores(data.data);
    } catch {}
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/content-intelligence/recommendations');
      const data = await res.json();
      if (data.success) setRecommendations(data.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); fetchScores(); fetchRecommendations(); }, [fetchStatus, fetchScores, fetchRecommendations]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      let input = {};
      if (inputJson.trim()) {
        try { input = JSON.parse(inputJson); } catch { input = generateMockInput(); }
      } else {
        input = generateMockInput();
      }

      const res = await fetch('/api/organic-os/engines/content-intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
        setScores(data.data.overall_scores);
        setRecommendations(data.data.recommendations || []);
        await fetchStatus();
      }
    } finally { setAnalyzing(false); }
  }

  function generateMockInput() {
    return {
      gsc_data: [
        { page: 'https://example.com/concursos', query: 'concursos publicos 2026', clicks: 150, impressions: 5000, ctr: 3, position: 8 },
        { page: 'https://example.com/estudo', query: 'como estudar para concurso', clicks: 80, impressions: 3000, ctr: 2.7, position: 12 },
        { page: 'https://example.com/salarios', query: 'salarios concursos', clicks: 200, impressions: 8000, ctr: 2.5, position: 5 },
        { page: 'https://example.com/legislacao', query: 'legislacao concursos', clicks: 10, impressions: 2000, ctr: 0.5, position: 35 },
        { page: 'https://example.com/dicas', query: 'dicas prova concurso', clicks: 5, impressions: 1500, ctr: 0.3, position: 45 },
      ],
      ga4_data: [
        { page: 'https://example.com/concursos', sessions: 120, pageviews: 180, bounce_rate: 35, avg_time_on_page: 180 },
        { page: 'https://example.com/estudo', sessions: 60, pageviews: 90, bounce_rate: 45, avg_time_on_page: 120 },
        { page: 'https://example.com/salarios', sessions: 180, pageviews: 250, bounce_rate: 25, avg_time_on_page: 200 },
        { page: 'https://example.com/legislacao', sessions: 8, pageviews: 12, bounce_rate: 85, avg_time_on_page: 20 },
        { page: 'https://example.com/dicas', sessions: 3, pageviews: 5, bounce_rate: 90, avg_time_on_page: 15 },
      ],
      rss_data: [
        { url: 'https://example.com/concursos', title: 'Guia Completo Concursos 2026', type: 'post', pubDate: '2026-01-15' },
        { url: 'https://example.com/estudo', title: 'Como Estudar para Concursos', type: 'post', pubDate: '2025-06-20' },
        { url: 'https://example.com/salarios', title: 'Salários dos Concursos', type: 'page', pubDate: '2026-03-10' },
        { url: 'https://example.com/legislacao', title: 'Legislação Essencial', type: 'post', pubDate: '2024-08-01' },
        { url: 'https://example.com/dicas', title: 'Dicas para a Prova', type: 'post', pubDate: '2024-03-15' },
      ],
    };
  }

  const scoreColor = (v: number) => v >= 70 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444';
  const priorityColor = (p: string) => p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : p === 'medium' ? '#3b82f6' : '#10b981';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🧠 Content Intelligence
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Transforma dados em decisões editoriais. Scores, oportunidades e recomendações.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{status?.total_content || 0} conteúdos</span>
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, width: 'auto', padding: '10px 20px', fontSize: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '🧠 Rodar Análise'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            backgroundColor: activeTab === tab ? '#6366f1' : 'transparent',
            color: activeTab === tab ? '#fff' : '#64748b',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {scores ? (
              <>
                {scoreGauge(scores.health, 'Health', scoreColor(scores.health))}
                {scoreGauge(scores.opportunity, 'Oportunidade', scoreColor(scores.opportunity))}
                {scoreGauge(scores.risk, 'Risco', scoreColor(100 - scores.risk))}
                {scoreGauge(scores.freshness, 'Freshness', scoreColor(scores.freshness))}
                {scoreGauge(scores.authority, 'Autoridade', scoreColor(scores.authority))}
                {scoreGauge(scores.potential, 'Potencial', scoreColor(scores.potential))}
                {scoreGauge(scores.growth, 'Crescimento', scoreColor(scores.growth))}
              </>
            ) : (
              <div style={{ ...card({ flex: 1, textAlign: 'center' as const, padding: '40px' }) }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Nenhuma análise realizada ainda</div>
                <div style={{ fontSize: '12px', color: '#3d4461', marginTop: '8px' }}>Clique em "Rodar Análise" para começar</div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ef4444' }}>{report?.critical_content?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Críticos</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b' }}>{report?.recommendations?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Recomendações</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{report?.promising_content?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Promissores</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Recomendações' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Recomendações ({recommendations.length})
          </div>
          {recommendations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>💡</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver recomendações</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recommendations.slice(0, 30).map((r: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px', gap: '10px', alignItems: 'center', backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${priorityColor(r.priority)}` }}>
                  <span style={badge(priorityColor(r.priority))}>{r.priority.toUpperCase()}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>{r.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{r.description}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: '700' }}>{r.type.toUpperCase()}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{r.impact}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Conteúdo Crítico' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Conteúdo Crítico ({report?.critical_content?.length || 0})
          </div>
          {(!report?.critical_content || report.critical_content.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>⚠️</div>
              <div style={{ fontSize: '14px' }}>Nenhum conteúdo crítico detectado</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.critical_content.map((c: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.item.title}</div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(c.scores.health) }}>{c.scores.health}</span><div style={{ fontSize: '8px', color: '#64748b' }}>HEALTH</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#ef4444' }}>{c.scores.risk}</span><div style={{ fontSize: '8px', color: '#64748b' }}>RISCO</div></div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{c.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Conteúdo Promissor' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Conteúdo Promissor ({report?.promising_content?.length || 0})
          </div>
          {(!report?.promising_content || report.promising_content.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🚀</div>
              <div style={{ fontSize: '14px' }}>Nenhum conteúdo promissor detectado</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.promising_content.map((c: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.item.title}</div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>{c.scores.opportunity}</span><div style={{ fontSize: '8px', color: '#64748b' }}>OPORTUNIDADE</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(c.scores.potential) }}>{c.scores.potential}</span><div style={{ fontSize: '8px', color: '#64748b' }}>POTENCIAL</div></div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{c.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Análise' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Input para Análise (JSON)
          </div>
          <div style={{ marginBottom: '12px', fontSize: '11px', color: '#64748b' }}>
            Cole JSON com dados dos Connectors ou deixe vazio para usar dados mock.
          </div>
          <textarea
            style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '14px', color: '#e2e8f0', fontSize: '12px', width: '100%', minHeight: '200px', fontFamily: 'monospace', resize: 'vertical' as const }}
            placeholder='{ "gsc_data": [...], "ga4_data": [...], "rss_data": [...] }'
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, marginTop: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '🧠 Rodar Análise com Estes Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
