'use client';

import { useState, useEffect } from 'react';

interface AuditCheck { id: string; module: string; category: string; name: string; status: string; score: number; maxScore: number; details: string }
interface WorkspaceCert { workspaceId: string; workspaceName: string; overallScore: number; status: string; risks: string[]; pendingItems: string[]; recommendations: string[] }
interface AgentCert { agentName: string; overallScore: number; registration: AuditCheck; permissions: AuditCheck; playbooks: AuditCheck; knowledge: AuditCheck; performance: AuditCheck; costs: AuditCheck; runtime: AuditCheck; events: AuditCheck; logs: AuditCheck; failures: AuditCheck; recovery: AuditCheck }
interface ConnectorCert { connectorName: string; healthCheck: string; score: number; latencyMs: number }
interface CertScore { infrastructure: number; runtime: number; security: number; publishing: number; workspace: number; agent: number; business: number; overall: number; level: string }
interface Certificate { id: string; version: string; date: string; environment: string; overallScore: CertScore; workspaces: WorkspaceCert[]; agents: AgentCert[]; connectors: ConnectorCert[]; overallAudit: AuditCheck[]; pendingItems: string[]; risks: string[]; goLiveChecklist: string[]; rollbackChecklist: string[]; approvedBy: string; validUntil: string; generatedAt: string }

export default function CertificationPage() {
  const [tab, setTab] = useState<'score' | 'workspaces' | 'agents' | 'go-live'>('score');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [certifying, setCertifying] = useState(false);

  const runCertification = async () => {
    setCertifying(true);
    const res = await fetch('/api/organic-os/certification/run', { method: 'POST' });
    const data = await res.json();
    setCert(data);
    setCertifying(false);
  };

  useEffect(() => { runCertification(); }, []);

  const levelColor = (l: string) => l === 'certified' ? '#059669' : l === 'conditional' ? '#f59e0b' : l === 'pending' ? '#3b82f6' : '#dc2626';
  const statusColor = (s: string) => s === 'passed' ? '#059669' : s === 'warning' ? '#f59e0b' : '#dc2626';

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb' }}>Operational Certification</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Certificacao e Go-Live</p>
        </div>
        <button onClick={runCertification} disabled={certifying} style={{ padding: '6px 16px', borderRadius: '6px', background: certifying ? '#4b5563' : '#059669', color: '#fff', border: 'none', cursor: certifying ? 'not-allowed' : 'pointer' }}>
          {certifying ? 'Certificando...' : 'Executar Certificacao'}
        </button>
      </div>

      {cert && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Readiness Score', value: `${cert.overallScore.overall}/100`, color: levelColor(cert.overallScore.level) },
              { label: 'Nivel', value: cert.overallScore.level, color: levelColor(cert.overallScore.level) },
              { label: 'Workspaces', value: `${cert.workspaces.length}/5`, color: '#3b82f6' },
              { label: 'Agents', value: `${cert.agents.length}/8`, color: '#8b5cf6' },
            ].map(k => (
              <div key={k.label} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: k.color, marginTop: '4px', textTransform: 'capitalize' }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {Object.entries(cert.overallScore).filter(([k]) => !['overall', 'level'].includes(k)).map(([k, v]) => (
              <div key={k} style={{ background: '#1f2937', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'capitalize' }}>{k}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: levelColor(Number(v) >= 85 ? 'certified' : Number(v) >= 70 ? 'conditional' : 'pending'), marginTop: '4px' }}>{String(v)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {(['score', 'workspaces', 'agents', 'go-live'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: '6px', background: tab === t ? '#2563eb' : '#374151', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
                {t === 'score' ? 'Score' : t === 'workspaces' ? 'Workspaces' : t === 'agents' ? 'Agents' : 'Go-Live'}
              </button>
            ))}
          </div>

          {tab === 'score' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Conectores ({cert.connectors.length})</h3>
                {cert.connectors.map(c => (
                  <div key={c.connectorName} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #374151' }}>
                    <span style={{ fontSize: '12px', color: '#f9fafb' }}>{c.connectorName}</span>
                    <span style={{ fontSize: '12px', color: statusColor(c.healthCheck) }}>{c.score}% | {c.latencyMs}ms</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '12px' }}>Certificado</h3>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Versao: {cert.version}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Data: {cert.date}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Ambiente: {cert.environment}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Valido ate: {cert.validUntil}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Aprovado por: {cert.approvedBy}</div>
              </div>
            </div>
          )}

          {tab === 'workspaces' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {cert.workspaces.map(w => (
                <div key={w.workspaceId} style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f9fafb' }}>{w.workspaceName}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: levelColor(w.status), marginTop: '8px' }}>{w.overallScore}%</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', textTransform: 'capitalize' }}>{w.status}</div>
                  {w.risks.length > 0 && <div style={{ fontSize: '10px', color: '#dc2626', marginTop: '4px' }}>{w.risks.length} riscos</div>}
                </div>
              ))}
            </div>
          )}

          {tab === 'agents' && (
            <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
              {cert.agents.map(a => (
                <div key={a.agentName} style={{ background: '#111827', borderRadius: '6px', padding: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold', width: '120px' }}>{a.agentName}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['registration','permissions','playbooks','knowledge','performance','costs','runtime','events','logs','failures','recovery'].map(k => {
                      const check = a[k as keyof AgentCert] as AuditCheck;
                      return <div key={k} title={k} style={{ width: '12px', height: '12px', borderRadius: '2px', background: statusColor(check.status) }} />;
                    })}
                  </div>
                  <div style={{ fontSize: '12px', color: '#f9fafb', fontWeight: 'bold' }}>{a.overallScore}%</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'go-live' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669', marginBottom: '12px' }}>Go-Live Checklist</h3>
                {cert.goLiveChecklist.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#d1d5db', padding: '6px 0', borderBottom: '1px solid #374151' }}>✓ {item}</div>)}
              </div>
              <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626', marginBottom: '12px' }}>Rollback Checklist</h3>
                {cert.rollbackChecklist.map((item, i) => <div key={i} style={{ fontSize: '12px', color: '#d1d5db', padding: '6px 0', borderBottom: '1px solid #374151' }}>✓ {item}</div>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
