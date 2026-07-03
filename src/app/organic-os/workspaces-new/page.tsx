'use client';

import { useState, useEffect } from 'react';

interface Workspace { id: string; name: string; slug: string; domain: string; type: string; status: string; language: string; country: string; niche: string; audience: string; healthScore: number; lastActivity: string; config: { connectors: string[]; workflows: string[] } }

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selected, setSelected] = useState<string>('passacumaru');

  useEffect(() => {
    fetch('/api/organic-os/workspaces-new').then(r => r.json()).then(setWorkspaces);
  }, []);

  const statusColor = (s: string) => s === 'active' ? '#059669' : s === 'setup' ? '#f59e0b' : s === 'inactive' ? '#6b7280' : '#dc2626';

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Workspaces</h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Gerenciamento de multiplos blogs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {workspaces.map(w => (
          <div key={w.id} onClick={() => setSelected(w.id)} style={{ background: '#1f2937', borderRadius: '12px', padding: '20px', cursor: 'pointer', border: selected === w.id ? '2px solid #3b82f6' : '2px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f9fafb' }}>{w.name}</h3>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{w.domain}</p>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: '12px', background: statusColor(w.status), color: '#fff', fontSize: '11px', textTransform: 'uppercase' }}>{w.status}</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Nicho</div>
              <div style={{ fontSize: '14px', color: '#f9fafb' }}>{w.niche}</div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Publico</div>
              <div style={{ fontSize: '12px', color: '#d1d5db' }}>{w.audience}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Connectors</div>
                <div style={{ fontSize: '14px', color: '#f9fafb', fontWeight: 'bold' }}>{w.config.connectors.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Workflows</div>
                <div style={{ fontSize: '14px', color: '#f9fafb', fontWeight: 'bold' }}>{w.config.workflows.length}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Health Score</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: w.healthScore > 80 ? '#059669' : w.healthScore > 50 ? '#f59e0b' : '#dc2626' }}>{w.healthScore}%</div>
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {w.lastActivity ? `Ativo: ${new Date(w.lastActivity).toLocaleDateString('pt-BR')}` : 'Sem atividade'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '24px', background: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '16px' }}>Detalhes do Workspace Selecionado</h3>
          {(() => {
            const w = workspaces.find(ws => ws.id === selected);
            if (!w) return null;
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div><div style={{ fontSize: '11px', color: '#9ca3af' }}>ID</div><div style={{ fontSize: '14px', color: '#f9fafb' }}>{w.id}</div></div>
                <div><div style={{ fontSize: '11px', color: '#9ca3af' }}>Idioma</div><div style={{ fontSize: '14px', color: '#f9fafb' }}>{w.language}</div></div>
                <div><div style={{ fontSize: '11px', color: '#9ca3af' }}>Pais</div><div style={{ fontSize: '14px', color: '#f9fafb' }}>{w.country}</div></div>
                <div><div style={{ fontSize: '11px', color: '#9ca3af' }}>Tipo</div><div style={{ fontSize: '14px', color: '#f9fafb', textTransform: 'capitalize' }}>{w.type}</div></div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
