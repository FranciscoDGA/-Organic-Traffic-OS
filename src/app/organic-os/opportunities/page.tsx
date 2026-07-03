'use client';
import { useState, useEffect } from 'react';

interface Opp { id: string; workspaceId: string; type: string; title: string; description: string; origin: string; estimatedImpact: number; estimatedEffort: number; risk: number; confidence: number; priority: number; suggestedMission: string; status: string; scores: { opportunityScore: number; impactScore: number; effortScore: number; strategicValue: number; revenuePotential: number; aiVisibilityPotential: number; organicGrowthPotential: number; finalPriorityScore: number }; createdAt: string; }
interface Proposal { id: string; opportunityId: string; workspaceId: string; name: string; objective: string; type: string; priority: string; estimatedDuration: number; estimatedCost: number; status: string; }

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selected, setSelected] = useState<Opp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/organic-os/opportunities/ranking').then(r => r.json()),
      fetch('/api/organic-os/opportunities/proposals').then(r => r.json()),
    ]).then(([r, p]) => {
      setOpps(r.ranking || []);
      setProposals(p.proposals || []);
    }).finally(() => setLoading(false));
  }, []);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch('/api/organic-os/opportunities/analyze', { method: 'POST' });
    const data = await res.json();
    setOpps(data.opportunities || []);
    setProposals(data.proposals || []);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Autonomous Opportunity Manager</h1>
          <p className="text-gray-400 text-sm">{opps.length} oportunidades | {proposals.length} propostas</p>
        </div>
        <button onClick={analyze} className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold hover:bg-blue-500">Analisar e Propor</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm text-gray-400 mb-2">Ranking de Oportunidades</h2>
          {opps.map(o => (
            <div key={o.id} onClick={() => setSelected(o)} className={`p-4 rounded-xl border cursor-pointer transition ${selected?.id === o.id ? 'bg-blue-900/20 border-blue-600' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">{o.title}</span>
                <span className="text-lg font-bold text-blue-400">{o.scores.finalPriorityScore}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{o.workspaceId} | {o.type} | {o.origin}</div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-400">Impacto: {o.estimatedImpact}</span>
                <span className="text-yellow-400">Esforco: {o.estimatedEffort}</span>
                <span className="text-red-400">Risco: {o.risk}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">{selected.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{selected.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Prioridade</div>
                  <div className="text-2xl font-bold text-blue-400">{selected.scores.finalPriorityScore}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Impacto</div>
                  <div className="text-2xl font-bold text-green-400">{selected.scores.impactScore}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Esforco</div>
                  <div className="text-2xl font-bold text-yellow-400">{selected.scores.effortScore}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-500">ROI</div>
                  <div className="text-2xl font-bold text-purple-400">{selected.scores.revenuePotential}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {[
                  ['Strategic Value', selected.scores.strategicValue],
                  ['AI Visibility', selected.scores.aiVisibilityPotential],
                  ['Organic Growth', selected.scores.organicGrowthPotential],
                ].map(([label, val]) => (
                  <div key={label as string} className="p-2 bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-500">{label as string}</div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                      <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                    <div className="text-xs text-white font-bold mt-0.5">{val}%</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800 mb-4">
                <div className="text-xs text-blue-400 font-bold mb-1">Missao Sugerida</div>
                <div className="text-sm text-white">{selected.suggestedMission}</div>
              </div>

              <div className="flex gap-2 text-xs text-gray-500">
                <span>Origem: {selected.origin}</span>
                <span>Confianca: {(selected.confidence * 100).toFixed(0)}%</span>
                <span>Status: {selected.status}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center text-gray-500">Selecione uma oportunidade para ver detalhes</div>
          )}

          {proposals.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mt-4">
              <h3 className="text-sm text-gray-400 mb-3">Propostas de Missao ({proposals.length})</h3>
              <div className="space-y-2">
                {proposals.map(p => (
                  <div key={p.id} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-white">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.workspaceId} | {p.estimatedDuration}d | ${p.estimatedCost}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === 'approved' ? 'bg-green-500/20 text-green-400' : p.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
