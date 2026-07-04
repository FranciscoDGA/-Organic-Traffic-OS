'use client';

import { useState } from 'react';

export default function TopicClusterPage() {
  const [workspace, setWorkspace] = useState('passacumaru');
  const [keyword, setKeyword] = useState('');
  const [view, setView] = useState<'tree' | 'graph' | 'list'>('tree');
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/topic-cluster/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, workspaceId: workspace })
      });
      const json = await res.json();
      setData(json);
      
      // Auto expand all
      if (json.nodes) {
        const expandMap: Record<string, boolean> = {};
        json.nodes.forEach((n: any) => expandMap[n.id] = true);
        setExpandedNodes(expandMap);
        setSelectedNode(json.nodes[0]); // Select pillar
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // UI Helpers
  const renderTree = (parentId: string | null = null, depth = 0) => {
    if (!data || !data.nodes) return null;
    const children = data.nodes.filter((n: any) => n.parentId === parentId);
    
    return children.map((node: any) => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = data.nodes.some((n: any) => n.parentId === node.id);
      
      return (
        <div key={node.id} className={`ml-${depth > 0 ? '6' : '0'} border-l ${depth > 0 ? 'border-slate-700/50' : 'border-transparent'} relative`}>
          {depth > 0 && <div className="absolute top-5 left-0 w-6 border-t border-slate-700/50"></div>}
          
          <div 
            onClick={() => setSelectedNode(node)}
            className={`flex items-center gap-3 p-3 rounded-lg ml-${depth > 0 ? '6' : '0'} mt-2 cursor-pointer border ${selectedNode?.id === node.id ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/30'} transition-all`}
          >
            {hasChildren && (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                className="w-5 h-5 flex items-center justify-center bg-slate-700 rounded text-slate-300 hover:bg-slate-600"
              >
                {isExpanded ? '-' : '+'}
              </button>
            )}
            {!hasChildren && <span className="w-5" />}
            
            <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
              ${node.type === 'Pilar' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 
                node.type === 'Cluster' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'}`
            }>
              {node.type}
            </div>
            
            <span className="font-semibold text-sm text-slate-200">{node.keyword}</span>
            <span className="text-xs text-slate-500 ml-auto">{node.status}</span>
          </div>

          {isExpanded && hasChildren && (
            <div className="mt-1">
              {renderTree(node.id, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderList = () => {
    if (!data || !data.nodes) return null;
    return (
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase border-b border-slate-700">
            <tr>
              <th className="px-4 py-3">Nó / Keyword</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Intent</th>
              <th className="px-4 py-3">Prioridade</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.nodes.map((node: any) => (
              <tr key={node.id} onClick={() => setSelectedNode(node)} className={`border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/20 ${selectedNode?.id === node.id ? 'bg-indigo-900/20' : ''}`}>
                <td className="px-4 py-3 font-semibold text-white">{node.keyword}</td>
                <td className="px-4 py-3 text-xs">{node.type}</td>
                <td className="px-4 py-3 text-xs">{node.intent}</td>
                <td className="px-4 py-3 text-xs">{node.priority}</td>
                <td className="px-4 py-3 text-xs text-emerald-400">{node.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGraph = () => {
    if (!data || !data.nodes) return null;
    
    // SVG estático nativo ultra simplificado para validação da regra
    const pilar = data.nodes.find((n: any) => n.type === 'Pilar');
    const clusters = data.nodes.filter((n: any) => n.type === 'Cluster');
    
    if (!pilar) return null;

    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 relative flex items-center justify-center min-h-[400px]">
        <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/50 text-amber-400 px-3 py-1 rounded text-xs font-bold uppercase">
          Graph View básico — interação avançada pendente
        </div>

        <svg width="100%" height="400" className="absolute inset-0 z-0">
          {clusters.map((c: any, i: number) => {
            const cx = (i + 1) * 25 + '%';
            return <line key={c.id} x1="50%" y1="20%" x2={cx} y2="50%" stroke="#334155" strokeWidth="2" />;
          })}
        </svg>

        <div className="z-10 w-full h-full flex flex-col items-center">
          {/* Pilar */}
          <div 
            onClick={() => setSelectedNode(pilar)}
            className={`mt-4 px-6 py-4 rounded-full border-2 cursor-pointer shadow-lg shadow-purple-500/20 ${selectedNode?.id === pilar.id ? 'border-purple-400 bg-purple-900/50' : 'border-purple-600 bg-slate-800'}`}
          >
            <div className="text-purple-300 font-bold text-center">{pilar.keyword}</div>
            <div className="text-[10px] text-purple-400/70 text-center uppercase">Pilar Central</div>
          </div>

          {/* Clusters */}
          <div className="flex w-full justify-around mt-24">
            {clusters.map((c: any) => (
              <div key={c.id} className="flex flex-col items-center">
                <div 
                  onClick={() => setSelectedNode(c)}
                  className={`px-4 py-3 rounded-lg border-2 cursor-pointer shadow-lg shadow-blue-500/20 ${selectedNode?.id === c.id ? 'border-blue-400 bg-blue-900/50' : 'border-blue-600 bg-slate-800'}`}
                >
                  <div className="text-blue-300 font-bold text-center text-sm">{c.keyword}</div>
                </div>
                
                {/* Artigos (pontos menores simulados) */}
                <div className="flex gap-2 mt-4">
                  {data.nodes.filter((a: any) => a.parentId === c.id).map((a: any) => (
                    <div 
                      key={a.id} 
                      onClick={() => setSelectedNode(a)}
                      title={a.keyword}
                      className={`w-4 h-4 rounded-full cursor-pointer ${selectedNode?.id === a.id ? 'bg-emerald-400' : 'bg-emerald-600'}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans flex flex-col md:flex-row gap-8">
      {/* Esquerda: Visualizador */}
      <div className="flex-1 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Topic Cluster Engine</h1>
          <p className="text-slate-400">Arquitetura Estratégica, Pilares e Cobertura Temática.</p>
        </header>

        {/* Header Analítico (Score) */}
        {data && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg">
            <div className="flex gap-12">
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Cluster Health Score</div>
                <div className="text-4xl font-extrabold text-emerald-400">{data.metrics.healthScore}</div>
              </div>
              <div className="border-l border-slate-700 pl-8">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Cobertura Temática</div>
                <div className="text-2xl font-bold text-white">{data.metrics.coverage}%</div>
              </div>
              <div className="border-l border-slate-700 pl-8">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Páginas Órfãs</div>
                <div className="text-2xl font-bold text-red-400">{data.metrics.orphans}</div>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-400">Motor: <span className="text-indigo-400 font-bold">{data.sources.architecture}</span></div>
              <div className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-400">Prioridade: <span className="text-slate-300">{data.sources.priority}</span></div>
              <div className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-400">DB: <span className="text-emerald-400">{data.sources.existingDb}</span></div>
            </div>
          </div>
        )}

        {/* Controles de Geracao e View */}
        <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <input 
              type="text" 
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)} 
              className="flex-1 md:w-64 px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
              placeholder="Seed Keyword (Ex: CRM)"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !keyword}
              className={`px-6 py-2 rounded font-bold transition flex items-center space-x-2 ${loading || !keyword ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {loading ? 'Arquitetando...' : 'Gerar Cluster'}
            </button>
          </div>

          <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
            <button onClick={() => setView('tree')} className={`px-4 py-1.5 text-xs font-bold rounded ${view === 'tree' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Tree View</button>
            <button onClick={() => setView('graph')} className={`px-4 py-1.5 text-xs font-bold rounded ${view === 'graph' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Graph View</button>
            <button onClick={() => setView('list')} className={`px-4 py-1.5 text-xs font-bold rounded ${view === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>List View</button>
          </div>
        </div>

        {/* View Container */}
        {data && (
          <div className="bg-[#0f172a]/50 p-6 rounded-xl border border-slate-700/50 min-h-[500px]">
            {view === 'tree' && renderTree(null, 0)}
            {view === 'list' && renderList()}
            {view === 'graph' && renderGraph()}
          </div>
        )}
      </div>

      {/* Painel Lateral do Nó */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl sticky top-8 shadow-2xl overflow-hidden min-h-[600px]">
          <div className="bg-indigo-600/20 border-b border-indigo-500/30 px-5 py-4">
            <h2 className="font-bold text-indigo-400 text-sm tracking-wider uppercase">Nó Selecionado</h2>
          </div>
          
          <div className="p-5">
            {!selectedNode ? (
              <div className="text-center text-slate-500 text-sm py-12">
                Selecione um Pilar, Cluster ou Artigo para ver os detalhes.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded uppercase font-bold">{selectedNode.type}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs rounded uppercase font-bold">{selectedNode.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">{selectedNode.keyword}</h3>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Search Intent</div>
                    <div className="text-sm font-semibold text-amber-400">{selectedNode.intent || 'Pendente'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Prioridade Sugerida</div>
                    <div className="text-sm text-white">{selectedNode.priority || 'Pendente'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Ordem Ideal de Publicação</div>
                    <div className="text-sm font-mono text-indigo-300">Passo {selectedNode.order}</div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Sugestão de URL (Slug)</div>
                    <div className="text-xs font-mono bg-black/40 border border-slate-700 p-2 rounded text-slate-300 overflow-hidden text-ellipsis">{selectedNode.slug}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Anchor Text (Para Pilar)</div>
                    <div className="text-xs text-slate-400 italic">"{selectedNode.anchorText || 'N/A'}"</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Schema Markup</div>
                    <div className="text-xs text-emerald-400">{selectedNode.schema || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Categoria</div>
                    <div className="text-xs px-2 py-1 bg-slate-900 border border-slate-700 inline-block rounded text-slate-300">{selectedNode.category || 'N/A'}</div>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold shadow-lg shadow-blue-500/20 transition-all text-sm">
                    Enviar para Content Planner
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
