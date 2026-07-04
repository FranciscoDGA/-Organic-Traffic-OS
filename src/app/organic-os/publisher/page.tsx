'use client';

import { useState, useEffect } from 'react';

export default function PublisherPage() {
  const [workspaceDomain, setWorkspaceDomain] = useState('localhost:3000'); // Falso por padrão, para simular erro de bridge se não for existente
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/publisher');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const simulateBase = async () => {
    try {
      await fetch('/api/organic-os/publisher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate' })
      });
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  const addLog = (msg: string, type: 'info'|'error'|'success' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] [${type.toUpperCase()}] ${msg}`, ...prev].slice(0, 15));
  };

  const selectedArticle = data?.queue?.find((q: any) => q.id === selectedArticleId);

  const handlePublish = async () => {
    if (!selectedArticle) return;
    if (!selectedArticle.isReady) {
      addLog('Tentativa bloqueada. Checklist não está 100% OK.', 'error');
      return;
    }

    setIsPublishing(true);
    addLog(`Iniciando Teste real de conexão com Bridge para o artigo: ${selectedArticle.title}`);
    addLog(`Ping alvo: ${workspaceDomain}/api/bridge/publish`);

    try {
      const res = await fetch('/api/organic-os/publisher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'publish', 
          endpointDomain: workspaceDomain,
          articleId: selectedArticle.id,
          title: selectedArticle.title
        })
      });
      const json = await res.json();

      if (json.success) {
        addLog(json.message, 'success');
        // Update local state to published
        setData((prev: any) => ({
          ...prev,
          queue: prev.queue.map((q: any) => q.id === selectedArticle.id ? { ...q, status: 'Publicado' } : q)
        }));
      } else {
        if (json.error === 'Integração pendente') {
           addLog(`Integração pendente: ${json.message}`, 'error');
        } else {
           addLog(`Falhou: ${json.message}`, 'error');
        }
        setData((prev: any) => ({
          ...prev,
          queue: prev.queue.map((q: any) => q.id === selectedArticle.id ? { ...q, status: 'Falhou' } : q)
        }));
      }
    } catch (err: any) {
      addLog(`Erro crítico de rede: ${err.message}`, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReject = () => {
    if (!selectedArticle) return;
    addLog(`Artigo "${selectedArticle.title}" rejeitado. Voltando para fila do AI Writer.`, 'info');
    setData((prev: any) => ({
      ...prev,
      queue: prev.queue.filter((q: any) => q.id !== selectedArticle.id)
    }));
    setSelectedArticleId(null);
  };

  if (loading) {
    return <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 flex items-center justify-center">Carregando Fila de Publicação...</div>;
  }

  // Base Insuficiente State
  if (data?.status === 'insufficient') {
    return (
      <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200 font-sans">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Organic Publisher</h1>
          <p className="text-slate-400">Porteira final de qualidade. Auto-publicação desativada por segurança.</p>
        </header>

        <div className="flex flex-col items-center justify-center bg-slate-800/20 border border-slate-700/50 rounded-2xl h-96 text-center shadow-lg">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">A fila está vazia</h3>
          <p className="text-slate-400 max-w-md">Nenhum artigo aprovado enviado pelo AI Writer até o momento.</p>
          <button onClick={simulateBase} className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition shadow-lg shadow-indigo-500/20 text-sm">
            Simular Carga de Pipeline para Teste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-screen text-slate-200 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-3">
            Organic Publisher
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30 uppercase font-bold tracking-widest animate-pulse">
              Simulação de Teste
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Domínio do Workspace (Para Teste do Bridge)</label>
          <input 
            type="text" 
            value={workspaceDomain} 
            onChange={(e) => setWorkspaceDomain(e.target.value)}
            className="px-3 py-1 bg-black border border-slate-700 rounded text-sm text-slate-300 w-64 focus:border-indigo-500 outline-none font-mono"
            placeholder="ex: qualoseguro.com"
          />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LISTA (40%) */}
        <div className="w-[40%] border-r border-slate-800 flex flex-col bg-[#0F172A] overflow-y-auto custom-scrollbar p-4">
          <h2 className="text-xs uppercase font-bold text-slate-500 mb-4 tracking-widest">Fila de Publicação</h2>
          
          <div className="space-y-3">
            {data?.queue?.map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedArticleId(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${selectedArticleId === item.id ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${
                    item.status === 'Publicado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    item.status === 'Falhou' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    item.isReady ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  {!item.isReady && item.status !== 'Falhou' && (
                    <span className="text-red-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                <div className="text-[10px] font-mono text-slate-500 truncate">/{item.slug}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CHECKLIST & AÇÕES (60%) */}
        <div className="w-[60%] flex flex-col bg-slate-900/50 relative">
          
          {selectedArticle ? (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">{selectedArticle.title}</h2>
                <button onClick={() => setShowPreview(true)} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded border border-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Preview
                </button>
              </div>

              {/* Checklist Panel */}
              <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 mb-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between border-b border-slate-700 pb-2">
                  Checklist de Qualidade (Go/No-Go)
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${selectedArticle.isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {selectedArticle.isReady ? '100% OK' : 'PENDÊNCIAS ENCONTRADAS'}
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {Object.entries(selectedArticle.checks).map(([key, val]: any) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${val ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {val ? (
                          <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-3 h-3 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </div>
                      <span className={`text-sm ${val ? 'text-slate-300' : 'text-red-400 font-bold'}`}>{
                        key === 'metaTitle' ? 'Meta Title Presente' :
                        key === 'metaDescription' ? 'Meta Description Presente' :
                        key === 'canonical' ? 'URL Canonical Definida' :
                        key === 'schema' ? 'Schema JSON-LD Válido' :
                        key === 'internalLinks' ? 'Links Internos Presentes' :
                        key === 'imagesAlt' ? 'Todas as Imagens têm Alt Text' :
                        key === 'category' ? 'Categoria Definida' :
                        key === 'slugUnique' ? 'Slug é Único na Base' : key
                      }</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-4">
                <button 
                  onClick={handleReject}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-sm font-bold text-slate-300 rounded-lg border border-slate-700 transition"
                >
                  Rejeitar e voltar ao AI Writer
                </button>
                <button 
                  onClick={handlePublish}
                  disabled={!selectedArticle.isReady || isPublishing || selectedArticle.status === 'Publicado'}
                  className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg shadow-lg transition flex items-center justify-center gap-2 ${
                    !selectedArticle.isReady || selectedArticle.status === 'Publicado' ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 
                    isPublishing ? 'bg-indigo-600 text-white animate-pulse' :
                    'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                  }`}
                >
                  {isPublishing ? 'Disparando ao Bridge...' : 
                   selectedArticle.status === 'Publicado' ? 'Já Publicado' : 
                   !selectedArticle.isReady ? 'Corrija as pendências para publicar' : 'Publicar Manualmente'}
                </button>
              </div>

            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-slate-500">Selecione um artigo na fila</div>
          )}

        </div>
      </div>

      {/* FOOTER TERMINAL */}
      <footer className="h-48 bg-black border-t border-slate-800 flex flex-col shrink-0">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Terminal de Bridge Logs</span>
          <span className="text-[10px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">Auto-publicação desativada</span>
        </div>
        <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1 custom-scrollbar">
          {logs.length === 0 && <div className="text-slate-600 italic">Nenhum evento registrado na sessão atual.</div>}
          {logs.map((log, i) => (
             <div key={i} className={
               log.includes('[ERROR]') ? 'text-red-400' :
               log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-400'
             }>{log}</div>
          ))}
        </div>
      </footer>

      {/* MODAL PREVIEW */}
      {showPreview && selectedArticle && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
              <h2 className="font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Preview: {selectedArticle.title}
              </h2>
              <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
