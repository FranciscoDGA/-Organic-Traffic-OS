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
  ...inputStyle, minHeight: '120px', resize: 'vertical' as const,
};
const btnPrimary: React.CSSProperties = {
  width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
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
const btnPublish: React.CSSProperties = {
  ...btnPrimary,
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
};
const TABS = ['Status', 'Posts', 'Criar Rascunho', 'Categorias & Tags', 'Logs'];

export default function WordpressConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [connected, setConnected] = useState(false);

  const [draftTitle, setDraftTitle] = useState('');
  const [draftSlug, setDraftSlug] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/connectors/wordpress/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setConnected(data.data.connected);
        setLogs(data.data.logs || []);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function connect() {
    if (!siteUrl || !username || !appPassword) return;
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/wordpress/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', site_url: siteUrl, username, app_password: appPassword }),
      });
      const data = await res.json();
      if (data.success) setConnected(true);
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function syncNow() {
    setSyncing(true);
    try {
      const res = await fetch('/api/organic-os/connectors/wordpress/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setPosts(data.data.posts || []);
        setCategories(data.data.categories || []);
        setTags(data.data.tags || []);
        setLogs(data.data.logs || []);
      }
    } finally { setSyncing(false); }
  }

  async function createDraft() {
    if (!draftTitle || !draftSlug || !draftContent) return;
    setCreatingDraft(true);
    try {
      const res = await fetch('/api/organic-os/connectors/wordpress/create-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: draftTitle, slug: draftSlug, content: draftContent, excerpt: draftExcerpt }),
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
            📝 WordPress
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Publica rascunhos e gerencia posts via WordPress REST API.
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
              Autenticação
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Site URL</label>
                <input style={inputStyle} placeholder="https://meusite.com.br" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Usuário</label>
                <input style={inputStyle} placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Application Password</label>
                <input style={inputStyle} type="password" placeholder="xxxx xxxx xxxx xxxx" value={appPassword} onChange={e => setAppPassword(e.target.value)} />
              </div>
              <button onClick={connect} disabled={loading || connected} style={{
                ...btnPrimary, opacity: loading || connected ? 0.5 : 1, cursor: loading || connected ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : connected ? 'Conectado' : '🔗 Conectar ao WordPress'}
              </button>
              {connected && (
                <button onClick={async () => { await fetch('/api/organic-os/connectors/wordpress/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) }); setConnected(false); await fetchStatus(); }} style={{ ...btnDanger, fontSize: '12px', padding: '8px' }}>
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
                backgroundColor: activeTab === tab ? '#8b5cf6' : 'transparent',
                color: activeTab === tab ? '#fff' : '#64748b',
              }}>{tab}</button>
            ))}
          </div>

          {activeTab === 'Status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Conexão', value: connected ? 'Ativa' : 'Inativa', color: connected ? '#10b981' : '#ef4444' },
                  { label: 'Site', value: status?.site_url || '—', color: '#3b82f6' },
                  { label: 'Última Sync', value: status?.timestamp ? new Date(status.timestamp).toLocaleDateString('pt-BR') : 'Nunca', color: '#f59e0b' },
                  { label: 'Posts', value: status?.total_posts || 0, color: '#8b5cf6' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: s.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Posts', value: status?.total_posts || 0, icon: '📝', color: '#8b5cf6' },
                  { label: 'Categorias', value: status?.total_categories || 0, icon: '📂', color: '#10b981' },
                  { label: 'Tags', value: status?.total_tags || 0, icon: '🏷️', color: '#f59e0b' },
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
            </div>
          )}

          {activeTab === 'Posts' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Posts Recentes
              </div>
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📝</div>
                  <div style={{ fontSize: '14px' }}>Sincronize para ver os posts</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {posts.slice(0, 30).map((p: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title?.rendered || 'Sem título'}</div>
                      <div><span style={{ ...badge(p.status === 'publish' ? '#10b981' : p.status === 'draft' ? '#f59e0b' : '#64748b'), fontSize: '9px', padding: '1px 6px' }}>{p.status}</span></div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>{p.date ? new Date(p.date).toLocaleDateString('pt-BR') : '—'}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>#{p.id}</div>
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
                  <label style={labelStyle}>Título *</label>
                  <input style={inputStyle} placeholder="Título do post" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Slug *</label>
                  <input style={inputStyle} placeholder="slug-do-post" value={draftSlug} onChange={e => setDraftSlug(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Conteúdo * (HTML)</label>
                  <textarea style={textareaStyle} placeholder="<p>Conteúdo do post...</p>" value={draftContent} onChange={e => setDraftContent(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Excerpt</label>
                  <textarea style={{ ...textareaStyle, minHeight: '60px' }} placeholder="Resumo do post" value={draftExcerpt} onChange={e => setDraftExcerpt(e.target.value)} />
                </div>
                <button onClick={createDraft} disabled={creatingDraft || !draftTitle || !draftSlug || !draftContent} style={{
                  ...btnPrimary, opacity: creatingDraft || !draftTitle || !draftSlug || !draftContent ? 0.5 : 1, cursor: creatingDraft ? 'not-allowed' : 'pointer',
                }}>
                  {creatingDraft ? '⏳ Criando...' : '📝 Criar Rascunho'}
                </button>
                {draftResult && (
                  <div style={{ ...card({ padding: '14px', borderLeft: `4px solid ${draftResult.success ? '#10b981' : '#ef4444'}` }) }}>
                    {draftResult.success ? (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>Rascunho criado!</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {draftResult.data.id} | Slug: {draftResult.data.slug} | Status: {draftResult.data.status}</div>
                        <a href={draftResult.data.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#8b5cf6', textDecoration: 'underline' }}>Ver no WordPress →</a>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#ef4444' }}>{draftResult.error}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Categorias & Tags' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={card()}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Categorias ({categories.length})
                </div>
                {categories.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#3d4461', fontSize: '13px' }}>Nenhuma categoria</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '400px', overflowY: 'auto' }}>
                    {categories.map((c: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#080b10', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{c.name}</span>
                        <span style={{ color: '#64748b', fontSize: '10px' }}>{c.count} posts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={card()}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Tags ({tags.length})
                </div>
                {tags.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#3d4461', fontSize: '13px' }}>Nenhuma tag</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '400px', overflowY: 'auto' }}>
                    {tags.map((t: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#080b10', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{t.name}</span>
                        <span style={{ color: '#64748b', fontSize: '10px' }}>{t.count} posts</span>
                      </div>
                    ))}
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
