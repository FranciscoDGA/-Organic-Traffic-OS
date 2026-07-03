'use client';

import { useEffect, useState } from 'react';

type MemoryRecord = { id: string; type: string; category: string; title: string; description: string; learning: string; confidence: number; tags: string[]; workspaceId: string; createdAt: string };
type Stats = { totalRecords: number; byType: Record<string, number>; byCategory: Record<string, number>; avgConfidence: number };

const TABS = ['Visao Geral', 'Memorias', 'Aprendizados', 'Erros', 'Pesquisa'] as const;
const WORKSPACES = ['passacumaru', 'garimpeibrasil'];

export default function MemoryPage() {
  const [ws, setWs] = useState('passacumaru');
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`/api/organic-os/memory?workspace=${ws}`)
      .then(r => r.json())
      .then(d => { setMemories(d.memories || []); setStats(d.stats); });
  }, [ws]);

  const filtered = memories.filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.learning.toLowerCase().includes(search.toLowerCase()));
  const errors = memories.filter(m => m.category === 'error');
  const learnings = memories.filter(m => m.category === 'insight' || m.category === 'pattern');

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Memory Engine</h1>

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

      {tab === 0 && stats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Total</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{stats.totalRecords}</div>
            </div>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Confianca Media</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{(stats.avgConfidence * 100).toFixed(0)}%</div>
            </div>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Erros</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ef4444' }}>{errors.length}</div>
            </div>
            <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888' }}>Aprendizados</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>{learnings.length}</div>
            </div>
          </div>
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <h3 style={{ marginBottom: 12 }}>Por Tipo</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(stats.byType).map(([t, c]) => (
                <span key={t} style={{ padding: '4px 10px', background: '#333', borderRadius: 20, fontSize: 12 }}>{t}: {c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(m => (
              <div key={m.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{m.title}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ padding: '2px 8px', background: '#333', borderRadius: 12, fontSize: 11 }}>{m.type}</span>
                    <span style={{ padding: '2px 8px', background: m.category === 'error' ? '#7f1d1d' : m.category === 'success' ? '#14532d' : '#333', borderRadius: 12, fontSize: 11 }}>{m.category}</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{m.description}</div>
                <div style={{ fontSize: 12, color: '#10b981' }}>Aprendizado: {m.learning}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {m.tags.map(t => <span key={t} style={{ padding: '2px 6px', background: '#222', borderRadius: 8, fontSize: 10 }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {learnings.map(m => (
              <div key={m.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: '#10b981' }}>{m.learning}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Confianca: {(m.confidence * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 3 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {errors.map(m => (
              <div key={m.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #7f1d1d' }}>
                <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{m.description}</div>
                <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>Aprendizado: {m.learning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 4 && (
        <div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar memorias..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 16 }} />
          <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Resultados para &quot;{search}&quot;</div>
            <div style={{ fontSize: 14 }}>{filtered.length} memorias encontradas</div>
          </div>
        </div>
      )}
    </div>
  );
}
