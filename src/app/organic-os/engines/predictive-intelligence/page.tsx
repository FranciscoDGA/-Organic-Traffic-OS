"use client";
import React, { useState, useEffect, useCallback } from 'react';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px', padding: '24px', ...extra,
});
const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px',
  fontSize: '11px', fontWeight: '700', backgroundColor: color + '18', color, border: `1px solid ${color}30`,
});
const scoreGauge = (value: number, label: string, color: string) => (
  <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }), flex: 1, minWidth: '100px' }}>
    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 8px' }}>
      <svg viewBox="0 0 36 36" style={{ width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1d2133" strokeWidth="3" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${value}, 100`} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '18px', fontWeight: '900', color }}>{value}</div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
  </div>
);
const btnPrimary: React.CSSProperties = {
  width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  background: 'linear-gradient(135deg, #ec4899, #f472b6)',
  boxShadow: '0 4px 20px rgba(236,72,153,0.35)',
};
const TABS = ['Overview', 'Previsões', 'Cenários', 'Riscos', 'Refresh', 'Recomendações', 'Análise'];

export default function PredictiveIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [inputJson, setInputJson] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/predictive-intelligence');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch {}
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/predictive-intelligence/recommendations');
      const data = await res.json();
      if (data.success) setRecommendations(data.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); fetchRecommendations(); }, [fetchStatus, fetchRecommendations]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      let input = {};
      if (inputJson.trim()) {
        try { input = JSON.parse(inputJson); } catch { input = {}; }
      }

      const res = await fetch('/api/organic-os/engines/predictive-intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
        setScores(data.data.overall_scores);
        setRecommendations(data.data.recommendations || []);
        await fetchStatus();
      }
    } finally { setAnalyzing(false); }
  }

  const scoreColor = (v: number) => v >= 70 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444';
  const priorityColor = (p: string) => p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : p === 'medium' ? '#3b82f6' : '#10b981';
  const riskColor = (r: string) => r === 'high' ? '#ef4444' : r === 'medium' ? '#f59e0b' : '#10b981';
  const scenarioColor = (s: string) => s === 'conservative' ? '#ef4444' : s === 'probable' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🔮 Predictive Intelligence
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Transforma dados históricos em previsões estruturadas e cenários futuros.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{status?.items_analyzed || 0} previsões</span>
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, width: 'auto', padding: '10px 20px', fontSize: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Prevendo...' : '🔮 Rodar Previsão'}
          </button>
        </div>
      </div>

      {status?.warnings && status.warnings.length > 0 && (
        <div style={{ ...card({ padding: '12px 16px', marginBottom: '16px', borderLeft: '3px solid #f59e0b' }) }}>
          {status.warnings.map((w: string, i: number) => (
            <div key={i} style={{ fontSize: '12px', color: '#f59e0b' }}>⚠️ {w}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '7px 6px', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            backgroundColor: activeTab === tab ? '#ec4899' : 'transparent',
            color: activeTab === tab ? '#fff' : '#64748b',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {scores ? (
              <>
                {scoreGauge(scores.overall, 'Overall', scoreColor(scores.overall))}
                {scoreGauge(scores.confidence, 'Confiança', scoreColor(scores.confidence))}
                {scoreGauge(scores.growth_potential, 'Crescimento', scoreColor(scores.growth_potential))}
                {scoreGauge(scores.content_longevity, 'Longevidade', scoreColor(scores.content_longevity))}
                {scoreGauge(100 - scores.refresh_probability, 'Sem Refresh', scoreColor(100 - scores.refresh_probability))}
                {scoreGauge(scores.traffic_forecast, 'Traffic', scoreColor(scores.traffic_forecast))}
                {scoreGauge(scores.strategic_value, 'Estratégico', scoreColor(scores.strategic_value))}
              </>
            ) : (
              <div style={{ ...card({ flex: 1, textAlign: 'center' as const, padding: '40px' }) }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Nenhuma previsão realizada ainda</div>
                <div style={{ fontSize: '12px', color: '#3d4461', marginTop: '8px' }}>Clique em "Rodar Previsão" para começar</div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ec4899' }}>{report?.items_analyzed || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Previsões</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b' }}>{report?.scenarios?.length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Cenários</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ef4444' }}>{report?.risk_forecasts?.filter((r: any) => r.severity === 'high').length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Riscos Altos</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{report?.refresh_forecasts?.filter((r: any) => r.refresh_needed).length || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Precisam Refresh</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Previsões' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Previsões por Conteúdo ({report?.predictions?.length || 0})
          </div>
          {(!report?.predictions || report.predictions.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📊</div>
              <div style={{ fontSize: '14px' }}>Execute uma previsão para ver resultados</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.predictions.map((p: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${scoreColor(p.scores.overall)}` }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{p.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{p.cluster || 'Geral'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '900', color: '#10b981' }}>{p.traffic_forecast.predicted_30d}</span><div style={{ fontSize: '8px', color: '#64748b' }}>30D</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6' }}>{p.traffic_forecast.predicted_90d}</span><div style={{ fontSize: '8px', color: '#64748b' }}>90D</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '900', color: scoreColor(p.ranking_forecast.predicted_position_30d <= p.ranking_forecast.current_position ? 80 : 30) }}>{p.ranking_forecast.predicted_position_30d}</span><div style={{ fontSize: '8px', color: '#64748b' }}>POS 30D</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '900', color: p.growth_forecast.potential === 'high' ? '#10b981' : p.growth_forecast.potential === 'medium' ? '#f59e0b' : '#ef4444' }}>{p.growth_forecast.predicted_growth_rate}%</span><div style={{ fontSize: '8px', color: '#64748b' }}>GROWTH</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '12px', fontWeight: '900', color: scoreColor(p.scores.confidence) }}>{p.scores.confidence}%</span><div style={{ fontSize: '8px', color: '#64748b' }}>CONFIANÇA</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Cenários' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(!report?.scenarios || report.scenarios.length === 0) ? (
            <div style={card({ textAlign: 'center' as const, padding: '40px' })}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🎯</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Execute uma previsão para ver cenários</div>
            </div>
          ) : (
            report.scenarios.map((s: any, i: number) => (
              <div key={i} style={{ ...card({ borderLeft: `4px solid ${scenarioColor(s.name)}` }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={badge(scenarioColor(s.name))}>{s.name.toUpperCase()}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>{s.confidence}% confiança</span>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>{s.description}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {s.indicators.map((ind: any, j: number) => (
                    <div key={j} style={{ backgroundColor: '#080b10', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: scenarioColor(s.name) }}>{ind.value.toLocaleString()}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{ind.metric}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', marginBottom: '6px' }}>Riscos</div>
                    {s.risks.map((r: string, j: number) => (
                      <div key={j} style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>• {r}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', marginBottom: '6px' }}>Oportunidades</div>
                    {s.opportunities.map((o: string, j: number) => (
                      <div key={j} style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>• {o}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Riscos' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Previsão de Riscos ({report?.risk_forecasts?.length || 0})
          </div>
          {(!report?.risk_forecasts || report.risk_forecasts.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>⚠️</div>
              <div style={{ fontSize: '14px' }}>Execute uma previsão para ver riscos</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.risk_forecasts.sort((a: any, b: any) => b.probability - a.probability).map((r: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${riskColor(r.severity)}` }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{r.content_id}</div>
                  <span style={badge('#f59e0b')}>{r.risk_type}</span>
                  <span style={badge(riskColor(r.severity))}>{r.severity}</span>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: riskColor(r.severity) }}>{r.probability}%</span><div style={{ fontSize: '8px', color: '#64748b' }}>PROB</div></div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{r.mitigation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Refresh' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Previsão de Refresh ({report?.refresh_forecasts?.filter((r: any) => r.refresh_needed).length || 0} necessitam)
          </div>
          {(!report?.refresh_forecasts || report.refresh_forecasts.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔄</div>
              <div style={{ fontSize: '14px' }}>Execute uma previsão para ver refresh forecasts</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.refresh_forecasts.sort((a: any, b: any) => b.probability - a.probability).map((r: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 1fr 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${r.refresh_needed ? '#f59e0b' : '#10b981'}` }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{r.content_id}</div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: r.refresh_needed ? '#f59e0b' : '#10b981' }}>{r.probability}%</span><div style={{ fontSize: '8px', color: '#64748b' }}>PROB</div></div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{r.reason}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Até: {r.recommended_date}</div>
                  <span style={badge(r.refresh_needed ? '#f59e0b' : '#10b981')}>{r.refresh_needed ? 'REFRESH' : 'OK'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Recomendações' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Recomendações ({recommendations.length})
          </div>
          {recommendations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>💡</div>
              <div style={{ fontSize: '14px' }}>Execute uma previsão para ver recomendações</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recommendations.slice(0, 20).map((r: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 80px', gap: '10px', alignItems: 'center', backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${priorityColor(r.priority)}` }}>
                  <span style={badge(priorityColor(r.priority))}>{r.priority.toUpperCase()}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>{r.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{r.description}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#ec4899', fontWeight: '700' }}>{r.type.toUpperCase()}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{r.timeframe}</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{r.confidence}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Análise' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Input para Análise (JSON)
          </div>
          <div style={{ marginBottom: '12px', fontSize: '11px', color: '#64748b' }}>
            Cole JSON com content_history, gsc_data, inventory_data ou deixe vazio para usar dados mock.
          </div>
          <textarea
            style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '14px', color: '#e2e8f0', fontSize: '12px', width: '100%', minHeight: '200px', fontFamily: 'monospace', resize: 'vertical' as const }}
            placeholder='{ "gsc_data": [...], "inventory_data": [...] }'
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, marginTop: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Prevendo...' : '🔮 Rodar Previsão com Estes Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
