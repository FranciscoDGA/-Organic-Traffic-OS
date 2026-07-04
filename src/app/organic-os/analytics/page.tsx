'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AnalyticsDashboardPage() {
  const [workspace, setWorkspace] = useState('passacumaru');
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/analytics');
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
  }, [workspace, period]);

  const simulateBase = async () => {
    try {
      await fetch('/api/organic-os/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate' })
      });
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 flex items-center justify-center">Analisando Inteligência de Tráfego...</div>;
  }

  // Insufficient State
  if (data?.status === 'insufficient') {
    return (
      <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-400">Inteligência de tráfego orgânico.</p>
        </header>

        <div className="flex flex-col items-center justify-center bg-slate-800/20 border border-slate-700/50 rounded-2xl h-96 text-center shadow-lg">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-amber-500">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Integração pendente (GA/GSC não conectados)</h3>
          <p className="text-slate-400 max-w-md">Dados insuficientes. Conecte as contas do Google Analytics e Google Search Console no Workspace Manager para popular este painel.</p>
          <button onClick={simulateBase} className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition shadow-lg shadow-indigo-500/20 text-sm">
            Simular Dados para Teste
          </button>
        </div>
      </div>
    );
  }

  const { metrics, chartData, topPages, topKeywords, opportunities } = data;

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
      
      {/* Header & Filters */}
      <header className="mb-8 flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-4">
            Analytics Dashboard
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30 uppercase font-bold tracking-widest animate-pulse">
              Simulação de Teste
            </span>
          </h1>
          <p className="text-slate-400">Monitoramento real de crescimento orgânico e identificação de anomalias.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <select value={workspace} onChange={e => setWorkspace(e.target.value)} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-white outline-none focus:border-indigo-500">
            <option value="passacumaru">PassaCumaru</option>
            <option value="qualoseguro">QualoSeguro</option>
          </select>

          <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
            <button onClick={() => setPeriod('7d')} className={`px-4 py-1.5 text-xs font-bold rounded ${period === '7d' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>7 dias</button>
            <button onClick={() => setPeriod('30d')} className={`px-4 py-1.5 text-xs font-bold rounded ${period === '30d' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>30 dias</button>
            <button onClick={() => setPeriod('90d')} className={`px-4 py-1.5 text-xs font-bold rounded ${period === '90d' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>90 dias</button>
          </div>
        </div>
      </header>

      {/* Vitals Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Visitas (GA)</div>
          <div className="text-3xl font-black text-white">{metrics.visits.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-bold mt-1">{metrics.visitsTrend}</div>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Impressões (GSC)</div>
          <div className="text-3xl font-black text-white">{metrics.impressions.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-bold mt-1">{metrics.impressionsTrend}</div>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Cliques (GSC)</div>
          <div className="text-3xl font-black text-white">{metrics.clicks.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-bold mt-1">{metrics.clicksTrend}</div>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">CTR (GSC)</div>
          <div className="text-3xl font-black text-white">{metrics.ctr}</div>
          <div className="text-xs text-red-400 font-bold mt-1">{metrics.ctrTrend}</div>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Posição Média</div>
          <div className="text-3xl font-black text-white">{metrics.position}</div>
          <div className="text-xs text-emerald-400 font-bold mt-1">{metrics.positionTrend}</div>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Artigos Publicados</div>
          <div className="text-3xl font-black text-indigo-400">{metrics.publishedArticles}</div>
          <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">Banco Local (Real)</div>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 shadow-lg mb-8 h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white">Tráfego Orgânico (Cliques x Impressões)</h3>
          <span className="text-[9px] bg-slate-700 px-2 py-1 rounded border border-slate-600 uppercase font-bold text-slate-300">Fonte: Simulação de Teste</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="impressoes" name="Impressões" stroke="#6366f1" fillOpacity={1} fill="url(#colorImpressions)" strokeWidth={2} />
            <Area type="monotone" dataKey="cliques" name="Cliques" stroke="#10b981" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Pages */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/60 p-4 border-b border-slate-700">
            <h3 className="font-bold text-white">Top Páginas</h3>
          </div>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Página</th>
                <th className="px-4 py-3 text-right">Cliques</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3 text-right">Posição</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page: any, i: number) => (
                <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-800 transition">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-300 truncate max-w-[200px]">{page.url}</td>
                  <td className="px-4 py-3 text-right font-bold text-white">{page.clicks}</td>
                  <td className="px-4 py-3 text-right">{page.ctr}</td>
                  <td className="px-4 py-3 text-right">{page.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Keywords */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/60 p-4 border-b border-slate-700">
            <h3 className="font-bold text-white">Top Keywords</h3>
          </div>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Keyword</th>
                <th className="px-4 py-3 text-right">Impressões</th>
                <th className="px-4 py-3 text-right">Cliques</th>
                <th className="px-4 py-3 text-right">Posição</th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((kw: any, i: number) => (
                <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-800 transition">
                  <td className="px-4 py-3 font-bold text-white truncate max-w-[200px]">{kw.keyword}</td>
                  <td className="px-4 py-3 text-right">{kw.impressions}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">{kw.clicks}</td>
                  <td className="px-4 py-3 text-right">{kw.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Oportunidades de Atualização (Content Decay & Quick Wins) */}
      <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 shadow-inner">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Oportunidades de Atualização <span className="text-xs font-normal text-slate-500 ml-2">— Content Decay & Quick Wins</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Em Queda */}
          <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-3 border-b border-slate-700 pb-2">Conteúdos em Queda (Decay)</h3>
            {opportunities.falling.map((item: any, i: number) => (
               <div key={i} className="text-xs">
                 <div className="font-mono text-slate-300 truncate mb-1" title={item.url}>{item.url}</div>
                 <div className="flex justify-between items-center font-bold">
                   <span className="text-red-400">{item.drop}</span>
                   <button className="text-[9px] bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 transition">Atualizar Artigo</button>
                 </div>
               </div>
            ))}
          </div>

          {/* Em Crescimento */}
          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-3 border-b border-slate-700 pb-2">Conteúdos em Crescimento</h3>
            {opportunities.growing.map((item: any, i: number) => (
               <div key={i} className="text-xs">
                 <div className="font-mono text-slate-300 truncate mb-1" title={item.url}>{item.url}</div>
                 <div className="flex justify-between items-center font-bold">
                   <span className="text-emerald-400">{item.growth}</span>
                   <button className="text-[9px] bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 transition">Adicionar Links</button>
                 </div>
               </div>
            ))}
          </div>

          {/* Alta Impressão / Baixo CTR */}
          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-3 border-b border-slate-700 pb-2">Alta Impressão & Baixo CTR</h3>
            {opportunities.highImpressionLowCtr.map((item: any, i: number) => (
               <div key={i} className="text-xs">
                 <div className="font-mono text-slate-300 truncate mb-1" title={item.url}>{item.url}</div>
                 <div className="flex justify-between items-center text-slate-400 mb-1">
                   <span>Imp: {item.impressions}</span>
                   <span>CTR: {item.ctr}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] text-amber-400 font-bold">{item.status}</span>
                   <button className="text-[9px] bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 transition">Otimizar Meta</button>
                 </div>
               </div>
            ))}
          </div>

          {/* Órfãos / Sem Tráfego */}
          <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-700 pb-2">Páginas Sem Tráfego (Órfãs)</h3>
            {opportunities.noTraffic.map((item: any, i: number) => (
               <div key={i} className="text-xs">
                 <div className="font-mono text-slate-300 truncate mb-1" title={item.url}>{item.url}</div>
                 <div className="flex justify-between items-center mt-2">
                   <span className="text-[10px] text-slate-500 font-bold">{item.status}</span>
                   <button className="text-[9px] bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 transition">Forçar Index</button>
                 </div>
               </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
