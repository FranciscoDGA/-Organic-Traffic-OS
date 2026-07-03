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
  <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }), flex: 1, minWidth: '100px' }}>
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
const btnPrimary: React.CSSProperties = {
  width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #10b981, #34d399)',
  boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
};
const TABS = ['Overview', 'Quick Wins', 'Estratégicas', 'Atualização', 'Clusters', 'Conversão', 'Todas', 'Análise'];

export default function OpportunityIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [inputJson, setInputJson] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/opportunity-intelligence');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch {}
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/opportunity-intelligence/recommendations');
      const data = await res.json();
      if (data.success) setRecommendations(data.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); fetchRecommendations(); }, [fetchStatus, fetchRecommendations]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      let input = {};
      if (inputJson.trim()) {
        try { input = JSON.parse(inputJson); } catch { input = generateMockInput(); }
      } else {
        input = generateMockInput();
      }

      const res = await fetch('/api/organic-os/engines/opportunity-intelligence/analyze', {
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
        { page: '/concursos-2026', query: 'concursos publicos 2026', clicks: 150, impressions: 5000, ctr: 3, position: 8 },
        { page: '/seo-basico', query: 'como fazer seo', clicks: 80, impressions: 3000, ctr: 2.7, position: 12 },
        { page: '/analytics', query: 'google analytics 4', clicks: 200, impressions: 8000, ctr: 2.5, position: 5 },
      ],
      trends_data: [
        { keyword: 'inteligencia artificial para concursos', interest: 85, volume: 1200 },
        { keyword: 'estudo com ia', interest: 72, volume: 800 },
        { keyword: 'concurso digital', interest: 65, volume: 600 },
      ],
      keywords_data: [
        { keyword: ' simulado concurso online', volume: 900, competition: 25, commercial_intent: false, type: 'informational' },
        { keyword: 'checklist estudo concurso', volume: 400, competition: 20, commercial_intent: false, type: 'informational' },
        { keyword: 'curso preparatorio concurso', volume: 2000, competition: 75, commercial_intent: true, type: 'transactional' },
      ],
      inventory_data: [
        { url: '/concursos-2026', title: 'Guia Concursos 2026', type: 'pillar', cluster: 'concursos' },
        { url: '/seo-basico', title: 'SEO Básico', type: 'pillar', cluster: 'seo' },
      ],
      content_intelligence: {
        critical_content: [
          { item: { id: 'inv-4', title: 'Legislação Concursos', pubDate: '2024-08-01' }, scores: { health: 20, risk: 75 }, reason: 'Health score baixo' },
        ],
      },
      semantic_intelligence: {
        questions: [
          { question: 'Como estudar para concurso?', topic: 'estudo', answer_coverage: 20 },
          { question: 'Qual o melhor cursinho?', topic: 'cursos', answer_coverage: 10 },
          { question: 'Quando sai edital?', topic: 'editais', answer_coverage: 30 },
        ],
      },
      authority_intelligence: {
        pillar_gaps: [
          { cluster: 'analytics', recommended_keywords: ['analytics', 'ga4', 'métricas'], reason: 'Cluster com 3 conteúdos sem pilar' },
        ],
        weak_clusters: [
          { cluster: 'copywriting', score: 25, reason: 'pouco conteúdo, sem pilar' },
        ],
      },
    };
  }

  const scoreColor = (v: number) => v >= 70 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444';
  const priorityColor = (p: string) => p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : p === 'medium' ? '#3b82f6' : '#10b981';
  const typeLabel = (t: string) => ({
    new_content: 'Novo Conteúdo', update: 'Atualização', pillar_page: 'Pilar', satellite_article: 'Satélite',
    faq: 'FAQ', simulado: 'Simulado', checklist: 'Checklist', landing: 'Landing',
    internal_linking: 'Links Internos', cta_improvement: 'CTA', cluster_expansion: 'Cluster',
  } as any)[t] || t;
  const typeColor = (t: string) => ({
    new_content: '#3b82f6', update: '#f59e0b', pillar_page: '#ef4444', satellite_article: '#8b5cf6',
    faq: '#10b981', simulado: '#06b6d4', checklist: '#f97316', landing: '#ec4899',
    internal_linking: '#64748b', cta_improvement: '#a78bfa', cluster_expansion: '#14b8a6',
  } as any)[t] || '#64748b';

  function renderOppRow(o: any, idx: number) {
    return (
      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 80px 80px 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${typeColor(o.type)}` }}>
        <span style={badge(typeColor(o.type))}>{typeLabel(o.type)}</span>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{o.title}</div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{o.reason}</div>
        </div>
        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(o.opportunity_score) }}>{o.opportunity_score}</span><div style={{ fontSize: '8px', color: '#64748b' }}>SCORE</div></div>
        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>{o.traffic_potential}</span><div style={{ fontSize: '8px', color: '#64748b' }}>TRAFFIC</div></div>
        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444' }}>{o.difficulty}</span><div style={{ fontSize: '8px', color: '#64748b' }}>DIFF</div></div>
        <span style={badge(o.effort === 'baixo' ? '#10b981' : o.effort === 'medio' ? '#f59e0b' : '#ef4444')}>{o.effort.toUpperCase()}</span>
        <span style={badge(o.impact === 'critico' ? '#ef4444' : o.impact === 'alto' ? '#f59e0b' : o.impact === 'medio' ? '#3b82f6' : '#10b981')}>{o.impact.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            💎 Opportunity Intelligence
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Cruza múltiplos sinais para identificar as melhores oportunidades editoriais.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{status?.total_opportunities || 0} oportunidades</span>
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, width: 'auto', padding: '10px 20px', fontSize: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '💎 Rodar Análise'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            backgroundColor: activeTab === tab ? '#10b981' : 'transparent',
            color: activeTab === tab ? '#fff' : '#64748b',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {scores ? (
              <>
                {scoreGauge(scores.opportunity, 'Oportunidade', scoreColor(scores.opportunity))}
                {scoreGauge(scores.traffic_potential, 'Traffic', scoreColor(scores.traffic_potential))}
                {scoreGauge(100 - scores.difficulty, 'Fácil', scoreColor(100 - scores.difficulty))}
                {scoreGauge(scores.monetization, 'Monetização', scoreColor(scores.monetization))}
                {scoreGauge(scores.freshness, 'Freshness', scoreColor(scores.freshness))}
                {scoreGauge(scores.authority_fit, 'Autoridade', scoreColor(scores.authority_fit))}
                {scoreGauge(scores.content_gap, 'Content Gap', scoreColor(scores.content_gap))}
                {scoreGauge(scores.strategic_priority, 'Estratégico', scoreColor(scores.strategic_priority))}
              </>
            ) : (
              <div style={{ ...card({ flex: 1, textAlign: 'center' as const, padding: '40px' }) }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Nenhuma análise realizada ainda</div>
                <div style={{ fontSize: '12px', color: '#3d4461', marginTop: '8px' }}>Clique em "Rodar Análise" para começar</div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{report?.quick_wins?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Quick Wins</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b' }}>{report?.strategic_opportunities?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Estratégicas</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3b82f6' }}>{report?.refresh_opportunities?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Atualização</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#8b5cf6' }}>{report?.cluster_opportunities?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Clusters</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ec4899' }}>{report?.conversion_opportunities?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Conversão</div>
            </div>
          </div>

          <div style={{ ...card({ padding: '16px' }) }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Sinais Analisados
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(report?.signals_analyzed || []).map((s: string, i: number) => (
                <span key={i} style={badge('#10b981')}>{s}</span>
              ))}
              {(!report?.signals_analyzed || report.signals_analyzed.length === 0) && (
                <span style={{ fontSize: '12px', color: '#3d4461' }}>Execute uma análise para ver sinais</span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Quick Wins' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Quick Wins ({report?.quick_wins?.length || 0})
          </div>
          {(!report?.quick_wins || report.quick_wins.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>⚡</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver quick wins</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.quick_wins.map((o: any, i: number) => renderOppRow(o, i))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Estratégicas' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Oportunidades Estratégicas ({report?.strategic_opportunities?.length || 0})
          </div>
          {(!report?.strategic_opportunities || report.strategic_opportunities.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🎯</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver oportunidades estratégicas</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.strategic_opportunities.map((o: any, i: number) => renderOppRow(o, i))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Atualização' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Oportunidades de Atualização ({report?.refresh_opportunities?.length || 0})
          </div>
          {(!report?.refresh_opportunities || report.refresh_opportunities.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔄</div>
              <div style={{ fontSize: '14px' }}>Nenhuma oportunidade de atualização</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.refresh_opportunities.map((o: any, i: number) => renderOppRow(o, i))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Clusters' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Oportunidades de Cluster ({report?.cluster_opportunities?.length || 0})
          </div>
          {(!report?.cluster_opportunities || report.cluster_opportunities.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📦</div>
              <div style={{ fontSize: '14px' }}>Nenhuma oportunidade de cluster</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.cluster_opportunities.map((o: any, i: number) => renderOppRow(o, i))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Conversão' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Oportunidades de Conversão ({report?.conversion_opportunities?.length || 0})
          </div>
          {(!report?.conversion_opportunities || report.conversion_opportunities.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>💰</div>
              <div style={{ fontSize: '14px' }}>Nenhuma oportunidade de conversão</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.conversion_opportunities.map((o: any, i: number) => renderOppRow(o, i))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Todas' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Todas as Oportunidades ({report?.ranked_opportunities?.length || 0})
          </div>
          {(!report?.ranked_opportunities || report.ranked_opportunities.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📋</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver todas as oportunidades</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.ranked_opportunities.map((o: any, i: number) => renderOppRow(o, i))}
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
            Cole JSON com gsc_data, trends_data, keywords_data, content_intelligence, semantic_intelligence, authority_intelligence ou deixe vazio para mock.
          </div>
          <textarea
            style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '14px', color: '#e2e8f0', fontSize: '12px', width: '100%', minHeight: '200px', fontFamily: 'monospace', resize: 'vertical' as const }}
            placeholder='{ "gsc_data": [...], "trends_data": [...], "keywords_data": [...] }'
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, marginTop: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '💎 Rodar Análise com Estes Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
