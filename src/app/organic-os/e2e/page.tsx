import React from 'react';

export default function E2EPanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">E2E Validation Pipeline</h1>
          <p className="text-slate-500 mt-2 font-medium">Console de testes ponta a ponta (MVP V1 Homologation).</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-rose-600 text-white px-6 py-2.5 rounded-lg shadow-lg shadow-rose-200 font-bold cursor-pointer hover:bg-rose-700 transition flex items-center gap-2">
            <span className="text-xl">▶</span> RUN PIPELINE E2E
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Execution Logs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <span className="text-emerald-500">✔️</span> Última Execução
               </h2>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-widest border border-emerald-200">Quality Gate Passed</span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm mb-6">
               <p className="text-slate-500">Tema (Input): <span className="text-indigo-600 font-bold">Concurso Prefeitura de Cumaru do Norte</span></p>
               <p className="text-slate-500 mt-1">Tempo Total: <span className="font-bold text-slate-700">42s 145ms</span></p>
            </div>

            <div className="space-y-3">
              {[
                { engine: '1. Knowledge Core', time: '120ms', status: 'OK' },
                { engine: '6. Opportunity Discovery', time: '840ms', status: 'OK' },
                { engine: '9. Blueprint Engine', time: '1450ms', status: 'OK' },
                { engine: '14. Draft Writer', time: '8500ms', status: 'OK' },
                { engine: '17. Natural Language (UX)', time: '4100ms', status: 'OK' },
                { engine: '23. Publishing Engine (Manifest)', time: '35ms', status: 'OK' }
              ].map((stage, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-semibold text-slate-700">{stage.engine}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="text-slate-400">{stage.time}</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{stage.status}</span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4 text-xs text-slate-400 font-medium">
                 + 17 engines executadas (Logs ocultados)
              </div>
            </div>
          </div>
        </div>

        {/* Health Score */}
        <div className="p-8 bg-gradient-to-br from-indigo-800 to-indigo-900 shadow-xl shadow-indigo-900/20 rounded-2xl border border-indigo-700 text-white h-fit">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            🏆 Health Score
          </h2>
          
          <div className="flex flex-col items-center justify-center py-6 mb-4">
             <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
               100%
             </div>
             <p className="text-indigo-200 mt-2 font-medium uppercase tracking-widest text-xs">MVP V1 Homologado</p>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-800">
              <div className="text-xs text-indigo-300 uppercase tracking-wider font-bold mb-1">Tokens IA Consumidos</div>
              <div className="text-xl font-bold">42.500</div>
            </div>
            <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-800">
               <p className="text-xs text-indigo-300 font-bold uppercase mb-2">Confiabilidade</p>
               <div className="flex justify-between text-sm font-medium">
                 <span>Falhas Críticas</span>
                 <span className="text-emerald-400">0</span>
               </div>
               <div className="flex justify-between text-sm font-medium mt-1">
                 <span>Warnings (Schema)</span>
                 <span className="text-amber-400">2</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
