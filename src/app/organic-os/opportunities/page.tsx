'use client';

import { useState, useEffect } from 'react';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchOpps = () => {
    setLoading(true);
    fetch('/api/organic-os/opportunities?blog_id=passacumaru')
      .then(res => res.json())
      .then(json => {
        setOpportunities(json.data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    await fetch('/api/organic-os/opportunities/generate?blog_id=passacumaru', { method: 'POST' });
    setGenerating(false);
    fetchOpps();
  };

  const total = opportunities.length;
  const highPriority = opportunities.filter(o => o.prioridade === 'Muito Alta' || o.prioridade === 'Alta').length;

  if (loading && total === 0) return <div className="p-8">Carregando Discovery Engine...</div>;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Opportunity Discovery Engine</h1>
          <p className="text-gray-500 mt-2">Cruzamento de Inventário, Competitors e Keywords para gerar Pautas de Ouro.</p>
        </div>
        <div>
          <button 
            onClick={handleGenerate} 
            disabled={generating}
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? 'Cruzando Dados...' : 'Gerar Oportunidades'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Oportunidades</h3>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Prioridade Alta / Muito Alta</h3>
          <p className="text-3xl font-bold text-red-600">{highPriority}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">Ranking Oficial de Pautas (Top 20)</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">Prioridade</th>
              <th className="p-4 font-medium">Título Sugerido</th>
              <th className="p-4 font-medium">Intenção</th>
              <th className="p-4 font-medium">Motivo Principal</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.slice(0, 20).map((op: any) => (
              <tr key={op.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-purple-600 text-lg">{op.score}</td>
                <td className="p-4">
                  {op.prioridade === 'Muito Alta' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Muito Alta</span>}
                  {op.prioridade === 'Alta' && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">Alta</span>}
                  {op.prioridade === 'Média' && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Média</span>}
                  {op.prioridade === 'Baixa' && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">Baixa</span>}
                </td>
                <td className="p-4 font-bold text-gray-800">{op.titulo}</td>
                <td className="p-4 text-gray-600">{op.intencao}</td>
                <td className="p-4 text-gray-500 italic text-xs">{op.motivo}</td>
              </tr>
            ))}
            {opportunities.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Nenhuma oportunidade gerada ainda. Clique em "Gerar Oportunidades".</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
