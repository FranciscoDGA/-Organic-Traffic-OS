'use client';

import { useState, useEffect } from 'react';

export default function KeywordsPage() {
  const [data, setData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/keywords?blog_id=passacumaru')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setData(json.data);
          setValidation(json.validation);
        } else {
          setValidation(json.validation || { isValid: false, errors: [json.error] });
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Carregando Inteligência de Palavras-Chave...</div>;

  const totalKeywords = data?.keywords?.length || 0;
  const totalClusters = data?.clusters?.length || 0;
  const totalEntidades = data?.entities?.length || 0;
  const totalOportunidades = data?.opportunities?.length || 0;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Keyword Intelligence</h1>
        <p className="text-gray-500 mt-2">Visão geral sobre tópicos, intenções de busca e priorização estratégica de pautas.</p>
      </header>

      <div className="mb-8 p-4 rounded-xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">Integridade do Motor</h2>
          <p className="text-sm text-gray-500">Dados do rastreamento estrutural.</p>
        </div>
        <div className="flex flex-col items-end">
          {validation?.isValid ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Estrutura 100% Válida</span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">Falha no Banco</span>
          )}
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Keywords</h3>
              <p className="text-3xl font-bold">{totalKeywords}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Clusters</h3>
              <p className="text-3xl font-bold">{totalClusters}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Entidades (Silos)</h3>
              <p className="text-3xl font-bold">{totalEntidades}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Oportunidades Puras</h3>
              <p className="text-3xl font-bold text-purple-600">{totalOportunidades}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-indigo-700 mb-4">Clusters Editoriais</h3>
              <ul className="space-y-4">
                {data.clusters.map((c: any) => (
                  <li key={c.id} className="text-sm border-b pb-3">
                    <span className="font-bold block text-base">{c.nome}</span>
                    <span className="text-gray-500 block">{c.descricao}</span>
                    <div className="mt-2 text-xs bg-gray-100 p-2 rounded text-gray-700">
                      <strong>Principal:</strong> {c.palavra_principal}
                      <br />
                      <strong>Secundárias:</strong> {c.palavras_secundarias.join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-emerald-700 mb-4">Mapeamento de Entidades</h3>
              <ul className="space-y-4">
                {data.entities.map((e: any) => (
                  <li key={e.id} className="text-sm border-l-2 border-emerald-500 pl-3">
                    <span className="font-bold block text-base">{e.nome} <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{e.tipo}</span></span>
                    <span className="text-gray-600 mt-1 block">{e.descricao}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Tabela Mestre (Priorização)</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-4 font-medium">Palavra-Chave</th>
                  <th className="p-4 font-medium">Intenção</th>
                  <th className="p-4 font-medium">Potencial</th>
                  <th className="p-4 font-medium">Competição</th>
                </tr>
              </thead>
              <tbody>
                {data.keywords.map((kw: any) => {
                  const intentInfo = data.intents.find((i:any) => i.keyword_id === kw.id)?.intent || 'N/A';
                  const prioInfo = data.priorities.find((p:any) => p.keyword_id === kw.id) || {};

                  return (
                    <tr key={kw.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-bold text-blue-600">{kw.keyword}</td>
                      <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{intentInfo}</span></td>
                      <td className="p-4 text-green-600 font-bold">{prioInfo.potencial || 'N/A'}</td>
                      <td className="p-4 text-red-600 font-bold">{prioInfo.competicao || 'N/A'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          <div className="bg-white border rounded-xl shadow-sm p-5 mb-8">
            <h3 className="font-bold text-lg text-orange-600 mb-4">People Also Ask (Perguntas)</h3>
            <div className="flex flex-wrap gap-2">
              {data.questions.map((q: any) => (
                <span key={q.id} className="bg-orange-50 border border-orange-200 text-orange-800 px-3 py-1.5 rounded-full text-sm">
                  {q.pergunta}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
