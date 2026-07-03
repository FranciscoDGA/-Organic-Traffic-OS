import React from 'react';

export default function PublishingPanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Publishing Engine</h1>
          <p className="text-slate-500 mt-2 font-medium">Preparo, formatação e empacotamento agnóstico (Headless) de conteúdo.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm font-semibold cursor-pointer hover:bg-slate-50 transition">
            Testar Renderers
          </div>
          <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-semibold cursor-pointer hover:bg-indigo-700 transition">
            Processar Fila
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="text-indigo-500">📦</span> Pacotes Prontos (Aguardando Deploy)
          </h2>
          <div className="space-y-4">
            {[
              { id: 'cid-09283', title: 'Guia Definitivo Concursos', renderer: 'WordPress REST', status: 'Prepared', hash: '8f4e2a...' },
              { id: 'cid-09284', title: 'FAQ Edital Cumaru', renderer: 'Next.js MDX', status: 'Prepared', hash: '3c1d9b...' },
              { id: 'cid-09285', title: 'Checklist Prova', renderer: 'HTML Puro', status: 'Prepared', hash: '7b5f1e...' }
            ].map((pkg, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">ID: {pkg.id} • Hash: {pkg.hash}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                    {pkg.renderer}
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">
                    {pkg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 rounded-2xl border border-slate-700 text-white">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">⚙️</span> Engine Architecture
          </h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Status da Fila</div>
                <div className="text-2xl font-extrabold tracking-tight text-white">3 <span className="text-sm font-medium text-slate-400">Pacotes</span></div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Renderers Carregados</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-slate-700 text-xs font-medium border border-slate-600">Markdown</span>
                  <span className="px-2 py-1 rounded bg-slate-700 text-xs font-medium border border-slate-600">HTML</span>
                  <span className="px-2 py-1 rounded bg-slate-700 text-xs font-medium border border-slate-600">JSON</span>
                  <span className="px-2 py-1 rounded bg-slate-700 text-xs font-medium border border-slate-600 text-indigo-300 border-indigo-500/30">WordPress (Draft)</span>
                  <span className="px-2 py-1 rounded bg-slate-700 text-xs font-medium border border-slate-600 text-blue-300 border-blue-500/30">Next.js (Draft)</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
               <p className="text-xs text-slate-400 italic">O sistema é estritamente Headless. A injeção em banco final de destino ocorre no módulo de Deploy (Future Sprint).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
