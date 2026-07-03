'use client';
import { useState, useEffect } from 'react';

interface CEOData {
  totalWorkspaces: number;
  activeWorkspaces: number;
  healthScore: number;
  growthScore: number;
  riskScore: number;
  workspaceRanking: { workspaceId: string; name: string; overallScore: number; healthScore: number; growthScore: number; riskScore: number; traffic: number; cost: number; contentCount: number; status: string }[];
  alerts: { id: string; level: string; title: string; description: string; origin: string }[];
  prioritizedActions: { id: string; type: string; title: string; description: string; impact: string; confidence: number; origin: string }[];
  costOverview: { totalCost: number; totalTokens: number; avgCostPerWorkspace: number };
  executionOverview: { totalWorkflows: number; activeJobs: number; pendingActions: number; experimentsRunning: number; contentInProduction: number; contentAtRisk: number };
  summary: { situation: string; bestWorkspace: string; highestRiskWorkspace: string; mostUrgentAction: string; biggestOpportunity: string; estimatedCost: string; mainRecommendation: string };
}

function ScoreRing({ label, score, color }: { label: string; score: number; color: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="transform -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute mt-5 text-center">
        <div className="text-xl font-bold text-white">{score}</div>
      </div>
      <span className="text-xs text-gray-400 mt-2">{label}</span>
    </div>
  );
}

export default function CEOPage() {
  const [data, setData] = useState<CEOData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/ceo')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;
  if (!data) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">Erro ao carregar</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CEO Dashboard</h1>
        <p className="text-gray-400 mt-1">{data.totalWorkspaces} workspaces | {data.activeWorkspaces} ativos</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <h2 className="text-sm text-gray-400 mb-3">Resumo Executivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-gray-500">Situacao:</span> <span className="text-white">{data.summary.situation}</span></div>
          <div><span className="text-gray-500">Melhor:</span> <span className="text-green-400">{data.summary.bestWorkspace}</span></div>
          <div><span className="text-gray-500">Maior Risco:</span> <span className="text-red-400">{data.summary.highestRiskWorkspace}</span></div>
          <div><span className="text-gray-500">Acao mais urgente:</span> <span className="text-yellow-400">{data.summary.mostUrgentAction}</span></div>
          <div><span className="text-gray-500">Maior oportunidade:</span> <span className="text-blue-400">{data.summary.biggestOpportunity}</span></div>
          <div><span className="text-gray-500">Custo estimado:</span> <span className="text-white">{data.summary.estimatedCost}</span></div>
        </div>
        <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
          <span className="text-blue-400 text-sm font-medium">Recomendacao:</span> <span className="text-white text-sm">{data.summary.mainRecommendation}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <ScoreRing label="Health" score={data.healthScore} color="#22c55e" />
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <ScoreRing label="Growth" score={data.growthScore} color="#3b82f6" />
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <ScoreRing label="Risk" score={data.riskScore} color="#ef4444" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Ranking dos Workspaces</h3>
          <div className="space-y-3">
            {data.workspaceRanking.map((w, i) => (
              <div key={w.workspaceId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-500">#{i + 1}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{w.name}</div>
                    <div className="text-xs text-gray-500">Conteudo: {w.contentCount} | Trafego: {w.traffic}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-400">{w.overallScore}</div>
                  <div className={`text-xs ${w.status === 'healthy' ? 'text-green-400' : w.status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>{w.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Alertas Criticos</h3>
          <div className="space-y-2">
            {data.alerts.map(a => (
              <div key={a.id} className={`p-3 rounded-lg border ${a.level === 'critical' ? 'bg-red-900/20 border-red-800' : a.level === 'warning' ? 'bg-yellow-900/20 border-yellow-800' : 'bg-blue-900/20 border-blue-800'}`}>
                <div className="text-sm font-bold text-white">{a.title}</div>
                <div className="text-xs text-gray-400">{a.description} | Origem: {a.origin}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
        <h3 className="text-sm text-gray-400 mb-3">Acoes Prioritarias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.prioritizedActions.map(a => (
            <div key={a.id} className="p-3 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">{a.title}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${a.impact === 'high' ? 'bg-red-500/20 text-red-400' : a.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{a.impact}</span>
              </div>
              <p className="text-xs text-gray-400">{a.description}</p>
              <div className="mt-1 text-xs text-gray-500">Tipo: {a.type} | Confianca: {(a.confidence * 100).toFixed(0)}% | Origem: {a.origin}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Custos e IA</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Custo Total</div>
              <div className="text-xl font-bold text-yellow-400">${data.costOverview.totalCost}</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Tokens</div>
              <div className="text-xl font-bold text-white">{data.costOverview.totalTokens}</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Custo/Workspace</div>
              <div className="text-xl font-bold text-white">${data.costOverview.avgCostPerWorkspace}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Workflows e Jobs</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Workflows</div>
              <div className="text-xl font-bold text-blue-400">{data.executionOverview.totalWorkflows}</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Jobs Ativos</div>
              <div className="text-xl font-bold text-green-400">{data.executionOverview.activeJobs}</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Acoes Pendentes</div>
              <div className="text-xl font-bold text-yellow-400">{data.executionOverview.pendingActions}</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500">Conteudo em Risco</div>
              <div className="text-xl font-bold text-red-400">{data.executionOverview.contentAtRisk}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
