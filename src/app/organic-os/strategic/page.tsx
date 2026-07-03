'use client';
import { useState, useEffect } from 'react';

interface Score { missionHealth: number; executionHealth: number; strategyScore: number; priorityScore: number; operationalRisk: number; expectedSuccess: number; overallStrategicScore: number; }
interface Supervision { missionId: string; workspaceId: string; name: string; status: string; progress: number; score: Score; deviations: string[]; recommendations: string[]; lastAnalyzed: string; }
interface Decision { id: string; workspaceId: string; missionId: string; type: string; origin: string; reason: string; impact: string; confidence: number; priority: string; recommendation: string; status: string; createdAt: string; }
interface Report { id: string; supervisedMissions: number; activeDecisions: number; missionSupervisions: Supervision[]; recentDecisions: Decision[]; overallStrategicScore: number; recommendations: string[]; createdAt: string; }

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-700 rounded-full">
        <div className={`h-1.5 ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function StrategicPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/strategic', { method: 'GET' })
      .then(r => r.json())
      .then(setReport)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    const res = await fetch('/api/organic-os/strategic/analyze', { method: 'POST' });
    const data = await res.json();
    const rRes = await fetch('/api/organic-os/strategic', { method: 'GET' });
    const rData = await rRes.json();
    setReport(rData);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;
  if (!report) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">Erro ao carregar</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Strategic AI Director</h1>
          <p className="text-gray-400 text-sm">{report.supervisedMissions} missoes supervisionadas | Score: {report.overallStrategicScore}</p>
        </div>
        <button onClick={runAnalysis} className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold hover:bg-blue-500">Analisar Agora</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <div className="text-xs text-gray-400 mb-1">Strategic Score</div>
          <div className="text-4xl font-bold text-blue-400">{report.overallStrategicScore}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <div className="text-xs text-gray-400 mb-1">Missoes</div>
          <div className="text-4xl font-bold text-white">{report.supervisedMissions}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <div className="text-xs text-gray-400 mb-1">Decisoes Ativas</div>
          <div className="text-4xl font-bold text-yellow-400">{report.activeDecisions}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Supervisao de Missoes</h3>
          <div className="space-y-4">
            {report.missionSupervisions.map(s => (
              <div key={s.missionId} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-bold text-white">{s.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{s.workspaceId}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{s.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <ScoreBar label="Mission Health" value={s.score.missionHealth} />
                  <ScoreBar label="Execution" value={s.score.executionHealth} />
                  <ScoreBar label="Strategy" value={s.score.strategyScore} />
                  <ScoreBar label="Risk" value={s.score.operationalRisk} />
                </div>
                {s.deviations.length > 0 && (
                  <div className="mt-2">
                    {s.deviations.map((d, i) => <div key={i} className="text-xs text-yellow-400">⚠ {d}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Decisoes Recentes</h3>
          <div className="space-y-2">
            {report.recentDecisions.length === 0 && <p className="text-sm text-gray-500">Nenhuma decisao gerada</p>}
            {report.recentDecisions.map(d => (
              <div key={d.id} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-white">{d.type}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${d.impact === 'high' ? 'bg-red-500/20 text-red-400' : d.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{d.impact}</span>
                </div>
                <p className="text-xs text-gray-400">{d.reason}</p>
                <div className="mt-1 text-xs text-gray-500">Missao: {d.missionId} | Confianca: {(d.confidence * 100).toFixed(0)}% | Status: {d.status}</div>
              </div>
            ))}
          </div>

          <h3 className="text-sm text-gray-400 mt-4 mb-2">Recomendacoes</h3>
          <div className="space-y-1">
            {[...new Set(report.recommendations)].map((r, i) => (
              <div key={i} className="p-2 bg-blue-900/20 rounded text-xs text-blue-400 border border-blue-800">💡 {r}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
