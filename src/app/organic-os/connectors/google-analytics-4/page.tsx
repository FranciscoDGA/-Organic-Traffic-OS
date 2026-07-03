"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});
const inputStyle: React.CSSProperties = {
  backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px',
  padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', width: '100%',
  outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
  fontSize: '10px', color: '#64748b', fontWeight: '700', display: 'block',
  marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.6px',
};
const btnPrimary: React.CSSProperties = {
  width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
  boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
};
const btnDanger: React.CSSProperties = {
  ...btnPrimary,
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  boxShadow: '0 4px 20px rgba(239,68,68,0.35)',
};
const btnSync: React.CSSProperties = {
  ...btnPrimary,
  background: 'linear-gradient(135deg, #10b981, #059669)',
  boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
};
const TABS = ['Status', 'Propriedades', 'Páginas', 'Fontes de Tráfego', 'Eventos', 'Logs'];

export default function GoogleAnalytics4ConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/connectors/google-analytics-4/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setLogs(data.data.logs || []);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function initializeAndAuth() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/google-analytics-4/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize', client_id: clientId, client_secret: clientSecret }),
      });
      const data = await res.json();
      if (data.auth_url) {
        window.open(data.auth_url, '_blank', 'width=500,height=600');
      }
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function syncProperty() {
    if (!selectedProperty) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/organic-os/connectors/google-analytics-4/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: selectedProperty }),
      });
      const data = await res.json();
      setLastSyncResult(data.data || data);
      await fetchStatus();
    } finally { setSyncing(false); }
  }

  async function loadProperties() {
    try {
      const res = await fetch('/api/organic-os/connectors/google-analytics-4/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'listProperties' }),
      });
      const data = await res.json();
      if (data.success && data.data) setProperties(data.data);
    } catch {}
  }

  const isConnected = status?.connected && status?.has_valid_token;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            📊 Google Analytics 4
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Connector de dados reais de comportamento dos usuários. OAuth 2.0. Dados 100% desacoplados.
          </p>
        </div>
        <span style={{ ...badge(isConnected ? '#10b981' : '#f59e0b'), fontSize: '12px', padding: '6px 14px' }}>
          {isConnected ? 'v1.0.0 — CONNECTED' : 'v1.0.0 — DISCONNECTED'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={card()}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
              Autenticação OAuth 2.0
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Google Client ID</label>
                <input style={inputStyle} type="password" placeholder="Seu Client ID do Google" value={clientId} onChange={e => setClientId(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Google Client Secret</label>
                <input style={inputStyle} type="password" placeholder="Seu Client Secret" value={clientSecret} onChange={e => setClientSecret(e.target.value)} />
              </div>
              <button onClick={initializeAndAuth} disabled={loading || isConnected} style={{
                ...btnPrimary, opacity: loading || isConnected ? 0.5 : 1, cursor: loading || isConnected ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : isConnected ? 'Conectado' : '🔑 Conectar ao Google'}
              </button>
              {isConnected && (
                <button onClick={async () => { await fetch('/api/organic-os/connectors/google-analytics-4/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) }); await fetchStatus(); }} style={{ ...btnDanger, fontSize: '12px', padding: '8px' }}>
                  Desconectar
                </button>
              )}
            </div>
          </div>

          {isConnected && (
            <div style={card()}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
                Sincronização
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Propriedade GA4</label>
                  <select style={inputStyle} value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} onClick={loadProperties}>
                    <option value="">Selecione uma propriedade</option>
                    {properties.map((p: any, i: number) => <option key={i} value={p.propertyId}>{p.displayName} ({p.propertyId})</option>)}
                  </select>
                </div>
                <button onClick={syncProperty} disabled={syncing || !selectedProperty} style={{
                  ...btnSync, opacity: syncing || !selectedProperty ? 0.5 : 1, cursor: syncing || !selectedProperty ? 'not-allowed' : 'pointer',
                }}>
                  {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Agora'}
                </button>
                <button onClick={loadProperties} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '12px', padding: '8px' }}>
                  📋 Carregar Propriedades
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#f59e0b' : 'transparent',
                color: activeTab === tab ? '#fff' : '#64748b',
              }}>{tab}</button>
            ))}
          </div>

          {activeTab === 'Status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Conexão', value: isConnected ? 'Ativa' : 'Inativa', color: isConnected ? '#10b981' : '#ef4444' },
                  { label: 'Token', value: status?.has_valid_token ? 'Válido' : 'Inválido', color: status?.has_valid_token ? '#10b981' : '#f59e0b' },
                  { label: 'Última Sync', value: status?.last_sync ? new Date(status.last_sync).toLocaleDateString('pt-BR') : 'Nunca', color: '#3b82f6' },
                  { label: 'Cache', value: status?.cache_status || 'empty', color: status?.cache_status === 'valid' ? '#10b981' : '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Sessões', value: status?.total_sessions || 0, icon: '📈' },
                  { label: 'Usuários', value: status?.total_users || 0, icon: '👥' },
                  { label: 'Visualizações', value: status?.total_views || 0, icon: '👁️' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '20px' }), display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#e2e8f0' }}>{s.value.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {lastSyncResult && (
                <div style={card({ borderLeft: '4px solid #f59e0b' })}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    Último Resultado da Sincronização
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Sessões', value: lastSyncResult.total_sessions?.toLocaleString() || '0' },
                      { label: 'Usuários', value: lastSyncResult.total_users?.toLocaleString() || '0' },
                      { label: 'Engajamento', value: `${lastSyncResult.avg_engagement_rate || 0}%` },
                      { label: 'Duração Média', value: `${lastSyncResult.avg_session_duration || 0}s` },
                    ].map((s, i) => (
                      <div key={i} style={{ backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#e2e8f0' }}>{s.value}</div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Propriedades' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Propriedades GA4 Vinculadas
              </div>
              {properties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📊</div>
                  <div style={{ fontSize: '14px' }}>Conecte-se e carregue as propriedades</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {properties.map((p: any, i: number) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: '#080b10', padding: '14px', borderRadius: '8px',
                      borderLeft: `3px solid ${selectedProperty === p.propertyId ? '#f59e0b' : '#1d2133'}`,
                      cursor: 'pointer',
                    }} onClick={() => setSelectedProperty(p.propertyId)}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{p.displayName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>ID: {p.propertyId} | {p.serviceLevel}</div>
                      </div>
                      {selectedProperty === p.propertyId && <span style={badge('#f59e0b')}>SELECIONADO</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Páginas' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Páginas Mais Acessadas
              </div>
              {pages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📄</div>
                  <div style={{ fontSize: '14px' }}>Sincronize uma propriedade para ver as páginas</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pages.slice(0, 50).map((p: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.id}</div>
                      <div style={{ color: '#10b981', fontWeight: '700', textAlign: 'right' }}>{p.sessions.toLocaleString()}</div>
                      <div style={{ color: '#3b82f6', fontWeight: '700', textAlign: 'right' }}>{p.screenPageViews.toLocaleString()}</div>
                      <div style={{ color: '#f59e0b', fontWeight: '700', textAlign: 'right' }}>{p.engagementRate}%</div>
                      <div style={{ color: '#8b5cf6', fontWeight: '700', textAlign: 'right' }}>{p.averageSessionDuration}s</div>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px 70px', gap: '8px', padding: '6px 14px', fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                    <div>Página</div><div style={{ textAlign: 'right' }}>Sessões</div><div style={{ textAlign: 'right' }}>Views</div><div style={{ textAlign: 'right' }}>Engaj.</div><div style={{ textAlign: 'right' }}>Duração</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Fontes de Tráfego' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Fontes de Tráfego
              </div>
              {trafficSources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔗</div>
                  <div style={{ fontSize: '14px' }}>Sincronize uma propriedade para ver as fontes</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {trafficSources.slice(0, 50).map((t: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{t.id}</div>
                      <div style={{ color: '#10b981', fontWeight: '700', textAlign: 'right' }}>{t.sessions.toLocaleString()}</div>
                      <div style={{ color: '#3b82f6', fontWeight: '700', textAlign: 'right' }}>{t.screenPageViews.toLocaleString()}</div>
                      <div style={{ color: '#f59e0b', fontWeight: '700', textAlign: 'right' }}>{t.engagementRate}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Eventos' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Eventos Rastreados
              </div>
              {events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>⚡</div>
                  <div style={{ fontSize: '14px' }}>Sincronize uma propriedade para ver os eventos</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {events.slice(0, 50).map((e: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{e.id}</div>
                      <div style={{ color: '#10b981', fontWeight: '700', textAlign: 'right' }}>{e.sessions.toLocaleString()}</div>
                      <div style={{ color: '#3b82f6', fontWeight: '700', textAlign: 'right' }}>{e.screenPageViews.toLocaleString()}</div>
                      <div style={{ color: '#f59e0b', fontWeight: '700', textAlign: 'right' }}>{e.conversions}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Logs' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Logs de Operação
              </div>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📋</div>
                  <div style={{ fontSize: '14px' }}>Nenhum log registrado</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '500px', overflowY: 'auto' }}>
                  {logs.slice().reverse().map((l: any, i: number) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px',
                      borderLeft: `3px solid ${l.level === 'error' ? '#ef4444' : l.level === 'warn' ? '#f59e0b' : l.level === 'debug' ? '#6366f1' : '#10b981'}`,
                    }}>
                      <span style={{ color: '#64748b', whiteSpace: 'nowrap', fontSize: '10px' }}>
                        {new Date(l.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                      <span style={{ ...badge(l.level === 'error' ? '#ef4444' : l.level === 'warn' ? '#f59e0b' : l.level === 'debug' ? '#6366f1' : '#10b981'), fontSize: '9px', padding: '1px 6px' }}>
                        {l.level.toUpperCase()}
                      </span>
                      <span style={{ color: '#94a3b8', fontWeight: '600', whiteSpace: 'nowrap' }}>{l.action}</span>
                      <span style={{ color: '#e2e8f0', flex: 1 }}>{l.message}</span>
                      {l.duration_ms !== undefined && <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{l.duration_ms}ms</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
