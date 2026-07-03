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
  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
};
const btnSync: React.CSSProperties = {
  ...btnPrimary,
  background: 'linear-gradient(135deg, #10b981, #059669)',
  boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
};
const TABS = ['Status', 'Interesse', 'Regiões', 'Relacionados', 'Comparar', 'Sazonalidade', 'Logs'];

export default function GoogleTrendsConnectorPanel() {
  const [status, setStatus] = useState<any>(null);
  const [interest, setInterest] = useState<any>(null);
  const [regions, setRegions] = useState<any>(null);
  const [relatedQueries, setRelatedQueries] = useState<any>(null);
  const [relatedTopics, setRelatedTopics] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [seasonality, setSeasonality] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Status');
  const [term, setTerm] = useState('concurso');
  const [terms, setTerms] = useState('concurso,concurso público,edital');
  const [country, setCountry] = useState('BR');
  const [connected, setConnected] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/connectors/google-trends/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
        setLogs(data.data.logs || []);
        setConnected(data.data.connected);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function connect() {
    setLoading(true);
    try {
      await fetch('/api/organic-os/connectors/google-trends/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', mode: 'mock', country }),
      });
      await fetchStatus();
    } finally { setLoading(false); }
  }

  async function loadInterest() {
    setLoading(true);
    try {
      const res = await fetch(`/api/organic-os/connectors/google-trends/interest?term=${encodeURIComponent(term)}&country=${country}`);
      const data = await res.json();
      if (data.success) setInterest(data.data);
    } finally { setLoading(false); }
  }

  async function loadRegions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/organic-os/connectors/google-trends/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchInterestByRegion', term, country }),
      });
      const data = await res.json();
      if (data.success) setRegions(data.data);
    } finally { setLoading(false); }
  }

  async function loadRelated() {
    setLoading(true);
    try {
      const [qRes, tRes] = await Promise.all([
        fetch(`/api/organic-os/connectors/google-trends/related?term=${encodeURIComponent(term)}&country=${country}&type=queries`),
        fetch(`/api/organic-os/connectors/google-trends/related?term=${encodeURIComponent(term)}&country=${country}&type=topics`),
      ]);
      const qData = await qRes.json();
      const tData = await tRes.json();
      if (qData.success) setRelatedQueries(qData.data);
      if (tData.success) setRelatedTopics(tData.data);
    } finally { setLoading(false); }
  }

  async function loadComparison() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/google-trends/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms: terms.split(',').map(t => t.trim()), country }),
      });
      const data = await res.json();
      if (data.success) setComparison(data.data);
    } finally { setLoading(false); }
  }

  async function loadSeasonality() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/connectors/google-trends/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'detectSeasonality', term, country }),
      });
      const data = await res.json();
      if (data.success) setSeasonality(data.data);
    } finally { setLoading(false); }
  }

  async function syncAll() {
    setSyncing(true);
    try {
      const termList = terms.split(',').map(t => t.trim());
      const res = await fetch('/api/organic-os/connectors/google-trends/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', terms: termList, country }),
      });
      const data = await res.json();
      await fetchStatus();
    } finally { setSyncing(false); }
  }

  const trendColor = (t: string) => t === 'rising' ? '#10b981' : t === 'declining' ? '#ef4444' : '#f59e0b';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            📈 Google Trends
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Tendências, crescimento de interesse, sazonalidade e consultas relacionadas. Mock Adapter.
          </p>
        </div>
        <span style={{ ...badge(connected ? '#10b981' : '#f59e0b'), fontSize: '12px', padding: '6px 14px' }}>
          {connected ? 'v1.0.0 — ACTIVE (MOCK)' : 'v1.0.0 — IDLE'}
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
                <label style={labelStyle}>Termo Principal</label>
                <input style={inputStyle} value={term} onChange={e => setTerm(e.target.value)} placeholder="ex: concurso" />
              </div>
              <div>
                <label style={labelStyle}>Termos para Comparação (vírgula)</label>
                <input style={inputStyle} value={terms} onChange={e => setTerms(e.target.value)} placeholder="concurso,edital,licitação" />
              </div>
              <div>
                <label style={labelStyle}>País</label>
                <select style={inputStyle} value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                </select>
              </div>
              <button onClick={connect} disabled={loading || connected} style={{
                ...btnPrimary, opacity: loading || connected ? 0.5 : 1, cursor: loading || connected ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Conectando...' : connected ? 'Conectado (Mock)' : '🔌 Conectar'}
              </button>
              <button onClick={syncAll} disabled={syncing || !connected} style={{
                ...btnSync, opacity: syncing || !connected ? 0.5 : 1, cursor: syncing || !connected ? 'not-allowed' : 'pointer',
              }}>
                {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Tudo'}
              </button>
            </div>
          </div>

          <div style={card()}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
              Ações Rápidas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={loadInterest} disabled={!connected} style={{ ...btnPrimary, fontSize: '12px', padding: '8px', opacity: connected ? 1 : 0.5 }}>
                📊 Carregar Interesse
              </button>
              <button onClick={loadRegions} disabled={!connected} style={{ ...btnPrimary, fontSize: '12px', padding: '8px', opacity: connected ? 1 : 0.5 }}>
                🗺️ Carregar Regiões
              </button>
              <button onClick={loadRelated} disabled={!connected} style={{ ...btnPrimary, fontSize: '12px', padding: '8px', opacity: connected ? 1 : 0.5 }}>
                🔗 Carregar Relacionados
              </button>
              <button onClick={loadComparison} disabled={!connected} style={{ ...btnPrimary, fontSize: '12px', padding: '8px', opacity: connected ? 1 : 0.5 }}>
                ⚖️ Comparar Termos
              </button>
              <button onClick={loadSeasonality} disabled={!connected} style={{ ...btnPrimary, fontSize: '12px', padding: '8px', opacity: connected ? 1 : 0.5 }}>
                📅 Detectar Sazonalidade
              </button>
            </div>
          </div>
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
                  { label: 'Modo', value: status?.mode?.toUpperCase() || 'MOCK', color: '#8b5cf6' },
                  { label: 'Termos', value: status?.terms_monitored || 0, color: '#3b82f6' },
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
                  { label: 'Registros Interesse', value: status?.total_interest_records || 0, icon: '📈' },
                  { label: 'Registros Relacionados', value: status?.total_related_records || 0, icon: '🔗' },
                  { label: 'Última Sync', value: status?.last_sync ? new Date(status.last_sync).toLocaleDateString('pt-BR') : 'Nunca', icon: '🕐' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '20px' }), display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#e2e8f0' }}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Interesse' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Interesse ao Longo do Tempo — {term}
              </div>
              {!interest ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📈</div>
                  <div style={{ fontSize: '14px' }}>Clique em "Carregar Interesse" para ver os dados</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#e2e8f0' }}>{interest.average}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Média</div>
                    </div>
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#e2e8f0' }}>{interest.peak}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Pico</div>
                    </div>
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: trendColor(interest.trend) }}>{interest.trend?.toUpperCase()}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Tendência</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {interest.timelineData?.slice(-6).map((point: any, i: number) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 50px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '8px 14px', borderRadius: '6px', fontSize: '12px' }}>
                        <div style={{ color: '#94a3b8' }}>{point.date}</div>
                        <div style={{ height: '8px', backgroundColor: '#1d2133', borderRadius: '4px' }}>
                          <div style={{ height: '100%', width: `${point.value}%`, backgroundColor: '#8b5cf6', borderRadius: '4px' }} />
                        </div>
                        <div style={{ color: '#e2e8f0', fontWeight: '700', textAlign: 'right' }}>{point.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Regiões' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Interesse por Região — {term}
              </div>
              {!regions ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🗺️</div>
                  <div style={{ fontSize: '14px' }}>Clique em "Carregar Regiões" para ver os dados</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {regions.regions?.map((r: any, i: number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 60px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ color: '#64748b', fontWeight: '700' }}>#{i + 1}</div>
                      <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{r.region}</div>
                      <div style={{ height: '6px', backgroundColor: '#1d2133', borderRadius: '4px' }}>
                        <div style={{ height: '100%', width: `${r.value}%`, backgroundColor: '#8b5cf6', borderRadius: '4px' }} />
                      </div>
                      <div style={{ color: '#e2e8f0', fontWeight: '700', textAlign: 'right' }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Relacionados' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={card()}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Consultas Relacionadas — {term}
                </div>
                {!relatedQueries ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔗</div>
                    <div style={{ fontSize: '14px' }}>Clique em "Carregar Relacionados"</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>EM ALTA (RISING)</div>
                      {relatedQueries.rising?.map((q: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#080b10', padding: '8px 12px', borderRadius: '6px', marginBottom: '4px', fontSize: '12px', borderLeft: '3px solid #10b981' }}>
                          <div style={{ color: '#e2e8f0' }}>{q.query}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>Score: {q.value}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>TOP</div>
                      {relatedQueries.top?.map((q: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#080b10', padding: '8px 12px', borderRadius: '6px', marginBottom: '4px', fontSize: '12px', borderLeft: '3px solid #f59e0b' }}>
                          <div style={{ color: '#e2e8f0' }}>{q.query}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>Score: {q.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={card()}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Tópicos Relacionados — {term}
                </div>
                {!relatedTopics ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>Sem dados</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>EM ALTA</div>
                      {relatedTopics.rising?.map((t: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#080b10', padding: '8px 12px', borderRadius: '6px', marginBottom: '4px', fontSize: '12px', borderLeft: '3px solid #10b981' }}>
                          <div style={{ color: '#e2e8f0' }}>{t.topic}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>Score: {t.value}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>TOP</div>
                      {relatedTopics.top?.map((t: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#080b10', padding: '8px 12px', borderRadius: '6px', marginBottom: '4px', fontSize: '12px', borderLeft: '3px solid #f59e0b' }}>
                          <div style={{ color: '#e2e8f0' }}>{t.topic}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>Score: {t.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Comparar' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Comparação de Termos
              </div>
              {!comparison ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>⚖️</div>
                  <div style={{ fontSize: '14px' }}>Configure termos e clique em "Comparar Termos"</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: '#10b98118', padding: '14px', borderRadius: '8px', border: '1px solid #10b98130' }}>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginBottom: '4px' }}>VENCEDOR</div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>{comparison.winner}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${comparison.terms.length}, 1fr)`, gap: '12px' }}>
                    {comparison.terms.map((t: string, i: number) => (
                      <div key={i} style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center', borderLeft: `3px solid ${i === comparison.terms.indexOf(comparison.winner) ? '#10b981' : '#6366f1'}` }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0', marginBottom: '8px' }}>{t}</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#e2e8f0' }}>{comparison.average[i]}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Média</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#8b5cf6', marginTop: '4px' }}>Pico: {comparison.peak[i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Sazonalidade' && (
            <div style={card()}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Análise de Sazonalidade — {term}
              </div>
              {!seasonality ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📅</div>
                  <div style={{ fontSize: '14px' }}>Clique em "Detectar Sazonalidade"</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>MÊS PICO</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>{seasonality.peakMonth}</div>
                    </div>
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>MÊS BAIXO</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#ef4444' }}>{seasonality.lowMonth}</div>
                    </div>
                    <div style={{ backgroundColor: '#080b10', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>FORÇA SAZONAL</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#8b5cf6' }}>{seasonality.seasonalStrength}%</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {seasonality.pattern?.map((m: any, i: number) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 50px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '8px 14px', borderRadius: '6px', fontSize: '12px' }}>
                        <div style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{m.month}</div>
                        <div style={{ height: '8px', backgroundColor: '#1d2133', borderRadius: '4px' }}>
                          <div style={{ height: '100%', width: `${m.avgValue}%`, backgroundColor: m.month === seasonality.peakMonth ? '#10b981' : m.month === seasonality.lowMonth ? '#ef4444' : '#8b5cf6', borderRadius: '4px' }} />
                        </div>
                        <div style={{ color: '#e2e8f0', fontWeight: '700', textAlign: 'right' }}>{m.avgValue}</div>
                      </div>
                    ))}
                  </div>
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
