'use client';

import { useState, useEffect } from 'react';

interface ReliabilityScore { overall: number; availability: number; performance: number; resilience: number; efficiency: number; level: string }
interface TrendData { metric: string; current: number; previous: number; change: number; direction: string; period: string }
interface Recommendation { id: string; category: string; title: string; description: string; impact: string; effort: string; priority: number }
interface ReliabilityReport { id: string; period: string; indicators: { uptime: number; availability: number; mtbf: number; mttr: number; errorRate: number; avgLatencyMs: number; throughput: number; resourceUtilization: number; costGrowth: number }; capacity: { cpuUsage: number; memoryUsage: number; storageUsage: number; queueDepth: number; aiConsumption: number }; trends: TrendData[]; recommendations: Recommendation[]; bottleneckAlerts: string[]; generatedAt: string }

export default function ReliabilityPage() {
  const [tab, setTab] = useState<'score' | 'trends' | 'capacity' | 'recommendations'>('score');
  const [score, setScore] = useState<ReliabilityScore | null>(null);
  const [report, setReport] = useState<ReliabilityReport | null>(null);
  const [calculating, setCalculating] = useState(false);

  const loadAndCalculate = async () => {
    setCalculating(true);
    const [s, r] = await Promise.all([
      fetch('/api/organic-os/reliability/score').then(r => r.json()),
      fetch('/api/organic-os/reliability/recalculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ period: 'daily' }) }).then(r => r.json()),
    ]);
    setScore(s); setReport(r);
    setCalculating(false);
  };

  useEffect(() => { loadAndCalculate(); }, []);

  const levelColor = (l: string) => l === 'excellent' ? '#059669' : l === 'good' ? '#3b82f6' : l === 'fair' ? '#f59e0b' : '#dc2626';
  const trendIcon = (d: string) => d === 'improving' ? '↑' : d === 'degrading' ? '↓' : '→';
  const trendColor = (d: string) => d === 'improving' ? '#059669' : d === 'degrading' ? '#dc2626' : '#6b7280';

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Reliability Engineering</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Confiabilidade e evolucao continua</p>
        </div>
        <button onClick={loadAndCalculate} disabled={calculating} style={{ padding: '6px 16px', borderRadius: '6px', background: calculating ? '#4b5563' : '#059669', color: '#fff', border: 'none', cursor: calculating ? 'not-allowed' : 'pointer' }}>
          {calculating ? 'Calculando...' : 'Recalcular'}
        </button>
      </div>

      {score && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Reliability Score', value: `${score.overall}/100`, color: levelColor(score.level) },
            { label: 'Disponibilidade', value: `${score.availability}%`, color: '#3b82f6' },
            { label: 'Performance', value: `${score.performance}%`, color: '#059669' },
            { label: 'Resiliencia', value: `${score.resilience}%`, color: '#f59e0b' },
            { label: 'Eficiencia', value: `${score.efficiency}%`, color: '#8b5cf6' },
          ].map(k => (
            <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: k.color, marginTop: '4px' }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['score', 'trends', 'capacity', 'recommendations'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: '6px', background: tab === t ? '#2563eb' : '#374151', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
            {t === 'score' ? 'Score' : t === 'trends' ? 'Tendencias' : t === 'capacity' ? 'Capacidade' : 'Recomendacoes'}
          </button>
        ))}
      </div>

      {tab === 'score' && report && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Indicadores</h3>
            {Object.entries(report.indicators).filter(([k]) => k !== 'overallReliability').map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #374151' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                <span style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold' }}>{String(v)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Gargalos ({report.bottleneckAlerts.length})</h3>
            {report.bottleneckAlerts.map((alert, i) => (
              <div key={i} style={{ fontSize: '12px', color: '#f59e0b', padding: '6px 0', borderBottom: '1px solid #374151' }}>⚠ {alert}</div>
            ))}
            {report.bottleneckAlerts.length === 0 && <div style={{ fontSize: '12px', color: '#059669' }}>Nenhum gargalo detectado</div>}
          </div>
        </div>
      )}

      {tab === 'trends' && report && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Tendencias</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {report.trends.map(t => (
              <div key={t.metric} style={{ background: '#111827', borderRadius: '6px', padding: '10px', display: 'grid', gridTemplateColumns: '150px 1fr 1fr 80px', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold', textTransform: 'capitalize' }}>{t.metric.replace(/([A-Z])/g, ' $1')}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Atual: {t.current}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Anterior: {t.previous}</div>
                <div style={{ fontSize: '14px', color: trendColor(t.direction), fontWeight: 'bold' }}>{trendIcon(t.direction)} {t.change > 0 ? '+' : ''}{t.change}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'capacity' && report && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {Object.entries(report.capacity).map(([k, v]) => (
            <div key={k} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb', marginTop: '4px' }}>{String(v)}{typeof v === 'number' && v < 100 ? '%' : ''}</div>
              <div style={{ marginTop: '8px', background: '#374151', borderRadius: '4px', height: '6px' }}>
                <div style={{ background: Number(v) > 70 ? '#dc2626' : Number(v) > 50 ? '#f59e0b' : '#059669', borderRadius: '4px', height: '6px', width: `${Math.min(100, Number(v))}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'recommendations' && report && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Recomendacoes ({report.recommendations.length})</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {report.recommendations.sort((a, b) => a.priority - b.priority).map(r => (
              <div key={r.id} style={{ background: '#111827', borderRadius: '6px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', color: '#f9fafb', fontWeight: 'bold' }}>{r.title}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: r.impact === 'high' ? '#dc2626' : r.impact === 'medium' ? '#f59e0b' : '#374151', color: '#fff' }}>{r.impact}</span>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#374151', color: '#9ca3af' }}>{r.effort}</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{r.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
