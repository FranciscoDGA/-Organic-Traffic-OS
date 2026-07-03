'use client';

import React, { useState, useEffect } from 'react';

interface WizardStep {
  step_number: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'blocked';
  estimated_time_minutes: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  platform: string;
  documentation_link: string;
  items: {
    key: string;
    description: string;
    completed: boolean;
    mandatory: boolean;
  }[];
}

interface WizardStatus {
  timestamp: string;
  overall_progress_percent: number;
  completed_steps: number;
  pending_steps: number;
  critical_blocks: number;
  readiness_scores: {
    infrastructure: number;
    database: number;
    storage: number;
    providers: number;
    publishing: number;
    workspaces: number;
    overall: number;
  };
  steps: WizardStep[];
}

export default function WizardDashboard() {
  const [status, setStatus] = useState<WizardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/setup');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Error fetching wizard status:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRevalidate = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/setup/revalidate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (e) {
      console.error('Error revalidating wizard:', e);
    } finally {
      setChecking(false);
    }
  };

  const handleCompleteItem = async (key: string) => {
    try {
      const res = await fetch('/api/setup/complete-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (e) {
      console.error('Error completing item:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500 border-r-2 border-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando Assistente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
            Infrastructure Wizard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Assistente inteligente para provisionamento e deploy seguro do Organic Traffic OS
          </p>
        </div>
        <button
          onClick={handleRevalidate}
          disabled={checking}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 text-sm flex items-center gap-2"
        >
          {checking ? 'Revalidando...' : 'Revalidar Tudo'}
        </button>
      </div>

      {status && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Overview Card */}
          <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">Progresso do Setup</h3>
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-36 h-36 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-indigo-400">{status.overall_progress_percent}%</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold mt-1">Concluído</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Etapas Concluídas:</span>
                  <span className="font-bold text-emerald-400">{status.completed_steps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Etapas Pendentes:</span>
                  <span className="font-bold text-amber-400">{status.pending_steps}</span>
                </div>
                {status.critical_blocks > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bloqueios Críticos:</span>
                    <span className="font-bold text-rose-400">{status.critical_blocks}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Readiness Scores</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Database:</span>
                  <span className="font-bold text-slate-200">{status.readiness_scores.database}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Storage:</span>
                  <span className="font-bold text-slate-200">{status.readiness_scores.storage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Providers:</span>
                  <span className="font-bold text-slate-200">{status.readiness_scores.providers}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Workspaces:</span>
                  <span className="font-bold text-slate-200">{status.readiness_scores.workspaces}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="lg:col-span-3 space-y-6">
            {status.steps.map((step) => (
              <div
                key={step.step_number}
                className={`bg-slate-900/20 border rounded-2xl p-6 transition-all duration-300 ${
                  step.status === 'completed' ? 'border-emerald-500/20' : 'border-slate-800/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.step_number}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        {step.title}
                        {step.status === 'completed' && (
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-medium">
                            Completa
                          </span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{step.platform}</span>
                    <span>•</span>
                    <span>{step.estimated_time_minutes} min</span>
                    <span>•</span>
                    <span className={step.difficulty === 'Fácil' ? 'text-emerald-400' : step.difficulty === 'Médio' ? 'text-amber-400' : 'text-rose-400'}>
                      {step.difficulty}
                    </span>
                  </div>
                </div>

                {/* Sub-items Checklist */}
                <div className="mt-4 space-y-3">
                  {step.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          item.completed ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'border-slate-700'
                        }`}>
                          {item.completed ? '✓' : ''}
                        </span>
                        <span className={item.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>
                          {item.description}
                          {item.mandatory && <span className="text-rose-400 ml-1 font-bold">*</span>}
                        </span>
                      </div>

                      {!item.completed && (
                        <button
                          onClick={() => handleCompleteItem(item.key)}
                          className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 transition-all text-xs font-semibold rounded-lg text-indigo-400 border border-indigo-500/20"
                        >
                          Marcar Concluído
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {step.documentation_link && (
                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-end">
                    <a
                      href={step.documentation_link}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      Ver Guia de Ajuda →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
