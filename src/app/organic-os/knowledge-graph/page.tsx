'use client';

import { useEffect, useState } from 'react';

type Node = { id: string; type: string; name: string; description: string };
type Edge = { id: string; source: string; target: string; relation: string };
type Stats = { totalNodes: number; totalEdges: number; orphans: number; nodesByType: Record<string, number>; edgesByRelation: Record<string, number> };
type Graph = { workspaceId: string; stats: Stats; nodes: Node[]; edges: Edge[] };

const TABS = ['Visao Geral', 'Nos', 'Relacoes', 'Pesquisa'] as const;

export default function KnowledgeGraphPage() {
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [selected, setSelected] = useState<string>('passacumaru');
  const [graph, setGraph] = useState<Graph | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/organic-os/knowledge-graph')
      .then(r => r.json())
      .then(d => { setGraphs(d.graphs || []); });
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/organic-os/knowledge-graph?workspace=${selected}`)
      .then(r => r.json())
      .then(d => { setGraph(d.graph); });
  }, [selected]);

  const filteredNodes = graph?.nodes.filter(n =>
    !search || n.name.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div style={{ padding: 32, color: '#e0e0e0', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Knowledge Graph</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={{ padding: '8px 12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6 }}>
          {graphs.map(g => <option key={g.workspaceId} value={g.workspaceId}>{g.workspaceId}</option>)}
        </select>
      </div>

      {graph && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{ padding: '8px 16px', background: tab === i ? '#3b82f6' : '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>

          {tab === 0 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
                  <div style={{ fontSize: 12, color: '#888' }}>Nos</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{graph.stats.totalNodes}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
                  <div style={{ fontSize: 12, color: '#888' }}>Relacoes</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{graph.stats.totalEdges}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
                  <div style={{ fontSize: 12, color: '#888' }}>Orfaos</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>{graph.stats.orphans}</div>
                </div>
              </div>

              <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
                <h3 style={{ marginBottom: 12 }}>Nos por Tipo</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(graph.stats.nodesByType).map(([type, count]) => (
                    <span key={type} style={{ padding: '4px 10px', background: '#333', borderRadius: 20, fontSize: 12 }}>
                      {type}: {count as number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar nos..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 16 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredNodes.map(n => (
                  <div key={n.id} style={{ background: '#1a1a2e', padding: 16, borderRadius: 10, border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{n.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{n.description}</div>
                    </div>
                    <span style={{ padding: '3px 10px', background: '#333', borderRadius: 12, fontSize: 11 }}>{n.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 2 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {graph.edges.map(e => (
                  <div key={e.id} style={{ background: '#1a1a2e', padding: 14, borderRadius: 10, border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ color: '#3b82f6' }}>{e.source.slice(0, 20)}</span>
                      <span style={{ margin: '0 8px', color: '#888' }}>→</span>
                      <span style={{ color: '#10b981' }}>{e.target.slice(0, 20)}</span>
                    </div>
                    <span style={{ padding: '3px 10px', background: '#333', borderRadius: 12, fontSize: 11 }}>{e.relation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 3 && (
            <div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar no grafo..." style={{ width: '100%', padding: '10px 14px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 8, marginBottom: 16 }} />
              <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Resultados para &quot;{search}&quot;</div>
                <div style={{ fontSize: 14 }}>{filteredNodes.length} nos encontrados</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {filteredNodes.slice(0, 20).map(n => (
                    <div key={n.id} style={{ padding: '8px 12px', background: '#222', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{n.name}</span>
                      <span style={{ color: '#888', fontSize: 12 }}>{n.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
