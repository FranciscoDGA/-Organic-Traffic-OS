'use client';

import { useState } from 'react';

export default function CompetitorAnalysisPage() {
  const [myUrl, setMyUrl] = useState('https://');
  const [comp1, setComp1] = useState('https://');
  const [comp2, setComp2] = useState('');
  const [comp3, setComp3] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<any>(null);

  const runAnalysis = async () => {
    if (!myUrl || myUrl.length < 8) {
      setErrorMsg('Insira pelo menos a sua URL inicial');
      return;
    }
    if (!comp1 || comp1.length < 8) {
      setErrorMsg('Insira pelo menos 1 concorrente para comparar');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setData(null);

    const competitors = [comp1, comp2, comp3].filter(c => c && c.length > 5);

    try {
      const res = await fetch('/api/organic-os/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myUrl, competitors })
      });
      const json = await res.json();
      
      if (!res.ok || json.error) {
         setErrorMsg(json.error || 'Erro na análise');
      } else {
         setData(json);
      }
    } catch (err: any) {
      setErrorMsg(`Falha de rede: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanner = () => {
    console.log("Action: Gaps enviados para o Content Planner");
    alert("Gaps enviados para o Content Planner (Log registrado)");
  };

  const handleWriter = () => {
    console.log("Action: Dados enviados para o AI Writer");
    alert("Esqueleto enviado para o AI Writer (Log registrado)");
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-slate-200 font-sans p-8">
      
      <header className="mb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-4">
          Competitor Analysis
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 uppercase font-bold tracking-widest">
            Espionagem de Estrutura
          </span>
        </h1>
        <p className="text-slate-400 mb-8">Varredura profunda e simultânea para identificar brechas de conteúdo nos seus concorrentes.</p>

        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl shadow-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Seu Site (Alvo)</label>
              <input 
                type="url" 
                value={myUrl}
                onChange={e => setMyUrl(e.target.value)}
                placeholder="https://meusite.com"
                className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded text-sm text-emerald-100 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-red-400 uppercase font-bold tracking-wider mb-2">Concorrente Principal</label>
              <input 
                type="url" 
                value={comp1}
                onChange={e => setComp1(e.target.value)}
                placeholder="https://concorrente1.com"
                className="w-full px-4 py-3 bg-slate-900 border border-red-500/30 rounded text-sm text-red-100 outline-none focus:border-red-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-2">Concorrente 2 (Opcional)</label>
              <input 
                type="url" 
                value={comp2}
                onChange={e => setComp2(e.target.value)}
                placeholder="https://concorrente2.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sm text-slate-300 outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-2">Concorrente 3 (Opcional)</label>
              <input 
                type="url" 
                value={comp3}
                onChange={e => setComp3(e.target.value)}
                placeholder="https://concorrente3.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sm text-slate-300 outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 italic max-w-md">
              A varredura fará o download da infraestrutura HTML das URLs em paralelo (Timeout: 8s). Volume de buscas e backlinks dependem de API externa.
            </div>
            <div className="flex items-center gap-4">
              {errorMsg && <span className="text-xs text-red-400 font-bold">{errorMsg}</span>}
              <button 
                onClick={runAnalysis}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition shadow-lg shadow-indigo-500/20 disabled:bg-slate-700 disabled:shadow-none flex items-center gap-2"
              >
                {loading && (
                   <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                )}
                {loading ? 'Extraindo Esqueletos...' : 'Comparar Concorrentes'}
              </button>
            </div>
          </div>

        </div>
      </header>


      {data && !loading && (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Alertas de Integração Pendente */}
          <div className="bg-amber-900/20 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
            <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <h3 className="font-bold text-amber-400 text-sm">Integração pendente (Métricas de Autoridade)</h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Volume de Palavras-chave, Tráfego Estimado, Backlinks e Domain Authority (DA/DR) requerem conexão ativa com <strong>DataForSEO, Ahrefs ou Semrush</strong>. Estas métricas estão ocultas da tabela para evitar a exibição de dados falsos ou simulados.
              </p>
            </div>
          </div>

          {/* Tabela Lado a Lado */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-x-auto shadow-xl custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
              <thead className="bg-slate-900/80 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-slate-500 w-48">Métrica (Crawl Real)</th>
                  <th className="px-6 py-4 border-l border-emerald-500/20 bg-emerald-900/10">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Seu Site</div>
                    <div className="font-mono text-xs text-white truncate max-w-[200px]" title={data.mySite.url}>{data.mySite.url}</div>
                  </th>
                  {data.competitors.map((comp: any, i: number) => (
                    <th key={i} className="px-6 py-4 border-l border-red-500/20 bg-red-900/5">
                      <div className="text-[10px] uppercase font-bold text-red-400 mb-1">Concorrente {i+1}</div>
                      <div className="font-mono text-xs text-white truncate max-w-[200px]" title={comp.url}>{comp.url}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                
                {/* Error Row if any */}
                {[data.mySite, ...data.competitors].some(c => c.error) && (
                  <tr className="bg-red-900/10">
                    <td className="px-6 py-3 font-bold text-red-400 text-xs">Status do Crawl</td>
                    <td className="px-6 py-3 border-l border-emerald-500/20 text-xs">{data.mySite.error ? <span className="text-red-400 font-bold">{data.mySite.error}</span> : <span className="text-emerald-400">200 OK</span>}</td>
                    {data.competitors.map((c: any, i: number) => (
                      <td key={i} className="px-6 py-3 border-l border-red-500/20 text-xs">{c.error ? <span className="text-red-400 font-bold">{c.error}</span> : <span className="text-emerald-400">200 OK</span>}</td>
                    ))}
                  </tr>
                )}

                {/* Data Rows */}
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">Title Length</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 font-mono text-xs">{data.mySite.title?.length || 0} chars</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 font-mono text-xs">{c.title?.length || 0} chars</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">Title Principal</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 text-xs text-emerald-100 max-w-[200px] truncate" title={data.mySite.title}>{data.mySite.title}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 text-xs text-red-100 max-w-[200px] truncate" title={c.title}>{c.title}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">H1 Encontrados</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 font-mono text-xs">{data.mySite.h1s?.length || 0}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 font-mono text-xs">{c.h1s?.length || 0}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">H2 Encontrados (Profundidade)</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 font-mono text-xs">{data.mySite.h2Count || 0}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 font-mono text-xs">{c.h2Count || 0}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">Word Count (Corpo)</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 font-bold text-white text-sm">{data.mySite.wordCount || 0}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 font-bold text-white text-sm">{c.wordCount || 0}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">Links Internos na Página</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 text-xs">{data.mySite.internalLinks || 0}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 text-xs">{c.internalLinks || 0}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">Schema.org Presente</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 text-xs">{data.mySite.schemaDetected ? '✅ Sim' : '❌ Não'}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 text-xs">{c.schemaDetected ? '✅ Sim' : '❌ Não'}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">FAQ Detectada</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 text-xs">{data.mySite.faqDetected ? '✅ Sim' : '❌ Não'}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 text-xs">{c.faqDetected ? '✅ Sim' : '❌ Não'}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-400 text-xs">Call to Action (CTA) Detectado</td>
                  <td className="px-6 py-3 border-l border-emerald-500/20 text-xs">{data.mySite.ctaDetected ? '✅ Sim' : '❌ Não'}</td>
                  {data.competitors.map((c: any, i: number) => (
                    <td key={i} className="px-6 py-3 border-l border-red-500/20 text-xs">{c.ctaDetected ? '✅ Sim' : '❌ Não'}</td>
                  ))}
                </tr>
                
              </tbody>
            </table>
          </div>

          {/* Gaps de Conteúdo (OpenAI) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-slate-800/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                {data.aiStatus}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Gaps Temáticos e Insights da Inteligência Artificial
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-red-400 mb-2">O que eles cobrem e você NÃO cobre:</h3>
                  <ul className="space-y-2">
                    {data.gaps.topicsNotCovered.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-red-500 mt-1">✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 mb-2">Recomendações Diretas de Estrutura:</h3>
                  <ul className="space-y-2">
                    {data.gaps.recommendations.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-emerald-500 mt-1">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-indigo-400 mb-2">Palavras-chave Inferidas (Sugeridas):</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.gaps.keywordsOpportunities.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-mono">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Ações */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col justify-center gap-4">
              <h3 className="font-bold text-white text-center mb-2">Próximos Passos</h3>
              
              <button onClick={handlePlanner} className="w-full px-4 py-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl text-sm transition flex flex-col items-center justify-center gap-1">
                <span>Enviar Gap para Content Planner</span>
                <span className="text-[10px] font-normal text-emerald-500/70">Gerar nova pauta a partir da falha</span>
              </button>
              
              <button onClick={handleWriter} className="w-full px-4 py-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 font-bold rounded-xl text-sm transition flex flex-col items-center justify-center gap-1">
                <span>Enviar Esqueleto para AI Writer</span>
                <span className="text-[10px] font-normal text-purple-500/70">Reescrever e expandir a sua página</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
