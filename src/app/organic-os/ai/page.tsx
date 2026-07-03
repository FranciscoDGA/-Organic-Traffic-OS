'use client';

import { useState, useEffect } from 'react';

interface AIProvider { id: string; name: string; status: string; models: { id: string; name: string; maxTokens: number; inputCostPer1k: number; outputCostPer1k: number }[]; priority: number; }
interface Health { providerId: string; available: boolean; latencyMs: number; remainingRequests: number; recentFailures: number; }
interface CostStats { totalCost: number; dailyCost: number; monthlyCost: number; byProvider: Record<string, number>; byWorkspace: Record<string, number>; }

export default function AIDashboard() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [health, setHealth] = useState<Health[]>([]);
  const [costs, setCosts] = useState<CostStats>({ totalCost: 0, dailyCost: 0, monthlyCost: 0, byProvider: {}, byWorkspace: {} });
  const [profiles, setProfiles] = useState<{ id: string; name: string; preferredProviderId: string; preferredModelId: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'providers' | 'profiles' | 'health' | 'costs'>('providers');

  useEffect(() => {
    fetch('/api/organic-os/ai/providers').then(r => r.json()).then(setProviders);
    fetch('/api/organic-os/ai/health').then(r => r.json()).then(setHealth);
    fetch('/api/organic-os/ai/costs').then(r => r.json()).then(setCosts);
    fetch('/api/organic-os/ai/models').then(r => r.json()).then(() => {});
  }, []);

  const statusColor = (s: string) => {
    const m: Record<string, string> = { active: '#22c55e', inactive: '#6b7280', rate_limited: '#f59e0b', error: '#ef4444' };
    return m[s] || '#6b728b';
  };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>AI Intelligence Layer</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Gerenciamento centralizado de provedores de IA</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Provedores', value: providers.filter(p => p.status === 'active').length + '/' + providers.length, color: '#3b82f6' },
          { label: 'Custo Total', value: `$${costs.totalCost.toFixed(2)}`, color: '#22c55e' },
          { label: 'Custo Hoje', value: `$${costs.dailyCost.toFixed(2)}`, color: '#f59e0b' },
          { label: 'Custo Mes', value: `$${costs.monthlyCost.toFixed(2)}`, color: '#8b5cf6' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['providers', 'profiles', 'health', 'costs'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'providers' ? 'Provedores' : tab === 'profiles' ? 'Perfis' : tab === 'health' ? 'Saude' : 'Custos'}
          </button>
        ))}
      </div>

      {activeTab === 'providers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {providers.map(p => (
            <div key={p.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '1rem' }}>{p.name}</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>Priority: {p.priority}</span>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: statusColor(p.status) + '22', color: statusColor(p.status) }}>{p.status}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {p.models.map(m => (
                  <div key={m.id} style={{ padding: '0.5rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155', minWidth: '150px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{m.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{m.maxTokens.toLocaleString()} tokens</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>In: ${m.inputCostPer1k}/1k | Out: ${m.outputCostPer1k}/1k</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profiles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {[
            { id: 'research', name: 'Pesquisa', provider: 'OpenAI', model: 'GPT-4o' },
            { id: 'planning', name: 'Planejamento', provider: 'Anthropic', model: 'Claude Sonnet 4' },
            { id: 'writing', name: 'Escrita', provider: 'Anthropic', model: 'Claude Opus 4' },
            { id: 'editorial_review', name: 'Revisao Editorial', provider: 'Anthropic', model: 'Claude Sonnet 4' },
            { id: 'qa', name: 'QA', provider: 'OpenAI', model: 'GPT-4o' },
            { id: 'seo', name: 'SEO', provider: 'OpenAI', model: 'GPT-4o' },
            { id: 'ai_visibility', name: 'AI Visibility', provider: 'Anthropic', model: 'Claude Sonnet 4' },
            { id: 'title_generation', name: 'Geracao de Titulos', provider: 'OpenAI', model: 'GPT-4o Mini' },
            { id: 'faq_generation', name: 'Geracao de FAQ', provider: 'OpenAI', model: 'GPT-4o' },
            { id: 'schema_generation', name: 'Geracao de Schema', provider: 'OpenAI', model: 'GPT-4o Mini' },
            { id: 'data_analysis', name: 'Analise de Dados', provider: 'OpenAI', model: 'GPT-4o' },
            { id: 'executive_summary', name: 'Resumo Executivo', provider: 'Anthropic', model: 'Claude Sonnet 4' },
          ].map(p => (
            <div key={p.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Provider: {p.provider}</div>
              <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Modelo: {p.model}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {health.map(h => (
            <div key={h.providerId} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{h.providerId}</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>Latencia: {h.latencyMs}ms | Falhas: {h.recentFailures}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Restante: {h.remainingRequests} reqs</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: h.available ? '#22c55e22' : '#ef444422', color: h.available ? '#22c55e' : '#ef4444' }}>{h.available ? 'Disponivel' : 'Indisponivel'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'costs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Custo por Provedor</h3>
            {Object.entries(costs.byProvider).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #0f172a' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{k}</span>
                <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>${v.toFixed(4)}</span>
              </div>
            ))}
            {Object.keys(costs.byProvider).length === 0 && <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Nenhum custo registrado</p>}
          </div>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Custo por Workspace</h3>
            {Object.entries(costs.byWorkspace).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #0f172a' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{k}</span>
                <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>${v.toFixed(4)}</span>
              </div>
            ))}
            {Object.keys(costs.byWorkspace).length === 0 && <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Nenhum custo registrado</p>}
          </div>
        </div>
      )}
    </div>
  );
}
