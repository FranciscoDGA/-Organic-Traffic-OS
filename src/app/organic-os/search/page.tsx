import React from 'react';

export default function SearchPanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Search Intelligence Engine</h1>
          <p className="text-slate-500 mt-2 font-medium">Inteligência adaptativa baseada em arquitetura de Connectors (GSC, Bing, GA4).</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm font-semibold cursor-pointer hover:bg-slate-50 transition">
             Connectors
          </div>
          <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-semibold cursor-pointer hover:bg-indigo-700 transition flex items-center gap-2">
            <span className="text-xl">🔄</span> FORÇAR SYNC
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Connectors Ativos</p>
              <p className="text-3xl font-black text-slate-800 mt-1">2</p>
            </div>
            <div className="p-5 bg-white shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Consultas Analisadas</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">1.450</p>
            </div>
            <div className="p-5 bg-white shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Impressões (7d)</p>
              <p className="text-3xl font-black text-slate-800 mt-1">65.5K</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-orange-100/50 rounded-2xl border border-orange-200 flex flex-col justify-center">
              <p className="text-orange-600 font-bold text-[10px] uppercase tracking-wider">Oportunidades</p>
              <p className="text-3xl font-black text-orange-600 mt-1">12</p>
            </div>
          </div>

          <div className="p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
               Oportunidades de Otimização
            </h2>
            <div className="space-y-4">
              {[
                { tipo: 'Alta Impressão + Baixo CTR', query: 'gabarito concurso cumaru', foco: 'CTR: 0.11%', badge: 'Alta' },
                { tipo: 'Striking Distance (Pag 2)', query: 'edital cumaru', foco: 'Posição: 12.0', badge: 'Média' },
                { tipo: 'Consulta Emergente', query: 'inscrições concurso cumaru norte', foco: '+450% Impressões', badge: 'Alta' }
              ].map((opp, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                  <div>
                    <h3 className="font-bold text-slate-800">"{opp.query}"</h3>
                    <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-wider">{opp.tipo}</p>
                    <p className="text-sm text-slate-500 mt-2 font-medium">{opp.foco}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${opp.badge === 'Alta' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>Urgência: {opp.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 rounded-2xl border border-slate-700 text-white h-fit">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">🔌</span> Connectors Layer
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
              <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Mock Connector</p>
                 <p className="text-[10px] text-emerald-400">Sincronizado há 2min</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
              <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Manual CSV</p>
                 <p className="text-[10px] text-emerald-400">Ativo (Aguardando)</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center opacity-50">
              <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Google Search Console</p>
                 <p className="text-[10px] text-slate-500">Configurar Credenciais</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
