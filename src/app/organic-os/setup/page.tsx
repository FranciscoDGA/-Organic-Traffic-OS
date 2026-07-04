'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DiagnosticStatus {
  workspace: 'ok' | 'missing' | 'partial' | 'error';
  site: 'ok' | 'missing' | 'partial' | 'error';
  endpoints: 'ok' | 'missing' | 'partial' | 'error';
  secrets: 'ok' | 'missing' | 'partial' | 'error';
  data_mode: 'mock' | 'real';
  ready_for_production: boolean;
}

export default function SetupWizardDashboard() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticStatus | null>(null);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/system/diagnostics');
      const data = await res.json();
      setDiagnostics(data.status);
      setMissingItems(data.missing_items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const renderStatusBadge = (status: string) => {
    if (status === 'ok') return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs uppercase font-bold">OK</span>;
    if (status === 'partial') return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs uppercase font-bold">Partial</span>;
    if (status === 'error') return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs uppercase font-bold">Error</span>;
    return <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs uppercase font-bold">Faltando</span>;
  };

  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Setup & Diagnostics Wizard</h1>
            <p className="text-slate-400">Validação Real de Prontidão de Produção (Production Readiness)</p>
          </div>
          <button onClick={fetchDiagnostics} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition">
            Re-executar Diagnóstico
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse bg-slate-800/50 h-64 rounded border border-slate-700"></div>
        ) : diagnostics ? (
          <div className="space-y-6">
            
            {/* System Status Alert */}
            {diagnostics.ready_for_production ? (
              <div className="bg-emerald-900/30 border border-emerald-500/50 p-6 rounded-lg flex items-center space-x-4">
                <div className="text-emerald-400 text-4xl">✅</div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-300">Sistema Pronto para Produção</h3>
                  <p className="text-emerald-400/80">Todos os requisitos reais de ambiente foram atendidos.</p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/30 border border-amber-500/50 p-6 rounded-lg flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-amber-400 text-4xl">⚠️</div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-300">Atenção: Sistema NÃO Pronto para Produção</h3>
                    <p className="text-amber-400/80">Existem configurações pendentes ou dados mockados detectados no ambiente.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Checklist Grid */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-700 font-bold bg-slate-800">Checklist de Integrações</div>
              
              <div className="p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-800/30">
                <div>
                  <div className="font-semibold text-white">1. Workspace Configurado</div>
                  <div className="text-xs text-slate-400">Verifica variáveis de ambiente de projeto base.</div>
                </div>
                <div>{renderStatusBadge(diagnostics.workspace)}</div>
              </div>

              <div className="p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-800/30">
                <div>
                  <div className="font-semibold text-white">2. Site Conectado</div>
                  <div className="text-xs text-slate-400">Verifica se existe um domínio alvo (ORGANIC_SITE_URL).</div>
                </div>
                <div>{renderStatusBadge(diagnostics.site)}</div>
              </div>

              <div className="p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-800/30">
                <div>
                  <div className="font-semibold text-white">3. Endpoints de Publicação</div>
                  <div className="text-xs text-slate-400">Verifica se as pontes de comunicação (Bridges) estão ativas.</div>
                </div>
                <div>{renderStatusBadge(diagnostics.endpoints)}</div>
              </div>

              <div className="p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-800/30">
                <div>
                  <div className="font-semibold text-white">4. API Secrets & Chaves</div>
                  <div className="text-xs text-slate-400">Verifica chaves sensíveis como OPENAI_API_KEY.</div>
                </div>
                <div>{renderStatusBadge(diagnostics.secrets)}</div>
              </div>

              <div className="p-4 flex justify-between items-center hover:bg-slate-800/30">
                <div>
                  <div className="font-semibold text-white">5. Uso de Dados Reais</div>
                  <div className="text-xs text-slate-400">Verifica se o sistema está operando sem dados falsos (mocks).</div>
                </div>
                <div>
                  {diagnostics.data_mode === 'mock' 
                    ? <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs uppercase font-bold">MOCK DETECTADO</span>
                    : <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs uppercase font-bold">DADOS REAIS</span>
                  }
                </div>
              </div>
            </div>

            {/* O que falta configurar */}
            {missingItems.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h4 className="font-bold text-red-400 mb-4">O que falta configurar (Erros Bloqueantes):</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                  {missingItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button 
                disabled={!diagnostics.ready_for_production}
                className={`px-8 py-3 rounded font-bold transition ${diagnostics.ready_for_production ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
              >
                Colocar em Produção
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
