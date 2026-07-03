import React from 'react';

export default function EditorialPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Redação Inteligente (Editorial Team)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">Equipe de Agentes</h2>
          <ul className="list-disc pl-5">
            <li>01 - Chief Editor</li>
            <li>02 - Research Reviewer</li>
            <li>03 - Outline Reviewer</li>
            <li>04 - SEO Reviewer</li>
            <li>05 - Content Writer</li>
            <li>06 - Humanization Reviewer</li>
            <li>07 - Quality Reviewer</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">Contratos & Workflow</h2>
          <ul className="list-disc pl-5">
            <li>Fluxo de aprovação: Multi-Agente Ativo</li>
            <li>Status: Contratos Estabelecidos</li>
            <li>Dependências: Validadas pelo Validator</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
