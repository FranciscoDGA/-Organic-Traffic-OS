"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: '1px solid ' + color + '30',
});
const TABS = ['Status', 'Queues', 'Workers', 'Workflows', 'History'];

export default function RuntimeOREPanel() {
  const [status, setStatus] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Status');
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [s, j, w, h] = await Promise.all([
        fetch('/api/organic-os/runtime/status').then(r => r.json()),
        fetch('/api/organic-os/runtime/jobs').then(r => r.json()),
        fetch('/api/organic-os/runtime/workflows').then(r => r.json()),
        fetch('/api/organic-os/runtime/history').then(r => r.json()),
      ]);
      if (s.success) setStatus(s.data);
      if (j.success) setJobs(j.data || []);
      if (w.success) setWorkflows(w.data || []);
      if (h.success) setHistory(h.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function startRuntime() {
    setLoading(true);
    try { await fetch('/api/organic-os/runtime/start', { method: 'POST' }); await fetchAll(); } finally { setLoading(false); }
  }
  async function stopRuntime() {
    setLoading(true);
    try { await fetch('/api/organic-os/runtime/stop', { method: 'POST' }); await fetchAll(); } finally { setLoading(false); }
  }

  const statusColor = (s: string) => s === 'completed' ? '#10b981' : s === 'failed' || s === 'dead_letter' ? '#ef4444' : s === 'running' ? '#f59e0b' : s === 'paused' ? '#64748b' : s === 'retry' ? '#f59e0b' : s === 'queued' ? '#3b82f6' : '#94a3b8';
  const workerColor = (s: string) => s === 'idle' ? '#10b981' : s === 'busy' ? '#f59e0b' : s === 'offline' ? '#ef4444' : '#64748b';
  const queueColor = (n: string) => n === 'missions' ? '#f59e0b' : n === 'content' ? '#3b82f6' : n === 'publishing' ? '#ec4899' : n === 'system' ? '#ef4444' : '#64748b';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>Organic Runtime Engine</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>Nucleo operacional - filas, workers, jobs e workflows.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {status?.running ? (
            <button onClick={stopRuntime} disabled={loading} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#ef4444' }}>Parar</button>
          ) : (
            <button onClick={startRuntime} disabled={loading} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#10b981' }}>Iniciar</button>
          )}
          <button onClick={fetchAll} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#3b82f6' }}>Atualizar</button>
        </div>
      </div>

      {status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: status.running ? '#10b981' : '#64748b' }}>{status.running ? 'RUNNING' : 'STOPPED'}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>STATE</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>{status.metrics?.jobsPerMinute || 0}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>JOBS/MIN</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#3b82f6' }}>{status.queues?.reduce((s: number, q: any) => s + q.pending, 0) || 0}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>QUEUED</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#8b5cf6' }}>{status.workers?.filter((w: any) => w.status !== 'offline').length || 0}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>WORKERS</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ef4444' }}>{status.metrics?.deadLetters || 0}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>DEAD LETTER</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            backgroundColor: activeTab === tab ? '#6366f1' : 'transparent',
            color: activeTab === tab ? '#fff' : '#64748b',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Status' && status && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={card()}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' }}>Metrics</div>
            {Object.entries(status.metrics || {}).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', backgroundColor: '#080b10', borderRadius: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{key}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>{String(val)}</span>
              </div>
            ))}
          </div>
          <div style={card()}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' }}>Workers</div>
            {status.workers?.map((w: any) => (
              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px', marginBottom: '4px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{w.id}</span>
                  <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '8px' }}>{w.type}</span>
                </div>
                <span style={badge(workerColor(w.status))}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Queues' && status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {status.queues?.map((q: any) => (
            <div key={q.name} style={{ ...card(), borderTop: '3px solid ' + queueColor(q.name) }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '10px' }}>{q.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#3b82f6' }}>{q.pending}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>PENDENTE</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b' }}>{q.processing}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>RODANDO</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>{q.completed}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>OK</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Workers' && status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {status.workers?.map((w: any) => (
            <div key={w.id} style={{ ...card(), borderLeft: '3px solid ' + workerColor(w.status) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{w.id}</span>
                <span style={badge(workerColor(w.status))}>{w.status}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Type: {w.type}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <div style={{ textAlign: 'center' as const, padding: '4px', backgroundColor: '#080b10', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#e2e8f0' }}>{w.totalJobs}</div>
                  <div style={{ fontSize: '8px', color: '#64748b' }}>TOTAL</div>
                </div>
                <div style={{ textAlign: 'center' as const, padding: '4px', backgroundColor: '#080b10', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>{w.successJobs}</div>
                  <div style={{ fontSize: '8px', color: '#64748b' }}>OK</div>
                </div>
                <div style={{ textAlign: 'center' as const, padding: '4px', backgroundColor: '#080b10', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#ef4444' }}>{w.failedJobs}</div>
                  <div style={{ fontSize: '8px', color: '#64748b' }}>FAIL</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Workflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {workflows.map((wf: any) => (
            <div key={wf.id} style={card()}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '10px' }}>{wf.name}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {wf.steps?.map((s: any, i: number) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#6366f120', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{i + 1}</span>
                    <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{s.name}</span>
                    {i < wf.steps.length - 1 && <span style={{ color: '#64748b' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'History' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '16px' }}>Job History ({history.length})</div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}><div style={{ fontSize: '14px' }}>Nenhum job executado</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {history.slice(0, 20).map((j: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '8px 1fr 80px 60px 80px', gap: '10px', alignItems: 'center', padding: '8px 12px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor(j.status) }} />
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{j.queue} | {j.priority}</span>
                  <span style={badge(statusColor(j.status))}>{j.status}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>#{j.attempt}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{j.executionTimeMs || '-'}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
