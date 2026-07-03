import React from 'react';

export default function SourcesPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Source Intelligence Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Biblioteca de Fontes</h2>
          <ul className="list-disc pl-5">
            <li>Fontes Cadastradas: 450</li>
            <li>Autoridade Média: 82/100</li>
            <li>Última Verificação: Hoje</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Categorias em Destaque</h2>
          <ul className="list-disc pl-5">
            <li>Governo Federal (250 fontes)</li>
            <li>Instituições Oficiais (120 fontes)</li>
            <li>Artigos Científicos (80 fontes)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
