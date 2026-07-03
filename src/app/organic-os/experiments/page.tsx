'use client';

import { useEffect, useState } from 'react';

type Variant = { id: string; name: string; description: string; changes: string; status: string; metrics: Record<string, number> };
type Experiment = { id: string; workspaceId: string; name: string; hypothesis: string; type: string; status: string; startDate?: string; endDate?: string; primaryMetric: string; variants: Variant[]; winner?: string; confidence: number; conclusion: string };

const TABS = ['Visao Geral', 'Experimentos', 'Criar', 'Historico'] as const;
const WORKSPACES = ['passacumaru', 'garimpeibrasil'];
const TYPES = ['title_test', 'meta_description_test', 'cta_test', 'introduction_test', 'content_format_test', 'internal_link_test', 'newsletter_subject_test', 'publishing_channel_test'];
const METRICS = ['ctr', 'impressions', 'clicks', 'avg_position', 'avg_time', 'engagement', 'conversions', 'downloads', 'leads', 'open_rate', 'click_rate'];

export default function ExperimentsPage() {
  const [ws, setWs] = useState('passacumaru');
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', hypothesis: '', type: 'title_test', primaryMetric: 'ctr' });

  useEffect(() => {
    fetch(`/api/organic-os/experiments?workspace=${ws}`).then(r => r.json()).then(d => setExperiments(d.experiments || []));
  }, [ws]);

  const active = experiments.filter(e => e.status === 'running');
  const completed = experiments.filter(e => e.status === 'completed');
  const draft = experiments.filter(e => e.status === 'draft');
  const withWinner = experiments.filter(e => e.winner);

  const handleCreate = async () => {
    if (!form.name || !form.hypothesis) return;
    const res = await fetch('/api/organic-os/experiments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: ws, ...form }) });
    const data = await res.json();
    if (data.experiment) setExperiments(prev => [...prev, data.experiment]);
    setForm({ name: '', hypothesis: '', type: 'title_test', primaryMetric: 'ctr' });
  };

  const handleAction = async (id: string, action: string) => {
    const res = await fetch('/api/organic-os/experiments/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
    const data = await res.json();
    if (data.experiment) setExperiments(prev => prev.map(e => e.id === id ? data.experiment : e));
  };

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Experimentation Engine</h1>

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
            <div style={{ fontSize: 12, color: '#888' }}>Total</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{experiments.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Ativos</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{active.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Concluidos</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#8b5cf6' }}>{completed.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Com Vencedor</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>{withWinner.length}</div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {experiments.map(exp => (
            <div key={exp.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{exp.name}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ padding: '2px 8px', background: '#333', borderRadius: 12, fontSize: 11 }}>{exp.type}</span>
                  <span style={{ padding: '2px 8px', background: exp.status === 'running' ? '#14532d' : exp.status === 'completed' ? '#312e81' : '#713f12', borderRadius: 12, fontSize: 11 }}>{exp.status}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Hipotese: {exp.hypothesis}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Metrica: {exp.primaryMetric} | Varicoes: {exp.variants.length}</div>
              {exp.winner && <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>Vencedor: {exp.variants.find(v => v.id === exp.winner)?.name} ({exp.confidence.toFixed(0)}%)</div>}
              {exp.conclusion && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{exp.conclusion}</div>}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {exp.status === 'draft' && <button onClick={() => handleAction(exp.id, 'start')} style={{ padding: '4px 10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Iniciar</button>}
                {exp.status === 'running' && <button onClick={() => handleAction(exp.id, 'pause')} style={{ padding: '4px 10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Pausar</button>}
                {exp.status === 'running' && <button onClick={() => handleAction(exp.id, 'stop')} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Parar</button>}
                {exp.status === 'running' && <button onClick={() => handleAction(exp.id, 'analyze')} style={{ padding: '4px 10px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Analisar</button>}
              </div>
              {exp.variants.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {exp.variants.map(v => (
                    <div key={v.id} style={{ padding: '6px 10px', background: '#222', borderRadius: 6, fontSize: 11, border: exp.winner === v.id ? '1px solid #10b981' : '1px solid #333' }}>
                      <div style={{ fontWeight: 600 }}>{v.name}</div>
                      <div style={{ color: '#888' }}>{v.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
          <h3 style={{ marginBottom: 16 }}>Criar Experimento</h3>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome do experimento..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 12 }} />
          <input value={form.hypothesis} onChange={e => setForm({ ...form, hypothesis: e.target.value })} placeholder="Hipotese..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} style={{ padding: '8px 12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6 }}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.primaryMetric} onChange={e => setForm({ ...form, primaryMetric: e.target.value as any })} style={{ padding: '8px 12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6 }}>
              {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={handleCreate} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Criar Experimento</button>
        </div>
      )}

      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {completed.map(exp => (
            <div key={exp.id} style={{ background: '#1a1a2e', padding: 14, borderRadius: 10, border: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{exp.name}</span>
                <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>{exp.type}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                {exp.winner && <div style={{ fontSize: 12, color: '#10b981' }}>Vencedor: {exp.confidence.toFixed(0)}%</div>}
                <div style={{ fontSize: 11, color: '#888' }}>{exp.conclusion}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
