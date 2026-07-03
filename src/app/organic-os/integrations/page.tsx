"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});
const btnPrimary: React.CSSProperties = {
  padding: '8px 16px', border: 'none', borderRadius: '8px', color: '#fff',
  fontSize: '12px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
  boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
};

type Connector = {
  id: string; name: string; provider: string; type: string;
  status: string; has_env_vars: boolean; env_vars: string[];
  api_routes: string[]; panel_path: string; capabilities: string[];
};

export default function IntegrationsPanel() {
  const [data, setData] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [intRes, healthRes] = await Promise.all([
        fetch('/api/organic-os/integrations'),
        fetch('/api/organic-os/integrations/health'),
      ]);
      const intData = await intRes.json();
      const healthData = await healthRes.json();
      if (intData.success) setData(intData.data);
      if (healthData.success) setHealth(healthData.data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function testConnector(id: string) {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/organic-os/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connector: id }),
      });
      const result = await res.json();
      if (result.success) setTestResult(result.data);
    } finally { setTesting(false); }
  }

  const statusColor = (s: string) => s === 'configured' ? '#10b981' : s === 'mock' ? '#f59e0b' : '#ef4444';
  const statusLabel = (s: string) => s === 'configured' ? 'CONFIGURADO' : s === 'mock' ? 'MOCK' : 'SEM CREDENCIAIS';
  const healthColor = (s: string) => s === 'healthy' ? '#10b981' : s === 'degraded' ? '#f59e0b' : '#ef4444';

  if (loading) {
    return (
      <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Carregando integrações...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🔌 Integrações
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Visão consolidada de todos os Connectors do Epic 04.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Epic 04 — {data?.summary?.total || 0} connectors</span>
          <button onClick={fetchData} style={{ ...btnPrimary, fontSize: '11px', padding: '6px 12px' }}>🔄 Atualizar</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Total', value: data?.summary?.total || 0, color: '#e2e8f0', icon: '🔌' },
          { label: 'Configurados', value: data?.summary?.configured || 0, color: '#10b981', icon: '✅' },
          { label: 'Mock', value: data?.summary?.mock || 0, color: '#f59e0b', icon: '⚠️' },
          { label: 'Sem Credenciais', value: data?.summary?.missing_credentials || 0, color: '#ef4444', icon: '🔑' },
          { label: 'Health', value: health?.overall || '—', color: healthColor(health?.overall || ''), icon: '🛡️' },
        ].map((s, i) => (
          <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Health Checks */}
      {health && (
        <div style={{ ...card({ marginBottom: '24px', borderLeft: `4px solid ${healthColor(health.overall)}` }) }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Health Check
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {health.checks?.map((c: any, i: number) => (
              <div key={i} style={{ backgroundColor: '#080b10', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>{c.connector}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: healthColor(c.status) }}>{c.status.toUpperCase()}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{c.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connector Groups */}
      {['data', 'publishing', 'newsletter'].map(type => {
        const group = data?.groups?.[type] || [];
        if (group.length === 0) return null;
        const typeLabel = type === 'data' ? '📥 Data Connectors' : type === 'publishing' ? '📤 Publishing Connectors' : '✉️ Newsletter Connectors';
        return (
          <div key={type} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#c7d2fe', marginBottom: '12px' }}>{typeLabel}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '12px' }}>
              {group.map((c: Connector) => (
                <div key={c.id} style={{ ...card({ padding: '16px' }), borderLeft: `4px solid ${statusColor(c.status)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>{c.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Provider: {c.provider}</div>
                    </div>
                    <span style={badge(statusColor(c.status))}>{statusLabel(c.status)}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {c.capabilities.slice(0, 4).map((cap, i) => (
                      <span key={i} style={{ fontSize: '9px', color: '#818cf8', backgroundColor: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {c.capabilities.length > 4 && <span style={{ fontSize: '9px', color: '#64748b' }}>+{c.capabilities.length - 4}</span>}
                  </div>

                  {c.env_vars.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Env Vars</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {c.env_vars.map((v, i) => (
                          <span key={i} style={{ fontSize: '9px', color: process.env[v] ? '#10b981' : '#ef4444', backgroundColor: process.env[v] ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {process.env[v] ? '✅' : '❌'} {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <Link href={c.panel_path} style={{ ...btnPrimary, fontSize: '10px', padding: '5px 10px', textDecoration: 'none', textAlign: 'center' }}>
                      Abrir Painel
                    </Link>
                    <button onClick={() => testConnector(c.id)} disabled={testing} style={{ ...btnPrimary, fontSize: '10px', padding: '5px 10px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                      {testing ? '...' : 'Testar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Test Result */}
      {testResult && (
        <div style={{ ...card({ marginTop: '24px', borderLeft: `4px solid ${testResult.result === 'available' || testResult.result === 'credentials_available' ? '#10b981' : '#f59e0b'}` }) }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Resultado do Teste — {testResult.name}
          </div>
          <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>{testResult.message}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Tipo: {testResult.test} | Resultado: {testResult.result}</div>
        </div>
      )}

      {/* E2E Flow */}
      <div style={{ ...card({ marginTop: '24px' }) }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Fluxo E2E — Pipeline de Dados
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px' }}>
          {['Search Console', 'GA4', 'Trends', 'Bing', 'RSS'].map((s, i) => (
            <React.Fragment key={s}>
              <span style={{ backgroundColor: '#080b10', padding: '6px 12px', borderRadius: '6px', color: '#0ea5e9', fontWeight: '700' }}>{s}</span>
              {i < 4 && <span style={{ color: '#3d4461' }}>→</span>}
            </React.Fragment>
          ))}
          <span style={{ color: '#3d4461' }}>→</span>
          <span style={{ backgroundColor: '#080b10', padding: '6px 12px', borderRadius: '6px', color: '#8b5cf6', fontWeight: '700' }}>Dados Normalizados</span>
          <span style={{ color: '#3d4461' }}>→</span>
          <span style={{ backgroundColor: '#080b10', padding: '6px 12px', borderRadius: '6px', color: '#f59e0b', fontWeight: '700' }}>Engines</span>
          <span style={{ color: '#3d4461' }}>→</span>
          <span style={{ backgroundColor: '#080b10', padding: '6px 12px', borderRadius: '6px', color: '#10b981', fontWeight: '700' }}>Agents</span>
          <span style={{ color: '#3d4461' }}>→</span>
          <span style={{ backgroundColor: '#080b10', padding: '6px 12px', borderRadius: '6px', color: '#06b6d4', fontWeight: '700' }}>Publishing</span>
          <span style={{ color: '#3d4461' }}>→</span>
          {['WordPress', 'Headless', 'Newsletter'].map((s, i) => (
            <React.Fragment key={s}>
              <span style={{ backgroundColor: '#080b10', padding: '6px 12px', borderRadius: '6px', color: '#f43f5e', fontWeight: '700' }}>{s}</span>
              {i < 2 && <span style={{ color: '#3d4461', fontSize: '10px' }}>/</span>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '10px' }}>
          ⚠️ Nenhum conteúdo é publicado automaticamente. Todos os outputs são criados como rascunho.
        </div>
      </div>
    </div>
  );
}
