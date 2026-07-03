'use client';

import { useEffect, useState } from 'react';

type Action = { id: string; type: string; title: string; description: string; expectedImpact: number; effort: number; priority: number; confidence: number; risk: string; status: string; origin: string; rejectionReason?: string };
type Plan = { totalActions: number; approvedActions: number; rejectedActions: number; pendingActions: number; avgPriority: number; risks: string[]; recommendations: string[] };

const TABS = ['Visao Geral', 'Acoes', 'Fila', 'Priorizar'] as const;
const WORKSPACES = ['passacumaru', 'garimpeibrasil'];

export default function GrowthPage() {
  const [ws, setWs] = useState('passacumaru');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [prioritized, setPrioritized] = useState<{ action: Action; score: { finalScore: number; impactScore: number; effortScore: number } }[]>([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetch(`/api/organic-os/growth?workspace=${ws}`).then(r => r.json()).then(d => { setPlan(d.plan); setActions(d.actions || []); });
    fetch(`/api/organic-os/growth/priority?workspace=${ws}`).then(r => r.json()).then(d => setPrioritized(d.prioritized || []));
  }, [ws]);

  const handleAction = async (actionId: string, action: string, reason?: string) => {
    const res = await fetch('/api/organic-os/growth/actions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionId, action, reason }) });
    const data = await res.json();
    if (data.action) setActions(prev => prev.map(a => a.id === actionId ? data.action : a));
  };

  const approved = actions.filter(a => a.status === 'approved');
  const pending = actions.filter(a => a.status === 'pending_approval');
  const rejected = actions.filter(a => a.status === 'rejected');

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Autonomous Growth Engine</h1>

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

      {tab === 0 && plan && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Total Acoes</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{plan.totalActions}</div>
            </div>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Aprovadas</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{plan.approvedActions}</div>
            </div>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Pendentes</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>{plan.pendingActions}</div>
            </div>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Rejeitadas</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ef4444' }}>{plan.rejectedActions}</div>
            </div>
          </div>
          {plan.recommendations.length > 0 && (
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333', marginBottom: 16 }}>
              <h3 style={{ marginBottom: 12 }}>Recomendacoes</h3>
              {plan.recommendations.map((r, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13 }}>{r}</div>)}
            </div>
          )}
          {plan.risks.length > 0 && (
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #7f1d1d' }}>
              <h3 style={{ color: '#ef4444', marginBottom: 12 }}>Riscos</h3>
              {plan.risks.map((r, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13, color: '#fca5a5' }}>{r}</div>)}
            </div>
          )}
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {actions.map(a => (
            <div key={a.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{a.title}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ padding: '2px 8px', background: '#333', borderRadius: 12, fontSize: 11 }}>{a.type}</span>
                  <span style={{ padding: '2px 8px', background: a.status === 'approved' ? '#14532d' : a.status === 'rejected' ? '#7f1d1d' : '#713f12', borderRadius: 12, fontSize: 11 }}>{a.status}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{a.description}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888' }}>
                <span>Impacto: {a.expectedImpact}</span>
                <span>Esforco: {a.effort}</span>
                <span>Prioridade: {a.priority}</span>
                <span>Confianca: {(a.confidence * 100).toFixed(0)}%</span>
                <span>Risco: {a.risk}</span>
              </div>
              {a.rejectionReason && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Motivo: {a.rejectionReason}</div>}
              {a.status === 'pending_approval' && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button onClick={() => handleAction(a.id, 'approve')} style={{ padding: '4px 10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Aprovar</button>
                  <button onClick={() => handleAction(a.id, 'reject', 'Rejeitado pelo usuario')} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Rejeitar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {approved.map(a => (
            <div key={a.id} style={{ background: '#1a1a2e', padding: 14, borderRadius: 10, border: '1px solid #14532d', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{a.title}</span>
                <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>Prioridade: {a.priority}</span>
              </div>
              <span style={{ padding: '2px 8px', background: '#14532d', borderRadius: 12, fontSize: 11 }}>Na Fila</span>
            </div>
          ))}
        </div>
      )}

      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {prioritized.map((p, i) => (
            <div key={p.action.id} style={{ background: '#1a1a2e', padding: 14, borderRadius: 10, border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{i + 1}. {p.action.title}</span>
                <div style={{ fontSize: 12, color: '#888' }}>Impacto: {p.score.impactScore} | Esforco: {p.score.effortScore} | Score: {p.score.finalScore}</div>
              </div>
              <span style={{ padding: '4px 10px', background: '#333', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>{p.score.finalScore}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
