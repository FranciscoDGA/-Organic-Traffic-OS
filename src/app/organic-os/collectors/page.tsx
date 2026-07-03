'use client';

import { useState, useEffect } from 'react';

export default function CollectorsPage() {
  const [collectors, setCollectors] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runResult, setRunResult] = useState<any>(null);

  const fetchDados = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/organic-os/collectors').then(r => r.json()),
      fetch('/api/organic-os/collectors/status').then(r => r.json())
    ]).then(([colRes, statRes]) => {
      setCollectors(colRes.data || []);
      setStatus(statRes.data || null);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const runManualCollector = async () => {
    const res = await fetch('/api/organic-os/collectors/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectorId: 'manual-collector',
        params: { text: 'Texto de exemplo inserido pelo agente.', sourceUrl: 'http://example.com' }
      })
    });
    const json = await res.json();
    setRunResult(json.data);
    fetchDados();
  };

  const clearCache = async () => {
    await fetch('/api/organic-os/collectors/cache/clear', { method: 'POST' });
    fetchDados();
  };

  if (loading && collectors.length === 0) return <div className="p-8">Carregando Frota de Coletores...</div>;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Research Collectors Engine</h1>
          <p className="text-gray-500 mt-2">Camada de blindagem e padronização de dados externos. Os agentes não acessam a internet, eles pedem aos Coletores.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={runManualCollector} className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Testar "Manual Collector"</button>
          <button onClick={clearCache} className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded hover:bg-red-200">Limpar Cache</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Collectors Registrados</h3>
          <p className="text-3xl font-bold">{collectors.length}</p>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Collectors Ativos</h3>
          <p className="text-3xl font-bold text-green-600">{status?.active_collectors || 0}</p>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Itens no Cache</h3>
          <p className="text-3xl font-bold text-indigo-600">{status?.total_cache_entries || 0}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">Frota de Coletores (Registry)</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="p-4 font-medium">Nome do Coletor</th>
              <th className="p-4 font-medium">Fonte Primária</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {collectors.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{c.nome}</td>
                <td className="p-4 text-gray-600">{c.fonte}</td>
                <td className="p-4">
                  {c.status === 'ativo' ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Ativo</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 border border-gray-300 px-2 py-1 rounded text-xs">Placeholder</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {runResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm mb-8">
          <h3 className="font-bold text-lg text-blue-800 mb-2">Última Execução (Log)</h3>
          <pre className="text-xs bg-white p-4 border rounded overflow-auto max-h-60 text-gray-700">
            {JSON.stringify(runResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
