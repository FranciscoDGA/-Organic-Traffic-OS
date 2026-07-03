"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: '1px solid ' + color + '30',
});
const btnSmall = (bg: string): React.CSSProperties => ({
  padding: '5px 10px', border: 'none', borderRadius: '6px', color: '#fff',
  fontSize: '11px', fontWeight: '700', cursor: 'pointer', background: bg,
});
const TABS = ['Jobs', 'Criar', 'Historico'];

const JOB_TYPES = ['connector_sync', 'workflow_run', 'agent_run', 'monitoring_run', 'report_generation', 'content_refresh', 'publishing_prepare'];
const SCHEDULE_TYPES = ['cron', 'interval', 'once', 'manual'];

export default function SchedulerPanel() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Jobs');
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '', type: 'connector_sync', scheduleType: 'interval', expression: '', intervalMs: 60000,
    timezone: 'America/Sao_Paulo', targetId: '', targetField: 'connectorId', timeoutMs: 30000, maxRetries: 3,
  });

  const fetchAll = useCallback(async () => {
    try {
      const [j, h, s] = await Promise.all([
        fetch('/api/organic-os/scheduler/jobs').then(r => r.json()),
        fetch('/api/organic-os/scheduler/history').then(r => r.json()),
        fetch('/api/organic-os/scheduler/status').then(r => r.json()),
      ]);
      if (j.success) setJobs(j.data || []);
      if (h.success) setHistory(h.data || []);
      if (s.success) setStatus(s.data);
    } catch {}
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function createJob() {
    setLoading(true);
    try {
      const body: any = {
        name: createForm.name,
        type: createForm.type,
        status: 'scheduled',
        schedule: {
          type: createForm.scheduleType,
          expression: createForm.scheduleType === 'cron' ? createForm.expression : undefined,
          intervalMs: createForm.scheduleType === 'interval' ? createForm.intervalMs : undefined,
          timezone: createForm.timezone,
        },
        target: { [createForm.targetField]: createForm.targetId },
        payload: {},
        retries: 0,
        maxRetries: createForm.maxRetries,
        timeoutMs: createForm.timeoutMs,
      };
      await fetch('/api/organic-os/scheduler/jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      setCreateForm({ ...createForm, name: '', targetId: '' });
      await fetchAll();
    } finally { setLoading(false); }
  }

  async function runJob(id: string) {
    setLoading(true);
    try { await fetch('/api/organic-os/scheduler/jobs/' + id + '/action?action=run-now', { method: 'POST' }); await fetchAll(); } finally { setLoading(false); }
  }
  async function pauseJob(id: string) {
    setLoading(true);
    try { await fetch('/api/organic-os/scheduler/jobs/' + id + '/action?action=pause', { method: 'POST' }); await fetchAll(); } finally { setLoading(false); }
  }
  async function resumeJob(id: string) {
    setLoading(true);
    try { await fetch('/api/organic-os/scheduler/jobs/' + id + '/action?action=resume', { method: 'POST' }); await fetchAll(); } finally { setLoading(false); }
  }
  async function cancelJob(id: string) {
    setLoading(true);
    try { await fetch('/api/organic-os/scheduler/jobs/' + id + '/action?action=cancel', { method: 'POST' }); await fetchAll(); } finally { setLoading(false); }
  }

  const statusColor = (s: string) => s === 'completed' ? '#10b981' : s === 'failed' ? '#ef4444' : s === 'running' ? '#f59e0b' : s === 'paused' ? '#64748b' : s === 'cancelled' ? '#ef4444' : s === 'scheduled' ? '#3b82f6' : '#94a3b8';
  const typeColor = (t: string) => t === 'connector_sync' ? '#3b82f6' : t === 'workflow_run' ? '#8b5cf6' : t === 'agent_run' ? '#f59e0b' : t === 'monitoring_run' ? '#10b981' : t === 'report_generation' ? '#ec4899' : t === 'content_refresh' ? '#06b6d4' : '#f97316';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>Scheduler & Jobs</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>Agendamento seguro de tarefas recorrentes.</p>
        </div>
        <button onClick={fetchAll} style={btnSmall('#3b82f6')}>Atualizar</button>
      </div>

      {status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#6366f1' }}>{status.totalJobs}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Total</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{status.activeJobs}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Ativos</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#64748b' }}>{status.pausedJobs}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Pausados</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ef4444' }}>{status.failedJobs}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Falhas</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>{status.runningJobs}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Rodando</div>
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

      {activeTab === 'Jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {jobs.length === 0 ? (
            <div style={{ ...card({ textAlign: 'center' as const, padding: '40px' }) }}>
              <div style={{ fontSize: '14px', color: '#3d4461' }}>Nenhum job configurado</div>
            </div>
          ) : jobs.map((j: any) => (
            <div key={j.id} style={{ ...card({ padding: '16px' }) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#e2e8f0' }}>{j.name}</span>
                  <span style={{ marginLeft: '8px', ...badge(typeColor(j.type)) }}>{j.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={badge(statusColor(j.status))}>{j.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                <span>Schedule: {j.schedule.type} {j.schedule.expression || (j.schedule.intervalMs ? j.schedule.intervalMs + 'ms' : '')}</span>
                <span>Timeout: {j.timeoutMs}ms</span>
                <span>Retries: {j.retries}/{j.maxRetries}</span>
                {j.lastRun && <span>Ultima: {new Date(j.lastRun).toLocaleString('pt-BR')}</span>}
                {j.nextRun && <span>Proxima: {new Date(j.nextRun).toLocaleString('pt-BR')}</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {j.status !== 'running' && j.status !== 'cancelled' && <button onClick={() => runJob(j.id)} style={btnSmall('#10b981')}>Executar</button>}
                {(j.status === 'scheduled' || j.status === 'pending') && <button onClick={() => pauseJob(j.id)} style={btnSmall('#f59e0b')}>Pausar</button>}
                {j.status === 'paused' && <button onClick={() => resumeJob(j.id)} style={btnSmall('#3b82f6')}>Retomar</button>}
                {j.status !== 'completed' && j.status !== 'cancelled' && <button onClick={() => cancelJob(j.id)} style={btnSmall('#ef4444')}>Cancelar</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Criar' && (
        <div style={card()}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '16px' }}>Novo Job</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Nome</label>
              <input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}
                placeholder="Ex: Sync GSC diario" />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Tipo</label>
              <select value={createForm.type} onChange={e => setCreateForm({ ...createForm, type: e.target.value })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Schedule Type</label>
              <select value={createForm.scheduleType} onChange={e => setCreateForm({ ...createForm, scheduleType: e.target.value })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}>
                {SCHEDULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {createForm.scheduleType === 'cron' && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Cron Expression</label>
                <input value={createForm.expression} onChange={e => setCreateForm({ ...createForm, expression: e.target.value })}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}
                  placeholder="0 8 * * *" />
              </div>
            )}
            {createForm.scheduleType === 'interval' && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Intervalo (ms)</label>
                <input type="number" value={createForm.intervalMs} onChange={e => setCreateForm({ ...createForm, intervalMs: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Target ID</label>
              <input value={createForm.targetId} onChange={e => setCreateForm({ ...createForm, targetId: e.target.value })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}
                placeholder="connector-gsc" />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Target Field</label>
              <select value={createForm.targetField} onChange={e => setCreateForm({ ...createForm, targetField: e.target.value })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}>
                <option value="connectorId">connectorId</option>
                <option value="workflowId">workflowId</option>
                <option value="agentId">agentId</option>
                <option value="engineId">engineId</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Timeout (ms)</label>
              <input type="number" value={createForm.timeoutMs} onChange={e => setCreateForm({ ...createForm, timeoutMs: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Max Retries</label>
              <input type="number" value={createForm.maxRetries} onChange={e => setCreateForm({ ...createForm, maxRetries: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }} />
            </div>
          </div>
          <button onClick={createJob} disabled={!createForm.name || loading} style={{
            padding: '10px 24px', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
            opacity: !createForm.name || loading ? 0.5 : 1,
          }}>Criar Job</button>
        </div>
      )}

      {activeTab === 'Historico' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '16px' }}>Historico ({history.length})</div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}><div style={{ fontSize: '14px' }}>Nenhuma execucao registrada</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {history.slice(0, 30).map((e: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '8px 1fr 100px 100px 100px 80px', gap: '12px', alignItems: 'center', padding: '10px 12px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor(e.status) }} />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{e.jobName}</span>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{e.jobType}</div>
                  </div>
                  <span style={badge(statusColor(e.status))}>{e.status}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(e.startedAt).toLocaleTimeString('pt-BR')}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{e.durationMs ? e.durationMs + 'ms' : '-'}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Retry {e.retryAttempt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
