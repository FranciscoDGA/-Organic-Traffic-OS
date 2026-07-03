'use client';

import { useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  agentType?: string;
  queue?: string;
  dependsOn: string[];
}

interface WorkflowDef {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  status: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: string;
  currentSteps: string[];
  completedSteps: string[];
  failedSteps: string[];
  startedAt: string;
  completedAt?: string;
}

export default function WorkflowDashboard() {
  const [templates, setTemplates] = useState<WorkflowDef[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowDef | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'dag' | 'executions'>('templates');

  useEffect(() => {
    fetch('/api/organic-os/workflow').then(r => r.json()).then(setTemplates);
    fetch('/api/organic-os/workflow/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {});
  }, []);

  const statusColor = (s: string) => {
    const m: Record<string, string> = { ready: '#22c55e', running: '#3b82f6', completed: '#22c55e', failed: '#ef4444', paused: '#f59e0b', cancelled: '#6b7280', draft: '#8b5cf6', validating: '#f59e0b' };
    return m[s] || '#6b7280';
  };

  const typeIcon = (t: string) => {
    const m: Record<string, string> = { agent: '🤖', worker: '⚙️', approval: '✋', wait: '⏳', event: '📡', publish: '🚀', condition: '🔀', parallel: '⚡' };
    return m[t] || '📋';
  };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Workflow Orchestrator (OWO)</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Construir, validar e supervisionar workflows complexos</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['templates', 'dag', 'executions'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'templates' ? 'Templates' : tab === 'dag' ? 'DAG View' : 'Execucoes'}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {templates.map(t => (
            <div key={t.id} onClick={() => setSelectedTemplate(t)} style={{ background: '#1e293b', border: selectedTemplate?.id === t.id ? '1px solid #3b82f6' : '1px solid #334155', borderRadius: '8px', padding: '1rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{t.name}</span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '9999px', background: statusColor(t.status) + '22', color: statusColor(t.status) }}>{t.category}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{t.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {t.steps.map(s => (
                  <span key={s.id} title={`${s.name} (${s.type})`} style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: '#334155', color: '#cbd5e1' }}>{typeIcon(s.type)} {s.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'dag' && selectedTemplate && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>DAG: {selectedTemplate.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedTemplate.steps.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '1.25rem' }}>{typeIcon(step.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{step.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {step.id} | Tipo: {step.type}{step.agentType ? ` | Agent: ${step.agentType}` : ''}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {step.dependsOn.length > 0 ? `Depende de: ${step.dependsOn.join(', ')}` : 'Sem dependencias'}
                </div>
                {i < selectedTemplate.steps.length - 1 && (
                  <div style={{ color: '#475569', fontSize: '1.25rem' }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dag' && !selectedTemplate && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Selecione um template para visualizar o DAG
        </div>
      )}

      {activeTab === 'executions' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Execucoes Ativas</h3>
          {executions.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Nenhuma execucao ativa</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {executions.map(e => (
                <div key={e.id} style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{e.workflowId}</span>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>{e.id}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '9999px', background: statusColor(e.status) + '22', color: statusColor(e.status) }}>{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
