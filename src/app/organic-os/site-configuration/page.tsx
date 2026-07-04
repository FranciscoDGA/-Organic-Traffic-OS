'use client';

import { useState, useEffect } from 'react';

interface CheckResult {
  id: string;
  name: string;
  status: 'OK' | 'Crítico' | 'Atenção' | 'Pendente';
  details: string;
  urlTested?: string;
  statusCode?: number | null;
}

export default function SiteConfigurationPage() {
  const [domain, setDomain] = useState('passacumaru.com.br');
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    setHasValidated(true);
    try {
      const res = await fetch(`/api/organic-os/site-configuration/validate?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      setChecks(data.checks || []);
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Validation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OK': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>OK</span>;
      case 'Crítico': return <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>Crítico</span>;
      case 'Atenção': return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Atenção</span>;
      case 'Pendente': return <span className="px-2 py-1 bg-slate-600/30 text-slate-400 border border-slate-600/50 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Pendente</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Site Configuration</h1>
            <p className="text-slate-400">Technical SEO & Estrutura de Domínio.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input 
              type="text" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500 w-64"
              placeholder="Ex: dominio.com.br"
            />
            <button 
              onClick={handleValidate}
              disabled={loading}
              className={`px-6 py-2.5 rounded font-bold transition flex items-center space-x-2 ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Validando...
                </>
              ) : (
                'Validar Configuração SEO'
              )}
            </button>
          </div>
        </header>

        {!hasValidated && !loading && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            <p className="text-lg">Insira o domínio do Workspace e clique em "Validar" para iniciar o diagnóstico HTTP real.</p>
          </div>
        )}

        {loading && !checks.length && (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="animate-pulse bg-slate-800/50 h-16 rounded-xl border border-slate-700"></div>)}
          </div>
        )}

        {checks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Resultados da Análise (18 Regras)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checks.map(check => (
                  <div key={check.id} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-200">{check.name}</h3>
                      {getStatusBadge(check.status)}
                    </div>
                    <p className="text-sm text-slate-400">{check.details}</p>
                    
                    {(check.urlTested || check.statusCode) && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-col gap-1">
                        {check.urlTested && <span className="text-[10px] text-indigo-400 truncate" title={check.urlTested}>{check.urlTested}</span>}
                        {check.statusCode && <span className="text-[10px] bg-slate-900/50 px-2 py-0.5 rounded text-slate-400 w-fit">HTTP {check.statusCode}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-4">Logs de Requisição</h2>
              <div className="bg-black/40 border border-slate-700 rounded-lg p-4 h-[600px] overflow-y-auto font-mono text-xs text-green-400 shadow-inner">
                {logs.length === 0 ? (
                  <div className="text-slate-500 italic">Aguardando execução...</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1 pb-1 border-b border-slate-800/50 last:border-0">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
