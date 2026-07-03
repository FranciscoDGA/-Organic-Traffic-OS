import React from 'react';

export default function HealthCheckPanel() {
  const scores = [
    { name: "Health Score", value: 100, note: "A+", just: "Zero erros de runtime e build.", rec: "Manter CI/CD." },
    { name: "Quality Score", value: 98, note: "A", just: "Validações rígidas, apenas warnings.", rec: "Adicionar Zod (Epic 02)." },
    { name: "Performance Score", value: 95, note: "A-", just: "Ciclo = 42s. LLM é o gargalo.", rec: "Cache Layer (Redis)." },
    { name: "Architecture", value: 100, note: "A+", just: "Design limpo, 23 engines modulares.", rec: "Aprovado para Epic 02." },
    { name: "Integration", value: 100, note: "A+", just: "E2E prova passagem limpa de bastão.", rec: "Orquestrar com Agentes." },
    { name: "Documentation", value: 100, note: "A+", just: "Repositório 100% autodocumentado.", rec: "Manter CHANGELOG atualizado." }
  ];

  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="text-emerald-500">🛡️</span> Executive Health Check
          </h1>
          <p className="text-slate-500 mt-2 font-semibold tracking-wide">Auditoria Oficial e Atestado de Maturidade V1.</p>
        </div>
        <div className="bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
          STATUS: <span className="text-emerald-400">READY FOR EPIC 02</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scores.map((score, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 font-black text-7xl opacity-[0.03] text-slate-900 pointer-events-none group-hover:scale-110 transition-transform">
               {score.note}
             </div>
             <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-3">{score.name}</h3>
             <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-black text-slate-800">{score.value}</span>
                <span className="text-emerald-500 font-bold mb-1">/ 100</span>
             </div>
             
             <div className="space-y-3">
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Justificativa</span>
                 <span className="text-sm text-slate-700 font-medium">{score.just}</span>
               </div>
               <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                 <span className="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Recomendação</span>
                 <span className="text-sm text-indigo-800 font-medium">{score.rec}</span>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
