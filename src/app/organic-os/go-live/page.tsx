'use client';

import { useState, useEffect } from 'react';

interface CheckResult { id: string; name: string; category: string; status: string; score: number; maxScore: number; details: string }
interface WorkspaceReadiness { workspaceId: string; workspaceName: string; overallScore: number; checks: CheckResult[]; status: string }
interface AgentReadiness { agentName: string; score: number; permissions: string; performance: string; consumption: string; costs: string; logs: string; retries: string; playbooks: string; knowledge: string; integrations: string }
interface GoLiveReport { id: string; overallScore: { infrastructure: number; security: number; runtime: number; publishing: number; business: number; ai: number; workspace: number; overall: number; level: string }; workspaces: WorkspaceReadiness[]; agents: AgentReadiness[]; pendingItems: string[]; risks: string[]; criticalItems: string[]; blockingItems: string[]; recommendations: string[]; goLivePlan: string[]; rollbackPlan: string[]; successCriteria: string[]; authorized: boolean; generatedAt: string }

export default function GoLivePage() {
  const [tab, setTab] = useState<'score' | 'checklist' | 'workspaces' | 'plano'>('score');
  const [report, setReport] = useState<GoLiveReport | null>(null);
  const [validating, setValidating] = useState(false);

  const runValidation = async () => {
    setValidating(true);
    const res = await fetch('/api/organic-os/go-live/validate', { method: 'POST' });
    const data = await res.json();
    setReport(data);
    setValidating(false);
  };

  useEffect(() => { runValidation(); }, []);

  const statusColor = (s: string) => s === 'passed' || s === 'excellent' ? '#059669' : s === 'warning' || s === 'ready' ? '#f59e0b' : '#dc2626';
  const levelColor = (l: string) => l === 'excellent' ? '#059669' : l === 'ready' ? '#3b82f6' : l === 'partial' ? '#f59e0b' : '#dc2626';

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Go-Live Center</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Production Readiness & Authorization</p>
        </div>
        <button onClick={runValidation} disabled={validating} style={{ padding: '6px 16px', borderRadius: '6px', background: validating ? '#4b5563' : '#059669', color: '#fff', border: 'none', cursor: validating ? 'not-allowed' : 'pointer' }}>
          {validating ? 'Validando...' : 'Executar Validacao'}
        </button>
      </div>

      {report && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Readiness Score', value: `${report.overallScore.overall}/100`, color: levelColor(report.overallScore.level) },
              { label: 'Nivel', value: report.overallScore.level, color: levelColor(report.overallScore.level) },
              { label: 'Autorizado', value: report.authorized ? 'SIM' : 'NAO', color: report.authorized ? '#059669' : '#dc2626' },
              { label: 'Workspaces', value: `${report.workspaces.length}/5`, color: '#3b82f6' },
            ].map(k => (
              <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: k.color, marginTop: '4px', textTransform: 'capitalize' }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {Object.entries(report.overallScore).filter(([k]) => k !== 'overall' && k !== 'level').map(([k, v]) => (
              <div key={k} style={{ background: '#1f2937', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'capitalize' }}>{k}</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: levelColor(Number(v) >= 85 ? 'excellent' : Number(v) >= 70 ? 'ready' : 'partial'), marginTop: '4px' }}>{String(v)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {(['score', 'checklist', 'workspaces', 'plano'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: '6px', background: tab === t ? '#2563eb' : '#374151', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
                {t === 'score' ? 'Score' : t === 'checklist' ? 'Checklist' : t === 'workspaces' ? 'Workspaces' : 'Plano'}
              </button>
            ))}
          </div>

          {tab === 'score' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Pendencias ({report.pendingItems.length})</h3>
                {report.pendingItems.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#f59e0b', padding: '4px 0' }}>• {item}</div>)}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Riscos ({report.risks.length})</h3>
                {report.risks.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#f59e0b', padding: '4px 0' }}>• {item}</div>)}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Itens Criticos ({report.criticalItems.length})</h3>
                {report.criticalItems.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#dc2626', padding: '4px 0' }}>• {item}</div>)}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Recomendacoes ({report.recommendations.length})</h3>
                {report.recommendations.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#059669', padding: '4px 0' }}>• {item}</div>)}
              </div>
            </div>
          )}

          {tab === 'checklist' && (
            <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Agents ({report.agents.length})</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {report.agents.map(a => (
                  <div key={a.agentName} style={{ background: '#111827', borderRadius: '6px', padding: '10px', display: 'grid', gridTemplateColumns: '150px repeat(9, 1fr)', gap: '4px', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold' }}>{a.agentName}</div>
                    {(['permissions','performance','consumption','costs','logs','retries','playbooks','knowledge','integrations'] as const).map(k => (
                      <div key={k} style={{ fontSize: '10px', color: statusColor(a[k]), textAlign: 'center' }}>{a[k] === 'passed' ? '✓' : '⚠'}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'workspaces' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {report.workspaces.map(w => (
                <div key={w.workspaceId} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb' }}>{w.workspaceName}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: levelColor(w.status), marginTop: '8px' }}>{w.overallScore}%</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', textTransform: 'capitalize' }}>{w.status}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>{w.checks.length} checks</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'plano' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669', marginBottom: '12px' }}>Plano de Go-Live</h3>
                {report.goLivePlan.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#d1d5db', padding: '6px 0', borderBottom: '1px solid #374151' }}>{i+1}. {item}</div>)}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626', marginBottom: '12px' }}>Plano de Rollback</h3>
                {report.rollbackPlan.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#d1d5db', padding: '6px 0', borderBottom: '1px solid #374151' }}>{i+1}. {item}</div>)}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '12px' }}>Criterios de Sucesso</h3>
                {report.successCriteria.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#d1d5db', padding: '4px 0' }}>✓ {item}</div>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
