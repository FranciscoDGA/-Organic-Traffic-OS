'use client';

import { useState, useEffect } from 'react';

export default function InternalLinkingPage() {
  const [workspace, setWorkspace] = useState('passacumaru');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [actionLogs, setActionLogs] = useState<string[]>([]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/internal-linking');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workspace]);

  const simulateBase = async () => {
    try {
      await fetch('/api/organic-os/internal-linking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate' })
      });
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  const addLog = (msg: string) => {
    setActionLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 4));
  };

  const handleAction = (suggestionId: string, actionName: string) => {
    // Regra: "Nenhum deles deve editar artigo real automaticamente ou publicar."
    addLog(`Ação "${actionName}" registrada localmente para a sugestão ${suggestionId}. Banco persistente não alterado.`);
  };

  if (loading) {
    return <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 flex items-center justify-center">Carregando malha...</div>;
  }

  // Base Insuficiente State
  if (data?.status === 'insufficient') {
    return (
      <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Internal Linking Engine</h1>
          <p className="text-slate-400">Motor semântico de conexões entre Pilares, Clusters e Artigos.</p>
        </header>

        <div className="flex flex-col items-center justify-center bg-slate-800/20 border border-slate-700/50 rounded-2xl h-96 text-center shadow-lg">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Base insuficiente para calcular links</h3>
          <p className="text-slate-400 max-w-md">Não há artigos reais no momento para orquestrar as sugestões e calcular pontuações.</p>
          <button onClick={simulateBase} className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition shadow-lg shadow-indigo-500/20 text-sm">
            Simular Base para Teste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans flex flex-col md:flex-row gap-8">
      
      <div className="flex-1 max-w-5xl">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-4">
              Internal Linking
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30 uppercase font-bold tracking-widest animate-pulse">
                Simulação de Teste
              </span>
            </h1>
            <p className="text-slate-400">Fortalecimento da autoridade temática e prevenção de páginas órfãs.</p>
          </div>
          
          <select value={workspace} onChange={e => setWorkspace(e.target.value)} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-white outline-none">
            <option value="passacumaru">PassaCumaru</option>
            <option value="qualoseguro">QualoSeguro</option>
          </select>
        </header>

        {/* Dashboard Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow-lg col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Internal Link Score</div>
            <div className="text-4xl font-black text-emerald-400">{data?.score}/100</div>
            <div className="text-xs text-slate-400 mt-2">Grau de coesão temática</div>
          </div>
          
          <div className="col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.alerts?.map((alert: any, i: number) => (
              <div key={i} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{alert.type}</div>
                <div className={`text-2xl font-bold ${alert.severity === 'Crítica' || alert.severity === 'Alta' && alert.count > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                  {alert.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de Conexões (Graph) */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 relative flex items-center justify-center min-h-[400px] mb-8 shadow-inner">
          <div className="absolute top-4 left-4 font-bold text-slate-300 text-sm">Mapa de Conexões Visuais</div>
          <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/50 text-amber-400 px-3 py-1 rounded text-[10px] font-bold uppercase">
            Graph View básico — interação avançada pendente
          </div>

          <svg width="100%" height="400" className="absolute inset-0 z-0 pointer-events-none">
            {data?.links?.map((link: any, i: number) => {
              // Basic fake coordinates for rendering SVG lines just to fulfill the native SVG requirement visually
              const sX = link.sourceId === 'n1' ? '50%' : link.sourceId === 'n2' ? '30%' : '70%';
              const sY = link.sourceId === 'n1' ? '20%' : '50%';
              const tX = link.targetId === 'n2' ? '30%' : link.targetId === 'n3' ? '70%' : link.targetId === 'n7' ? '80%' : '20%';
              const tY = link.targetId === 'n2' ? '50%' : link.targetId === 'n3' ? '50%' : link.targetId === 'n7' ? '80%' : '80%';
              return (
                <line 
                  key={i} 
                  x1={sX} y1={sY} x2={tX} y2={tY} 
                  stroke={link.status === 'Quebrado' ? '#ef4444' : '#3b82f6'} 
                  strokeWidth="2" 
                  strokeDasharray={link.status === 'Quebrado' ? '4 4' : '0'} 
                  opacity="0.5"
                />
              );
            })}
          </svg>

          <div className="z-10 w-full h-full relative">
            {data?.nodes?.map((node: any) => {
              // Fake positions based on ID
              let top = '50%', left = '50%', color = 'bg-slate-800 border-blue-500 text-blue-300';
              if (node.id === 'n1') { top = '15%'; left = '43%'; color = 'bg-purple-900/50 border-purple-500 text-purple-300 shadow-purple-500/20 shadow-lg'; }
              if (node.id === 'n2') { top = '45%'; left = '20%'; color = 'bg-blue-900/50 border-blue-500 text-blue-300 shadow-blue-500/20 shadow-lg'; }
              if (node.id === 'n3') { top = '45%'; left = '60%'; color = 'bg-blue-900/50 border-blue-500 text-blue-300 shadow-blue-500/20 shadow-lg'; }
              if (node.id === 'n4') { top = '75%'; left = '10%'; color = 'bg-emerald-900/50 border-emerald-500 text-emerald-300 shadow-emerald-500/20 shadow-lg'; }
              if (node.id === 'n5') { top = '75%'; left = '50%'; color = 'bg-emerald-900/50 border-emerald-500 text-emerald-300 shadow-emerald-500/20 shadow-lg'; }
              if (node.id === 'n6') { top = '15%'; left = '75%'; color = 'bg-red-900/50 border-red-500 text-red-300 shadow-red-500/20 shadow-lg animate-pulse'; } // Órfão
              if (node.id === 'n7') { top = '75%'; left = '75%'; color = 'bg-slate-800 border-slate-500 text-slate-400 opacity-50'; } // Quebrado
              
              return (
                <div key={node.id} className={`absolute px-4 py-2 rounded-full border-2 text-xs font-bold ${color}`} style={{ top, left }}>
                  {node.label}
                  {node.id === 'n6' && <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded">ÓRFÃO</div>}
                  {node.id === 'n7' && <div className="absolute -top-3 -right-3 bg-slate-600 text-white text-[9px] px-1.5 py-0.5 rounded">404</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabela de Sugestões de Links */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="bg-slate-800/60 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-white">Recomendações de Otimização Semântica</h3>
          </div>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Relação</th>
                <th className="px-6 py-3">Origem → Destino</th>
                <th className="px-6 py-3">Anchor Text Sugerido</th>
                <th className="px-6 py-3">Fonte</th>
                <th className="px-6 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {data?.suggestions?.map((sug: any) => (
                <tr key={sug.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">{sug.type}</span>
                    {sug.priority.includes('Crítica') && <span className="ml-2 text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold uppercase">{sug.priority}</span>}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="text-white">{sug.sourceArticle}</span> <br/>
                    <span className="text-slate-500">→ {sug.targetArticle}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-indigo-300 bg-black/40 border border-slate-700 px-2 py-1 rounded">"{sug.anchorText}"</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {sug.origin}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex flex-col gap-1 items-end">
                    <button onClick={() => handleAction(sug.id, 'Aplicar sugestão (Aprovação Local)')} className="text-[10px] bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-bold uppercase w-32 text-center">Aplicar Sugestão</button>
                    <button onClick={() => handleAction(sug.id, 'Enviar para AI Writer')} className="text-[10px] bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-2 py-1 rounded font-bold uppercase w-32 text-center">AI Writer</button>
                    <button onClick={() => handleAction(sug.id, 'Enviar para Organic Publisher')} className="text-[10px] bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded font-bold uppercase w-32 text-center">Organic Publisher</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Painel Lateral (Logs) */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl sticky top-8 shadow-2xl overflow-hidden min-h-[400px]">
          <div className="bg-slate-900 border-b border-slate-800 px-5 py-4 flex justify-between items-center">
            <h2 className="font-bold text-slate-300 text-sm tracking-wider uppercase">Logs de Ação</h2>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          
          <div className="p-4 space-y-3 font-mono text-[10px] text-slate-400">
            {actionLogs.length === 0 ? (
              <div className="text-slate-600 italic">Nenhuma ação registrada na sessão atual. Lembre-se: botões apenas registram aprovações locais, sem editar artigos diretamente.</div>
            ) : (
              actionLogs.map((log, i) => (
                <div key={i} className="pb-2 border-b border-slate-700/50 last:border-0">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
