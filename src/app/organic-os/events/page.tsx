'use client';

import { useState, useEffect } from 'react';

interface OrganicEvent {
  event_id: string;
  event_name: string;
  event_type: string;
  workspace_id?: string;
  mission_id?: string;
  workflow_id?: string;
  timestamp: string;
  status: string;
  retry_count: number;
  payload: Record<string, unknown>;
}

interface EventStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
}

export default function EventsDashboard() {
  const [events, setEvents] = useState<OrganicEvent[]>([]);
  const [stats, setStats] = useState<EventStats>({ total: 0, byStatus: {}, byType: {} });
  const [subscriptions, setSubscriptions] = useState<{ id: string; subscriberId: string; eventTypes: string[]; active: boolean }[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'stats' | 'subscriptions' | 'failed'>('live');
  const [selectedEvent, setSelectedEvent] = useState<OrganicEvent | null>(null);

  const fetchData = () => {
    fetch('/api/organic-os/events/live').then(r => r.json()).then(d => { setEvents(d.events || []); setStats(d.stats || { total: 0, byStatus: {}, byType: {} }); });
    fetch('/api/organic-os/events/subscriptions').then(r => r.json()).then(setSubscriptions);
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 5000); return () => clearInterval(interval); }, []);

  const statusColor = (s: string) => {
    const m: Record<string, string> = { pending: '#f59e0b', processing: '#3b82f6', completed: '#22c55e', failed: '#ef4444', dead_letter: '#dc2626' };
    return m[s] || '#6b7280';
  };

  const typeIcon = (t: string) => {
    if (t.startsWith('Mission')) return '📋';
    if (t.startsWith('Workflow')) return '🔄';
    if (t.startsWith('Job')) return '📦';
    if (t.startsWith('Agent')) return '🤖';
    if (t.startsWith('Content')) return '📝';
    if (t.startsWith('Campaign')) return '📢';
    if (t.startsWith('Connector')) return '🔌';
    if (t.startsWith('System')) return '⚠️';
    return '📡';
  };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Event Bus (OEB)</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Comunicacao assincrona centralizada entre modulos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Eventos', value: stats.total, color: '#3b82f6' },
          { label: 'Processados', value: stats.byStatus['completed'] || 0, color: '#22c55e' },
          { label: 'Falhas', value: (stats.byStatus['failed'] || 0) + (stats.byStatus['dead_letter'] || 0), color: '#ef4444' },
          { label: 'Subscribers', value: subscriptions.filter(s => s.active).length, color: '#8b5cf6' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['live', 'stats', 'subscriptions', 'failed'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'live' ? 'Ao Vivo' : tab === 'stats' ? 'Estatisticas' : tab === 'subscriptions' ? 'Subscriptions' : 'Falhas'}
          </button>
        ))}
      </div>

      {activeTab === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {events.slice(-30).reverse().map(e => (
            <div key={e.event_id} onClick={() => setSelectedEvent(e)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{typeIcon(e.event_type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{e.event_name}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{e.event_type} | {e.event_id}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(e.timestamp).toLocaleTimeString()}</div>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: statusColor(e.status) + '22', color: statusColor(e.status) }}>{e.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Por Status</h3>
            {Object.entries(stats.byStatus).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'capitalize' }}>{k}</span>
                <span style={{ fontSize: '0.8rem', color: statusColor(k), fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Por Tipo</h3>
            {Object.entries(stats.byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{typeIcon(k)} {k}</span>
                <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem' }}>Subscriptions Ativas</h3>
          {subscriptions.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Nenhuma subscription registrada</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subscriptions.map(s => (
                <div key={s.id} style={{ padding: '0.5rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{s.subscriberId}</span>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>{s.eventTypes.join(', ')}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: s.active ? '#22c55e22' : '#6b728022', color: s.active ? '#22c55e' : '#6b7280' }}>{s.active ? 'active' : 'inactive'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'failed' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem' }}>Eventos com Falha</h3>
          {events.filter(e => e.status === 'failed' || e.status === 'dead_letter').length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Nenhum evento com falha</p>
          ) : (
            events.filter(e => e.status === 'failed' || e.status === 'dead_letter').map(e => (
              <div key={e.event_id} style={{ padding: '0.5rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{e.event_name}</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>{e.event_type}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>retries: {e.retry_count}/{3}</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: statusColor(e.status) + '22', color: statusColor(e.status) }}>{e.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedEvent(null)}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', maxWidth: '500px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ color: '#f8fafc' }}>{selectedEvent.event_name}</h3>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}>X</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div><span style={{ color: '#94a3b8' }}>ID:</span> <span style={{ color: '#f8fafc' }}>{selectedEvent.event_id}</span></div>
              <div><span style={{ color: '#94a3b8' }}>Tipo:</span> <span style={{ color: '#f8fafc' }}>{selectedEvent.event_type}</span></div>
              <div><span style={{ color: '#94a3b8' }}>Status:</span> <span style={{ color: statusColor(selectedEvent.status) }}>{selectedEvent.status}</span></div>
              <div><span style={{ color: '#94a3b8' }}>Timestamp:</span> <span style={{ color: '#f8fafc' }}>{selectedEvent.timestamp}</span></div>
              {selectedEvent.workspace_id && <div><span style={{ color: '#94a3b8' }}>Workspace:</span> <span style={{ color: '#f8fafc' }}>{selectedEvent.workspace_id}</span></div>}
              {selectedEvent.mission_id && <div><span style={{ color: '#94a3b8' }}>Mission:</span> <span style={{ color: '#f8fafc' }}>{selectedEvent.mission_id}</span></div>}
              <div><span style={{ color: '#94a3b8' }}>Payload:</span></div>
              <pre style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#cbd5e1', overflow: 'auto', maxHeight: '200px' }}>{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
