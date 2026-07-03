import React from 'react';

export default function PerformancePanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Content Performance Engine</h1>
          <p className="text-slate-500 mt-2 font-medium">Radiografia pós-publicação, detecção de decay e Refresh Cirúrgico.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm font-semibold cursor-pointer hover:bg-slate-50 transition">
            Importar GA4 (Mock)
          </div>
          <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-semibold cursor-pointer hover:bg-indigo-700 transition">
            Rodar Análise RICE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Alerts and Decay */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-500 font-medium text-sm">Monitorados (Live)</p>
              <p className="text-4xl font-black text-slate-800 mt-2">42 <span className="text-sm font-medium text-emerald-500">Ativos</span></p>
            </div>
            <div className="p-6 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-rose-100 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              </div>
              <p className="text-rose-500 font-bold text-sm uppercase tracking-wider">Alerta de Decay</p>
              <p className="text-4xl font-black text-rose-600 mt-2">3 <span className="text-sm font-medium text-rose-400">Ativos Sangrando</span></p>
            </div>
            <div className="p-6 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-emerald-100 flex flex-col justify-center">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Top Performers</p>
              <p className="text-4xl font-black text-emerald-600 mt-2">7 <span className="text-sm font-medium text-emerald-400">Ativos em Alta</span></p>
            </div>
          </div>

          <div className="p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
               Cirurgias Editoriais (Refresh RICE)
            </h2>
            <div className="space-y-4">
              {[
                { title: 'O que estudar para Cumaru 2026', issue: 'Decay Brusco de Tráfego (-22%)', action: 'Atualizar conteúdo + Adicionar Vídeo', score: 240, urgency: 'Alta' },
                { title: 'Tabela de Vencimentos GCM', issue: 'Baixa Conversão (CTR 0.5%)', action: 'Melhorar CTA + Criar Landing', score: 180, urgency: 'Média' },
                { title: 'Simulado Raciocínio Lógico', issue: 'Falta de Autoridade Topical', action: 'Criar Artigos Satélite (2)', score: 90, urgency: 'Baixa' }
              ].map((rec, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer">
                  <div>
                    <h3 className="font-bold text-slate-800">{rec.title}</h3>
                    <p className="text-xs text-rose-500 font-bold mt-1 uppercase tracking-wider">{rec.issue}</p>
                    <p className="text-sm text-slate-600 mt-2 font-medium">🛠️ Prescrição: <span className="text-indigo-600">{rec.action}</span></p>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase">RICE Score</span>
                    <span className="text-xl font-black text-amber-600">{rec.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 rounded-2xl border border-slate-700 text-white h-fit">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">📊</span> Motor Analítico
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Métricas Rastreadas</div>
              <ul className="text-sm font-medium text-slate-300 space-y-1">
                <li>• Visualizações (Views)</li>
                <li>• Cliques (GSC)</li>
                <li>• CTR (Taxa de Clique)</li>
                <li>• Impressões</li>
                <li>• Dwell Time (Tempo de Leitura)</li>
                <li>• Scroll Depth</li>
                <li>• Conversões de Lead</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 mt-4">
               <p className="text-xs text-amber-400 font-bold uppercase mb-2">Conectores Futuros</p>
               <div className="flex gap-2">
                 <span className="px-2 py-1 rounded bg-slate-700 text-[10px] border border-slate-600 opacity-50">GA4 API</span>
                 <span className="px-2 py-1 rounded bg-slate-700 text-[10px] border border-slate-600 opacity-50">GSC API</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
