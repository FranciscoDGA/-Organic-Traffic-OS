'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Workspaces');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState('All');

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/settings/diagnostics');
      const json = await res.json();
      setData(json);

      // Fetch logs
      const resLogs = await fetch('/api/organic-os/settings/logs');
      const jsonLogs = await resLogs.json();
      setLogs(jsonLogs.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'Conectado' || status === 'OK') {
       return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{status}</span>
    }
    if (status.includes('Atenção')) {
       return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">{status}</span>
    }
    return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">{status}</span>
  };

  const tabs = [
    { name: 'Workspaces', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Inteligência Artificial', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'SEO Providers', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { name: 'Infraestrutura', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    { name: 'Segurança', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { name: 'Sistema', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Backup', icon: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' },
    { name: 'Logs', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' }
  ];

  const renderContent = () => {
    if (loading || !data) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
           <svg className="w-12 h-12 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           <div className="text-slate-400 font-bold">Inspecionando Infraestrutura do Servidor...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Workspaces':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Workspaces Registrados</h2>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900/80 border-b border-slate-700">
                   <tr><th className="px-6 py-3">Workspace</th><th className="px-6 py-3">Domínio</th><th className="px-6 py-3">Organic Bridge</th><th className="px-6 py-3">Status</th></tr>
                 </thead>
                 <tbody>
                   <tr className="border-b border-slate-700/50 hover:bg-slate-800/50">
                     <td className="px-6 py-4 font-bold text-white">PassaCumaru</td><td className="px-6 py-4 font-mono text-xs">passacumaru.com.br</td><td className="px-6 py-4"><StatusBadge status="Integração pendente" /></td><td className="px-6 py-4"><StatusBadge status="Atenção" /></td>
                   </tr>
                   <tr className="hover:bg-slate-800/50">
                     <td className="px-6 py-4 font-bold text-white">QualoSeguro</td><td className="px-6 py-4 font-mono text-xs">qualoseguro.com</td><td className="px-6 py-4"><StatusBadge status="Integração pendente" /></td><td className="px-6 py-4"><StatusBadge status="Atenção" /></td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </div>
        );
      case 'Inteligência Artificial':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Inteligência Artificial (LLMs)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.diagnostics.ai).map(([key, val]: any) => (
                <div key={key} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                     <div className="font-bold text-white capitalize">{key}</div>
                     <div className="text-xs text-slate-500 mt-1">Último teste: {new Date().toLocaleTimeString()}</div>
                  </div>
                  <div>
                    {typeof val === 'string' && val.includes('pendente') ? <StatusBadge status={val} /> : <StatusBadge status={val} />}
                  </div>
                </div>
              ))}
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-sm transition mt-4">Testar conexão</button>
          </div>
        );
      case 'SEO Providers':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">SEO Providers & APIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.diagnostics.seo).map(([key, val]: any) => (
                <div key={key} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                     <div className="font-bold text-white capitalize">{key}</div>
                     <div className="text-xs text-slate-500 mt-1">Última sincronização: Nunca</div>
                  </div>
                  <StatusBadge status={val} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Infraestrutura':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Infraestrutura Cloud</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.diagnostics.infra).map(([key, val]: any) => (
                <div key={key} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div className="font-bold text-white capitalize">{key}</div>
                  <StatusBadge status={val} />
                </div>
              ))}
            </div>
            <button onClick={runDiagnostics} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-sm transition mt-4">Executar diagnóstico</button>
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Segurança & Secrets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.diagnostics.security).map(([key, val]: any) => (
                <div key={key} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <StatusBadge status={val} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Sistema':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Informações do Sistema</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(data.system).map(([key, val]: any) => (
                <div key={key} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="font-bold text-white truncate" title={val}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Backup':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Backup Database</h2>
            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 max-w-md">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-sm font-bold text-slate-400">Status</span>
                 <StatusBadge status={data.backup.status} />
               </div>
               <div className="flex justify-between items-center mb-6">
                 <span className="text-sm font-bold text-slate-400">Último backup</span>
                 <span className="text-sm font-bold text-white">{data.backup.lastBackup}</span>
               </div>
               <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded font-bold text-sm transition border border-slate-600">Executar Backup</button>
            </div>
          </div>
        );
      case 'Logs':
        const filteredLogs = logs.filter(l => logFilter === 'All' || l.level === logFilter);
        return (
          <div className="space-y-6 animate-in fade-in flex flex-col h-full">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Logs do Sistema</h2>
                <span className="text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 uppercase font-bold tracking-widest">Logs em memória — persistência pendente</span>
              </div>
              <div className="flex gap-2">
                {['All', 'ERROR', 'WARN', 'INFO'].map(f => (
                  <button key={f} onClick={() => setLogFilter(f)} className={`px-3 py-1 text-xs font-bold rounded border transition ${logFilter === f ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{f}</button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 bg-black rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-2">
              {filteredLogs.map(l => (
                 <div key={l.id} className="flex gap-3 pb-2 border-b border-slate-900/50">
                    <span className="text-slate-600 shrink-0">{new Date(l.timestamp).toLocaleTimeString()}</span>
                    <span className={`shrink-0 w-12 font-bold ${l.level === 'ERROR' ? 'text-red-500' : l.level === 'WARN' ? 'text-amber-500' : 'text-emerald-500'}`}>[{l.level}]</span>
                    <span className="text-indigo-400 shrink-0 w-20">[{l.source}]</span>
                    <span className="text-slate-300">{l.message}</span>
                 </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-slate-200 font-sans flex flex-col">
      
      {/* Topbar */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Centro de Configuração (Settings)</h1>
          <p className="text-sm text-slate-400 mt-1">Validação de Infraestrutura e Integrações.</p>
        </div>
        <button 
          onClick={runDiagnostics} 
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-500/20 disabled:bg-slate-700 disabled:shadow-none flex items-center gap-2"
        >
          {loading ? (
             <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Auditando Sistema...</span>
             </>
          ) : 'Executar Diagnóstico Geral'}
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Nav */}
        <div className="w-64 bg-slate-900/50 border-r border-slate-800 overflow-y-auto shrink-0 p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.name ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
              >
                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#0B0F19] custom-scrollbar">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
