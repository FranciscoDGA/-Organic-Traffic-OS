'use client';
import { useState, useEffect } from 'react';

interface MissionTask { id: string; type: string; priority: string; status: string; assignee: string; progress: number; result?: string; }
interface Mission { id: string; workspaceId: string; name: string; description: string; objective: string; type: string; priority: string; status: string; owner: string; strategy: string; expectedResult: string; deadline: string; progress: number; tasks: MissionTask[]; estimatedDuration: number; estimatedCost: number; history: { action: string; timestamp: string; details: string }[]; createdAt: string; }

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { draft: 'bg-gray-500/20 text-gray-400', planned: 'bg-blue-500/20 text-blue-400', active: 'bg-green-500/20 text-green-400', paused: 'bg-yellow-500/20 text-yellow-400', completed: 'bg-green-500/20 text-green-400', failed: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-gray-400' };
  return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = { critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400' };
  return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[priority] || 'bg-gray-500/20 text-gray-400'}`}>{priority}</span>;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selected, setSelected] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organic-os/missions')
      .then(r => r.json())
      .then(d => { setMissions(d.missions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const refresh = () => {
    fetch('/api/organic-os/missions').then(r => r.json()).then(d => {
      setMissions(d.missions || []);
      if (selected) { const updated = d.missions?.find((m: Mission) => m.id === selected.id); if (updated) setSelected(updated); }
    });
  };

  const action = async (id: string, act: string) => {
    await fetch(`/api/organic-os/missions/${id}/${act}`, { method: 'POST' });
    refresh();
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;

  const active = missions.filter(m => m.status === 'active');
  const planned = missions.filter(m => m.status === 'planned' || m.status === 'draft');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mission Control</h1>
        <p className="text-gray-400 text-sm">{missions.length} missoes | {active.length} ativas | {planned.length} planejadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm text-gray-400 mb-2">Missoes</h2>
          {missions.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} className={`p-4 rounded-xl border cursor-pointer transition ${selected?.id === m.id ? 'bg-blue-900/20 border-blue-600' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">{m.name}</span>
                <StatusBadge status={m.status} />
              </div>
              <div className="text-xs text-gray-500 mb-2">{m.workspaceId} | {m.type}</div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full">
                <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${m.progress}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{m.progress}% | {m.tasks.length} tasks | Deadline: {m.deadline || 'N/A'}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{selected.description}</p>
                </div>
                <div className="flex gap-2">
                  {selected.status === 'draft' && <button onClick={() => action(selected.id, 'start')} className="px-3 py-1 bg-green-600 rounded text-xs font-bold">Iniciar</button>}
                  {selected.status === 'active' && <button onClick={() => action(selected.id, 'pause')} className="px-3 py-1 bg-yellow-600 rounded text-xs font-bold">Pausar</button>}
                  {selected.status === 'paused' && <button onClick={() => action(selected.id, 'resume')} className="px-3 py-1 bg-blue-600 rounded text-xs font-bold">Retomar</button>}
                  {selected.status !== 'completed' && selected.status !== 'cancelled' && <button onClick={() => action(selected.id, 'cancel')} className="px-3 py-1 bg-red-600 rounded text-xs font-bold">Cancelar</button>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-gray-800 rounded-lg"><div className="text-xs text-gray-500">Objetivo</div><div className="text-sm text-white font-bold">{selected.objective}</div></div>
                <div className="p-3 bg-gray-800 rounded-lg"><div className="text-xs text-gray-500">Estrategia</div><div className="text-sm text-white font-bold">{selected.strategy}</div></div>
                <div className="p-3 bg-gray-800 rounded-lg"><div className="text-xs text-gray-500">Resultado Esperado</div><div className="text-sm text-white font-bold">{selected.expectedResult}</div></div>
                <div className="p-3 bg-gray-800 rounded-lg"><div className="text-xs text-gray-500">Custo Estimado</div><div className="text-sm text-yellow-400 font-bold">${selected.estimatedCost}</div></div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progresso</span>
                  <span className="text-white font-bold">{selected.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${selected.progress}%` }} />
                </div>
              </div>

              <h3 className="text-sm text-gray-400 mb-2">Tasks ({selected.tasks.length})</h3>
              <div className="space-y-2 mb-4">
                {selected.tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <span className="text-sm text-white">{t.type}</span>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{t.assignee}</span>
                      <span className="text-xs text-white font-bold">{t.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm text-gray-400 mb-2">Historico</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {selected.history.map((h, i) => (
                  <div key={i} className="text-xs text-gray-500">
                    <span className="text-gray-400">{new Date(h.timestamp).toLocaleDateString()}</span> — {h.details}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center text-gray-500">
              Selecione uma missao para ver detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
