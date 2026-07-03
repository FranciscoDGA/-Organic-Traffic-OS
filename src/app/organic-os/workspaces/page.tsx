'use client';

import { useState, useEffect } from 'react';

interface WorkspaceConfig {
  identity: { id: string; name: string; domain: string; niche: string; type: string; status: string; language: string; publishMode: string; publisherAdapter: string; organicBridgeEndpoint: string; objective: string; targetAudience: string; monetization: string };
  editorialProfile: { voiceTone: string; depthLevel: string; mainCategories: string[]; allowedContentTypes: string[] };
  policy: { requireHumanApproval: boolean; maxPostsPerDay: number; minWordsPerArticle: number };
  publisherConfig: { publish_endpoint: string; auto_publish_enabled: boolean; max_posts_per_day: number };
  kpis: { id: string; name: string; target: number; unit: string }[];
}

export default function WorkspacesDashboard() {
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>([]);
  const [selected, setSelected] = useState<WorkspaceConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'kpis' | 'editorial'>('list');

  useEffect(() => { fetch('/api/organic-os/workspaces').then(r => r.json()).then(setWorkspaces); }, []);

  const statusColor = (s: string) => {
    const m: Record<string, string> = { active: '#22c55e', inactive: '#6b7280', suspended: '#ef4444', maintenance: '#f59e0b' };
    return m[s] || '#6b7280';
  };

  const handleActivate = async (id: string) => {
    await fetch('/api/organic-os/workspaces/activate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const res = await fetch('/api/organic-os/workspaces');
    setWorkspaces(await res.json());
  };

  const handleDeactivate = async (id: string) => {
    await fetch('/api/organic-os/workspaces/deactivate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const res = await fetch('/api/organic-os/workspaces');
    setWorkspaces(await res.json());
  };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Workspace Onboarding</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Cadastro, configuracao e ativacao de Workspaces</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {workspaces.map(ws => (
          <div key={ws.identity.id} onClick={() => setSelected(ws)} style={{ background: '#1e293b', border: selected?.identity.id === ws.identity.id ? '1px solid #3b82f6' : '1px solid #334155', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{ws.identity.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ws.identity.domain}</div>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '9999px', background: statusColor(ws.identity.status) + '22', color: statusColor(ws.identity.status) }}>{ws.identity.status}</span>
              <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '9999px', background: '#334155', color: '#cbd5e1' }}>{ws.identity.publishMode}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['list', 'kpis', 'editorial'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'list' ? 'Detalhes' : tab === 'kpis' ? 'KPIs' : 'Editorial'}
          </button>
        ))}
      </div>

      {selected && activeTab === 'list' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ color: '#f8fafc', fontSize: '1.25rem' }}>{selected.identity.name}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{selected.identity.domain} | {selected.identity.niche}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {selected.identity.status === 'inactive' ? (
                <button onClick={() => handleActivate(selected.identity.id)} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>Ativar</button>
              ) : (
                <button onClick={() => handleDeactivate(selected.identity.id)} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>Desativar</button>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Objetivo</div>
              <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{selected.identity.objective}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Publico Alvo</div>
              <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{selected.identity.targetAudience}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Monetizacao</div>
              <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{selected.identity.monetization}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Publisher</div>
              <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{selected.identity.publisherAdapter}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Bridge</div>
              <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{selected.identity.organicBridgeEndpoint}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Modo Publicacao</div>
              <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{selected.identity.publishMode}</div>
            </div>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Politica</div>
            <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>Aprovacao Humana: {selected.policy.requireHumanApproval ? 'Sim' : 'Nao'} | Max {selected.policy.maxPostsPerDay}/dia | {selected.policy.minWordsPerArticle}+ palavras</div>
          </div>
        </div>
      )}

      {selected && activeTab === 'kpis' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>KPIs: {selected.identity.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {selected.kpis.map(kpi => (
              <div key={kpi.id} style={{ padding: '1rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{kpi.name}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>{kpi.target}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{kpi.unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && activeTab === 'editorial' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Perfil Editorial: {selected.identity.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Tom de Voz</div>
              <div style={{ fontSize: '0.875rem', color: '#f8fafc' }}>{selected.editorialProfile.voiceTone}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Profundidade</div>
              <div style={{ fontSize: '0.875rem', color: '#f8fafc' }}>{selected.editorialProfile.depthLevel}</div>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Categorias Principais</div>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {selected.editorialProfile.mainCategories.map(c => <span key={c} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#334155', color: '#cbd5e1' }}>{c}</span>)}
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Tipos de Conteudo</div>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {selected.editorialProfile.allowedContentTypes.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#1e3a5f', color: '#60a5fa' }}>{t}</span>)}
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Selecione um Workspace para visualizar detalhes
        </div>
      )}
    </div>
  );
}
