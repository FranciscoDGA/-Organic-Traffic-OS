import React from 'react';

export default function VisibilityPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Visibility Optimization Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">Performance Recente</h2>
          <ul className="list-disc pl-5">
            <li>Draft #001 - <span className="font-bold text-green-700">96/100 (Overall)</span></li>
            <ul className="list-circle pl-5 mt-2 text-sm">
              <li>SEO: 95/100</li>
              <li>GEO (AI): 98/100</li>
              <li>Schema: 100/100</li>
            </ul>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">Métricas de Indexação Híbrida</h2>
          <ul className="list-disc pl-5">
            <li>Estruturas de AI Overviews: 100% integradas</li>
            <li>FAQ Pages (Schema): Validadas sem erros</li>
            <li>Snippets de Resposta Direta: 45 blocos mapeados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
