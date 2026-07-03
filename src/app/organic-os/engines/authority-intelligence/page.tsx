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
  <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }), flex: 1, minWidth: '110px' }}>
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
  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
};
const TABS = ['Overview', 'Clusters', 'Entidades', 'Pilares', 'Lacunas', 'Recomendações', 'Análise'];

export default function AuthorityIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [inputJson, setInputJson] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/authority-intelligence');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch {}
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/authority-intelligence/recommendations');
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

      const res = await fetch('/api/organic-os/engines/authority-intelligence/analyze', {
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
      inventory_data: [
        { url: '/concursos-2026', title: 'Guia Concursos 2026', type: 'pillar', cluster: 'concursos', keywords: ['concurso', 'edital', '2026'], entities: ['CEBRASPE', 'FGV'], word_count: 3500, internal_links_in: 12, internal_links_out: 8 },
        { url: '/estudo-concursos', title: 'Como Estudar para Concursos', type: 'post', cluster: 'concursos', keywords: ['estudo', 'técnicas'], entities: ['Pomodoro', 'ANKI'], word_count: 1800, internal_links_in: 5, internal_links_out: 6 },
        { url: '/salarios-concursos', title: 'Salários dos Concursos', type: 'post', cluster: 'concursos', keywords: ['salário', 'remuneração'], entities: ['Receita Federal'], word_count: 1200, internal_links_in: 3, internal_links_out: 4 },
        { url: '/legislacao-concursos', title: 'Legislação para Concursos', type: 'post', cluster: 'concursos', keywords: ['legislação', 'constituição'], entities: ['STF'], word_count: 2200, internal_links_in: 4, internal_links_out: 5 },
        { url: '/seo-basico', title: 'SEO Básico', type: 'pillar', cluster: 'seo', keywords: ['seo', 'otimização'], entities: ['Google', 'Bing'], word_count: 4000, internal_links_in: 15, internal_links_out: 10 },
        { url: '/on-page-seo', title: 'On-Page SEO', type: 'post', cluster: 'seo', keywords: ['on-page', 'meta tags'], entities: ['Google'], word_count: 1500, internal_links_in: 6, internal_links_out: 7 },
        { url: '/off-page-seo', title: 'Off-Page SEO', type: 'post', cluster: 'seo', keywords: ['backlinks', 'link building'], entities: ['Ahrefs'], word_count: 1300, internal_links_in: 4, internal_links_out: 5 },
        { url: '/copywriting', title: 'Copywriting para SEO', type: 'post', cluster: 'seo', keywords: ['copywriting', 'copy'], entities: [], word_count: 900, internal_links_in: 2, internal_links_out: 3 },
        { url: '/analytics-setup', title: 'Configurando Google Analytics', type: 'post', cluster: 'analytics', keywords: ['analytics', 'ga4'], entities: ['Google Analytics', 'Google'], word_count: 2000, internal_links_in: 7, internal_links_out: 4 },
        { url: '/dashboard-analytics', title: 'Dashboard Analytics', type: 'post', cluster: 'analytics', keywords: ['dashboard', 'métricas'], entities: ['Google Analytics'], word_count: 1100, internal_links_in: 3, internal_links_out: 4 },
        { url: '/relatorios-analytics', title: 'Relatórios no Analytics', type: 'post', cluster: 'analytics', keywords: ['relatórios', 'dimension'], entities: ['Google Analytics'], word_count: 800, internal_links_in: 2, internal_links_out: 3 },
        { url: '/termos-google', title: 'Termos do Google', type: 'page', cluster: 'referencia', keywords: ['termos', 'glossário'], entities: ['Google'], word_count: 2500, internal_links_in: 8, internal_links_out: 2 },
      ],
      clusters_data: [
        { name: 'concursos', items: ['/concursos-2026', '/estudo-concursos', '/salarios-concursos', '/legislacao-concursos'], pillar_id: '/concursos-2026', keywords: ['concurso', 'edital', 'estudo', 'salário'], entities: ['CEBRASPE', 'FGV', 'STF'] },
        { name: 'seo', items: ['/seo-basico', '/on-page-seo', '/off-page-seo', '/copywriting'], pillar_id: '/seo-basico', keywords: ['seo', 'otimização', 'backlinks'], entities: ['Google', 'Bing'] },
        { name: 'analytics', items: ['/analytics-setup', '/dashboard-analytics', '/relatorios-analytics'], keywords: ['analytics', 'ga4'], entities: ['Google Analytics'] },
        { name: 'referencia', items: ['/termos-google'], keywords: ['termos'], entities: ['Google'] },
      ],
      internal_links: [
        { source_id: 'inv-1', target_id: 'inv-2', source_url: '/concursos-2026', target_url: '/estudo-concursos' },
        { source_id: 'inv-1', target_id: 'inv-3', source_url: '/concursos-2026', target_url: '/salarios-concursos' },
        { source_id: 'inv-1', target_id: 'inv-4', source_url: '/concursos-2026', target_url: '/legislacao-concursos' },
        { source_id: 'inv-2', target_id: 'inv-1', source_url: '/estudo-concursos', target_url: '/concursos-2026' },
        { source_id: 'inv-3', target_id: 'inv-1', source_url: '/salarios-concursos', target_url: '/concursos-2026' },
        { source_id: 'inv-5', target_id: 'inv-6', source_url: '/seo-basico', target_url: '/on-page-seo' },
        { source_id: 'inv-5', target_id: 'inv-7', source_url: '/seo-basico', target_url: '/off-page-seo' },
        { source_id: 'inv-5', target_id: 'inv-8', source_url: '/seo-basico', target_url: '/copywriting' },
        { source_id: 'inv-6', target_id: 'inv-5', source_url: '/on-page-seo', target_url: '/seo-basico' },
        { source_id: 'inv-7', target_id: 'inv-5', source_url: '/off-page-seo', target_url: '/seo-basico' },
        { source_id: 'inv-9', target_id: 'inv-10', source_url: '/analytics-setup', target_url: '/dashboard-analytics' },
        { source_id: 'inv-9', target_id: 'inv-11', source_url: '/analytics-setup', target_url: '/relatorios-analytics' },
      ],
    };
  }

  const scoreColor = (v: number) => v >= 70 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444';
  const priorityColor = (p: string) => p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : p === 'medium' ? '#3b82f6' : '#10b981';
  const clusterScore = (c: any) => {
    let s = 50;
    if (c.pillar_id) s += 15;
    if (c.items.length > 3) s += 15;
    if (c.total_words > 3000) s += 10;
    if (c.keywords.length > 2) s += 10;
    return Math.min(100, s);
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            👑 Authority Intelligence
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Mede e fortalece a autoridade temática do site. Clusters, pilares, links internos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{status?.total_items || 0} itens</span>
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, width: 'auto', padding: '10px 20px', fontSize: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '👑 Rodar Análise'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            backgroundColor: activeTab === tab ? '#f59e0b' : 'transparent',
            color: activeTab === tab ? '#fff' : '#64748b',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {scores ? (
              <>
                {scoreGauge(scores.overall, 'Overall', scoreColor(scores.overall))}
                {scoreGauge(scores.topical, 'Topical', scoreColor(scores.topical))}
                {scoreGauge(scores.cluster, 'Clusters', scoreColor(scores.cluster))}
                {scoreGauge(scores.entity, 'Entidades', scoreColor(scores.entity))}
                {scoreGauge(scores.internal_linking, 'Links', scoreColor(scores.internal_linking))}
                {scoreGauge(scores.pillar_coverage, 'Pilares', scoreColor(scores.pillar_coverage))}
                {scoreGauge(scores.source, 'Fontes', scoreColor(scores.source))}
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
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b' }}>{report?.total_items || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Itens</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3b82f6' }}>{report?.total_clusters || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Clusters</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#8b5cf6' }}>{report?.total_entities || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Entidades</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{report?.total_pillar_pages || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Pilares</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ef4444' }}>{report?.pillar_gaps?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Lacunas</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Clusters' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Clusters ({report?.clusters?.length || 0})
          </div>
          {(!report?.clusters || report.clusters.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📦</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver clusters</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.clusters.map((c: any, i: number) => {
                const sc = clusterScore(c);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px 100px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${scoreColor(sc)}` }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{c.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{c.pillar_id ? '✅ Com pilar' : '❌ Sem pilar'}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#3b82f6' }}>{c.items.length}</span><div style={{ fontSize: '8px', color: '#64748b' }}>ITENS</div></div>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#94a3b8' }}>{c.total_words}</span><div style={{ fontSize: '8px', color: '#64748b' }}>WORDS</div></div>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#f59e0b' }}>{c.keywords.length}</span><div style={{ fontSize: '8px', color: '#64748b' }}>KW</div></div>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#8b5cf6' }}>{c.entities.length}</span><div style={{ fontSize: '8px', color: '#64748b' }}>ENT</div></div>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(sc) }}>{sc}</span><div style={{ fontSize: '8px', color: '#64748b' }}>SCORE</div></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Entidades' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Autoridade por Entidade ({report?.entity_authority?.length || 0})
          </div>
          {(!report?.entity_authority || report.entity_authority.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🏷️</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver entidades</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.entity_authority.slice(0, 25).map((e: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 80px 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${e.has_pillar ? '#10b981' : '#f59e0b'}` }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{e.name}</div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#8b5cf6' }}>{e.mentions}</span><div style={{ fontSize: '8px', color: '#64748b' }}>MENÇÕES</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#3b82f6' }}>{e.clusters_referenced.length}</span><div style={{ fontSize: '8px', color: '#64748b' }}>CLUSTERS</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#94a3b8' }}>{e.items_referenced.length}</span><div style={{ fontSize: '8px', color: '#64748b' }}>ITENS</div></div>
                  <span style={badge(e.has_pillar ? '#10b981' : '#f59e0b')}>{e.has_pillar ? 'PILAR' : 'SEM PILAR'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Pilares' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Páginas Pilares ({report?.pillar_pages?.length || 0})
          </div>
          {(!report?.pillar_pages || report.pillar_pages.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📄</div>
              <div style={{ fontSize: '14px' }}>Nenhuma página pilar encontrada</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.pillar_pages.map((p: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{p.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{p.cluster}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#94a3b8' }}>{p.word_count}</span><div style={{ fontSize: '8px', color: '#64748b' }}>PALAVRAS</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>{p.internal_links_in}</span><div style={{ fontSize: '8px', color: '#64748b' }}>LINKS IN</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#3b82f6' }}>{p.internal_links_out}</span><div style={{ fontSize: '8px', color: '#64748b' }}>LINKS OUT</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(p.coverage_score) }}>{p.coverage_score}</span><div style={{ fontSize: '8px', color: '#64748b' }}>COVERAGE</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Lacunas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={card()}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Páginas Pilares Ausentes ({report?.pillar_gaps?.length || 0})
            </div>
            {(!report?.pillar_gaps || report.pillar_gaps.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>✅</div>
                <div style={{ fontSize: '14px' }}>Todos os clusters têm páginas pilares</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.pillar_gaps.map((g: any, i: number) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{g.cluster}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{g.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={card()}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Clusters Fracos ({report?.weak_clusters?.length || 0})
            </div>
            {(!report?.weak_clusters || report.weak_clusters.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>✅</div>
                <div style={{ fontSize: '14px' }}>Nenhum cluster fraco detectado</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.weak_clusters.map((w: any, i: number) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${scoreColor(w.score)}` }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{w.cluster}</div>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(w.score) }}>{w.score}</span><div style={{ fontSize: '8px', color: '#64748b' }}>SCORE</div></div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{w.reason}</div>
                  </div>
                ))}
              </div>
            )}
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
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 80px', gap: '10px', alignItems: 'center', backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${priorityColor(r.priority)}` }}>
                  <span style={badge(priorityColor(r.priority))}>{r.priority.toUpperCase()}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>{r.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{r.description}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700' }}>{r.type.replace(/_/g, ' ').toUpperCase()}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{r.impact}</span>
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
            Cole JSON com inventory_data, clusters_data, internal_links, knowledge_core, etc. ou deixe vazio para mock.
          </div>
          <textarea
            style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '14px', color: '#e2e8f0', fontSize: '12px', width: '100%', minHeight: '200px', fontFamily: 'monospace', resize: 'vertical' as const }}
            placeholder='{ "inventory_data": [...], "clusters_data": [...], "internal_links": [...] }'
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, marginTop: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '👑 Rodar Análise com Estes Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
