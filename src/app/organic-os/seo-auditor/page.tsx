'use client';

import { useState } from 'react';

export default function SEOAuditorPage() {
  const [workspace, setWorkspace] = useState('passacumaru');
  const [targetUrl, setTargetUrl] = useState('https://');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<any>(null);
  
  const [filterType, setFilterType] = useState('All'); // All, Críticos, Avisos, SEO Técnico, Conteúdo, Performance, Indexação

  const runAudit = async () => {
    if (!targetUrl || targetUrl.length < 8) {
      setErrorMsg('Informe uma URL válida');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    setData(null);

    try {
      const res = await fetch('/api/organic-os/seo-auditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl })
      });
      const json = await res.json();
      
      if (!res.ok || json.error) {
         setErrorMsg(json.error || 'Erro na auditoria');
      } else {
         setData(json);
      }
    } catch (err: any) {
      setErrorMsg(`Falha de rede: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${new URL(targetUrl).hostname}-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportPDF = () => {
    window.print();
  };

  const filteredIssues = data?.issues?.filter((issue: any) => {
    if (filterType === 'All') return true;
    if (filterType === 'Críticos' && issue.type === 'Critical Issues') return true;
    if (filterType === 'Avisos' && issue.type === 'Warnings') return true;
    if (issue.category === filterType) return true;
    return false;
  }) || [];

  return (
    <div className="bg-[#0B0F19] min-h-screen text-slate-200 font-sans p-8 print:bg-white print:text-black print:p-0">
      
      {/* Header and Search */}
      <header className="mb-12 max-w-5xl mx-auto print:hidden">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-4">
          SEO Auditor
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 uppercase font-bold tracking-widest">
            Auditoria Técnica Real
          </span>
        </h1>
        <p className="text-slate-400 mb-8">Centro de Diagnóstico Técnico. Identifique erros silenciosos antes que afetem seu tráfego.</p>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4">
          <div className="w-48">
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Workspace</label>
            <select value={workspace} onChange={e => setWorkspace(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sm text-white outline-none">
              <option value="passacumaru">PassaCumaru</option>
              <option value="qualoseguro">QualoSeguro</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">URL Inicial</label>
            <div className="flex">
              <input 
                type="url" 
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://meusite.com"
                className="w-full px-4 py-3 bg-slate-900 border-y border-l border-slate-700 rounded-l text-sm text-white outline-none focus:border-indigo-500 font-mono"
              />
              <button 
                onClick={runAudit}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-r transition shadow-lg shadow-indigo-500/20 disabled:bg-slate-700 disabled:shadow-none"
              >
                {loading ? 'Varrendo...' : 'Executar Auditoria'}
              </button>
            </div>
            {errorMsg && <div className="mt-2 text-xs text-red-400 font-bold">{errorMsg}</div>}
            <div className="mt-2 text-[10px] text-slate-500 italic">Crawl limitado — auditoria profunda da URL inicial + ping em até 5 links internos para evitar timeout no servidor.</div>
          </div>
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse print:hidden">
          <div className="h-48 bg-slate-800/40 border border-slate-700/50 rounded-2xl"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-32 bg-slate-800/40 border border-slate-700/50 rounded-xl"></div>
            <div className="h-32 bg-slate-800/40 border border-slate-700/50 rounded-xl"></div>
            <div className="h-32 bg-slate-800/40 border border-slate-700/50 rounded-xl"></div>
            <div className="h-32 bg-slate-800/40 border border-slate-700/50 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Results Dashboard */}
      {data && !loading && (
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold text-white">Relatório de Diagnóstico</h2>
            <div className="flex gap-2">
              <button onClick={exportPDF} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded border border-slate-700">Exportar PDF / Imprimir</button>
              <button onClick={exportJSON} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded border border-slate-700">Exportar JSON</button>
            </div>
          </div>

          <div className="hidden print:block text-center mb-8">
             <h1 className="text-3xl font-bold">SEO Audit Report</h1>
             <p className="text-sm">Target: {targetUrl}</p>
             <p className="text-xs text-gray-500">Gerado em: {new Date().toLocaleString()}</p>
          </div>

          {/* Master Score Board */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center gap-12 print:border-gray-300 print:text-black">
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-slate-800 print:border-gray-200">
                 <div className={`absolute inset-0 rounded-full border-8 border-t-transparent animate-[spin_3s_linear_infinite] opacity-20 ${data.classification === 'Crítico' ? 'border-red-500' : data.classification === 'Excelente' ? 'border-emerald-500' : data.classification === 'Bom' ? 'border-emerald-400' : 'border-amber-500'}`}></div>
                 <div className="flex flex-col items-center">
                    <span className={`text-5xl font-black ${data.classification === 'Crítico' ? 'text-red-400' : data.classification === 'Excelente' ? 'text-emerald-500' : data.classification === 'Bom' ? 'text-emerald-400' : 'text-amber-500'} print:text-black`}>{data.score}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1 print:text-gray-500">SEO Score Geral</span>
                 </div>
              </div>
              <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${data.classification === 'Crítico' ? 'bg-red-500/20 text-red-400' : data.classification === 'Excelente' ? 'bg-emerald-500/20 text-emerald-400' : data.classification === 'Bom' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} print:border print:border-gray-400 print:bg-transparent print:text-black`}>
                {data.classification}
              </div>
            </div>

            <div className="flex-1 w-full">
              <h3 className="font-bold text-white text-lg mb-4 print:text-black">Resumo da Auditoria</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 print:border-gray-300">
                  <div className="text-[10px] uppercase text-slate-500 mb-1">Testes Executados</div>
                  <div className="text-2xl font-bold text-white print:text-black">{data.testsRun}</div>
                </div>
                <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/20 print:border-gray-300">
                  <div className="text-[10px] uppercase text-red-400 mb-1">Critical Issues</div>
                  <div className="text-2xl font-bold text-red-400 print:text-black">{data.criticalCount}</div>
                </div>
                <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-500/20 print:border-gray-300">
                  <div className="text-[10px] uppercase text-amber-400 mb-1">Warnings</div>
                  <div className="text-2xl font-bold text-amber-400 print:text-black">{data.warningCount}</div>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 print:border-gray-300">
                  <div className="text-[10px] uppercase text-blue-400 mb-1">Tempo Gasto</div>
                  <div className="text-2xl font-bold text-blue-400 print:text-black">{data.timeSpent}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Checklist Detalhado (Esquerda) */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 overflow-x-auto print:hidden custom-scrollbar">
                {['All', 'Críticos', 'Avisos', 'SEO Técnico', 'Conteúdo', 'Performance', 'Indexação'].map(f => (
                  <button key={f} onClick={() => setFilterType(f)} className={`px-4 py-1.5 text-xs font-bold rounded flex-shrink-0 ${filterType === f ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>{f}</button>
                ))}
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg print:border-gray-300">
                <table className="w-full text-left text-sm text-slate-300 print:text-black">
                  <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-700 print:bg-gray-100 print:text-black print:border-gray-300">
                    <tr>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Problema Encontrado</th>
                      <th className="px-6 py-3">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Nenhum item nesta categoria. Ótimo trabalho!</td></tr>
                    ) : (
                      filteredIssues.map((issue: any, i: number) => (
                        <tr key={i} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition print:border-gray-200">
                          <td className="px-6 py-4">
                            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border print:border-gray-400 print:text-black ${
                              issue.type === 'Critical Issues' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              issue.type === 'Warnings' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {issue.type === 'Critical Issues' ? 'Crítico' : issue.type === 'Warnings' ? 'Aviso' : 'Oportunidade'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-white print:text-black">{issue.title}</td>
                          <td className="px-6 py-4 text-xs">{issue.category}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              
              <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 print:border-gray-300">
                 <h3 className="font-bold text-white text-sm mb-4 border-b border-slate-700/50 pb-2 print:text-black">Performance (Core Web Vitals)</h3>
                 <div className="flex flex-col items-center justify-center py-4 text-center">
                    <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-amber-400 font-bold text-sm mb-1">Integração pendente</span>
                    <span className="text-xs text-slate-500">A API do Google PageSpeed Insights não está configurada neste ambiente local.</span>
                 </div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 print:border-gray-300">
                 <h3 className="font-bold text-white text-sm mb-4 border-b border-slate-700/50 pb-2 print:text-black">URLs Auditadas em Profundidade</h3>
                 <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {data.auditedUrls.map((u: any, i: number) => (
                       <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded border border-slate-800 print:border-gray-200">
                         <span className="font-mono text-slate-400 truncate pr-4 max-w-[200px]" title={u.url}>{u.url}</span>
                         <span className={`font-bold ${u.status === 200 ? 'text-emerald-400' : 'text-red-400'} print:text-black`}>
                           {u.status}
                         </span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-2 print:hidden">
                <button className="w-full px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold rounded text-xs hover:bg-indigo-600/30 transition">Enviar para Content Planner</button>
                <button className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 font-bold rounded text-xs hover:bg-purple-600/30 transition">Enviar para AI Writer</button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
