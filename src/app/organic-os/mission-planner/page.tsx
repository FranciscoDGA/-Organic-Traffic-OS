'use client';

import { useState, useEffect } from 'react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  requiredAgents: string[];
  estimatedDurationMinutes: number;
  estimatedCost: number;
  risks: string[];
}

interface ExecutionPlan {
  id: string;
  missionObjective: { id: string; description: string; contentType?: string; targetKeyword?: string };
  workspace: { id: string; name: string; type: string };
  strategy: Strategy;
  workflowId: string;
  priority: string;
  resources: { agents: string[]; workers: string[]; estimatedTokens: number; estimatedApiCalls: number };
  estimatedDurationMinutes: number;
  estimatedCost: number;
  risks: string[];
  status: string;
  createdAt: string;
}

export default function MissionPlannerDashboard() {
  const [plans, setPlans] = useState<ExecutionPlan[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'strategies' | 'create'>('plans');
  const [createForm, setCreateForm] = useState({ objectiveDesc: '', contentType: '', targetKeyword: '', workspaceName: '', workspaceType: 'blog' });
  const [createdPlan, setCreatedPlan] = useState<ExecutionPlan | null>(null);

  useEffect(() => {
    fetch('/api/organic-os/mission-planner').then(r => r.json()).then(d => { setPlans(d.plans || []); setStrategies(d.strategies || []); });
  }, []);

  const handleCreate = async () => {
    const body = {
      objective: { id: `obj-${Date.now()}`, description: createForm.objectiveDesc, contentType: createForm.contentType, targetKeyword: createForm.targetKeyword },
      workspace: { id: `ws-${Date.now()}`, name: createForm.workspaceName, type: createForm.workspaceType, niche: '', goals: [], activeCampaigns: [], playbooks: [] }
    };
    const res = await fetch('/api/organic-os/mission-planner/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { const plan = await res.json(); setCreatedPlan(plan); setPlans(prev => [...prev, plan]); }
  };

  const priorityColor = (p: string) => {
    const m: Record<string, string> = { urgent: '#ef4444', high: '#f59e0b', normal: '#3b82f6', low: '#6b7280', background: '#475569' };
    return m[p] || '#6b7280';
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = { planned: '#8b5cf6', in_progress: '#3b82f6', completed: '#22c55e', failed: '#ef4444', cancelled: '#6b7280', received: '#f59e0b', planning: '#f59e0b' };
    return m[s] || '#6b7280';
  };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Mission Planner (OMP)</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Transformar objetivos estrategicos em planos de execucao</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['plans', 'strategies', 'create'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'plans' ? 'Planos' : tab === 'strategies' ? 'Estrategias' : 'Criar Plano'}
          </button>
        ))}
      </div>

      {activeTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {plans.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Nenhum plano criado</p>}
          {plans.map(p => (
            <div key={p.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{p.missionObjective.description}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: priorityColor(p.priority) + '22', color: priorityColor(p.priority) }}>{p.priority}</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: statusColor(p.status) + '22', color: statusColor(p.status) }}>{p.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Estrategia: {p.strategy.name}</span>
                <span>Workflow: {p.workflowId}</span>
                <span>Duracao: ~{p.estimatedDurationMinutes}min</span>
                <span>Custo: ${p.estimatedCost.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {p.resources.agents.map(a => <span key={a} style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#334155', color: '#cbd5e1' }}>🤖 {a}</span>)}
                {p.resources.workers.map(w => <span key={w} style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#334155', color: '#cbd5e1' }}>⚙️ {w}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'strategies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {strategies.map(s => (
            <div key={s.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>{s.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{s.description}</div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>~{s.estimatedDurationMinutes}min</span>
                <span>${s.estimatedCost.toFixed(2)}</span>
                <span>{s.requiredAgents.length} agents</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>Workflow: {s.workflowId}</div>
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {s.requiredAgents.map(a => <span key={a} style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: '3px', background: '#334155', color: '#cbd5e1' }}>{a}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', maxWidth: '600px' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Criar Plano de Execucao</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Descricao do Objetivo</label>
              <input value={createForm.objectiveDesc} onChange={e => setCreateForm(p => ({ ...p, objectiveDesc: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Tipo de Conteudo</label>
              <input value={createForm.contentType} onChange={e => setCreateForm(p => ({ ...p, contentType: e.target.value }))} placeholder="artigo, review, pilar, ebook..." style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Keyword Alvo</label>
              <input value={createForm.targetKeyword} onChange={e => setCreateForm(p => ({ ...p, targetKeyword: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Nome do Workspace</label>
              <input value={createForm.workspaceName} onChange={e => setCreateForm(p => ({ ...p, workspaceName: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Tipo do Workspace</label>
              <select value={createForm.workspaceType} onChange={e => setCreateForm(p => ({ ...p, workspaceType: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.875rem' }}>
                {['blog', 'saas', 'ecommerce', 'agency', 'education', 'news', 'portfolio'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={handleCreate} style={{ padding: '0.6rem', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Criar Plano</button>
          </div>
          {createdPlan && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #22c55e' }}>
              <div style={{ fontWeight: 600, color: '#22c55e', marginBottom: '0.5rem' }}>Plano Criado: {createdPlan.id}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Estrategia: {createdPlan.strategy.name} | Workflow: {createdPlan.workflowId} | Prioridade: {createdPlan.priority}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Duracao: ~{createdPlan.estimatedDurationMinutes}min | Custo: ${createdPlan.estimatedCost.toFixed(2)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
