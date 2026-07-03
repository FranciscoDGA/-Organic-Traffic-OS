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
  background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  boxShadow: '0 4px 20px rgba(244,63,94,0.35)',
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
const TABS = ['Status', 'Audiências', 'Campanhas', 'Criar Rascunho', 'Logs'];
const PROVIDERS = [
  { value: 'mock', label: 'Mock (Desenvolvimento)' },
  { value: 'brevo', label: 'Brevo' },
  { value: 'mailchimp', label: 'Mailchimp' },
  { value: 'resend', label: 'Resend' },
  { value: 'convertkit', label: 'ConvertKit' },
];

export default function NewsletterConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [audiences, setAudiences] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [provider, setProvider] = useState('mock');
  const [apiKey, setApiKey] = useState('');
  const [connected, setConnected] = useState(false);

  const [draftSubject, setDraftSubject] = useState('');
  const [draftPreheader, setDraftPreheader] = useState('');
  const [draftBodyHtml, setDraftBodyHtml] = useState('');
  const [draftBodyText, setDraftBodyText] = useState('');
  const [draftCtaLabel, setDraftCtaLabel] = useState('Ler mais');
  const [draftCtaUrl, setDraftCtaUrl] = useState('');
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/connectors/newsletter/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setConnected(data.data.connected);
        setLogs(data.data.logs || []);
        setAudiences(data.data.audiences || []);
        setCampaigns(data.data.campaigns || []);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function connect() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/newsletter/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', provider, api_key: apiKey }),
      });
      const data = await res.json();
      if (data.success) setConnected(true);
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function syncNow() {
    setSyncing(true);
    try {
      const res = await fetch('/api/organic-os/connectors/newsletter/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setAudiences(data.data.audiences || []);
        setCampaigns(data.data.campaigns || []);
        setLogs(data.data.logs || []);
      }
    } finally { setSyncing(false); }
  }

  async function createDraft() {
    if (!draftSubject || !draftPreheader || !draftBodyHtml || !draftBodyText) return;
    setCreatingDraft(true);
    try {
      const res = await fetch('/api/organic-os/connectors/newsletter/create-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: draftSubject, preheader: draftPreheader,
          body_html: draftBodyHtml, body_text: draftBodyText,
          cta: { label: draftCtaLabel, url: draftCtaUrl },
        }),
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
            ✉️ Newsletter
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Transforma conteúdos em campanhas de e-mail/newsletter como rascunhos.
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
                <div>
                  <label style={labelStyle}>API Key</label>
                  <input style={inputStyle} type="password" placeholder="Sua API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                </div>
              )}
              <button onClick={connect} disabled={loading || connected} style={{
                ...btnPrimary, opacity: loading || connected ? 0.5 : 1, cursor: loading || connected ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : connected ? 'Conectado' : '🔗 Conectar'}
              </button>
              {connected && (
                <button onClick={async () => { await fetch('/api/organic-os/connectors/newsletter/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) }); setConnected(false); await fetchStatus(); }} style={{ ...btnDanger, fontSize: '12px', padding: '8px' }}>
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

          <div style={{ ...card({ borderLeft: '4px solid #ef4444' }) }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              🚫 Envio Bloqueado
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              Envio real de e-mails está bloqueado nesta versão. Apenas criação de rascunhos.
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#f43f5e' : 'transparent',
                color: activeTab === tab ? '#fff' : '#64748b',
              }}>{tab}</button>
            ))}
          </div>

          {activeTab === 'Status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Conexão', value: connected ? 'Ativa' : 'Inativa', color: connected ? '#10b981' : '#ef4444' },
                  { label: 'Provider', value: status?.provider?.toUpperCase() || '—', color: '#f43f5e' },
                  { label: 'Audiências', value: status?.total_audiences || 0, color: '#8b5cf6' },
                  { label: 'Campanhas', value: status?.total_campaigns || 0, color: '#f59e0b' },
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
                    Este connector está usando dados simulados para desenvolvimento.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Audiências' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Audiências / Listas ({audiences.length})
              </div>
              {audiences.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>👥</div>
                  <div style={{ fontSize: '14px' }}>Conecte e sincronize para ver audiências</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {audiences.map((a: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#080b10', padding: '12px 14px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>ID: {a.id}</div>
                      </div>
                      <span style={{ ...badge('#8b5cf6') }}>{a.count} contatos</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Campanhas' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Campanhas Recentes ({campaigns.length})
              </div>
              {campaigns.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>✉️</div>
                  <div style={{ fontSize: '14px' }}>Nenhuma campanha encontrada</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {campaigns.map((c: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject || 'Sem assunto'}</div>
                      <div><span style={{ ...badge(c.status === 'sent' ? '#10b981' : c.status === 'draft' ? '#f59e0b' : '#64748b'), fontSize: '9px', padding: '1px 6px' }}>{c.status}</span></div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : '—'}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>#{c.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Criar Rascunho' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Criar Rascunho de Campanha
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Assunto *</label>
                  <input style={inputStyle} placeholder="Assunto do e-mail" value={draftSubject} onChange={e => setDraftSubject(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Preheader *</label>
                  <input style={inputStyle} placeholder="Texto de preview no inbox" value={draftPreheader} onChange={e => setDraftPreheader(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Corpo HTML *</label>
                  <textarea style={textareaStyle} placeholder="<p>Conteúdo do e-mail...</p>" value={draftBodyHtml} onChange={e => setDraftBodyHtml(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Corpo Texto *</label>
                  <textarea style={{ ...textareaStyle, minHeight: '60px' }} placeholder="Versão em texto puro" value={draftBodyText} onChange={e => setDraftBodyText(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>CTA Label</label>
                    <input style={inputStyle} placeholder="Ler mais" value={draftCtaLabel} onChange={e => setDraftCtaLabel(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>CTA URL</label>
                    <input style={inputStyle} placeholder="https://..." value={draftCtaUrl} onChange={e => setDraftCtaUrl(e.target.value)} />
                  </div>
                </div>
                <button onClick={createDraft} disabled={creatingDraft || !draftSubject || !draftPreheader || !draftBodyHtml || !draftBodyText} style={{
                  ...btnPrimary, opacity: creatingDraft || !draftSubject || !draftPreheader || !draftBodyHtml || !draftBodyText ? 0.5 : 1, cursor: creatingDraft ? 'not-allowed' : 'pointer',
                }}>
                  {creatingDraft ? '⏳ Criando...' : '✉️ Criar Rascunho'}
                </button>
                {draftResult && (
                  <div style={{ ...card({ padding: '14px', borderLeft: `4px solid ${draftResult.success ? '#10b981' : '#ef4444'}` }) }}>
                    {draftResult.success ? (
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
                        Rascunho criado! ID: {draftResult.data.id} | Assunto: {draftResult.data.subject}
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
