'use client';

import React, { useState, useEffect } from 'react';

interface DiagnosticItem {
  id: string;
  name: string;
  category: string;
  severity: 'OK' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  description: string;
  impact: string;
  recommendation: string;
  documentation_link: string;
  checked_at: string;
}

interface ValidationReport {
  timestamp: string;
  overall_health_score: number;
  scores: {
    infrastructure: number;
    database: number;
    storage: number;
    publishing: number;
    workspace: number;
    security: number;
  };
  diagnostics: DiagnosticItem[];
}

export default function InfrastructureDashboard() {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/infrastructure/report');
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error('Error fetching infra report:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const res = await fetch('/api/infrastructure/recheck', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (e) {
      console.error('Error validation check:', e);
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500 border-r-2 border-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando Auditoria...</p>
        </div>
      </div>
    );
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  const severityBadge = (sev: DiagnosticItem['severity']) => {
    const classes: Record<string, string> = {
      'OK': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'INFO': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'WARNING': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'ERROR': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      'CRITICAL': 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase ${classes[sev] || ''}`}>
        {sev}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
            Infrastructure Validator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Auditoria automatizada do ecossistema do Organic Traffic OS
          </p>
        </div>
        <button
          onClick={handleValidate}
          disabled={validating}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all text-white font-semibold rounded-lg shadow-lg shadow-violet-500/20 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {validating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-2 border-transparent"></div>
              Verificando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.01" />
              </svg>
              Re-scanear Infraestrutura
            </>
          )}
        </button>
      </div>

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Health Card */}
          <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-6">Score Geral de Saúde</h3>
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-40 h-40 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <span className="text-5xl font-black text-violet-400">{report.overall_health_score}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Última auditoria completa: <br />
              <span className="text-slate-400 font-mono mt-1 block">
                {new Date(report.timestamp).toLocaleString('pt-BR')}
              </span>
            </p>
          </div>

          {/* Subscores Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className={`border rounded-2xl p-5 ${scoreColor(report.scores.infrastructure)}`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Infraestrutura</h4>
              <p className="text-3xl font-extrabold mt-2">{report.scores.infrastructure}/100</p>
              <div className="w-full bg-slate-800/60 rounded-full h-1.5 mt-4">
                <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${report.scores.infrastructure}%` }}></div>
              </div>
            </div>

            <div className={`border rounded-2xl p-5 ${scoreColor(report.scores.database)}`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Banco de Dados</h4>
              <p className="text-3xl font-extrabold mt-2">{report.scores.database}/100</p>
              <div className="w-full bg-slate-800/60 rounded-full h-1.5 mt-4">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${report.scores.database}%` }}></div>
              </div>
            </div>

            <div className={`border rounded-2xl p-5 ${scoreColor(report.scores.storage)}`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Storage</h4>
              <p className="text-3xl font-extrabold mt-2">{report.scores.storage}/100</p>
              <div className="w-full bg-slate-800/60 rounded-full h-1.5 mt-4">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${report.scores.storage}%` }}></div>
              </div>
            </div>

            <div className={`border rounded-2xl p-5 ${scoreColor(report.scores.publishing)}`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Publicador</h4>
              <p className="text-3xl font-extrabold mt-2">{report.scores.publishing}/100</p>
              <div className="w-full bg-slate-800/60 rounded-full h-1.5 mt-4">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${report.scores.publishing}%` }}></div>
              </div>
            </div>

            <div className={`border rounded-2xl p-5 ${scoreColor(report.scores.workspace)}`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspaces</h4>
              <p className="text-3xl font-extrabold mt-2">{report.scores.workspace}/100</p>
              <div className="w-full bg-slate-800/60 rounded-full h-1.5 mt-4">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${report.scores.workspace}%` }}></div>
              </div>
            </div>

            <div className={`border rounded-2xl p-5 ${scoreColor(report.scores.security)}`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Segurança</h4>
              <p className="text-3xl font-extrabold mt-2">{report.scores.security}/100</p>
              <div className="w-full bg-slate-800/60 rounded-full h-1.5 mt-4">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${report.scores.security}%` }}></div>
              </div>
            </div>
          </div>

          {/* Diagnostics list */}
          <div className="lg:col-span-4 bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Relatório de Auditoria e Alertas
            </h3>

            <div className="space-y-4">
              {report.diagnostics.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 backdrop-blur-sm ${
                    item.severity === 'OK' ? 'border-emerald-500/10' :
                    item.severity === 'WARNING' ? 'border-amber-500/20' :
                    'border-rose-500/30'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {severityBadge(item.severity)}
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100">{item.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                    {item.severity !== 'OK' && (
                      <div className="mt-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-xs">
                        <strong className="text-amber-400 block mb-1">Impacto:</strong>
                        <p className="text-slate-400 mb-2">{item.impact}</p>
                        <strong className="text-violet-400 block mb-1">Recomendação:</strong>
                        <p className="text-slate-300">{item.recommendation}</p>
                      </div>
                    )}
                  </div>

                  {item.documentation_link && (
                    <a
                      href={item.documentation_link}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-semibold rounded-lg text-slate-300 border border-slate-700/60 shrink-0 self-end md:self-center"
                    >
                      Ler Documentação
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
