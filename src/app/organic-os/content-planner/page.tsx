'use client';

import { useState, useEffect } from 'react';

export default function ContentPlannerPage() {
  const [workspace, setWorkspace] = useState('passacumaru');
  const [view, setView] = useState<'kanban' | 'calendar' | 'list'>('kanban');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<string>('');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/content-planner');
      const json = await res.json();
      setItems(json.data || []);
      setDbStatus(json.dbStatus || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const simulateImport = async () => {
    try {
      const dummyItem = {
        keyword: 'Importado de Topic Cluster - Teste ' + Math.floor(Math.random() * 100),
        status: 'Ideia',
        priority: 'Alta',
        cluster: 'Inteligência Artificial',
        type: 'Artigo',
      };
      await fetch('/api/organic-os/content-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dummyItem)
      });
      fetchPlan();
    } catch(err) {
      console.error(err);
    }
  };

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/organic-os/content-planner', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { status: newStatus } })
      });
      fetchPlan();
    } catch (err) {
      console.error(err);
    }
  };

  // Derived state
  const filteredItems = items.filter(item => {
    if (workspace !== 'all' && item.workspaceId !== 'default' && item.workspaceId !== workspace) return true; // simplified matching
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    if (filterPriority !== 'All' && item.priority !== filterPriority) return false;
    return true;
  });

  const kanbanColumns = ['Ideia', 'Planejado', 'Em produção', 'Revisão', 'Aprovado', 'Publicado'];

  const getSourceBadge = (source: string) => {
    if (source?.includes('OpenAI')) return <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded border border-purple-500/30">OpenAI (Estimado)</span>;
    if (source?.includes('Local')) return <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded border border-blue-500/30">Banco Local (Real)</span>;
    return <span className="text-[9px] bg-slate-500/20 text-slate-400 px-1 py-0.5 rounded border border-slate-500/30">Pendente</span>;
  };

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Content Planner</h1>
              {dbStatus && (
                <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {dbStatus}
                </span>
              )}
            </div>
            <p className="text-slate-400 max-w-2xl">Transforme keywords e clusters em um plano de produção editorial organizado. Esta tela apenas planeja — publicações reais são travadas nesta etapa.</p>
          </div>

          <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 w-fit">
            <button onClick={() => setView('kanban')} className={`px-4 py-1.5 text-xs font-bold rounded ${view === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Kanban</button>
            <button onClick={() => setView('calendar')} className={`px-4 py-1.5 text-xs font-bold rounded ${view === 'calendar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Calendário</button>
            <button onClick={() => setView('list')} className={`px-4 py-1.5 text-xs font-bold rounded ${view === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Lista</button>
          </div>
        </header>

        {/* Filters Toolbar */}
        <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl mb-8 flex flex-wrap gap-4 items-center shadow-lg">
          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Workspace</label>
            <select value={workspace} onChange={e => setWorkspace(e.target.value)} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white focus:border-indigo-500 outline-none">
              <option value="passacumaru">PassaCumaru</option>
              <option value="qualoseguro">QualoSeguro</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Prioridade</label>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white focus:border-indigo-500 outline-none">
              <option value="All">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Status (Filtro Kanban)</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white focus:border-indigo-500 outline-none">
              <option value="All">Todos</option>
              {kanbanColumns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          
          <div className="ml-auto flex gap-2">
            <button onClick={simulateImport} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-bold rounded shadow-sm transition">
              + Simular Importação de Cluster
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex gap-4 h-64">
            {[1,2,3].map(i => <div key={i} className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl animate-pulse"></div>)}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center bg-slate-800/20 border border-slate-700/50 rounded-2xl h-96 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Plano Editorial Vazio</h3>
                <p className="text-slate-400 max-w-md">Nenhum conteúdo no funil. Adicione itens enviando a partir do Topic Cluster ou Keyword Research.</p>
                <button onClick={simulateImport} className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition shadow-lg shadow-indigo-500/20">
                  Gerar Plano Simulado
                </button>
              </div>
            )}

            {/* KANBAN VIEW */}
            {items.length > 0 && view === 'kanban' && (
              <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-300px)] items-start">
                {kanbanColumns.map(col => {
                  if (filterStatus !== 'All' && filterStatus !== col) return null;
                  
                  const colItems = filteredItems.filter(i => i.status === col);
                  
                  return (
                    <div key={col} className="w-80 flex-shrink-0 flex flex-col bg-slate-800/40 border border-slate-700/60 rounded-xl max-h-full">
                      <div className="p-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/50 rounded-t-xl sticky top-0">
                        <h3 className="font-bold text-slate-200">{col}</h3>
                        <span className="text-xs bg-slate-900 px-2 py-0.5 rounded-full text-slate-400">{colItems.length}</span>
                      </div>
                      
                      <div className="p-3 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                        {colItems.map(item => (
                          <div key={item.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg shadow-sm hover:border-slate-500 transition group relative">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${item.priority === 'Alta' ? 'bg-red-500/20 text-red-400 border-red-500/30' : item.priority === 'Média' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-700 text-slate-300'} border`}>
                                {item.priority}
                              </span>
                              {getSourceBadge(item.source)}
                            </div>
                            
                            <h4 className="font-bold text-white text-sm mb-1 line-clamp-2" title={item.keyword}>{item.keyword}</h4>
                            <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              {item.cluster}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              <span className="text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-500 border border-slate-700">{item.intent}</span>
                              <span className="text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-500 border border-slate-700">{item.type}</span>
                            </div>

                            {/* Actions Overlay / Dropdown (Simulated with simple buttons for validation) */}
                            <div className="pt-3 border-t border-slate-800 flex gap-2">
                              {col === 'Ideia' && <button onClick={() => changeStatus(item.id, 'Planejado')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold py-1.5 rounded text-slate-300">Marcar Planejado</button>}
                              {col === 'Planejado' && <button onClick={() => changeStatus(item.id, 'Em produção')} className="flex-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-[10px] font-bold py-1.5 rounded text-indigo-300 border border-indigo-500/30">Enviar p/ AI Writer</button>}
                              {col === 'Em produção' && <button onClick={() => changeStatus(item.id, 'Revisão')} className="flex-1 bg-amber-600/30 hover:bg-amber-600/50 text-[10px] font-bold py-1.5 rounded text-amber-300 border border-amber-500/30">Enviar p/ Revisão</button>}
                              {col === 'Revisão' && <button onClick={() => changeStatus(item.id, 'Aprovado')} className="flex-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-[10px] font-bold py-1.5 rounded text-emerald-300 border border-emerald-500/30">Marcar Aprovado</button>}
                              {col === 'Aprovado' && <button onClick={() => changeStatus(item.id, 'Publicado')} className="flex-1 bg-blue-600/30 hover:bg-blue-600/50 text-[10px] font-bold py-1.5 rounded text-blue-300 border border-blue-500/30">Agendar Publicação</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST VIEW */}
            {items.length > 0 && view === 'list' && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4">Tópico / Keyword</th>
                      <th className="px-6 py-4">Cluster</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Prioridade</th>
                      <th className="px-6 py-4">Data Sugerida</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 font-semibold text-white">
                          {item.keyword}
                          <div className="flex items-center gap-2 mt-1">
                            {getSourceBadge(item.source)}
                            <span className="text-[10px] text-slate-500">Risco Canibalização: {item.cannibalizationRisk}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">{item.cluster}</td>
                        <td className="px-6 py-4 text-xs font-bold text-indigo-300">{item.status}</td>
                        <td className="px-6 py-4 text-xs">{item.priority}</td>
                        <td className="px-6 py-4 text-xs font-mono">{item.suggestedDate}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded font-bold">Ver Detalhes</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CALENDAR VIEW (Basic representation) */}
            {items.length > 0 && view === 'calendar' && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Próximos 7 Dias</h3>
                  <div className="text-sm text-slate-400">Layout GRID Simplificado para Validação</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {[...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    const dayItems = filteredItems.filter(item => item.suggestedDate === dateStr);
                    
                    return (
                      <div key={i} className="border border-slate-700/50 bg-slate-900/50 rounded-lg min-h-[150px] flex flex-col">
                        <div className="p-2 border-b border-slate-800 bg-slate-800/50 text-center text-xs font-bold text-slate-400">
                          {d.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="p-2 space-y-2 flex-1">
                          {dayItems.map(item => (
                            <div key={item.id} className="bg-indigo-900/30 border border-indigo-500/30 p-1.5 rounded text-[10px] text-indigo-200 truncate cursor-pointer hover:bg-indigo-800/50" title={item.keyword}>
                              {item.keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </>
        )}
      </div>
    </div>
  );
}
