"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: '1px solid ' + color + '30',
});
const TABS = ['Ambientes', 'Sandbox', 'Staging', 'Feature Flags', 'Promocao'];

export default function StagingPanel() {
  const [envData, setEnvData] = useState<any>(null);
  const [sandboxData, setSandboxData] = useState<any>(null);
  const [stagingData, setStagingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Ambientes');
  const [loading, setLoading] = useState(false);
  const [promoteFrom, setPromoteFrom] = useState('sandbox');
  const [promoteTo, setPromoteTo] = useState('staging');
  const [promoteNotes, setPromoteNotes] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const [e, s, st] = await Promise.all([
        fetch('/api/organic-os/system/environment').then(r => r.json()),
        fetch('/api/organic-os/system/sandbox').then(r => r.json()),
        fetch('/api/organic-os/system/staging').then(r => r.json()),
      ]);
      if (e.success) setEnvData(e.data);
      if (s.success) setSandboxData(s.data);
      if (st.success) setStagingData(st.data);
    } catch {}
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function toggleFlag(flag: string, enabled: boolean) {
    setLoading(true);
    try {
      await fetch('/api/organic-os/system/environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag, enabled }),
      });
      await fetchAll();
    } finally { setLoading(false); }
  }

  async function promote() {
    setLoading(true);
    try {
      await fetch('/api/organic-os/system/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: promoteFrom, to: promoteTo, notes: promoteNotes }),
      });
      setPromoteNotes('');
      await fetchAll();
    } finally { setLoading(false); }
  }

  async function resetSandbox() {
    setLoading(true);
    try {
      await fetch('/api/organic-os/system/reset-sandbox', { method: 'POST' });
      await fetchAll();
    } finally { setLoading(false); }
  }

  const envColor = (e: string) => e === 'development' ? '#3b82f6' : e === 'sandbox' ? '#f59e0b' : e === 'staging' ? '#8b5cf6' : '#10b981';
  const flagColor = (f: boolean) => f ? '#10b981' : '#64748b';
  const statusColor = (s: string) => s === 'active' ? '#10b981' : s === 'idle' ? '#3b82f6' : s === 'running' ? '#f59e0b' : s === 'completed' ? '#10b981' : s === 'error' ? '#ef4444' : '#64748b';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>Staging & Sandbox</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>Ambientes de homologacao e testes isolados.</p>
        </div>
        <button onClick={fetchAll} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#3b82f6' }}>Atualizar</button>
      </div>

      {envData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: envColor('development') }}>Development</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Local</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: envColor('sandbox') }}>Sandbox</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Testes isolados</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: envColor('staging') }}>Staging</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Homologacao</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: envColor('production') }}>Production</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Oficial</div>
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

      {activeTab === 'Ambientes' && envData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={card()}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' }}>Status do Ambiente</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>Ambiente Atual</span>
                <span style={badge(envColor(envData.environment))}>{envData.environment}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>Dominio</span>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{envData.domain}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>Log Level</span>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{envData.logLevel}</span>
              </div>
            </div>
          </div>
          <div style={card()}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' }}>Feature Flags</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {envData.featureFlags?.map((f: any) => (
                <div key={f.flag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{f.flag}</span>
                  <span style={badge(flagColor(f.enabled))}>{f.enabled ? 'ON' : 'OFF'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Sandbox' && sandboxData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>{sandboxData.summary?.totalWorkspaces || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>WORKSPACES</div>
            </div>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#3b82f6' }}>{sandboxData.summary?.totalArticles || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>ARTIGOS</div>
            </div>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#8b5cf6' }}>{sandboxData.summary?.totalAgents || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>AGENTS</div>
            </div>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{sandboxData.summary?.totalMissions || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>MISSOES</div>
            </div>
          </div>
          <div style={{ ...card(), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>Resetar Sandbox</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Limpa todos os dados ficticios e reinicia o sandbox</div>
            </div>
            <button onClick={resetSandbox} disabled={loading} style={{
              padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', opacity: loading ? 0.5 : 1,
            }}>Resetar</button>
          </div>
          {sandboxData.workspaces?.map((ws: any) => (
            <div key={ws.id} style={{ ...card(), padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#e2e8f0' }}>{ws.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>{ws.domain}</span>
                </div>
                <span style={badge(statusColor(ws.status))}>{ws.status}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{ws.description}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                <span>{ws.articles?.length || 0} artigos</span>
                <span>{ws.agents?.length || 0} agents</span>
                <span>{ws.missions?.length || 0} missoes</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Staging' && stagingData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#8b5cf6' }}>{stagingData.totalArticles || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>ARTIGOS</div>
            </div>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{stagingData.totalMissions || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>MISSOES</div>
            </div>
            <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>{stagingData.workspaces?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>WORKSPACES</div>
            </div>
          </div>
          {stagingData.workspaces?.map((ws: any) => (
            <div key={ws.id} style={{ ...card(), padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#e2e8f0' }}>{ws.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>{ws.domain}</span>
                </div>
                <span style={badge(statusColor(ws.status))}>{ws.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Feature Flags' && envData && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '16px' }}>Feature Flags</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {envData.featureFlags?.map((f: any) => (
              <div key={f.flag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#080b10', borderRadius: '8px', borderLeft: '3px solid ' + flagColor(f.enabled) }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>{f.flag}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{f.description}</div>
                </div>
                <button onClick={() => toggleFlag(f.flag, !f.enabled)} style={{
                  padding: '6px 14px', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                  background: f.enabled ? '#ef4444' : '#10b981',
                }}>{f.enabled ? 'Desligar' : 'Ligar'}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Promocao' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '16px' }}>Promocao de Ambiente</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '12px', alignItems: 'end', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>De</label>
              <select value={promoteFrom} onChange={e => setPromoteFrom(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}>
                <option value="sandbox">Sandbox</option>
                <option value="staging">Staging</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Para</label>
              <select value={promoteTo} onChange={e => setPromoteTo(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const }}>Notas</label>
              <input value={promoteNotes} onChange={e => setPromoteNotes(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }} placeholder="Notas da promocao..." />
            </div>
            <button onClick={promote} disabled={loading} style={{
              padding: '10px 20px', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              background: 'linear-gradient(135deg, #10b981, #34d399)', opacity: loading ? 0.5 : 1, height: '42px',
            }}>Promover</button>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', padding: '12px', backgroundColor: '#080b10', borderRadius: '8px' }}>
            Fluxo seguro: Sandbox → Staging → Production. Sandbox nunca vai direto para Production.
          </div>
        </div>
      )}
    </div>
  );
}
