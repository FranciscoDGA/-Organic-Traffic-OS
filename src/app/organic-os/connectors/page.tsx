"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: '1px solid ' + color + '30',
});
const TABS = ['Connectors', 'Health', 'Logs'];

export default function ConnectorsPanel() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Connectors');
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [c, h] = await Promise.all([
        fetch('/api/organic-os/connectors').then(r => r.json()),
        fetch('/api/organic-os/connectors/health').then(r => r.json()),
      ]);
      if (c.success) setConnectors(c.data || []);
      if (h.success) setHealth(h.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function testConnector(id: string) {
    setLoading(true);
    try {
      await fetch('/api/organic-os/connectors/test', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ connectorId: id }),
      });
      await fetchAll();
    } finally { setLoading(false); }
  }

  async function reconnectConnector(id: string) {
    setLoading(true);
    try {
      await fetch('/api/organic-os/connectors/' + id + '/reconnect', { method: 'POST' });
      await fetchAll();
    } finally { setLoading(false); }
  }

  const statusColor = (s: string) => s === 'active' ? '#10b981' : s === 'error' ? '#ef4444' : s === 'rate_limited' ? '#f59e0b' : s === 'circuit_open' ? '#ef4444' : '#64748b';
  const catColor = (c: string) => c === 'ai' ? '#8b5cf6' : c === 'google' ? '#3b82f6' : c === 'github' ? '#f1f5f9' : c === 'vercel' ? '#ef4444' : c === 'supabase' ? '#10b981' : c === 'communication' ? '#f59e0b' : c === 'publisher' ? '#ec4899' : '#64748b';
  const catIcon = (c: string) => c === 'ai' ? 'AI' : c === 'google' ? 'G' : c === 'github' ? 'GH' : c === 'vercel' ? 'V' : c === 'supabase' ? 'SB' : c === 'communication' ? 'EM' : c === 'publisher' ? 'PB' : 'X';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>Organic Connector Hub</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>Central de integracoes externas seguras.</p>
        </div>
        <button onClick={fetchAll} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#3b82f6' }}>Atualizar</button>
      </div>

      {connectors.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#6366f1' }}>{connectors.length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Total</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{connectors.filter(c => c.status === 'active').length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Ativos</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ef4444' }}>{connectors.filter(c => c.status === 'error').length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Erros</div>
          </div>
          <div style={{ ...card({ padding: '14px', textAlign: 'center' as const }) }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>{health.filter(h => h.latencyMs > 1000).length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' as const }}>Lentos</div>
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

      {activeTab === 'Connectors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '12px' }}>
          {connectors.map((c: any) => (
            <div key={c.id} style={{ ...card(), borderLeft: '3px solid ' + statusColor(c.status) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: catColor(c.category) + '20', color: catColor(c.category), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>{catIcon(c.category)}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>v{c.version} | {c.category}</div>
                  </div>
                </div>
                <span style={badge(statusColor(c.status))}>{c.status}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {c.permissions?.slice(0, 4).map((p: string) => (
                  <span key={p} style={{ padding: '2px 8px', backgroundColor: '#080b10', borderRadius: '4px', fontSize: '10px', color: '#94a3b8' }}>{p}</span>
                ))}
                {c.permissions?.length > 4 && <span style={{ fontSize: '10px', color: '#64748b' }}>+{c.permissions.length - 4}</span>}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#64748b', marginBottom: '10px' }}>
                <span>Auth: {c.authentication?.type}</span>
                <span>Rate: {c.rateLimit?.requestsPerMinute}/min</span>
                <span>Timeout: {c.timeout}ms</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => testConnector(c.id)} disabled={loading} style={{ padding: '5px 12px', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer', background: '#10b981', opacity: loading ? 0.5 : 1 }}>Testar</button>
                <button onClick={() => reconnectConnector(c.id)} disabled={loading} style={{ padding: '5px 12px', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer', background: '#3b82f6', opacity: loading ? 0.5 : 1 }}>Reconectar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Health' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {health.map((h: any) => (
            <div key={h.connectorId} style={{ ...card(), borderTop: '3px solid ' + statusColor(h.status) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>{h.connectorId}</span>
                <span style={badge(statusColor(h.status))}>{h.status}</span>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '36px', fontWeight: '900', color: h.latencyMs < 200 ? '#10b981' : h.latencyMs < 1000 ? '#f59e0b' : '#ef4444' }}>{h.latencyMs}ms</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>LATENCIA</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#10b981' }}>{h.availability}%</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>DISPONIBILIDADE</div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#3b82f6' }}>{h.successRate}%</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>TAXA SUCESSO</div>
                </div>
              </div>
              {h.lastError && <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px' }}>Erro: {h.lastError}</div>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Logs' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '16px' }}>Logs Recentes</div>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}><div style={{ fontSize: '14px' }}>Nenhum log registrado</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {logs.slice(0, 20).map((l: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '8px 100px 1fr 80px 60px', gap: '10px', alignItems: 'center', padding: '8px 12px', backgroundColor: '#080b10', borderRadius: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: l.success ? '#10b981' : '#ef4444' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{l.connectorId}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{l.action}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{l.durationMs}ms</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>r{l.retries}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
