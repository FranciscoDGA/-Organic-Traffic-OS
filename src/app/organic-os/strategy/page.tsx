import React from 'react';

export default function StrategyPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Content Strategy Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">Estratégias Ativas</h2>
          <ul className="list-disc pl-5">
            <li>Estratégia SEO 2026 - Captura de Lead (Descoberta)</li>
            <li>Guia Técnico Avançado - Autoridade (Decisão)</li>
            <li>Post Carrossel Redes Sociais - Engajamento (Aprendizado)</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">Modelos & Configurações</h2>
          <ul className="list-disc pl-5">
            <li>Personas mapeadas: 8 ativas</li>
            <li>Jornada do usuário: Funil Completo Ativo</li>
            <li>Regras de CTA: Validação Ativa</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
