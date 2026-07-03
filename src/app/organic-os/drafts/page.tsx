import React from 'react';

export default function DraftsPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Draft Writer Engine (Rascunhos)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Últimos Rascunhos Gerados</h2>
          <ul className="list-disc pl-5">
            <li>Como fazer SEO em 2026 - v1.0 (GPT-4o)</li>
            <li>Guia Definitivo React 19 - v1.2 (Claude 3.5 Sonnet)</li>
            <li>Melhores Práticas de UI/UX - v1.0 (GPT-4o)</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Estatísticas de Geração</h2>
          <ul className="list-disc pl-5">
            <li>Rascunhos Totais: 45</li>
            <li>Média de Tempo: 45s por Draft</li>
            <li>Consumo de Tokens: 2.5M Entrada / 1.2M Saída</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
