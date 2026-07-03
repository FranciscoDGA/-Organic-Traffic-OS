'use client';
import { useState, useEffect } from 'react';

interface KPI { id: string; name: string; currentValue: number; targetValue: number; unit: string; progress: number; trend: string; confidence: number; missionId: string; }
interface Milestone { id: string; name: string; deadline: string; status: string; progress: number; assignee: string; missionId: string; }
interface Scores { missionProgressScore: number; kpiAchievementScore: number; milestoneCompletionScore: number; executionVelocity: number; delayRiskScore: number; successProbability: number; overallMissionScore: number; }
interface MissionProgress { missionId: string; workspaceId: string; name: string; scores: Scores; kpis: KPI[]; milestones: Milestone[]; alerts: { id: string; level: string; message: string; type: string }[]; forecast: { estimatedCompletion: string; confidence: number }; velocity: { tasksPerDay: number; trend: string }; }

function ScoreBar({ label, value, color }: { label: string; value: number; color?: string }) {
  const c = color || (value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500');
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-700 rounded-full">
        <div className={`h-1.5 ${c} rounded-full`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

export default function MissionProgressPage() {
  const [missions, setMissions] = useState<MissionProgress[]>([]);
  const [selected, setSelected] = useState<MissionProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/mission-progress')
      .then(r => r.json())
      .then(d => { setMissions(d.missions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mission Progress Intelligence</h1>
        <p className="text-gray-400 text-sm">{missions.length} missoes monitoradas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {missions.map(m => (
            <div key={m.missionId} onClick={() => setSelected(m)} className={`p-4 rounded-xl border cursor-pointer transition ${selected?.missionId === m.missionId ? 'bg-blue-900/20 border-blue-600' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">{m.name}</span>
                <span className="text-lg font-bold text-blue-400">{m.scores.overallMissionScore}</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{m.workspaceId} | Velocity: {m.velocity.tasksPerDay}/dia</div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full">
                <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${m.scores.missionProgressScore}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{m.scores.missionProgressScore}% | Previsao: {m.forecast.estimatedCompletion}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">{selected.name}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Overall Score</div>
                  <div className="text-2xl font-bold text-blue-400">{selected.scores.overallMissionScore}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Sucesso</div>
                  <div className="text-2xl font-bold text-green-400">{selected.scores.successProbability}%</div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Risco Atraso</div>
                  <div className="text-2xl font-bold text-red-400">{selected.scores.delayRiskScore}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Velocity</div>
                  <div className="text-2xl font-bold text-yellow-400">{selected.velocity.tasksPerDay}/dia</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <ScoreBar label="Progresso" value={selected.scores.missionProgressScore} />
                <ScoreBar label="KPIs" value={selected.scores.kpiAchievementScore} />
                <ScoreBar label="Milestones" value={selected.scores.milestoneCompletionScore} />
                <ScoreBar label="Execucao" value={selected.scores.executionVelocity} />
                <ScoreBar label="Prob. Sucesso" value={selected.scores.successProbability} color="bg-green-500" />
                <ScoreBar label="Risco" value={selected.scores.delayRiskScore} color="bg-red-500" />
              </div>

              <h3 className="text-sm text-gray-400 mb-2">KPIs ({selected.kpis.length})</h3>
              <div className="space-y-2 mb-4">
                {selected.kpis.map(k => (
                  <div key={k.id} className="p-2 bg-gray-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white">{k.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{k.currentValue}/{k.targetValue} {k.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${k.trend === 'up' ? 'text-green-400' : k.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>{k.trend === 'up' ? '↑' : k.trend === 'down' ? '↓' : '→'}</span>
                      <span className="text-xs font-bold text-white">{k.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm text-gray-400 mb-2">Milestones ({selected.milestones.length})</h3>
              <div className="space-y-2 mb-4">
                {selected.milestones.map(ms => (
                  <div key={ms.id} className="p-2 bg-gray-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white">{ms.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{ms.deadline}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${ms.status === 'completed' ? 'bg-green-500/20 text-green-400' : ms.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : ms.status === 'delayed' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{ms.status}</span>
                  </div>
                ))}
              </div>

              {selected.alerts.length > 0 && (
                <>
                  <h3 className="text-sm text-gray-400 mb-2">Alertas ({selected.alerts.length})</h3>
                  <div className="space-y-1">
                    {selected.alerts.map(a => (
                      <div key={a.id} className={`p-2 rounded text-xs ${a.level === 'critical' ? 'bg-red-900/20 text-red-400 border border-red-800' : a.level === 'warning' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-800' : 'bg-blue-900/20 text-blue-400 border border-blue-800'}`}>{a.message}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center text-gray-500">Selecione uma missao para ver detalhes</div>
          )}
        </div>
      </div>
    </div>
  );
}
