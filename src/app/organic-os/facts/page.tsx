import React from 'react';

export default function FactsPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Fact Intelligence Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">Base de Evidências</h2>
          <ul className="list-disc pl-5">
            <li>Fatos Aprovados: 1.452</li>
            <li>Fatos Pendentes: 34</li>
            <li>Confiabilidade Média: 96%</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">Categorias Monitoradas</h2>
          <ul className="list-disc pl-5">
            <li>Legislação</li>
            <li>Concurso</li>
            <li>Edital</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
