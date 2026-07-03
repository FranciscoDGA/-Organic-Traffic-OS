'use client';

import { useEffect, useState } from 'react';

type Plan = { id: string; workspaceId: string; provider: string; model: string; strategy: string; estimatedInputTokens: number; estimatedOutputTokens: number; estimatedCost: number; estimatedTimeMs: number; fallbackProvider?: string; reason: string; createdAt: string };
type Provider = { name: string; available: boolean; models: { name: string; quality: number; speed: number; costTier: string }[] };

const TABS = ['Visao Geral', 'Planos', 'Simular', 'Providers', 'Historico'] as const;
const WORKSPACES = ['passacumaru', 'garimpeibrasil'];
const STRATEGIES = ['fast', 'balanced', 'premium', 'low-cost', 'deep-research', 'long-context', 'multi-step'];

export default function ExecutionPage() {
  const [ws, setWs] = useState('passacumaru');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [tab, setTab] = useState(0);
  const [objective, setObjective] = useState('');
  const [strategy, setStrategy] = useState<string>('balanced');
  const [simulating, setSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{ strategy: string; plan: Plan }[]>([]);

  useEffect(() => {
    fetch(`/api/organic-os/execution/providers`).then(r => r.json()).then(d => setProviders(d.providers || []));
    fetch(`/api/organic-os/execution/history?workspace=${ws}`).then(r => r.json()).then(d => setPlans(d.logs || []));
  }, [ws]);

  const handlePlan = async () => {
    if (!objective) return;
    setSimulating(true);
    const res = await fetch('/api/organic-os/execution/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: ws, objective, strategy }) });
    const data = await res.json();
    if (data.plan) setPlans(prev => [...prev, data.plan]);
    setSimulating(false);
    setObjective('');
  };

  const handleSimulate = async () => {
    if (!objective) return;
    setSimulating(true);
    const res = await fetch('/api/organic-os/execution/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: ws, objective }) });
    const data = await res.json();
    setSimResults(data.results || []);
    setSimulating(false);
  };

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Execution Intelligence Engine</h1>

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Planos</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{plans.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Providers</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{providers.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Custo Total</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>${plans.reduce((s, p) => s + p.estimatedCost, 0).toFixed(4)}</div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {plans.map(p => (
            <div key={p.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{p.provider} / {p.model}</span>
                <span style={{ padding: '2px 8px', background: '#333', borderRadius: 12, fontSize: 11 }}>{p.strategy}</span>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>Tokens: {p.estimatedInputTokens + p.estimatedOutputTokens} | Custo: ${p.estimatedCost.toFixed(4)} | Tempo: {p.estimatedTimeMs}ms</div>
              {p.fallbackProvider && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>Fallback: {p.fallbackProvider}</div>}
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{p.reason}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
          <h3 style={{ marginBottom: 16 }}>Simular Execucao</h3>
          <input value={objective} onChange={e => setObjective(e.target.value)} placeholder="Objetivo..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <select value={strategy} onChange={e => setStrategy(e.target.value)} style={{ padding: '8px 12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6 }}>
              {STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={handlePlan} disabled={simulating} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Criar Plano</button>
            <button onClick={handleSimulate} disabled={simulating} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Simular Todas</button>
          </div>
          {simResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {simResults.map(r => (
                <div key={r.strategy} style={{ padding: 12, background: '#222', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{r.strategy}</span>
                  <span style={{ color: '#888' }}>{r.plan.provider}/{r.plan.model} - ${r.plan.estimatedCost.toFixed(4)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {providers.map(p => (
            <div key={p.name} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ padding: '2px 8px', background: p.available ? '#14532d' : '#7f1d1d', borderRadius: 12, fontSize: 11 }}>{p.available ? 'Ativo' : 'Inativo'}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.models.map(m => (
                  <span key={m.name} style={{ padding: '3px 8px', background: '#333', borderRadius: 8, fontSize: 11 }}>{m.name} (Q:{m.quality} S:{m.speed})</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {plans.slice(-10).reverse().map(p => (
            <div key={p.id} style={{ background: '#1a1a2e', padding: 14, borderRadius: 10, border: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{p.provider}/{p.model}</span>
                <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>{p.strategy}</span>
              </div>
              <span style={{ color: '#f59e0b' }}>${p.estimatedCost.toFixed(4)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
