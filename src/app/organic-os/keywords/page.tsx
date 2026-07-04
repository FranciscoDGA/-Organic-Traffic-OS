'use client';

import { useState } from 'react';

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState('');
  const [workspace, setWorkspace] = useState('passacumaru');
  const [language, setLanguage] = useState('pt-BR');
  const [country, setCountry] = useState('BR');
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleResearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/keywords/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, workspaceId: workspace, language, country })
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSourceBadge = (source: string) => {
    if (source === 'Integração pendente' || source === 'Pendente') {
      return <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600">Pendente</span>;
    }
    if (source.includes('OpenAI')) {
      return <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/50 flex items-center gap-1"><svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>Estimado</span>;
    }
    return <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/50">{source}</span>;
  };

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans flex flex-col md:flex-row gap-8">
      {/* Left Column (Main Engine) */}
      <div className="flex-1 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Keyword Engine</h1>
          <p className="text-slate-400">Inteligência semântica, descoberta de cluster e validação de Search Intent.</p>
        </header>

        {/* Input Controls */}
        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Keyword Principal</label>
              <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                placeholder="Ex: inteligencia artificial no marketing"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Workspace</label>
              <select value={workspace} onChange={e => setWorkspace(e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white">
                <option value="passacumaru">PassaCumaru</option>
                <option value="qualoseguro">QualoSeguro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Idioma / País</label>
              <div className="flex gap-2">
                <input type="text" value={language} onChange={e => setLanguage(e.target.value)} className="w-1/2 px-2 py-2 bg-slate-900 border border-slate-700 rounded text-white text-center" />
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-1/2 px-2 py-2 bg-slate-900 border border-slate-700 rounded text-white text-center" />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleResearch}
            disabled={loading || !keyword}
            className={`w-full md:w-auto px-8 py-3 rounded font-bold transition flex items-center justify-center space-x-2 ${loading || !keyword ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analisando Cluster e Intent...
              </>
            ) : (
              'Analisar Oportunidade'
            )}
          </button>
        </div>

        {/* Results Area */}
        {data && (
          <div className="space-y-6">
            
            {/* Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-xl">
                <div className="text-xs text-slate-400 mb-1 flex items-center">Volume (Mensal) {getSourceBadge(data.volumeSource)}</div>
                <div className="text-xl font-bold text-slate-200">{data.volume}</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-xl">
                <div className="text-xs text-slate-400 mb-1 flex items-center">Dificuldade SEO {getSourceBadge(data.difficultySource)}</div>
                <div className="text-xl font-bold text-slate-200">{data.difficulty}</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-xl">
                <div className="text-xs text-slate-400 mb-1 flex items-center">Custo por Clique (CPC) {getSourceBadge(data.cpcSource)}</div>
                <div className="text-xl font-bold text-slate-200">{data.cpc}</div>
              </div>
            </div>

            {/* AI Generated Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Long Tails */}
              <div className="bg-slate-800/20 border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-bold text-sm">Long Tail Keywords</h3>
                  {getSourceBadge(data.intentSource)}
                </div>
                <ul className="p-4 space-y-2">
                  {data.longTails?.map((lt: string, i: number) => (
                    <li key={i} className="text-sm bg-slate-900/50 p-2 rounded text-slate-300 border border-slate-700/50">{lt}</li>
                  ))}
                  {(!data.longTails || data.longTails.length === 0) && <li className="text-sm text-slate-500">Integração pendente</li>}
                </ul>
              </div>

              {/* People Also Ask */}
              <div className="bg-slate-800/20 border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-bold text-sm">People Also Ask (PAA)</h3>
                  {getSourceBadge(data.intentSource)}
                </div>
                <ul className="p-4 space-y-2">
                  {data.paa?.map((q: string, i: number) => (
                    <li key={i} className="text-sm bg-slate-900/50 p-2 rounded text-slate-300 border border-slate-700/50">{q}</li>
                  ))}
                  {(!data.paa || data.paa.length === 0) && <li className="text-sm text-slate-500">Integração pendente</li>}
                </ul>
              </div>
            </div>

            {/* Structure Ideas */}
            <div className="bg-slate-800/20 border border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-sm">Sugestões de Títulos e Slugs</h3>
                {getSourceBadge(data.intentSource)}
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-400 mb-2">Slug sugerido:</div>
                <code className="px-2 py-1 bg-black rounded text-indigo-400 text-xs mb-4 block w-fit border border-slate-800">{data.slug}</code>
                <div className="text-xs text-slate-400 mb-2 mt-4">Títulos gerados:</div>
                <ul className="space-y-2">
                  {data.titles?.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-slate-200 bg-slate-900/40 p-2 rounded border border-slate-700/30">{t}</li>
                  ))}
                  {(!data.titles || data.titles.length === 0) && <li className="text-sm text-slate-500">Integração pendente</li>}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Right Column (Side Panel as requested) */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl sticky top-8 shadow-2xl overflow-hidden">
          <div className="bg-indigo-600/20 border-b border-indigo-500/30 px-5 py-4">
            <h2 className="font-bold text-indigo-400 text-sm tracking-wider uppercase">Painel de Ação</h2>
          </div>
          
          <div className="p-5 space-y-6">
            
            {/* Status */}
            <div>
              <div className="text-xs text-slate-400 mb-1">Status da Keyword</div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded text-xs font-bold uppercase">{data?.status || 'Aguardando'}</span>
            </div>

            {/* Info consolidada */}
            <div className="space-y-4 pt-4 border-t border-slate-700/50">
              <div>
                <div className="text-xs text-slate-500 mb-1">Keyword Principal</div>
                <div className="text-sm font-semibold text-white">{data?.keyword || '...'}</div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 mb-1">Cluster Semântico</div>
                <div className="text-sm font-semibold text-indigo-300">{data?.cluster || '...'}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Search Intent</div>
                <div className="text-sm text-white">
                  {data?.intent ? (
                    <span className="px-2 py-0.5 bg-slate-900 rounded text-amber-400 border border-slate-700 inline-block">{data.intent}</span>
                  ) : '...'}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Categorias Recomendadas</div>
                <div className="flex flex-wrap gap-1">
                  {data?.categories?.map((c: string, i: number) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">{c}</span>) || <span className="text-xs text-slate-600">...</span>}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 mb-1">Schema Markup</div>
                <div className="text-sm text-slate-300 font-mono text-xs">{data?.schema || '...'}</div>
              </div>
            </div>

            {/* Canibalizacao */}
            <div className="p-3 bg-black/40 rounded-lg border border-slate-700/50 space-y-2">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Canibalização</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {data?.cannibalization || 'Aguardando verificação'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Conteúdo Existente</div>
                <div className="text-xs text-slate-400">{data?.existingContent || '...'}</div>
              </div>
            </div>

            <button 
              disabled={!data || data.status === 'Aguardando'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded font-bold shadow-lg shadow-blue-500/20 transition-all text-sm"
            >
              Criar no Content Planner
            </button>
            
          </div>
        </div>
      </div>

    </div>
  );
}
