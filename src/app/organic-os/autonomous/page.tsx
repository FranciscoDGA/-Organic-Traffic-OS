'use client';

import { useState, useEffect } from 'react';

interface SimulationResult {
  id: string;
  config: { totalDays: number; workspaces: string[]; mode: string };
  status: string;
  totalDaysCompleted: number;
  totalMissions: number;
  totalCompleted: number;
  totalFailed: number;
  totalPublications: number;
  totalTokens: number;
  totalCost: number;
  totalErrors: number;
  totalRetries: number;
  avgDayDurationMs: number;
  availability: number;
  reliability: number;
  days: { day: number; status: string; missionsGenerated: number; missionsCompleted: number; tokensUsed: number; alerts: string[] }[];
  startedAt?: string;
}

interface Health { status: string; availability: number; reliability: number; totalSimulations: number }

export default function AutonomousPage() {
  const [tab, setTab] = useState<'simulacao' | 'workspaces' | 'relatorio'>('simulacao');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [running, setRunning] = useState(false);
  const [days, setDays] = useState(30);

  const startSimulation = async () => {
    setRunning(true);
    const res = await fetch('/api/organic-os/autonomous/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ totalDays: days, mode: 'sandbox', workspaces: ['passacumaru','qualoseguro','utilprobrasil','tabuometro','aiagencyos'] }) });
    const data = await res.json();
    setResult(data);
    setRunning(false);
    loadHealth();
  };

  const loadHealth = async () => {
    const res = await fetch('/api/organic-os/autonomous/health');
    setHealth(await res.json());
  };

  useEffect(() => { loadHealth(); }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Autonomous Operations</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Simulacao de 30 dias em Sandbox</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={days} onChange={e => setDays(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: '6px', background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }}>
            {[15,30,60].map(d => <option key={d} value={d}>{d} dias</option>)}
          </select>
          <button onClick={startSimulation} disabled={running} style={{ padding: '6px 16px', borderRadius: '6px', background: running ? '#4b5563' : '#059669', color: '#fff', border: 'none', cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? 'Rodando...' : 'Iniciar Simulacao'}
          </button>
        </div>
      </div>

      {health && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Status', value: health.status, color: health.status === 'idle' ? '#6b7280' : '#059669' },
            { label: 'Disponibilidade', value: `${health.availability}%`, color: health.availability > 90 ? '#059669' : '#dc2626' },
            { label: 'Confiabilidade', value: `${health.reliability}%`, color: health.reliability > 80 ? '#059669' : '#dc2626' },
            { label: 'Total Simulacoes', value: String(health.totalSimulations), color: '#3b82f6' },
          ].map(k => (
            <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: k.color, marginTop: '4px' }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['simulacao','workspaces','relatorio'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: '6px', background: tab === t ? '#2563eb' : '#374151', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
            {t === 'simulacao' ? 'Simulacao' : t === 'workspaces' ? 'Workspaces' : 'Relatorio'}
          </button>
        ))}
      </div>

      {tab === 'simulacao' && result && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Dias Concluidos', value: `${result.totalDaysCompleted}/${result.config.totalDays}` },
              { label: 'Missoes', value: String(result.totalMissions) },
              { label: 'Concluidas', value: String(result.totalCompleted) },
              { label: 'Falhas', value: String(result.totalFailed), color: '#dc2626' },
              { label: 'Publicacoes', value: String(result.totalPublications) },
              { label: 'Tokens', value: result.totalTokens.toLocaleString() },
              { label: 'Custo', value: `$${result.totalCost}` },
              { label: 'Retries', value: String(result.totalRetries) },
            ].map(k => (
              <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: k.color || '#f9fafb', marginTop: '4px' }}>{k.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Timeline (Ultimos 10 dias)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
              {result.days.slice(-10).map(d => (
                <div key={d.day} style={{ background: d.status === 'completed' ? '#059669' : '#dc2626', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#fff' }}>D{d.day}</div>
                  <div style={{ fontSize: '10px', color: '#fff' }}>{d.missionsCompleted}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'workspaces' && result && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Workspaces</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {result.config.workspaces.map(ws => (
              <div key={ws} style={{ background: '#111827', borderRadius: '6px', padding: '12px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize' }}>{ws}</div>
                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Ativo em Sandbox</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'relatorio' && result && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Relatorio</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ background: '#111827', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: '#059669' }}>Disponibilidade: {result.availability}%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Confiabilidade: {result.reliability}%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Custo total: ${result.totalCost}</div>
            </div>
            <div style={{ background: '#111827', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Sistema pronto para Producao</div>
            </div>
          </div>
        </div>
      )}

      {!result && !running && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>Configure e inicie uma simulacao</div>
        </div>
      )}
    </div>
  );
}
