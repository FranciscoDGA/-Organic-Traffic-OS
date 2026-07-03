'use client';

import { useState, useEffect } from 'react';

interface EditorialProfile {
  id: string; workspaceId: string; name: string; niche: string; mission: string; vision: string;
  objectives: string[]; targetAudience: string; toneOfVoice: string[]; depthLevel: string;
  averageArticleSize: string; primaryCTA: string; publicationFrequency: string;
  personas: { id: string; name: string; goals: string[]; painPoints: string[]; searchIntent: string[] }[];
  categories: { id: string; name: string; subcategories: string[]; pillar: string }[];
  rules: { priorityThemes: string[]; forbiddenThemes: string[]; minWordCount: number; useFAQ: boolean; useTables: boolean; useSchema: boolean };
  monetization: { primaryMethod: string; secondaryMethods: string[]; ctaFocus: string[] };
}

export default function WorkspaceEditorialDashboard() {
  const [profiles, setProfiles] = useState<EditorialProfile[]>([]);
  const [selected, setSelected] = useState<EditorialProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'personas' | 'categories' | 'rules' | 'monetization'>('overview');

  useEffect(() => { fetch('/api/organic-os/workspace-profile').then(r => r.json()).then(setProfiles); }, []);

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Workspace Editorial Profile</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Identidade editorial e operacional de cada Workspace</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {profiles.map(p => (
          <button key={p.workspaceId} onClick={() => setSelected(p)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: selected?.workspaceId === p.workspaceId ? '1px solid #3b82f6' : '1px solid #334155', background: selected?.workspaceId === p.workspaceId ? '#1e3a5f' : '#1e293b', color: selected?.workspaceId === p.workspaceId ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>
          {p.name}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
            {(['overview', 'personas', 'categories', 'rules', 'monetization'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                {tab === 'overview' ? 'Visao Geral' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>{selected.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{selected.niche}</p>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem' }}><strong style={{ color: '#94a3b8' }}>Missao:</strong> {selected.mission}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem' }}><strong style={{ color: '#94a3b8' }}>Publico:</strong> {selected.targetAudience}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem' }}><strong style={{ color: '#94a3b8' }}>CTA:</strong> {selected.primaryCTA}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}><strong style={{ color: '#94a3b8' }}>Frequencia:</strong> {selected.publicationFrequency}</div>
              </div>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Objetivos</h3>
                {selected.objectives.map((o, i) => <div key={i} style={{ fontSize: '0.8rem', color: '#cbd5e1', padding: '0.25rem 0' }}>• {o}</div>)}
                <h3 style={{ color: '#f8fafc', marginTop: '1rem', marginBottom: '0.5rem' }}>Tom de Voz</h3>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {selected.toneOfVoice.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: '#334155', color: '#cbd5e1' }}>{t}</span>)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personas' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {selected.personas.map(per => (
                <div key={per.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>{per.name}</h4>
                  <div style={{ marginBottom: '0.5rem' }}><span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Objetivos:</span><div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{per.goals.join(', ')}</div></div>
                  <div style={{ marginBottom: '0.5rem' }}><span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Dores:</span><div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{per.painPoints.join(', ')}</div></div>
                  <div><span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Intencao:</span><div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{per.searchIntent.join(', ')}</div></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selected.categories.map(cat => (
                <div key={cat.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#f8fafc' }}>{cat.name}</h4>
                    <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>Pilar: {cat.pillar}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {cat.subcategories.map(s => <span key={s} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#334155', color: '#cbd5e1' }}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rules' && (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Temas Prioritarios</h4><div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>{selected.rules.priorityThemes.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#22c55e22', color: '#22c55e' }}>{t}</span>)}</div></div>
                <div><h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Temas Proibidos</h4><div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>{selected.rules.forbiddenThemes.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#ef444422', color: '#ef4444' }}>{t}</span>)}</div></div>
              </div>
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[['Min Palavras', selected.rules.minWordCount], ['FAQ', selected.rules.useFAQ ? 'Sim' : 'Nao'], ['Tabelas', selected.rules.useTables ? 'Sim' : 'Nao'], ['Schema', selected.rules.useSchema ? 'Sim' : 'Nao']].map(([l, v]) => (
                  <div key={String(l)} style={{ padding: '0.5rem', background: '#0f172a', borderRadius: '6px', textAlign: 'center' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{String(l)}</div><div style={{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>{String(v)}</div></div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'monetization' && (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem' }}>Monetizacao: {selected.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Metodo Principal</div><div style={{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>{selected.monetization.primaryMethod}</div></div>
                <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Secundarios</div><div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{selected.monetization.secondaryMethods.join(', ')}</div></div>
                <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Foco CTA</div><div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{selected.monetization.ctaFocus.join(', ')}</div></div>
              </div>
            </div>
          )}
        </>
      )}

      {!selected && <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: '#64748b' }}>Selecione um Workspace</div>}
    </div>
  );
}
