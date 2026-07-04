'use client';

import { useState, useEffect } from 'react';

export default function WorkspacesDashboard() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [expandedWs, setExpandedWs] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    setRunningDiagnostic(true);
    try {
      const res = await fetch('/api/organic-os/workspaces/diagnostics');
      const data = await res.json();
      setWorkspaces(data);
    } catch (err) {
      console.error('Failed to run diagnostics', err);
    } finally {
      setRunningDiagnostic(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchDiagnostics().then(() => {
      if (!mounted) return;
    });
    return () => { mounted = false; };
  }, []);

  const renderStatus = (val: boolean | string | null, label: string) => {
    if (val === true || (typeof val === 'string' && val.length > 0 && val !== 'Integração pendente')) {
      return (
        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
          <span className="text-slate-300 text-sm">{label}</span>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs uppercase font-bold border border-emerald-500/50 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {typeof val === 'string' ? val : 'Conectado'}
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs uppercase font-bold border border-slate-600 flex items-center gap-1">
          Integração pendente
        </span>
      </div>
    );
  };

  const getOverallStatusBadge = (status: string) => {
    switch (status) {
      case 'Online': return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Online</span>;
      case 'Offline': return <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Offline</span>;
      default: return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Atenção</span>;
    }
  };

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Workspace Health</h1>
            <p className="text-slate-400">Diagnóstico de Saúde e Integrações em tempo real.</p>
          </div>
          <button 
            onClick={fetchDiagnostics}
            disabled={runningDiagnostic}
            className={`px-6 py-2.5 rounded font-bold transition flex items-center space-x-2 ${runningDiagnostic ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
          >
            {runningDiagnostic ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processando...
              </>
            ) : (
              'Diagnóstico Completo'
            )}
          </button>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="animate-pulse bg-slate-800/50 h-24 rounded-xl border border-slate-700"></div>)}
          </div>
        ) : (
          <div className="space-y-4">
            {workspaces.map((ws) => (
              <div key={ws.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition-colors duration-300">
                
                {/* Header (Click to expand) */}
                <div 
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-700/20"
                  onClick={() => setExpandedWs(expandedWs === ws.id ? null : ws.id)}
                >
                  <div className="flex items-center space-x-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">{ws.name}</h2>
                      <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        {ws.domain}
                      </div>
                    </div>
                    <div className="hidden md:flex gap-4 px-6 border-l border-slate-700">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Health Score</div>
                        <div className="font-mono text-lg font-bold text-white">{ws.health}/100</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Artigos</div>
                        <div className="font-mono text-lg font-bold text-white">{ws.artigos}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getOverallStatusBadge(ws.status)}
                    <svg className={`w-5 h-5 text-slate-500 transform transition-transform ${expandedWs === ws.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Body (Expanded details) */}
                {expandedWs === ws.id && (
                  <div className="border-t border-slate-700/60 p-6 bg-slate-900/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      
                      {/* Categoria: Dominio e Presenca WEB */}
                      <div>
                        <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                          Presença WEB
                        </h3>
                        {renderStatus(ws.dns, 'Status DNS (Atingível)')}
                        {renderStatus(ws.sitemap, 'Sitemap Encontrado')}
                        {renderStatus(ws.robots, 'Robots.txt Encontrado')}
                        {renderStatus(ws.gsc, 'Google Search Console')}
                        {renderStatus(ws.ga, 'Google Analytics (GA4)')}
                      </div>

                      {/* Categoria: Integracao & Cloud */}
                      <div>
                        <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                          Infraestrutura Cloud
                        </h3>
                        {renderStatus(ws.vercel, 'Vercel Connect')}
                        {renderStatus(ws.supabase, 'Supabase Storage/DB')}
                        {renderStatus(ws.db, 'Banco de Dados (Relacional)')}
                        {renderStatus(ws.bridge, 'Organic Bridge')}
                        {renderStatus(ws.secret, 'App Secret (Auth)')}
                      </div>

                      {/* Categoria: Inteligencia & Jobs */}
                      <div>
                        <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          Inteligência & Motor
                        </h3>
                        {renderStatus(ws.openai, 'OpenAI API Key')}
                        {renderStatus(ws.model, 'Modelo de IA Ativo')}
                        {renderStatus(ws.cron, 'Cron Jobs (Schedules)')}
                        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                          <div>
                            <div className="text-xs text-slate-400">Último Scan Executado</div>
                            <div className="text-sm font-semibold text-slate-200 mt-1">{ws.lastScan || 'Integração pendente'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Última Publicação</div>
                            <div className="text-sm font-semibold text-slate-200 mt-1">{ws.lastPublish || 'Integração pendente'}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
