'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function AIWriterPage() {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'SEO' | 'IA' | 'ESTRUTURA'>('SEO');
  const [isSimulated, setIsSimulated] = useState(false);
  const [meta, setMeta] = useState<any>(null);
  
  const [saveStatus, setSaveStatus] = useState<string>('Nenhuma alteração');
  const [saveLogs, setSaveLogs] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // SEO Metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const keywordDensity = meta?.keyword && wordCount > 0 
    ? ((content.toLowerCase().split(meta.keyword.toLowerCase()).length - 1) / wordCount * 100).toFixed(1)
    : 0;
  const h1Count = (content.match(/^# /gm) || []).length;
  const h2Count = (content.match(/^## /gm) || []).length;
  const h3Count = (content.match(/^### /gm) || []).length;

  const simulateLoad = () => {
    setMeta({
      workspace: 'PassaCumaru',
      pilar: 'Estratégia de Marketing',
      cluster: 'Inbound Marketing',
      keyword: 'inbound marketing b2b',
      longTails: ['como fazer inbound b2b', 'ferramentas de inbound b2b', 'inbound marketing industrial'],
      intent: 'Informativo',
      category: 'Marketing',
      tags: ['B2B', 'Inbound'],
      slug: 'guia-inbound-marketing-b2b',
      schema: 'Article'
    });
    setContent('# Guia Completo de Inbound Marketing B2B\n\nO Inbound Marketing B2B é essencial...');
    setIsSimulated(true);
    addLog('Simulação de Carga (Teste) carregada do Content Planner');
  };

  const addLog = (msg: string) => {
    setSaveLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const autoSave = useCallback(async (currentContent: string) => {
    if (!currentContent) return;
    setSaveStatus('Salvando...');
    try {
      const res = await fetch('/api/organic-os/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent, meta })
      });
      const data = await res.json();
      setSaveStatus(`Salvo - ${data.dbStatus}`);
      addLog('Auto Save: Draft atualizado (Persistência Pendente)');
    } catch (e) {
      setSaveStatus('Erro ao salvar');
    }
  }, [meta]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSaveStatus('Editando...');
    timeoutRef.current = setTimeout(() => {
      autoSave(val);
    }, 2000); // 2s auto-save debounce
  };

  const handleAIAssist = async (action: string) => {
    addLog(`IA (${action}) processando...`);
    try {
      const res = await fetch('/api/organic-os/ai-writer/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, action, context: { keyword: meta?.keyword } })
      });
      const data = await res.json();
      setContent(data.result);
      addLog(`IA (${action}) aplicada. Fonte: ${data.source}`);
      autoSave(data.result);
    } catch (e) {
      addLog(`Erro na chamada da IA`);
    }
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-slate-200 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* Header Contexto */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-white">AI Writer</h1>
          {meta ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
                {meta.workspace}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300 font-bold">{meta.keyword}</span>
              {isSimulated && (
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 ml-2 animate-pulse">
                  Simulação de Teste
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-500 italic">Pauta pendente</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {!meta && (
            <button onClick={simulateLoad} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm font-bold text-slate-200 rounded shadow">
              Simular Carga de Pipeline para Teste
            </button>
          )}
          <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm font-bold text-slate-300 rounded border border-slate-700">Salvar Rascunho</button>
          <button className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-bold rounded border border-blue-500/30">Enviar para Revisão</button>
          <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded shadow-lg shadow-emerald-500/20">Enviar ao Organic Publisher</button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* EDITOR (60%) */}
        <div className="w-[60%] border-r border-slate-800 flex flex-col bg-[#0F172A]">
          <div className="p-2 border-b border-slate-800 bg-slate-900 flex gap-4 text-xs text-slate-400 shrink-0">
            <span>Palavras: <strong className="text-slate-200">{wordCount}</strong></span>
            <span>Leitura Est: <strong className="text-slate-200">{readingTime} min</strong></span>
            {meta && <span>Score Otimização: <strong className="text-emerald-400">{(wordCount > 300 ? 85 : 40)}/100</strong></span>}
          </div>
          <textarea 
            value={content}
            onChange={handleContentChange}
            placeholder={meta ? "Comece a redigir seu artigo genial em Markdown..." : "Carregue a pauta no topo para começar..."}
            disabled={!meta}
            className="flex-1 w-full bg-transparent text-slate-200 p-8 resize-none focus:outline-none custom-scrollbar font-mono text-sm leading-relaxed"
          />
        </div>

        {/* SIDEBAR TABS (40%) */}
        <div className="w-[40%] flex flex-col bg-slate-900/50">
          
          <div className="flex bg-slate-900 border-b border-slate-800 p-2 shrink-0 gap-1">
            <button onClick={() => setActiveTab('SEO')} className={`flex-1 py-1.5 text-xs font-bold rounded ${activeTab === 'SEO' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>SEO</button>
            <button onClick={() => setActiveTab('IA')} className={`flex-1 py-1.5 text-xs font-bold rounded ${activeTab === 'IA' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>IA Writer</button>
            <button onClick={() => setActiveTab('ESTRUTURA')} className={`flex-1 py-1.5 text-xs font-bold rounded ${activeTab === 'ESTRUTURA' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>Estrutura</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* TAB SEO */}
            {activeTab === 'SEO' && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-700/50 pb-2">Vitals</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-slate-500 mb-1">Densidade da Keyword</div>
                      <div className={`text-lg font-bold ${Number(keywordDensity) > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{keywordDensity}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Heading Structure</div>
                      <div className="text-slate-300">
                        <span className={h1Count === 1 ? 'text-emerald-400' : 'text-red-400'}>H1: {h1Count}</span> | H2: {h2Count} | H3: {h3Count}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-700/50 pb-2">Meta Dados Sugeridos <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded float-right">OpenAI (Estimado)</span></h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 mb-1">Title</div>
                      <div className="text-xs bg-slate-900 p-2 rounded text-slate-300 border border-slate-800">{meta ? `${meta.keyword} - O Guia Completo` : '...'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 mb-1">Description</div>
                      <div className="text-xs bg-slate-900 p-2 rounded text-slate-300 border border-slate-800">{meta ? `Descubra tudo sobre ${meta.keyword} neste guia estratégico...` : '...'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 mb-1">Schema JSON-LD</div>
                      <div className="text-xs text-emerald-400 font-mono">{meta ? meta.schema : '...'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-700/50 pb-2">Links Internos <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded float-right">Banco Local (Real)</span></h3>
                  {meta ? (
                    <ul className="text-xs space-y-2 text-indigo-300">
                      <li>• [Guia de CRM B2B](/crm)</li>
                      <li>• [Automação de Vendas](/vendas)</li>
                    </ul>
                  ) : <span className="text-xs text-slate-500">Pendente</span>}
                </div>
                
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-700/50 pb-2 flex justify-between">
                    Prevenção
                    <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded">Banco Local (Real)</span>
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>Duplicidade: <span className="text-emerald-400 font-bold">0% detectado</span></div>
                    <div>Canibalização: <span className="text-emerald-400 font-bold">Livre</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB IA */}
            {activeTab === 'IA' && (
              <div className="space-y-4">
                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                  <h3 className="font-bold text-purple-300 text-sm mb-2">Comandos Rápidos</h3>
                  <p className="text-xs text-slate-400 mb-4">A IA vai ler o conteúdo inteiro do editor e aplicar a otimização imediatamente.</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleAIAssist('rewrite')} className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 font-bold text-slate-200">Reescrever</button>
                    <button onClick={() => handleAIAssist('expand')} className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 font-bold text-slate-200">Expandir</button>
                    <button onClick={() => handleAIAssist('summarize')} className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 font-bold text-slate-200">Resumir</button>
                    <button onClick={() => handleAIAssist('fix_grammar')} className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 font-bold text-slate-200">Corrigir Gramática</button>
                    <button onClick={() => handleAIAssist('optimize')} className="p-2 bg-purple-600 hover:bg-purple-500 text-xs rounded border border-purple-500 font-bold text-white shadow-lg shadow-purple-500/20">Otimizar para SEO</button>
                    <button onClick={() => handleAIAssist('tone')} className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 font-bold text-slate-200">Mudar Tom</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB ESTRUTURA */}
            {activeTab === 'ESTRUTURA' && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-700/50 pb-2">Outline Detectado</h3>
                  <div className="text-xs font-mono text-indigo-300 space-y-1">
                    {(content.match(/^#{1,3} .*/gm) || []).map((h, i) => (
                      <div key={i} className={h.startsWith('###') ? 'ml-6' : h.startsWith('##') ? 'ml-3 text-white' : 'font-bold text-emerald-400'}>
                        {h}
                      </div>
                    )) || <span className="text-slate-500 italic">Nenhum heading encontrado</span>}
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-700/50 pb-2 flex justify-between">Sugestões de Bloco <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded float-right">OpenAI (Estimado)</span></h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 mb-1">FAQ Recomendado</div>
                      <div className="text-xs bg-slate-900 p-2 rounded text-slate-400 border border-slate-800">
                        {meta ? `1. O que é ${meta.keyword}?\n2. Como aplicar?` : '...'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 mb-1">Chamada para Ação (CTA)</div>
                      <div className="text-xs text-amber-400 italic">
                        {meta ? `"Agende sua consultoria sobre ${meta.keyword} agora"` : '...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* FOOTER (LOGS E AUTO SAVE) */}
      <footer className="bg-black border-t border-slate-800 p-2 shrink-0 flex justify-between items-center text-xs">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <span className={`w-2 h-2 rounded-full ${saveStatus.includes('Salvo') ? 'bg-emerald-500' : saveStatus.includes('Editando') ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
            {saveStatus}
          </div>
          <div className="text-slate-500 text-[10px] font-mono truncate h-4">
            {saveLogs[0] || 'Aguardando inicialização do editor...'}
          </div>
        </div>
        
        {saveStatus.includes('Pend') && (
          <div className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded">
            Persistência Pendente
          </div>
        )}
      </footer>

    </div>
  );
}
