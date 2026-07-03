import React from 'react';

export default function SystemPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">System Integration & Stabilization</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Health & Quality</h2>
          <ul className="list-disc pl-5">
            <li>Health Score: 100%</li>
            <li>Quality Score: 96.6%</li>
            <li>Status: Integrado e Estabilizado</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Métricas do Sistema</h2>
          <ul className="list-disc pl-5">
            <li>Módulos Auditados: 15</li>
            <li>Engines: 5 (Brief, Architect, Research, Fact, Source)</li>
            <li>APIs Validadas: 100%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
