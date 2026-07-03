'use client';

import { useState, useEffect } from 'react';

interface GlobalKPIs { totalPublished: number; totalMissions: number; avgProductionTime: number; avgCostPerContent: number; totalCost: number; totalROI: number; organicGrowth: number; totalLeads: number; totalConversions: number; totalRevenue: number; avgAIVisibility: number; avgEditorialQuality: number; }
interface WorkspaceMetric { workspaceId: string; published: number; missionsCompleted: number; costPerContent: number; estimatedROI: number; organicGrowth: number; leads: number; conversions: number; revenue: number; aiVisibility: number; editorialQuality: number; }
interface Alert { id: string; title: string; message: string; severity: string; workspaceId?: string; timestamp: string; }
interface Insight { id: string; title: string; description: string; type: string; impact: string; recommendation: string; }

export default function ExecutiveDashboard() {
  const [kpis, setKpis] = useState<GlobalKPIs | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceMetric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'insights' | 'alerts'>('overview');

  useEffect(() => {
    fetch('/api/organic-os/business/kpis').then(r => r.json()).then(setKpis);
    fetch('/api/organic-os/business/workspaces').then(r => r.json()).then(setWorkspaces);
    fetch('/api/organic-os/business/alerts').then(r => r.json()).then(setAlerts);
    fetch('/api/organic-os/business/insights').then(r => r.json()).then(setInsights);
  }, []);

  const sevColor = (s: string) => ({ critical: '#ef4444', warning: '#f59e0b', success: '#22c55e', info: '#3b82f6' }[s] || '#6b7280');
  const typeColor = (t: string) => ({ positive: '#22c55e', negative: '#ef4444', opportunity: '#3b82f6', warning: '#f59e0b', recommendation: '#8b5cf6' }[t] || '#6b7280');

  const wsName: Record<string, string> = { passacumaru: 'PassaCumaru', qualoseguro: 'Qual o Seguro', utilprobrasil: 'UtilPro Brasil', tabuometro: 'Tabuometro', aiagencyos: 'AI Agency OS' };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Executive Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Business Intelligence e metricas executivas</p>
      </div>

      {kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Publicados', value: kpis.totalPublished, color: '#3b82f6' },
            { label: 'Missoes', value: kpis.totalMissions, color: '#8b5cf6' },
            { label: 'Leads', value: kpis.totalLeads, color: '#22c55e' },
            { label: 'Conversoes', value: kpis.totalConversions, color: '#06b6d4' },
            { label: 'Receita', value: `$${kpis.totalRevenue.toLocaleString()}`, color: '#f59e0b' },
            { label: 'ROI', value: `${kpis.totalROI}x`, color: '#ec4899' },
          ].map(c => (
            <div key={c.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['overview', 'workspaces', 'insights', 'alerts'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'overview' ? 'Visao Geral' : tab === 'workspaces' ? 'Workspaces' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Metricas Globais</h3>
            {[
              ['Trafego Organico', `+${kpis.organicGrowth}%`],
              ['Custo Medio/Conteudo', `$${kpis.avgCostPerContent}`],
              ['Custo Total', `$${kpis.totalCost}`],
              ['Tempo Medio', `${kpis.avgProductionTime}min`],
              ['AI Visibility', `${kpis.avgAIVisibility}%`],
              ['Qualidade Editorial', `${kpis.avgEditorialQuality}%`],
            ].map(([l, v]) => (
              <div key={String(l)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #0f172a' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{String(l)}</span>
                <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>{String(v)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Resumo Executivo</h3>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#22c55e' }}>Melhores:</strong> AI Agency OS (ROI 8.5x), UtilPro Brasil (ROI 5.1x), Qual o Seguro (ROI 4.2x)</p>
              <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#f59e0b' }}>Atencao:</strong> Tabuometro com custo baixo mas monetizacao limitada</p>
              <p><strong style={{ color: '#3b82f6' }}>Oportunidade:</strong> Qual o Seguro com potencial para 500+ leads/mes</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workspaces' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {workspaces.map(m => (
            <div key={m.workspaceId} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>{wsName[m.workspaceId] || m.workspaceId}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[['Publicados', m.published], ['Leads', m.leads], ['Receita', `$${m.revenue}`], ['ROI', `${m.estimatedROI}x`], ['Trafego', `+${m.organicGrowth}%`], ['AI Vis.', `${m.aiVisibility}%`]].map(([l, v]) => (
                  <div key={String(l)} style={{ padding: '0.3rem', background: '#0f172a', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{String(l)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 600 }}>{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {insights.map(ins => (
            <div key={ins.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{ins.title}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: typeColor(ins.type) + '22', color: typeColor(ins.type) }}>{ins.type}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{ins.description}</p>
              <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Recomendacao: {ins.recommendation}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {alerts.map(a => (
            <div key={a.id} style={{ background: '#1e293b', border: `1px solid ${sevColor(a.severity)}33`, borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{a.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{a.message}</div>
                {a.workspaceId && <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{wsName[a.workspaceId] || a.workspaceId}</span>}
              </div>
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: sevColor(a.severity) + '22', color: sevColor(a.severity) }}>{a.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
