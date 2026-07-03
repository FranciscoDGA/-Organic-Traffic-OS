import React from 'react';

export default function AudiencePanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Audience Adaptation Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-cyan-600">Planos de Adaptação</h2>
          <ul className="list-disc pl-5">
            <li>Draft #001 - Persona: Iniciante - <span className="text-orange-500 font-bold">A ADAPTAR</span></li>
            <li>Draft #002 - Persona: Avançado - <span className="text-green-600 font-bold">ADAPTADO</span></li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-cyan-600">Diretrizes de Tom de Voz</h2>
          <ul className="list-disc pl-5">
            <li>Regra: "Usar exemplos focados em concursos locais"</li>
            <li>Regra: "Evitar jargões técnicos sem explicação"</li>
            <li>Tom atual predominante da IA: Acadêmico (Alerta)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
