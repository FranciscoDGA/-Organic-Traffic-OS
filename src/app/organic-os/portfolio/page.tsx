'use client';
import { useState, useEffect } from 'react';

type Tab = 'overview' | 'ranking' | 'compare' | 'capacity' | 'recommendations';
const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Visao Geral' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'compare', label: 'Comparar' },
  { id: 'capacity', label: 'Capacity' },
  { id: 'recommendations', label: 'Recomendacoes' },
];

function Badge({ value, color }: { value: number; color: string }) {
  return <span className={`px-2 py-1 rounded text-xs font-bold bg-${color}-500/20 text-${color}-400`}>{value}</span>;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-bold">{score}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full">
        <div className={`h-2 ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/organic-os/portfolio?tab=${tab}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [tab]);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;
  if (!data) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">Erro ao carregar</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Portfolio Intelligence</h1>
        <p className="text-gray-400 text-sm">{data.workspaceCount || 0} workspaces no portfolio</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && data.portfolioScore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-2">Portfolio Score</h3>
            <div className="text-4xl font-bold text-blue-400">{data.portfolioScore.overallPortfolioScore}</div>
          </div>
          {data.ranking?.map((r: any) => (
            <div key={r.workspaceId} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-1">{r.workspaceId}</h3>
              <div className="text-3xl font-bold text-white">{r.score}</div>
              <span className="text-xs text-gray-500">Rank #{r.rank}</span>
            </div>
          ))}
          {data.risks?.length > 0 && (
            <div className="bg-red-900/20 rounded-xl p-5 border border-red-800">
              <h3 className="text-sm text-red-400 mb-2">Riscos</h3>
              {data.risks.map((r: string, i: number) => <p key={i} className="text-sm text-gray-300">{r}</p>)}
            </div>
          )}
        </div>
      )}

      {tab === 'ranking' && data.ranking && (
        <div className="space-y-3">
          {data.ranking.map((r: any) => (
            <div key={r.workspaceId} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-500">#{r.rank}</span>
                <span className="text-lg font-bold text-white">{r.workspaceId}</span>
              </div>
              <span className="text-xl font-bold text-blue-400">{r.score}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'compare' && Array.isArray(data) && (
        <div className="space-y-3">
          {data.map((c: any) => (
            <div key={c.metric} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">{c.metric}</span>
                <span className="text-xs text-green-400">Vencedor: {c.winner}</span>
              </div>
              <div className="flex gap-4">
                {c.values.map((v: any) => (
                  <div key={v.workspaceId} className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{v.workspaceId}</div>
                    <div className="text-lg font-bold text-white">{v.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'capacity' && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-1">Workspaces</h3>
            <div className="text-3xl font-bold text-white">{data.totalWorkspaces}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-1">Total Conteudo</h3>
            <div className="text-3xl font-bold text-white">{data.totalContent}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-1">Workflows Executados</h3>
            <div className="text-3xl font-bold text-white">{data.totalWorkflows}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-1">Tokens Usados</h3>
            <div className="text-3xl font-bold text-white">{data.totalTokensUsed}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-1">Custo Estimado</h3>
            <div className="text-3xl font-bold text-yellow-400">${data.totalCostEstimate}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-1">Capacidade Restante</h3>
            <div className="text-3xl font-bold text-green-400">{data.capacityRemaining}%</div>
          </div>
          {data.bottlenecks?.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 col-span-full">
              <h3 className="text-sm text-gray-400 mb-2">Gargalos</h3>
              {data.bottlenecks.map((b: string, i: number) => <p key={i} className="text-sm text-gray-300">• {b}</p>)}
            </div>
          )}
        </div>
      )}

      {tab === 'recommendations' && Array.isArray(data) && (
        <div className="space-y-3">
          {data.map((r: any) => (
            <div key={r.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">{r.title}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${r.impact === 'high' ? 'bg-red-500/20 text-red-400' : r.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{r.impact}</span>
              </div>
              <p className="text-sm text-gray-400">{r.description}</p>
              <div className="mt-2 flex gap-2 text-xs text-gray-500">
                <span>Tipo: {r.type}</span>
                {r.workspaceId && <span>• WS: {r.workspaceId}</span>}
                <span>• Confianca: {(r.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
