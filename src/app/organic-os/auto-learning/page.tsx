'use client';

import { useEffect, useState } from 'react';

type Lesson = { id: string; type: string; category: string; description: string; patternDetected: string; evidence: string; impact: string; confidence: number; recommendation: string; status: string };
type Patterns = { successPatterns: string[]; failurePatterns: string[]; recurringFailures: string[]; opportunities: string[] };

const TABS = ['Visao Geral', 'Aprendizados', 'Padroes', 'Recomendacoes', 'Relatorio'] as const;
const WORKSPACES = ['passacumaru', 'garimpeibrasil'];

export default function AutoLearningPage() {
  const [ws, setWs] = useState('passacumaru');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [patterns, setPatterns] = useState<Patterns>({ successPatterns: [], failurePatterns: [], recurringFailures: [], opportunities: [] });
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetch(`/api/organic-os/auto-learning?workspace=${ws}`).then(r => r.json()).then(d => { setLessons(d.lessons || []); setPatterns(d.patterns || {}); });
    fetch(`/api/organic-os/auto-learning/recommendations?workspace=${ws}`).then(r => r.json()).then(d => setRecommendations(d.recommendations || []));
  }, [ws]);

  const active = lessons.filter(l => l.status === 'active');
  const suggestions = lessons.filter(l => l.status === 'suggestion');
  const avgConf = lessons.length > 0 ? lessons.reduce((s, l) => s + l.confidence, 0) / lessons.length : 0;

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Auto Learning Engine</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={ws} onChange={e => setWs(e.target.value)} style={{ padding: '8px 12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6 }}>
          {WORKSPACES.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: '8px 16px', background: tab === i ? '#3b82f6' : '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, cursor: 'pointer' }}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Total Aprendizados</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{lessons.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Ativos</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{active.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Sugestoes</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>{suggestions.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Confianca Media</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#8b5cf6' }}>{(avgConf * 100).toFixed(0)}%</div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lessons.map(l => (
            <div key={l.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: `1px solid ${l.status === 'active' ? '#333' : '#555'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{l.description}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ padding: '2px 8px', background: '#333', borderRadius: 12, fontSize: 11 }}>{l.type}</span>
                  <span style={{ padding: '2px 8px', background: l.status === 'active' ? '#14532d' : '#713f12', borderRadius: 12, fontSize: 11 }}>{l.status}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>Padrao: {l.patternDetected}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Evidencia: {l.evidence}</div>
              <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>Recomendacao: {l.recommendation}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Confianca: {(l.confidence * 100).toFixed(0)}% | Impacto: {l.impact}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <h3 style={{ color: '#10b981', marginBottom: 12 }}>Padroes de Sucesso</h3>
            {patterns.successPatterns.map((p, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13 }}>{p}</div>)}
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <h3 style={{ color: '#ef4444', marginBottom: 12 }}>Padroes de Falha</h3>
            {patterns.failurePatterns.map((p, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13 }}>{p}</div>)}
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: 12 }}>Falhas Recorrentes</h3>
            {patterns.recurringFailures.map((p, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13 }}>{p}</div>)}
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <h3 style={{ color: '#8b5cf6', marginBottom: 12 }}>Oportunidades</h3>
            {patterns.opportunities.map((p, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13 }}>{p}</div>)}
          </div>
        </div>
      )}

      {tab === 3 && (
        <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
          <h3 style={{ marginBottom: 16 }}>Recomendacoes Futuras</h3>
          {recommendations.map((r, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #333', fontSize: 13 }}>
              <span style={{ color: '#8b5cf6', marginRight: 8 }}>{i + 1}.</span> {r}
            </div>
          ))}
        </div>
      )}

      {tab === 4 && (
        <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
          <h3 style={{ marginBottom: 16 }}>Relatorio de Aprendizado</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ padding: 12, background: '#222', borderRadius: 8 }}><strong>Total:</strong> {lessons.length}</div>
            <div style={{ padding: 12, background: '#222', borderRadius: 8 }}><strong>Ativos:</strong> {active.length}</div>
            <div style={{ padding: 12, background: '#222', borderRadius: 8 }}><strong>Sucesso:</strong> {patterns.successPatterns.length}</div>
            <div style={{ padding: 12, background: '#222', borderRadius: 8 }}><strong>Falha:</strong> {patterns.failurePatterns.length}</div>
            <div style={{ padding: 12, background: '#222', borderRadius: 8 }}><strong>Confianca:</strong> {(avgConf * 100).toFixed(0)}%</div>
            <div style={{ padding: 12, background: '#222', borderRadius: 8 }}><strong>Recomendacoes:</strong> {recommendations.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
