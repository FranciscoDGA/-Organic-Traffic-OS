"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
};
const btnDanger: React.CSSProperties = {
  padding: '10px 20px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #ef4444, #f87171)',
  boxShadow: '0 4px 20px rgba(239,68,68,0.35)',
};
const TABS = ['Status', 'Workflows', 'Timeline', 'Execução'];

export default function OrchestratorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Status');
  const [running, setRunning] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/orchestrator/status');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch {}
  }, []);

  const fetchWorkflows = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/orchestrator/workflows');
      const data = await res.json();
      if (data.success) setWorkflows(data.data || []);
    } catch {}
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/orchestrator/history');
      const data = await res.json();
      if (data.success) setHistory(data.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); fetchWorkflows(); fetchHistory(); }, [fetchStatus, fetchWorkflows, fetchHistory]);

  async function runWorkflow() {
    if (!selectedWorkflow) return;
    setRunning(true);
    try {
      const res = await fetch('/api/organic-os/orchestrator/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow_id: selectedWorkflow }),
      });
      const data = await res.json();
      await fetchStatus();
      await fetchHistory();
    } finally { setRunning(false); }
  }

  async function stopExecution() {
    try {
      await fetch('/api/organic-os/orchestrator/stop', { method: 'POST' });
      await fetchStatus();
    } catch {}
  }

  const statusColor = (s: string) => s === 'completed' ? '#10b981' : s === 'failed' ? '#ef4444' : s === 'running' ? '#f59e0b' : s === 'cancelled' ? '#64748b' : '#3b82f6';
  const priorityColor = (p: string) => p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : p === 'medium' ? '#3b82f6' : '#10b981';
  const stepTypeColor = (t: string) => t === 'connector' ? '#3b82f6' : t === 'engine' ? '#8b5cf6' : t === 'agent' ? '#f59e0b' : '#64748b';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            ⚙️ Orchestrator
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Coordena toda a execução do Organic Traffic OS.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {status?.is_running ? (
            <button onClick={stopExecution} style={btnDanger}>⏹ Parar</button>
          ) : (
            <>
              <select value={selectedWorkflow} onChange={e => setSelectedWorkflow(e.target.value)} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '10px', color: '#e2e8f0', fontSize: '12px' }}>
                <option value="">Selecionar workflow...</option>
                {workflows.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <button onClick={runWorkflow} disabled={!selectedWorkflow || running} style={{ ...btnPrimary, opacity: !selectedWorkflow || running ? 0.5 : 1 }}>
                {running ? '⏳ Executando...' : '▶ Executar'}
              </button>
            </>
          )}
        </div>
      </div>

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

      {activeTab === 'Status' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: status?.is_running ? '#f59e0b' : '#10b981' }}>
                {status?.is_running ? '🟢 RUN' : '⏸ IDLE'}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Status</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#6366f1' }}>{status?.total_executions || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{status?.successful_executions || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Sucesso</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ef4444' }}>{status?.failed_executions || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Falhas</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#94a3b8' }}>{status?.average_duration_ms ? `${Math.round(status.average_duration_ms / 1000)}s` : '0s'}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Média</div>
            </div>
          </div>

          {status?.current_execution && (
            <div style={{ ...card({ borderLeft: '4px solid #f59e0b' }) }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Execução em Andamento
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>
                {status.current_execution.workflow_name}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {status.current_execution.steps?.map((s: any, i: number) => (
                  <span key={i} style={badge(statusColor(s.status))}>{s.step_name}: {s.status}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Workflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {workflows.map((w: any) => (
            <div key={w.id} style={{ ...card(), cursor: 'pointer' }} onClick={() => setSelectedWorkflow(w.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0' }}>{w.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>v{w.version}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={badge(priorityColor(w.priority))}>{w.priority}</span>
                  <span style={badge(w.status === 'active' ? '#10b981' : '#64748b')}>{w.status}</span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>{w.description}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {w.steps.map((s: any) => (
                  <span key={s.id} style={badge(stepTypeColor(s.type))}>{s.name}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
                <span>⏱ {Math.round(w.timeout_ms / 1000)}s timeout</span>
                <span>🔄 {w.retry_policy.max_retries} retries</span>
                <span>📋 {w.steps.length} etapas</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Timeline' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Histórico de Execuções ({history.length})
          </div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📜</div>
              <div style={{ fontSize: '14px' }}>Nenhuma execução registrada</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.slice(0, 20).map((exec: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 80px 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${statusColor(exec.status)}` }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{exec.workflow_name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{new Date(exec.started_at).toLocaleString('pt-BR')}</div>
                  </div>
                  <span style={badge(statusColor(exec.status))}>{exec.status}</span>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>{exec.steps?.filter((s: any) => s.status === 'completed').length || 0}</span><div style={{ fontSize: '8px', color: '#64748b' }}>OK</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#ef4444' }}>{exec.steps?.filter((s: any) => s.status === 'failed').length || 0}</span><div style={{ fontSize: '8px', color: '#64748b' }}>FAIL</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>{exec.duration_ms ? `${Math.round(exec.duration_ms / 1000)}s` : '-'}</span><div style={{ fontSize: '8px', color: '#64748b' }}>TEMPO</div></div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {exec.steps?.slice(0, 5).map((s: any, j: number) => (
                      <span key={j} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor(s.status) }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Execução' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Executar Workflow
          </div>
          <div style={{ marginBottom: '16px', fontSize: '13px', color: '#94a3b8' }}>
            Selecione um workflow e clique em Executar para iniciar uma orquestração completa.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Workflow</div>
              <select value={selectedWorkflow} onChange={e => setSelectedWorkflow(e.target.value)} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '10px', color: '#e2e8f0', fontSize: '13px', width: '100%' }}>
                <option value="">Selecionar...</option>
                {workflows.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name} ({w.steps.length} etapas)</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Ação</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={runWorkflow} disabled={!selectedWorkflow || running} style={{ ...btnPrimary, opacity: !selectedWorkflow || running ? 0.5 : 1 }}>
                  {running ? '⏳ Executando...' : '▶ Executar'}
                </button>
                {status?.is_running && (
                  <button onClick={stopExecution} style={btnDanger}>⏹ Parar</button>
                )}
              </div>
            </div>
          </div>

          {selectedWorkflow && (
            <div style={{ backgroundColor: '#080b10', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                Etapas do Workflow
              </div>
              {workflows.find((w: any) => w.id === selectedWorkflow)?.steps.map((s: any, i: number) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: i < (workflows.find((w: any) => w.id === selectedWorkflow)?.steps.length || 0) - 1 ? '1px solid #1d2133' : 'none' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: stepTypeColor(s.type) + '20', color: stepTypeColor(s.type), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{s.name}</span>
                    <span style={badge(stepTypeColor(s.type))}>{s.type}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{s.depends_on.length > 0 ? `Depende: ${s.depends_on.join(', ')}` : 'Sem dependências'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
