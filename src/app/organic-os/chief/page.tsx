'use client';
import { useState, useEffect } from 'react';

interface Plan { id: string; workspaceId: string; date: string; objectives: string[]; priorityTasks: { id: string; title: string; priority: string; status: string; assignedTo: string; estimatedTime: number; estimatedCost: number }[]; scheduledWorkflows: { id: string; name: string; time: string }[]; estimatedTime: number; estimatedCost: number; risks: string[]; opportunities: string[]; recommendations: string[]; }
interface Summary { topPriorities: string[]; criticalTasks: string[]; biggestRisk: string; biggestOpportunity: string; mostImportantMission: string; operationalRecommendation: string; }
interface Capacity { runtimeCapacity: number; schedulerCapacity: number; agentCapacity: number; aiLimit: number; dailyBudget: number; maxWorkflows: number; utilization: number; }
interface Workload { agent: string; taskCount: number; estimatedTime: number; }

function PriorityBadge({ p }: { p: string }) {
  const c = p === 'critical' ? 'bg-red-500/20 text-red-400' : p === 'high' ? 'bg-orange-500/20 text-orange-400' : p === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400';
  return <span className={`px-2 py-0.5 rounded text-xs font-bold ${c}`}>{p}</span>;
}

export default function ChiefPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [capacity, setCapacity] = useState<Capacity | null>(null);
  const [workload, setWorkload] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/organic-os/chief/daily-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(r => r.json()),
      fetch('/api/organic-os/chief/summary').then(r => r.json()),
      fetch('/api/organic-os/chief/capacity').then(r => r.json()),
    ]).then(([p, s, c]) => {
      setPlan(p.plan);
      setSummary(s.summary);
      setCapacity(c.capacity);
      setWorkload(c.workload || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;
  if (!plan || !summary || !capacity) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">Erro ao carregar</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Chief of Staff</h1>
        <p className="text-gray-400 text-sm">Plano do dia: {plan.date} | {plan.workspaceId}</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 border border-blue-800 mb-6">
        <h2 className="text-sm text-blue-400 mb-3">Resumo Executivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div><span className="text-gray-500">Prioridades:</span> <span className="text-white">{summary.topPriorities.join(', ')}</span></div>
          <div><span className="text-gray-500">Maior Risco:</span> <span className="text-red-400">{summary.biggestRisk}</span></div>
          <div><span className="text-gray-500">Maior Oportunidade:</span> <span className="text-green-400">{summary.biggestOpportunity}</span></div>
          <div><span className="text-gray-500">Missao Mais Importante:</span> <span className="text-white">{summary.mostImportantMission}</span></div>
          <div className="md:col-span-2"><span className="text-gray-500">Recomendacao:</span> <span className="text-yellow-400">{summary.operationalRecommendation}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <div className="text-xs text-gray-400 mb-1">Tempo Estimado</div>
          <div className="text-3xl font-bold text-blue-400">{plan.estimatedTime}h</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <div className="text-xs text-gray-400 mb-1">Custo Estimado</div>
          <div className="text-3xl font-bold text-yellow-400">${plan.estimatedCost}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          <div className="text-xs text-gray-400 mb-1">Utilizacao</div>
          <div className="text-3xl font-bold text-green-400">{capacity.utilization}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Tarefas Prioritarias ({plan.priorityTasks.length})</h3>
          <div className="space-y-2">
            {plan.priorityTasks.map(t => (
              <div key={t.id} className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{t.title}</div>
                  <div className="text-xs text-gray-500">{t.assignedTo} | {t.estimatedTime}h | ${t.estimatedCost}</div>
                </div>
                <PriorityBadge p={t.priority} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-3">Workflows Programados</h3>
          <div className="space-y-2 mb-4">
            {plan.scheduledWorkflows.map(w => (
              <div key={w.id} className="p-2 bg-gray-800 rounded-lg flex justify-between">
                <span className="text-sm text-white">{w.name}</span>
                <span className="text-xs text-blue-400">{w.time}</span>
              </div>
            ))}
          </div>

          <h3 className="text-sm text-gray-400 mb-2">Capacidade</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 bg-gray-800 rounded-lg text-center">
              <div className="text-xs text-gray-500">Runtime</div>
              <div className="text-sm font-bold text-white">{capacity.runtimeCapacity}%</div>
            </div>
            <div className="p-2 bg-gray-800 rounded-lg text-center">
              <div className="text-xs text-gray-500">Scheduler</div>
              <div className="text-sm font-bold text-white">{capacity.schedulerCapacity}%</div>
            </div>
            <div className="p-2 bg-gray-800 rounded-lg text-center">
              <div className="text-xs text-gray-500">Agents</div>
              <div className="text-sm font-bold text-white">{capacity.agentCapacity}%</div>
            </div>
            <div className="p-2 bg-gray-800 rounded-lg text-center">
              <div className="text-xs text-gray-500">IA Limite</div>
              <div className="text-sm font-bold text-white">{capacity.aiLimit}%</div>
            </div>
          </div>

          <h3 className="text-sm text-gray-400 mb-2">Workload por Agent</h3>
          <div className="space-y-1">
            {workload.map(w => (
              <div key={w.agent} className="flex justify-between text-xs">
                <span className="text-gray-400">{w.agent}</span>
                <span className="text-white">{w.taskCount} tasks | {w.estimatedTime}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-2">Riscos</h3>
          {plan.risks.map((r, i) => <div key={i} className="text-xs text-red-400 mb-1">⚠ {r}</div>)}
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-2">Oportunidades</h3>
          {plan.opportunities.map((o, i) => <div key={i} className="text-xs text-green-400 mb-1">💡 {o}</div>)}
        </div>
      </div>
    </div>
  );
}
