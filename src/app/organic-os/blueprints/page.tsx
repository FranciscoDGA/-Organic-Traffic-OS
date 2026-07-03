import React from 'react';

export default function BlueprintsPanel() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Content Architect - Blueprints</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Blueprints Criados</h2>
          <ul className="list-disc pl-5">
            <li>Guia Completo de SEO (v1.0) - Concluído</li>
            <li>Artigo Pilar: Marketing Digital (v1.2) - Draft</li>
          </ul>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Tipos de Conteúdo</h2>
          <ul className="list-disc pl-5">
            <li>Artigo Pilar</li>
            <li>Guia Completo</li>
            <li>Tutorial</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
