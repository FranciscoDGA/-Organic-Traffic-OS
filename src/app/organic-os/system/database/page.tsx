"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: '1px solid ' + color + '30',
});
const TABS = ['Schemas', 'Tabelas', 'Storage', 'Migrations', 'Health'];

export default function DatabasePanel() {
  const [dbData, setDbData] = useState<any>(null);
  const [storageData, setStorageData] = useState<any>(null);
  const [migData, setMigData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Schemas');

  const fetchAll = useCallback(async () => {
    try {
      const [db, st, mg, ht] = await Promise.all([
        fetch('/api/organic-os/system/database').then(r => r.json()),
        fetch('/api/organic-os/system/storage').then(r => r.json()),
        fetch('/api/organic-os/system/migrations').then(r => r.json()),
        fetch('/api/organic-os/system/health/database').then(r => r.json()),
      ]);
      if (db.success) setDbData(db.data);
      if (st.success) setStorageData(st.data);
      if (mg.success) setMigData(mg.data);
      if (ht.success) setHealthData(ht.data);
    } catch {}
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const schemaColor = (n: string) => n === 'core' ? '#3b82f6' : n === 'workspaces' ? '#8b5cf6' : n === 'missions' ? '#f59e0b' : n === 'agents' ? '#10b981' : n === 'publisher' ? '#ec4899' : n === 'audit' ? '#ef4444' : n === 'security' ? '#f97316' : '#64748b';
  const migStatus = (m: any) => m.rolledBack ? '#ef4444' : m.executedAt ? '#10b981' : '#f59e0b';
  const bucketVis = (b: any) => b.public ? '#10b981' : '#3b82f6';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>Database & Storage</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>Arquitetura enterprise de dados e armazenamento.</p>
        </div>
        <button onClick={fetchAll} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#3b82f6' }}>Atualizar</button>
      </div>

      {dbData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#3b82f6' }}>{dbData.totalSchemas}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Schemas</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#8b5cf6' }}>{dbData.totalTables}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Tabelas</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{dbData.totalBuckets}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Buckets</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>{dbData.migrations?.executed || 0}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Migrations</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: healthData?.status === 'healthy' ? '#10b981' : '#ef4444' }}>{healthData?.status || 'checking'}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Health</div>
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

      {activeTab === 'Schemas' && dbData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {dbData.schemas?.map((s: any) => (
            <div key={s.name} style={{ ...card(), borderTop: '3px solid ' + schemaColor(s.name) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#e2e8f0' }}>{s.name}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{s.tableCount} tabelas</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>{s.description}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {s.rls && <span style={badge('#8b5cf6')}>RLS</span>}
                {s.audit && <span style={badge('#f59e0b')}>Audit</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Tabelas' && dbData && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '16px' }}>Tabelas por Schema</div>
          {dbData.schemas?.map((s: any) => (
            <div key={s.name} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: schemaColor(s.name), marginBottom: '6px' }}>{s.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Array.from({ length: s.tableCount }, (_, i) => (
                  <span key={i} style={{ padding: '4px 10px', backgroundColor: '#080b10', borderRadius: '6px', fontSize: '11px', color: '#94a3b8', border: '1px solid #1d2133' }}>{s.name}.table_{i + 1}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Storage' && storageData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {storageData.buckets?.map((b: any) => (
            <div key={b.name} style={{ ...card(), borderLeft: '3px solid ' + bucketVis(b) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{b.name}</span>
                <span style={badge(bucketVis(b))}>{b.public ? 'Public' : 'Private'}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{b.description}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Limite: {(b.fileSizeLimit / 1048576).toFixed(0)}MB</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Tipos: {b.mimeTypes?.join(', ')}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Migrations' && migData && (
        <div style={card()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Migrations</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#e2e8f0' }}>{migData.status?.executed || 0}/{migData.status?.total || 0}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#10b981' }}>{migData.status?.executed || 0}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>EXECUTED</div>
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b' }}>{migData.status?.pending || 0}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>PENDING</div>
              </div>
            </div>
          </div>
          {migData.migrations?.map((m: any) => (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 80px', gap: '12px', alignItems: 'center', padding: '10px', backgroundColor: '#080b10', borderRadius: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>#{m.id}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{m.name}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{m.schema}</div>
              </div>
              <span style={badge(migStatus(m))}>{m.rolledBack ? 'rolled back' : m.executedAt ? 'executed' : 'pending'}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{m.executionTimeMs || '-'}ms</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>{m.version}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Health' && healthData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ ...card(), borderTop: '3px solid ' + (healthData.status === 'healthy' ? '#10b981' : '#ef4444') }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '12px' }}>Database Health</div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: '900', color: healthData.status === 'healthy' ? '#10b981' : '#ef4444' }}>{healthData.status}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Schemas</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{healthData.schemas}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Tabelas</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{healthData.tables}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Migrations Executed</span>
                <span style={{ fontSize: '12px', color: '#10b981' }}>{healthData.migrations?.executed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Migrations Pending</span>
                <span style={{ fontSize: '12px', color: '#f59e0b' }}>{healthData.migrations?.pending}</span>
              </div>
            </div>
          </div>
          <div style={card()}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '12px' }}>Connection Pool</div>
            {healthData.connectionPool && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Active</span>
                  <span style={{ fontSize: '12px', color: '#10b981' }}>{healthData.connectionPool.active}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Idle</span>
                  <span style={{ fontSize: '12px', color: '#f59e0b' }}>{healthData.connectionPool.idle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Max</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{healthData.connectionPool.max}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
