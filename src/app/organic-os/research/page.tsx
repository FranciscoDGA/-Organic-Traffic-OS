import React from 'react';

export default function ResearchPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Research Composer - Packs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Packs de Pesquisa</h2>
          <ul className="list-disc pl-5">
            <li>Guia Completo de SEO (v1.0) - Score: 95/100</li>
            <li>Artigo Pilar: Marketing Digital (v1.2) - Score: 88/100</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Entidades e Fontes</h2>
          <ul className="list-disc pl-5">
            <li>Cobertura Média: 92%</li>
            <li>Fontes Oficiais Analisadas: 45</li>
            <li>Perguntas Mapeadas: 120</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
