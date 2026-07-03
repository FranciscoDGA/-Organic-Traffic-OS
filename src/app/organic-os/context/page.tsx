'use client';

import { useEffect, useState } from 'react';

type ContextPackage = { id: string; workspaceId: string; objective: string; entities: string[]; clusters: string[]; relevantMemory: string[]; personas: string[]; sources: string[]; estimatedTokens: number; createdAt: string };

const TABS = ['Visao Geral', 'Pacotes', 'Construir', 'Logs'] as const;
const WORKSPACES = ['passacumaru', 'garimpeibrasil'];

export default function ContextPage() {
  const [ws, setWs] = useState('passacumaru');
  const [packages, setPackages] = useState<ContextPackage[]>([]);
  const [logs, setLogs] = useState<{ id: string; sourcesUsed: string[]; estimatedTokens: number; warnings: string[]; duration: number; createdAt: string }[]>([]);
  const [tab, setTab] = useState(0);
  const [objective, setObjective] = useState('');
  const [building, setBuilding] = useState(false);

  useEffect(() => {
    fetch(`/api/organic-os/context/packages?workspace=${ws}`).then(r => r.json()).then(d => setPackages(d.packages || []));
    fetch(`/api/organic-os/context/history?workspace=${ws}`).then(r => r.json()).then(d => setLogs(d.logs || []));
  }, [ws]);

  const handleBuild = async () => {
    if (!objective) return;
    setBuilding(true);
    const res = await fetch('/api/organic-os/context/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: ws, objective }) });
    const data = await res.json();
    if (data.package) setPackages(prev => [...prev, data.package]);
    setBuilding(false);
    setObjective('');
  };

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Context Intelligence Engine</h1>

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Pacotes</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{packages.length}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Tokens Estimados</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{packages.reduce((s, p) => s + p.estimatedTokens, 0)}</div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Logs</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>{logs.length}</div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {packages.map(p => (
            <div key={p.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{p.objective}</span>
                <span style={{ padding: '2px 8px', background: '#333', borderRadius: 12, fontSize: 11 }}>{p.estimatedTokens} tokens</span>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>Entidades: {p.entities.join(', ') || 'Nenhuma'}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Fontes: {p.sources.join(', ')}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
          <h3 style={{ marginBottom: 16 }}>Construir Contexto</h3>
          <input value={objective} onChange={e => setObjective(e.target.value)} placeholder="Objetivo do contexto..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 12 }} />
          <button onClick={handleBuild} disabled={building} style={{ padding: '10px 20px', background: building ? '#555' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: building ? 'not-allowed' : 'pointer' }}>
            {building ? 'Construindo...' : 'Construir Pacote'}
          </button>
        </div>
      )}

      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {logs.map(l => (
            <div key={l.id} style={{ background: '#1a1a2e', padding: 14, borderRadius: 10, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{l.id}</span>
                <span style={{ fontSize: 12, color: '#888' }}>{l.duration}ms</span>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>Tokens: {l.estimatedTokens} | Fontes: {l.sourcesUsed.length}</div>
              {l.warnings.length > 0 && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>Warnings: {l.warnings.join(', ')}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
