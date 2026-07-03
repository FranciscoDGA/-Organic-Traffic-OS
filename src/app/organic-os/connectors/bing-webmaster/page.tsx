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
  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
  boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
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
const TABS = ['Status', 'Sites', 'Consultas', 'Páginas', 'Rastreamento', 'Logs'];

export default function BingWebmasterConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [selectedSite, setSelectedSite] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/connectors/bing-webmaster/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setLogs(data.data.logs || []);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function connect() {
    setLoading(true);
    try {
      await fetch('/api/organic-os/connectors/bing-webmaster/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', api_key: apiKey }),
      });
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function loadSites() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/bing-webmaster/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'listSites' }),
      });
      const data = await res.json();
      if (data.success && data.data) setSites(data.data);
    } finally { setLoading(false); }
  }

  async function syncSite() {
    if (!selectedSite) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/organic-os/connectors/bing-webmaster/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl: selectedSite }),
      });
      const data = await res.json();
      setLastSyncResult(data.data || data);
      if (data.success) {
        await loadQueries();
        await loadPages();
      }
      await fetchStatus();
    } finally { setSyncing(false); }
  }

  async function loadQueries() {
    if (!selectedSite) return;
    try {
      const res = await fetch(`/api/organic-os/connectors/bing-webmaster/queries?siteUrl=${encodeURIComponent(selectedSite)}`);
      const data = await res.json();
      if (data.success && data.data) setQueries(data.data);
    } catch {}
  }

  async function loadPages() {
    if (!selectedSite) return;
    try {
      const res = await fetch(`/api/organic-os/connectors/bing-webmaster/pages?siteUrl=${encodeURIComponent(selectedSite)}`);
      const data = await res.json();
      if (data.success && data.data) setPages(data.data);
    } catch {}
  }

  const isConnected = status?.connected && status?.has_valid_key;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🔵 Bing Webmaster Tools
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Connector de dados de busca do Bing. Complementa Google Search Console.
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
              Autenticação (API Key)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Bing API Key</label>
                <input style={inputStyle} type="password" placeholder="Sua API Key do Bing" value={apiKey} onChange={e => setApiKey(e.target.value)} />
              </div>
              <button onClick={connect} disabled={loading || isConnected} style={{
                ...btnPrimary, opacity: loading || isConnected ? 0.5 : 1, cursor: loading || isConnected ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : isConnected ? 'Conectado' : '🔑 Conectar ao Bing'}
              </button>
              {isConnected && (
                <button onClick={async () => { await fetch('/api/organic-os/connectors/bing-webmaster/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) }); await fetchStatus(); }} style={{ ...btnDanger, fontSize: '12px', padding: '8px' }}>
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
                  <label style={labelStyle}>Site URL</label>
                  <select style={inputStyle} value={selectedSite} onChange={e => setSelectedSite(e.target.value)} onClick={loadSites}>
                    <option value="">Selecione um site</option>
                    {sites.map((s: any, i: number) => <option key={i} value={s.siteUrl}>{s.siteUrl}</option>)}
                  </select>
                </div>
                <button onClick={syncSite} disabled={syncing || !selectedSite} style={{
                  ...btnSync, opacity: syncing || !selectedSite ? 0.5 : 1, cursor: syncing || !selectedSite ? 'not-allowed' : 'pointer',
                }}>
                  {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Agora'}
                </button>
                <button onClick={loadSites} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '12px', padding: '8px' }}>
                  📋 Carregar Sites
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
                backgroundColor: activeTab === tab ? '#0ea5e9' : 'transparent',
                color: activeTab === tab ? '#fff' : '#64748b',
              }}>{tab}</button>
            ))}
          </div>

          {activeTab === 'Status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Conexão', value: isConnected ? 'Ativa' : 'Inativa', color: isConnected ? '#10b981' : '#ef4444' },
                  { label: 'API Key', value: status?.has_valid_key ? 'Válida' : 'Inválida', color: status?.has_valid_key ? '#10b981' : '#f59e0b' },
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
                  { label: 'Consultas', value: status?.total_queries || 0, icon: '🔍' },
                  { label: 'Páginas', value: status?.total_pages || 0, icon: '📄' },
                  { label: 'Erros', value: status?.errors?.length || 0, icon: '⚠️', color: (status?.errors?.length || 0) > 0 ? '#ef4444' : '#10b981' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '20px' }), display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: s.color || '#e2e8f0' }}>{s.value.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {lastSyncResult && (
                <div style={card({ borderLeft: '4px solid #0ea5e9' })}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    Último Resultado da Sincronização
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Clicks', value: lastSyncResult.total_clicks?.toLocaleString() || '0' },
                      { label: 'Impressões', value: lastSyncResult.total_impressions?.toLocaleString() || '0' },
                      { label: 'CTR Médio', value: `${lastSyncResult.avg_ctr || 0}%` },
                      { label: 'Posição Média', value: lastSyncResult.avg_position?.toFixed(1) || '0' },
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

          {activeTab === 'Sites' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Sites Vinculados
              </div>
              {sites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔵</div>
                  <div style={{ fontSize: '14px' }}>Conecte-se e carregue os sites</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sites.map((s: any, i: number) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: '#080b10', padding: '14px', borderRadius: '8px',
                      borderLeft: `3px solid ${selectedSite === s.siteUrl ? '#0ea5e9' : '#1d2133'}`,
                      cursor: 'pointer',
                    }} onClick={() => setSelectedSite(s.siteUrl)}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{s.siteUrl}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Indexadas: {s.indexedPages} | Último crawl: {s.dateLastCrawled ? new Date(s.dateLastCrawled).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </div>
                      {selectedSite === s.siteUrl && <span style={badge('#0ea5e9')}>SELECIONADO</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Consultas' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Consultas de Busca (Bing)
              </div>
              {queries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📊</div>
                  <div style={{ fontSize: '14px' }}>Sincronize um site para ver as consultas</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {queries.slice(0, 50).map((q: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.id}</div>
                      <div style={{ color: '#10b981', fontWeight: '700', textAlign: 'right' }}>{q.clicks.toLocaleString()}</div>
                      <div style={{ color: '#3b82f6', fontWeight: '700', textAlign: 'right' }}>{q.impressions.toLocaleString()}</div>
                      <div style={{ color: '#f59e0b', fontWeight: '700', textAlign: 'right' }}>{q.ctr}%</div>
                      <div style={{ color: '#8b5cf6', fontWeight: '700', textAlign: 'right' }}>{q.position.toFixed(1)}</div>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px 70px', gap: '8px', padding: '6px 14px', fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                    <div>Consulta</div><div style={{ textAlign: 'right' }}>Clicks</div><div style={{ textAlign: 'right' }}>Impressões</div><div style={{ textAlign: 'right' }}>CTR</div><div style={{ textAlign: 'right' }}>Pos.</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Páginas' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Páginas Indexadas (Bing)
              </div>
              {pages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📄</div>
                  <div style={{ fontSize: '14px' }}>Sincronize um site para ver as páginas</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pages.slice(0, 50).map((p: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.id}</div>
                      <div style={{ color: '#10b981', fontWeight: '700', textAlign: 'right' }}>{p.clicks.toLocaleString()}</div>
                      <div style={{ color: '#3b82f6', fontWeight: '700', textAlign: 'right' }}>{p.impressions.toLocaleString()}</div>
                      <div style={{ color: '#f59e0b', fontWeight: '700', textAlign: 'right' }}>{p.ctr}%</div>
                      <div style={{ color: '#8b5cf6', fontWeight: '700', textAlign: 'right' }}>{p.position.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Rastreamento' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Erros de Rastreamento & Indexação
              </div>
              <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🕷️</div>
                <div style={{ fontSize: '14px' }}>Sincronize um site para ver erros de rastreamento</div>
              </div>
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
