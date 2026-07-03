import React from 'react';

export default function QualityPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Content Quality Review Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Últimos Relatórios</h2>
          <ul className="list-disc pl-5">
            <li>Draft #001 - <span className="text-green-600 font-bold">APROVADO</span> (Score: 92)</li>
            <li>Draft #002 - <span className="text-red-600 font-bold">REPROVADO</span> (Score: 65) - Motivo: Fatos contraditórios</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Estatísticas de Qualidade</h2>
          <ul className="list-disc pl-5">
            <li>Score Médio Geral: 87/100</li>
            <li>Principais Recomendações: Melhorar CTA, Ajustar Tom de Voz</li>
            <li>Taxa de Aprovação de Primeira: 75%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
