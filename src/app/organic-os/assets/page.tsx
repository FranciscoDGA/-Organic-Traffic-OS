import React from 'react';

export default function AssetsPanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Content Asset Generation</h1>
          <p className="text-slate-500 mt-2 font-medium">Orquestração e modelagem de múltiplos formatos de conteúdo.</p>
        </div>
        <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-semibold cursor-pointer hover:bg-indigo-700 transition">
          + Novo Ativo Manual
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="text-indigo-500">📚</span> Biblioteca de Ativos
          </h2>
          <div className="space-y-4">
            {[
              { type: 'Página Pilar', title: 'Guia Definitivo Concursos Municipais', status: 'Gerado' },
              { type: 'FAQ', title: 'Dúvidas Frequentes Edital Cumaru', status: 'Validado' },
              { type: 'Checklist', title: 'Materiais para a Prova', status: 'Otimizando' },
              { type: 'Artigo Satélite', title: 'Como estudar Raciocínio Lógico', status: 'Gerado' }
            ].map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {asset.type.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{asset.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{asset.type}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  {asset.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 rounded-2xl border border-slate-700 text-white">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">⚡</span> Asset Selector Engine
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">Decisão de Formatos Ativos</p>
              <div className="text-3xl font-extrabold tracking-tight">14 Tipos</div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Heurística Principal</div>
                <p className="text-sm font-medium">Se <span className="text-emerald-400">Intenção = Compra</span> → Gerar <span className="text-indigo-400">Landing Page</span></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Heurística Secundária</div>
                <p className="text-sm font-medium">Se <span className="text-emerald-400">Objetivo = Lead</span> → Gerar <span className="text-indigo-400">Checklist/Quiz</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
