'use client';

import { useState, useEffect } from 'react';

export default function CompetitorsPage() {
  const [data, setData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/competitors?blog_id=passacumaru')
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

  if (loading) return <div className="p-8">Carregando Inteligência Competitiva...</div>;

  const totalConcorrentes = data?.competitors?.length || 0;
  const oportunidades = data?.opportunity_map?.length || 0;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Competitor Intelligence</h1>
        <p className="text-gray-500 mt-2">Mapeamento do ecossistema de concorrência e identificação de lacunas estratégicas.</p>
      </header>

      <div className="mb-8 p-4 rounded-xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">Status da Análise</h2>
          <p className="text-sm text-gray-500">Dados simulados para o nicho de Concursos Municipais (Banca IVIN).</p>
        </div>
        <div className="flex flex-col items-end">
          {validation?.isValid ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Catálogo Válido</span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">Erro de Validação</span>
          )}
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Concorrentes</h3>
              <p className="text-3xl font-bold">{totalConcorrentes}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Oportunidades de Ouro Encontradas</h3>
              <p className="text-3xl font-bold text-yellow-600">{oportunidades}</p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Mapa de Concorrência (Radares)</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-4 font-medium">Concorrente</th>
                  <th className="p-4 font-medium">Categoria</th>
                  <th className="p-4 font-medium">Domínio</th>
                  <th className="p-4 font-medium">Ameaça</th>
                </tr>
              </thead>
              <tbody>
                {data.competitors.map((comp: any) => (
                  <tr key={comp.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold">{comp.nome}</td>
                    <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{comp.categoria}</span></td>
                    <td className="p-4 text-blue-500">{comp.dominio}</td>
                    <td className="p-4">
                      {comp.tipo === 'Direto' || comp.tipo === 'Direto/Indireto' ? (
                        <span className="text-red-600 font-bold">Alta</span>
                      ) : (
                        <span className="text-yellow-600 font-bold">Média</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-green-700 mb-4">Radar de Oportunidades</h3>
              <ul className="space-y-4">
                {data.opportunity_map.map((op: any, idx: number) => (
                  <li key={idx} className="text-sm border-l-2 border-green-500 pl-3">
                    <span className="font-bold block text-base">{op.tema}</span>
                    <span className="text-gray-600 mt-1 block">{op.observacoes}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-blue-700 mb-4">SWOT Highlights</h3>
              <ul className="space-y-4">
                {data.strengths_weaknesses.map((sw: any, idx: number) => {
                  const compName = data.competitors.find((c:any) => c.id === sw.competitor_id)?.nome;
                  return (
                    <li key={idx} className="text-sm border-b pb-3">
                      <span className="font-bold block text-base">{compName}</span>
                      <div className="mt-2 text-gray-600">
                        <strong>Fraqueza:</strong> {sw.pontos_fracos[0]}<br/>
                        <strong>Nossa Vantagem:</strong> {sw.oportunidades[0]}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
