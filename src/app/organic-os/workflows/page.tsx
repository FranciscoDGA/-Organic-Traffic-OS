import React from 'react';

export default function WorkflowsPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Content Workflow Orchestrator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Execuções em Andamento</h2>
          <ul className="list-disc pl-5">
            <li>Blog Tech - Pipeline ID #401 - Progresso: 75%</li>
            <li>Blog Marketing - Pipeline ID #402 - Progresso: 25%</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Status Geral</h2>
          <ul className="list-disc pl-5">
            <li>Execuções Concluídas: 1.250</li>
            <li>Execuções Falhas (Retry): 3</li>
            <li>Tempo Médio: 1m 45s</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
