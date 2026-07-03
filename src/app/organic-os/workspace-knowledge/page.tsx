'use client';

import { useState, useEffect } from 'react';

interface KnowledgeContext { profile: { name: string; niche: string; toneOfVoice: string; language: string }; memory: { publishedContents: string[]; clusters: string[]; entities: string[]; faqs: string[]; rules: string[]; strategies: string[]; glossary: string[]; history: string[]; lessonsLearned: string[]; knownErrors: string[]; bestPractices: string[] }; editorialStyle: { technicalLevel: string; averageSize: string; useTables: boolean; useLists: boolean }; taxonomy: { categories: { name: string }[]; tags: string[] }; entities: { id: string; name: string; type: string; importance: number }[]; personas: { id: string; name: string; knowledgeLevel: string; objective: string; searchIntent: string }[]; objectives: { commercial: string; seo: string }; rules: { contentRules: string[] } }

export default function WorkspaceKnowledgePage() {
  const [workspace, setWorkspace] = useState('passacumaru');
  const [context, setContext] = useState<KnowledgeContext | null>(null);
  const [tab, setTab] = useState<'profile' | 'personas' | 'entities' | 'taxonomy' | 'memory'>('profile');

  useEffect(() => {
    fetch(`/api/organic-os/workspace-knowledge?workspace=${workspace}`).then(r => r.json()).then(setContext);
  }, [workspace]);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Workspace Knowledge</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Isolamento de conhecimento por workspace</p>
        </div>
        <select value={workspace} onChange={e => setWorkspace(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }}>
          <option value="passacumaru">PassaCumaru</option>
          <option value="garimpeibrasil">Garimpei Brasil</option>
        </select>
      </div>

      {context && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Workspace', value: context.profile.name },
              { label: 'Nicho', value: context.profile.niche },
              { label: 'Personas', value: String(context.personas.length) },
              { label: 'Entidades', value: String(context.entities.length) },
            ].map(k => (
              <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f9fafb', marginTop: '4px' }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {(['profile', 'personas', 'entities', 'taxonomy', 'memory'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: '6px', background: tab === t ? '#2563eb' : '#374151', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
                {t === 'profile' ? 'Perfil' : t === 'personas' ? 'Personas' : t === 'entities' ? 'Entidades' : t === 'taxonomy' ? 'Taxonomia' : 'Memoria'}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Knowledge Profile</h3>
                {Object.entries(context.profile).filter(([k]) => k !== 'workspaceId').map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #374151' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span style={{ fontSize: '12px', color: '#f9fafb', maxWidth: '60%', textAlign: 'right' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Objetivos</h3>
                {Object.entries(context.objectives).filter(([k]) => k !== 'workspaceId').map(([k, v]) => (
                  <div key={k} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>{k}</div>
                    <div style={{ fontSize: '12px', color: '#f9fafb' }}>{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'personas' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '12px' }}>
              {context.personas.map(p => (
                <div key={p.id} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '8px' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Objetivo: {p.objective}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Nivel: {p.knowledgeLevel}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Intencao: {p.searchIntent}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'entities' && (
            <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              {context.entities.sort((a, b) => b.importance - a.importance).map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #374151' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#f9fafb', fontWeight: 'bold' }}>{e.name}</span>
                    <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '8px' }}>{e.type}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: e.importance > 8 ? '#059669' : '#f59e0b' }}>{e.importance}/10</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'taxonomy' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Categorias</h3>
                {context.taxonomy.categories.map(c => (
                  <div key={c.name} style={{ fontSize: '13px', color: '#f9fafb', padding: '4px 0' }}>📁 {c.name}</div>
                ))}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {context.taxonomy.tags.map(t => (
                    <span key={t} style={{ padding: '4px 10px', borderRadius: '12px', background: '#374151', color: '#d1d5db', fontSize: '11px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'memory' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Publicados', value: context.memory.publishedContents.length, items: context.memory.publishedContents },
                { label: 'Clusters', value: context.memory.clusters.length, items: context.memory.clusters },
                { label: 'Entidades', value: context.memory.entities.length, items: context.memory.entities },
                { label: 'FAQs', value: context.memory.faqs.length, items: context.memory.faqs },
                { label: 'Regras', value: context.memory.rules.length, items: context.memory.rules },
                { label: 'Estrategias', value: context.memory.strategies.length, items: context.memory.strategies },
              ].map(m => (
                <div key={m.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '8px' }}>{m.label} ({m.value})</div>
                  {m.items.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ fontSize: '11px', color: '#9ca3af', padding: '2px 0' }}>• {item}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
