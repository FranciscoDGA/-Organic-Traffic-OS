'use client';

import { useState, useEffect } from 'react';

interface ComponentHealth { id: string; name: string; category: string; status: string; availability: number; latencyMs: number; utilization: number; version: string }
interface Alert { id: string; source: string; category: string; severity: string; message: string; acknowledged: boolean; createdAt: string }
interface Incident { id: string; source: string; impact: string; priority: string; status: string; createdAt: string }
interface OperationsStatus { overallStatus: string; totalComponents: number; healthy: number; degraded: number; unhealthy: number; offline: number; activeAlerts: number; openIncidents: number; uptime: number }

export default function OperationsPage() {
  const [tab, setTab] = useState<'overview' | 'components' | 'alerts' | 'incidents'>('overview');
  const [status, setStatus] = useState<OperationsStatus | null>(null);
  const [components, setComponents] = useState<ComponentHealth[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const loadData = async () => {
    const [s, c, a, i] = await Promise.all([
      fetch('/api/organic-os/operations/status').then(r => r.json()),
      fetch('/api/organic-os/operations/health').then(r => r.json()),
      fetch('/api/organic-os/operations/alerts').then(r => r.json()),
      fetch('/api/organic-os/operations/incidents').then(r => r.json()),
    ]);
    setStatus(s); setComponents(c.components || []); setAlerts(a); setIncidents(i);
  };

  const recheck = async () => { await fetch('/api/organic-os/operations/recheck', { method: 'POST' }); loadData(); };

  useEffect(() => { loadData(); }, []);

  const statusColor = (s: string) => s === 'healthy' ? '#059669' : s === 'degraded' ? '#f59e0b' : s === 'unhealthy' ? '#dc2626' : '#6b7280';
  const severityColor = (s: string) => s === 'info' ? '#3b82f6' : s === 'warning' ? '#f59e0b' : s === 'high' ? '#f97316' : s === 'critical' ? '#dc2626' : '#7c3aed';

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Operations Center</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Monitoramento em tempo real</p>
        </div>
        <button onClick={recheck} style={{ padding: '6px 16px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Recheck</button>
      </div>

      {status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Status', value: status.overallStatus, color: statusColor(status.overallStatus) },
            { label: 'Componentes', value: `${status.healthy}/${status.totalComponents}`, color: '#3b82f6' },
            { label: 'Alertas Ativos', value: String(status.activeAlerts), color: status.activeAlerts > 0 ? '#f59e0b' : '#059669' },
            { label: 'Incidentes', value: String(status.openIncidents), color: status.openIncidents > 0 ? '#dc2626' : '#059669' },
            { label: 'Uptime', value: `${status.uptime}%`, color: '#059669' },
          ].map(k => (
            <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: k.color, marginTop: '4px', textTransform: 'capitalize' }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['overview', 'components', 'alerts', 'incidents'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: '6px', background: tab === t ? '#2563eb' : '#374151', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
            {t === 'overview' ? 'Visao Geral' : t === 'components' ? 'Componentes' : t === 'alerts' ? 'Alertas' : 'Incidentes'}
          </button>
        ))}
      </div>

      {tab === 'overview' && status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Saudaveis', value: status.healthy, color: '#059669' },
            { label: 'Degradados', value: status.degraded, color: '#f59e0b' },
            { label: 'Instaveis', value: status.unhealthy, color: '#dc2626' },
          ].map(k => (
            <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: k.color, marginTop: '8px' }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'components' && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          {['infrastructure', 'runtime', 'connectors', 'ai'].map(cat => (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '8px', textTransform: 'capitalize' }}>{cat}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                {components.filter(c => c.category === cat).map(c => (
                  <div key={c.id} style={{ background: '#111827', borderRadius: '6px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold' }}>{c.name}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>{c.latencyMs}ms | {c.utilization}%</div>
                    </div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColor(c.status) }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'alerts' && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          {alerts.map(a => (
            <div key={a.id} style={{ background: '#111827', borderRadius: '6px', padding: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: a.acknowledged ? 0.6 : 1 }}>
              <div>
                <div style={{ fontSize: '12px', color: '#f9fafb' }}>{a.message}</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{a.source} | {new Date(a.createdAt).toLocaleDateString('pt-BR')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: severityColor(a.severity), textTransform: 'uppercase', fontWeight: 'bold' }}>{a.severity}</span>
                {a.acknowledged && <span style={{ fontSize: '10px', color: '#059669' }}>ACK</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'incidents' && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
          {incidents.map(inc => (
            <div key={inc.id} style={{ background: '#111827', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold' }}>{inc.source}</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>{inc.impact}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: severityColor(inc.priority), textTransform: 'uppercase', fontWeight: 'bold' }}>{inc.priority}</span>
                  <span style={{ fontSize: '10px', color: inc.status === 'open' ? '#dc2626' : '#059669', textTransform: 'uppercase' }}>{inc.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
