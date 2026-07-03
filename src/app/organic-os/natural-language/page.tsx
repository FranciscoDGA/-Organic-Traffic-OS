import React from 'react';

export default function NaturalLanguagePanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Natural Language Engine (UX Writing)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-violet-600">Histórico de Refinamento</h2>
          <ul className="list-disc pl-5">
            <li>Draft #001 - <span className="text-green-600 font-bold">REFINADO</span> (Score: 60 → 92)</li>
            <li>Draft #002 - <span className="text-green-600 font-bold">REFINADO</span> (Score: 71 → 95)</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-violet-600">Métricas Globais</h2>
          <ul className="list-disc pl-5">
            <li>Ganho médio de legibilidade: +32%</li>
            <li>Voz passiva removida: 8.5K sentenças</li>
            <li>Regras violadas (e corrigidas pelo Validator): 0</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
