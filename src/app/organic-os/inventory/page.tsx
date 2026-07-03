'use client';

import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [data, setData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/inventory?blog_id=passacumaru')
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

  if (loading) return <div className="p-8">Escaneando Inventário...</div>;

  const totalConteudo = data?.content_index?.length || 0;
  const orfaos = data?.orphan_pages?.length || 0;
  const duplicados = data?.duplicate_content?.length || 0;
  const healthMedio = data?.content_health?.reduce((acc: number, cur: any) => acc + cur.score_geral, 0) / (data?.content_health?.length || 1);

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Content Inventory</h1>
        <p className="text-gray-500 mt-2">Visão global de todos os artigos e páginas já publicados no blog PassaCumaru.</p>
      </header>

      <div className="mb-8 p-4 rounded-xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">Status do Scan</h2>
          <p className="text-sm text-gray-500">O motor rastreou todo o blog e mapeou as URLs.</p>
        </div>
        <div className="flex flex-col items-end">
          {validation?.isValid ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Inventário 100% Válido</span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">Erro no Scan</span>
          )}
          {!validation?.isValid && (
            <div className="text-xs text-red-600 mt-2 text-right">
              {validation?.errors?.map((err: string, i: number) => <div key={i}>{err}</div>)}
            </div>
          )}
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Conteúdos</h3>
              <p className="text-3xl font-bold">{totalConteudo}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Páginas Órfãs</h3>
              <p className="text-3xl font-bold text-red-600">{orfaos}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duplicidade Detectada</h3>
              <p className="text-3xl font-bold text-orange-500">{duplicados}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Health Score Médio</h3>
              <p className={`text-3xl font-bold ${healthMedio > 80 ? 'text-green-600' : 'text-orange-500'}`}>
                {healthMedio.toFixed(1)}/100
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Últimos Conteúdos Escaneados</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-4 font-medium">Título</th>
                  <th className="p-4 font-medium">Tipo</th>
                  <th className="p-4 font-medium">Categoria</th>
                  <th className="p-4 font-medium">Palavra-chave</th>
                </tr>
              </thead>
              <tbody>
                {data.content_index.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-blue-600">
                      <a href={item.url} target="_blank" rel="noreferrer">{item.titulo}</a>
                    </td>
                    <td className="p-4 capitalize">{item.tipo}</td>
                    <td className="p-4">{item.categoria}</td>
                    <td className="p-4 text-gray-500">{item.palavra_chave_principal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-red-700 mb-4">Atenção: Páginas Órfãs</h3>
              {data.orphan_pages.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma página órfã encontrada.</p>
              ) : (
                <ul className="space-y-3">
                  {data.orphan_pages.map((op: any) => (
                    <li key={op.id} className="text-sm border-l-2 border-red-500 pl-3">
                      <span className="font-bold block">{op.titulo}</span>
                      <span className="text-xs text-gray-500">{op.motivo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-orange-700 mb-4">Atenção: Conteúdo Duplicado</h3>
              {data.duplicate_content.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum conteúdo duplicado encontrado.</p>
              ) : (
                <ul className="space-y-3">
                  {data.duplicate_content.map((dc: any, idx: number) => (
                    <li key={idx} className="text-sm border-l-2 border-orange-500 pl-3">
                      <span className="font-bold block">Choque: {dc.original_id} vs {dc.similar_id}</span>
                      <span className="text-xs text-gray-500">Semelhança: {(dc.similarity_score * 100).toFixed(0)}% - {dc.motivo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
