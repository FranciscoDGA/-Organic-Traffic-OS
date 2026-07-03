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
const TABS = ['Status', 'Feeds & Sitemaps', 'URLs', 'Logs'];

export default function RssSitemapConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [domain, setDomain] = useState('');
  const [connected, setConnected] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!domain) return;
    try {
      const res = await fetch(`/api/organic-os/connectors/rss-sitemap/status?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setConnected(data.data.connected);
        setLogs(data.data.logs || []);
      }
    } catch {}
  }, [domain]);

  useEffect(() => { if (domain) fetchStatus(); }, [fetchStatus, domain]);

  async function connect() {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/rss-sitemap/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', domain }),
      });
      const data = await res.json();
      if (data.success) setConnected(true);
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function syncNow() {
    if (!domain) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/organic-os/connectors/rss-sitemap/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setLogs(data.data.logs || []);
      }
      await loadUrls();
      await fetchStatus();
    } finally { setSyncing(false); }
  }

  async function loadUrls() {
    if (!domain) return;
    try {
      const res = await fetch(`/api/organic-os/connectors/rss-sitemap/urls?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (data.success && data.data) setUrls(data.data);
    } catch {}
  }

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            📡 RSS & Sitemap
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Descobre e normaliza conteúdo publicado via RSS, Atom, sitemaps e robots.txt.
          </p>
        </div>
        <span style={{ ...badge(connected ? '#10b981' : '#f59e0b'), fontSize: '12px', padding: '6px 14px' }}>
          {connected ? 'v1.0.0 — CONNECTED' : 'v1.0.0 — DISCONNECTED'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={card()}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
              Configuração
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Domínio</label>
                <input style={inputStyle} placeholder="ex: passacumaru.com.br" value={domain} onChange={e => setDomain(e.target.value)} />
              </div>
              <button onClick={connect} disabled={loading || !domain} style={{
                ...btnPrimary, opacity: loading || !domain ? 0.5 : 1, cursor: loading || !domain ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : '🔗 Conectar & Descobrir'}
              </button>
              <button onClick={syncNow} disabled={syncing || !connected} style={{
                ...btnSync, opacity: syncing || !connected ? 0.5 : 1, cursor: syncing || !connected ? 'not-allowed' : 'pointer',
              }}>
                {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Agora'}
              </button>
            </div>
          </div>

          {status && (
            <div style={card()}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
                Última Sincronização
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {status.last_sync ? new Date(status.last_sync).toLocaleString('pt-BR') : 'Nunca'}
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
                  { label: 'Conexão', value: connected ? 'Ativa' : 'Inativa', color: connected ? '#10b981' : '#ef4444' },
                  { label: 'Domínio', value: status?.domain || domain || '—', color: '#3b82f6' },
                  { label: 'Formato', value: status?.feedFormat?.toUpperCase() || '—', color: '#8b5cf6' },
                  { label: 'Última Sync', value: status?.last_sync ? new Date(status.last_sync).toLocaleDateString('pt-BR') : 'Nunca', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: s.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'URLs Total', value: status?.total_urls || 0, icon: '🔗', color: '#0ea5e9' },
                  { label: 'Posts', value: status?.posts || 0, icon: '📝', color: '#10b981' },
                  { label: 'Páginas', value: status?.pages || 0, icon: '📄', color: '#8b5cf6' },
                  { label: 'Categorias', value: (status?.categories || 0) + (status?.tags || 0), icon: '🏷️', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '20px' }), display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: s.color }}>{s.value.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Sitemaps', value: status?.sitemapsFound?.length || 0, color: '#3b82f6' },
                  { label: 'Erros', value: status?.errors?.length || 0, color: (status?.errors?.length || 0) > 0 ? '#ef4444' : '#10b981' },
                  { label: 'Warnings', value: status?.warnings?.length || 0, color: (status?.warnings?.length || 0) > 0 ? '#f59e0b' : '#10b981' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Feeds & Sitemaps' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Feeds & Sitemaps Encontrados
              </div>
              {(!status?.sitemapsFound || status.sitemapsFound.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📡</div>
                  <div style={{ fontSize: '14px' }}>Conecte e sincronize para ver feeds e sitemaps</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {status.feedUrl && (
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                      <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Feed Principal</div>
                      <div style={{ fontSize: '12px', color: '#e2e8f0', wordBreak: 'break-all' }}>{status.feedUrl}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Formato: {status.feedFormat?.toUpperCase()}</div>
                    </div>
                  )}
                  {status.sitemapsFound?.map((url: string, i: number) => (
                    <div key={i} style={{ backgroundColor: '#080b10', padding: '12px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px' }}>🗺️</span>
                      <div style={{ fontSize: '12px', color: '#e2e8f0', wordBreak: 'break-all', flex: 1 }}>{url}</div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <div style={{ ...badge('#3b82f6') }}>robots.txt: {status?.robotsFound ? '✅' : '❌'}</div>
                    <div style={{ ...badge('#8b5cf6') }}>Sitemaps: {status?.sitemapsFound?.length || 0}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'URLs' && (
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  URLs Descobertas ({urls.length})
                </div>
                <button onClick={loadUrls} style={{ ...btnPrimary, width: 'auto', padding: '6px 14px', fontSize: '11px' }}>
                  🔄 Carregar
                </button>
              </div>
              {urls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔗</div>
                  <div style={{ fontSize: '14px' }}>Sincronize para ver as URLs descobertas</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '500px', overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 60px 70px 70px', gap: '8px', padding: '6px 14px', fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                    <div>Tipo</div><div>URL</div><div>Fonte</div><div>Prioridade</div><div>Freq.</div>
                  </div>
                  {urls.slice(0, 100).map((u: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 60px 70px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '8px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div>
                        <span style={{ ...badge(u.type === 'post' ? '#10b981' : u.type === 'page' ? '#3b82f6' : '#f59e0b'), fontSize: '9px', padding: '1px 6px' }}>
                          {u.type}
                        </span>
                      </div>
                      <div style={{ color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{u.url}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>{u.source}</div>
                      <div style={{ color: '#8b5cf6', fontWeight: '700', textAlign: 'right' }}>{u.priority ?? '—'}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>{u.changefreq || '—'}</div>
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
                      borderLeft: `3px solid ${l.level === 'error' ? '#ef4444' : l.level === 'warn' ? '#f59e0b' : '#10b981'}`,
                    }}>
                      <span style={{ color: '#64748b', whiteSpace: 'nowrap', fontSize: '10px' }}>
                        {new Date(l.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                      <span style={{ ...badge(l.level === 'error' ? '#ef4444' : l.level === 'warn' ? '#f59e0b' : '#10b981'), fontSize: '9px', padding: '1px 6px' }}>
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
