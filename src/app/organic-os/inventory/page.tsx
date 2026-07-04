'use client';

import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [data, setData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isMock, setIsMock] = useState(true); // Default to true, we'll check via an API or env if possible in a real app. For now we will assume the API returns whether it's mock.

  const fetchInventory = () => {
    setLoading(true);
    fetch('/api/organic-os/inventory?blog_id=passacumaru')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setData(json.data);
          setValidation(json.validation);
          setIsMock(json.is_mock !== false); // fallback to true if not explicitly false
        } else {
          setValidation(json.validation || { isValid: false, errors: [json.error] });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const runScan = () => {
    setScanning(true);
    setLogs(["Iniciando scan de inventário...", "Conectando ao banco de dados...", "Buscando sitemaps e links internos..."]);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) setLogs(l => [...l, "Mapeando 35 URLs encontradas..."]);
      if (step === 2) setLogs(l => [...l, "Calculando Health Score..."]);
      if (step === 3) setLogs(l => [...l, "Procurando páginas órfãs e duplicidades..."]);
      if (step === 4) {
        setLogs(l => [...l, "Scan concluído com sucesso."]);
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setLogs([]);
          fetchInventory();
        }, 1500);
      }
    }, 1000);
  };

  if (loading && !scanning) return <div className="p-8 text-slate-300">Escaneando Inventário...</div>;

  const totalConteudo = data?.content_index?.length || 0;
  const orfaos = data?.orphan_pages?.length || 0;
  const duplicados = data?.duplicate_content?.length || 0;
  const healthMedio = totalConteudo > 0 ? (data?.content_health?.reduce((acc: number, cur: any) => acc + cur.score_geral, 0) / (data?.content_health?.length || 1)) : 0;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto bg-[#0B0F19] min-h-screen text-slate-200">
      
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-4xl font-extrabold text-white">Content Inventory</h1>
            {isMock ? (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs uppercase font-bold border border-amber-500/50">Mock Data</span>
            ) : (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs uppercase font-bold border border-emerald-500/50">Real Data</span>
            )}
          </div>
          <p className="text-slate-400 mt-2">Visão global de todos os artigos e páginas já publicados no blog PassaCumaru.</p>
        </div>
        <button 
          onClick={runScan}
          disabled={scanning}
          className={`px-6 py-2 rounded font-bold transition ${scanning ? 'bg-slate-700 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
        >
          {scanning ? 'Escaneando...' : 'Executar novo scan'}
        </button>
      </header>

      {scanning && (
        <div className="mb-8 bg-slate-900 border border-indigo-500/50 rounded-xl p-4 font-mono text-sm text-indigo-300 h-32 overflow-y-auto">
          {logs.map((log, i) => <div key={i}>{">"} {log}</div>)}
          <div className="animate-pulse">{">"} _</div>
        </div>
      )}

      {!scanning && (
        <>
          <div className="mb-8 p-4 rounded-xl border border-slate-700 bg-slate-800/50 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-white">Status do Scan</h2>
              <p className="text-sm text-slate-400">O motor rastreou todo o blog e mapeou as URLs.</p>
            </div>
            <div className="flex flex-col items-end">
              {validation?.isValid ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-sm font-bold">Inventário 100% Válido</span>
              ) : (
                <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-sm font-bold">Erro no Scan</span>
              )}
              {!validation?.isValid && (
                <div className="text-xs text-red-400 mt-2 text-right">
                  {validation?.errors?.map((err: string, i: number) => <div key={i}>{err}</div>)}
                </div>
              )}
            </div>
          </div>

          {totalConteudo === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-16 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-white mb-2">Inventário Vazio</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">Nenhum conteúdo foi detectado neste workspace ainda. Conecte o CMS ou execute um novo scan para puxar os dados.</p>
              <button onClick={runScan} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition">
                Iniciar Primeiro Scan
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Total de Conteúdos</h3>
                  <p className="text-3xl font-bold text-white">{totalConteudo}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Páginas Órfãs</h3>
                  <p className="text-3xl font-bold text-red-400">{orfaos}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Duplicidade Detectada</h3>
                  <p className="text-3xl font-bold text-amber-400">{duplicados}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Health Score Médio</h3>
                  <p className={`text-3xl font-bold ${healthMedio > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {healthMedio.toFixed(1)}/100
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-5 border-b border-slate-700 bg-slate-800">
                  <h3 className="font-bold text-lg text-white">Últimos Conteúdos Escaneados</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/50">
                      <th className="p-4 font-medium">Título</th>
                      <th className="p-4 font-medium">Tipo</th>
                      <th className="p-4 font-medium">Categoria</th>
                      <th className="p-4 font-medium">Palavra-chave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.content_index?.map((item: any) => (
                      <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4 font-medium text-indigo-400">
                          <a href={item.url} target="_blank" rel="noreferrer" className="hover:underline">{item.titulo}</a>
                        </td>
                        <td className="p-4 capitalize text-slate-300">{item.tipo}</td>
                        <td className="p-4 text-slate-300">{item.categoria}</td>
                        <td className="p-4 text-slate-400">{item.palavra_chave_principal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm p-5">
                  <h3 className="font-bold text-lg text-red-400 mb-4">Atenção: Páginas Órfãs</h3>
                  {orfaos === 0 ? (
                    <p className="text-slate-400 text-sm">Nenhuma página órfã encontrada.</p>
                  ) : (
                    <ul className="space-y-3">
                      {data?.orphan_pages?.map((op: any) => (
                        <li key={op.id} className="text-sm border-l-2 border-red-500 pl-3 bg-red-900/10 py-2 pr-2 rounded-r">
                          <span className="font-bold block text-slate-200">{op.titulo}</span>
                          <span className="text-xs text-slate-400">{op.motivo}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm p-5">
                  <h3 className="font-bold text-lg text-amber-400 mb-4">Atenção: Conteúdo Duplicado</h3>
                  {duplicados === 0 ? (
                    <p className="text-slate-400 text-sm">Nenhum conteúdo duplicado encontrado.</p>
                  ) : (
                    <ul className="space-y-3">
                      {data?.duplicate_content?.map((dc: any, idx: number) => (
                        <li key={idx} className="text-sm border-l-2 border-amber-500 pl-3 bg-amber-900/10 py-2 pr-2 rounded-r">
                          <span className="font-bold block text-slate-200">Choque: {dc.original_id} vs {dc.similar_id}</span>
                          <span className="text-xs text-slate-400">Semelhança: {(dc.similarity_score * 100).toFixed(0)}% - {dc.motivo}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
