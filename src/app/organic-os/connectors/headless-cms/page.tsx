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
const textareaStyle: React.CSSProperties = {
  ...inputStyle, minHeight: '100px', resize: 'vertical' as const,
};
const btnPrimary: React.CSSProperties = {
  width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  boxShadow: '0 4px 20px rgba(6,182,212,0.35)',
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
const TABS = ['Status', 'Collections', 'Conteúdo', 'Criar Rascunho', 'Logs'];
const PROVIDERS = [
  { value: 'mock', label: 'Mock (Desenvolvimento)' },
  { value: 'strapi', label: 'Strapi' },
  { value: 'directus', label: 'Directus' },
  { value: 'sanity', label: 'Sanity' },
];

export default function HeadlessCmsConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [provider, setProvider] = useState('mock');
  const [apiUrl, setApiUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('posts');

  const [draftTitle, setDraftTitle] = useState('');
  const [draftSlug, setDraftSlug] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/connectors/headless-cms/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setConnected(data.data.connected);
        setLogs(data.data.logs || []);
        setCollections(data.data.collections || []);
        setContent(data.data.content || []);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function connect() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/headless-cms/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', provider, api_url: apiUrl, api_token: apiToken }),
      });
      const data = await res.json();
      if (data.success) setConnected(true);
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function syncNow() {
    setSyncing(true);
    try {
      const res = await fetch('/api/organic-os/connectors/headless-cms/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setCollections(data.data.collections || []);
        setContent(data.data.content || []);
        setLogs(data.data.logs || []);
      }
    } finally { setSyncing(false); }
  }

  async function loadContent() {
    try {
      const res = await fetch(`/api/organic-os/connectors/headless-cms/content?collection=${encodeURIComponent(selectedCollection)}`);
      const data = await res.json();
      if (data.success && data.data) setContent(data.data);
    } catch {}
  }

  async function createDraft() {
    if (!draftTitle || !draftSlug || !draftContent) return;
    setCreatingDraft(true);
    try {
      const res = await fetch('/api/organic-os/connectors/headless-cms/create-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: draftTitle, slug: draftSlug, content: draftContent, excerpt: draftExcerpt, collection: selectedCollection }),
      });
      const data = await res.json();
      setDraftResult(data);
    } finally { setCreatingDraft(false); }
  }

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            ⚡ Headless CMS
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Conectores base para Strapi, Directus, Sanity e Mock.
          </p>
        </div>
        <span style={{ ...badge(connected ? '#10b981' : '#f59e0b'), fontSize: '12px', padding: '6px 14px' }}>
          {connected ? `v1.0.0 — ${provider.toUpperCase()}` : 'v1.0.0 — DISCONNECTED'}
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
                <label style={labelStyle}>Provider</label>
                <select style={inputStyle} value={provider} onChange={e => setProvider(e.target.value)}>
                  {PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              {provider !== 'mock' && (
                <>
                  <div>
                    <label style={labelStyle}>API URL</label>
                    <input style={inputStyle} placeholder="https://cms.example.com" value={apiUrl} onChange={e => setApiUrl(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>API Token</label>
                    <input style={inputStyle} type="password" placeholder="Seu token de acesso" value={apiToken} onChange={e => setApiToken(e.target.value)} />
                  </div>
                </>
              )}
              <button onClick={connect} disabled={loading || connected} style={{
                ...btnPrimary, opacity: loading || connected ? 0.5 : 1, cursor: loading || connected ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : connected ? 'Conectado' : '🔗 Conectar'}
              </button>
              {connected && (
                <button onClick={async () => { await fetch('/api/organic-os/connectors/headless-cms/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) }); setConnected(false); await fetchStatus(); }} style={{ ...btnDanger, fontSize: '12px', padding: '8px' }}>
                  Desconectar
                </button>
              )}
            </div>
          </div>

          {connected && (
            <div style={card()}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
                Sincronização
              </div>
              <button onClick={syncNow} disabled={syncing} style={{
                ...btnSync, opacity: syncing ? 0.5 : 1, cursor: syncing ? 'not-allowed' : 'pointer',
              }}>
                {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Tudo'}
              </button>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#06b6d4' : 'transparent',
                color: activeTab === tab ? '#fff' : '#64748b',
              }}>{tab}</button>
            ))}
          </div>

          {activeTab === 'Status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Conexão', value: connected ? 'Ativa' : 'Inativa', color: connected ? '#10b981' : '#ef4444' },
                  { label: 'Provider', value: status?.provider?.toUpperCase() || '—', color: '#06b6d4' },
                  { label: 'Collections', value: status?.total_collections || 0, color: '#8b5cf6' },
                  { label: 'Conteúdo', value: status?.total_content || 0, color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: s.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {provider === 'mock' && (
                <div style={{ ...card({ borderLeft: '4px solid #f59e0b' }) }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    ⚠️ Modo Mock Ativo
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Este connector está usando dados simulados para desenvolvimento. Para conectar a um CMS real, selecione Strapi, Directus ou Sanity e configure as credenciais.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Collections' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Collections Disponíveis
              </div>
              {collections.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📦</div>
                  <div style={{ fontSize: '14px' }}>Conecte e sincronize para ver collections</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {collections.map((c: any, i: number) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: '#080b10', padding: '12px 14px', borderRadius: '8px',
                      borderLeft: `3px solid ${selectedCollection === c.uid ? '#06b6d4' : '#1d2133'}`,
                      cursor: 'pointer',
                    }} onClick={() => { setSelectedCollection(c.uid); loadContent(); }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>UID: {c.uid}</div>
                      </div>
                      {selectedCollection === c.uid && <span style={badge('#06b6d4')}>SELECIONADO</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Conteúdo' && (
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Conteúdo — {selectedCollection} ({content.length})
                </div>
                <button onClick={loadContent} style={{ ...btnPrimary, width: 'auto', padding: '6px 14px', fontSize: '11px' }}>
                  🔄 Carregar
                </button>
              </div>
              {content.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📄</div>
                  <div style={{ fontSize: '14px' }}>Nenhum conteúdo encontrado</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {content.map((item: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Sem título'}</div>
                      <div><span style={{ ...badge(item.status === 'published' ? '#10b981' : '#f59e0b'), fontSize: '9px', padding: '1px 6px' }}>{item.status}</span></div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>{item.slug || '—'}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>#{item.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Criar Rascunho' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Criar Rascunho
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Collection</label>
                  <select style={inputStyle} value={selectedCollection} onChange={e => setSelectedCollection(e.target.value)}>
                    {collections.map(c => <option key={c.uid} value={c.uid}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Título *</label>
                  <input style={inputStyle} placeholder="Título do conteúdo" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Slug *</label>
                  <input style={inputStyle} placeholder="slug-do-conteudo" value={draftSlug} onChange={e => setDraftSlug(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Conteúdo * (HTML/Markdown)</label>
                  <textarea style={textareaStyle} placeholder="<p>Conteúdo...</p>" value={draftContent} onChange={e => setDraftContent(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Excerpt</label>
                  <input style={inputStyle} placeholder="Resumo" value={draftExcerpt} onChange={e => setDraftExcerpt(e.target.value)} />
                </div>
                <button onClick={createDraft} disabled={creatingDraft || !draftTitle || !draftSlug || !draftContent} style={{
                  ...btnPrimary, opacity: creatingDraft || !draftTitle || !draftSlug || !draftContent ? 0.5 : 1, cursor: creatingDraft ? 'not-allowed' : 'pointer',
                }}>
                  {creatingDraft ? '⏳ Criando...' : '📝 Criar Rascunho'}
                </button>
                {draftResult && (
                  <div style={{ ...card({ padding: '14px', borderLeft: `4px solid ${draftResult.success ? '#10b981' : '#ef4444'}` }) }}>
                    {draftResult.success ? (
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
                        Rascunho criado! ID: {draftResult.data.id} | Slug: {draftResult.data.slug}
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#ef4444' }}>{draftResult.error}</div>
                    )}
                  </div>
                )}
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
