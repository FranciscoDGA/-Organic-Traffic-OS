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
  <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }), flex: 1, minWidth: '120px' }}>
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
  background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
};
const TABS = ['Overview', 'Entidades', 'Tópicos', 'Perguntas', 'Lacunas', 'Recomendações', 'Análise'];

export default function SemanticIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [inputJson, setInputJson] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/semantic-intelligence');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch {}
  }, []);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch('/api/organic-os/engines/semantic-intelligence/recommendations');
      const data = await res.json();
      if (data.success) setRecommendations(data.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchStatus(); fetchScores(); }, [fetchStatus, fetchScores]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      let input = {};
      if (inputJson.trim()) {
        try { input = JSON.parse(inputJson); } catch { input = generateMockInput(); }
      } else {
        input = generateMockInput();
      }

      const res = await fetch('/api/organic-os/engines/semantic-intelligence/analyze', {
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

  function generateMockInput() {
    return {
      knowledge_core: [
        { url: 'https://example.com/concursos', title: 'Guia Concursos 2026', content: 'Guia completo sobre concursos públicos. Analisamos editais, salários, requisitos e dicas de estudo para aprovação. Concurso público é o processo seletivo para cargo público.', keywords: ['concurso', 'público', 'edital', 'aprovação'], entities: ['CEBRASPE', 'CESPE', 'FGV'], topics: ['concursos', 'carreiras públicas'] },
        { url: 'https://example.com/estudo', title: 'Como Estudar para Concursos', content: 'Métodos de estudo comprovados para concursos públicos. Técnicas de memorização, organização do tempo, revisão espaçada e simulados. Estudo eficiente para concurso.', keywords: ['estudo', 'técnicas', 'memorização', 'simulado'], entities: ['Pomodoro', 'ANKI'], topics: ['estudo', 'técnicas de aprendizado'] },
        { url: 'https://example.com/salarios', title: 'Salários dos Concursos', content: 'Tabela de salários dos principais concursos públicos do Brasil. Remuneração, benefícios, gratificações e progressão funcional. Conheça os concursos mais bem pagos.', keywords: ['salário', 'remuneração', 'benefícios', 'concurso'], entities: ['IBGE', 'Receita Federal', 'PF'], topics: ['salários', 'carreiras'] },
        { url: 'https://example.com/legislacao', title: 'Legislação para Concursos', content: 'Legislação essencial para provas de concursos. Constituição Federal, código penal, administrativo e civil. Normas mais cobradas em concursos.', keywords: ['legislação', 'constituição', 'código', 'lei'], entities: ['STF', 'Congresso Nacional'], topics: ['legislação', 'direito'] },
      ],
      keywords_data: [
        { keyword: 'concurso público', topics: ['concursos', 'carreiras'] },
        { keyword: 'estudo para concurso', topics: ['estudo', 'técnicas'] },
        { keyword: 'salário concurso', topics: ['salários', 'carreiras'] },
        { keyword: 'legislação concurso', topics: ['legislação', 'direito'] },
        { keyword: 'edital concurso', topics: ['concursos', 'editais'] },
      ],
      inventory_data: [
        { url: 'https://example.com/concursos', title: 'Guia Concursos 2026', content: 'Guia completo sobre concursos públicos. Analisamos editais, salários, requisitos e dicas de estudo para aprovação.', type: 'post', keywords: ['concurso', 'edital'] },
        { url: 'https://example.com/estudo', title: 'Como Estudar', content: 'Métodos de estudo comprovados para concursos públicos.', type: 'post', keywords: ['estudo', 'técnicas'] },
      ],
      research_packs: [
        { title: 'Pesquisa: Mercado de Concursos', summary: 'Análise do mercado de concursos públicos 2026. Tendências, oportunidades e áreas com mais vagas.', keywords: ['concurso', 'mercado', 'vagas', '2026'], topics: ['mercado de concursos'] },
      ],
    };
  }

  const scoreColor = (v: number) => v >= 70 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444';
  const priorityColor = (p: string) => p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : p === 'medium' ? '#3b82f6' : '#10b981';
  const gapTypeLabel = (t: string) => ({
    entity_missing: 'Entidade Ausente', topic_missing: 'Tópico Raso', question_unanswered: 'Pergunta sem Resposta',
    keyword_missing: 'Keyword Ausente', depth_insufficient: 'Profundidade Insuficiente', cluster_incomplete: 'Cluster Incompleto',
  } as any)[t] || t;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🔮 Semantic Intelligence
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', margin: '8px 0 0' }}>
            Analisa cobertura semântica, entidades, tópicos, perguntas e lacunas de significado.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{status?.total_items || 0} itens</span>
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, width: 'auto', padding: '10px 20px', fontSize: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '🔮 Rodar Análise'}
          </button>
        </div>
      </div>

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

      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {scores ? (
              <>
                {scoreGauge(scores.coverage, 'Coverage', scoreColor(scores.coverage))}
                {scoreGauge(scores.entity_coverage, 'Entidades', scoreColor(scores.entity_coverage))}
                {scoreGauge(scores.topic_depth, 'Tópicos', scoreColor(scores.topic_depth))}
                {scoreGauge(scores.question_answering, 'Perguntas', scoreColor(scores.question_answering))}
                {scoreGauge(scores.topical_authority, 'Autoridade', scoreColor(scores.topical_authority))}
                {scoreGauge(scores.completeness, 'Completude', scoreColor(scores.completeness))}
              </>
            ) : (
              <div style={{ ...card({ flex: 1, textAlign: 'center' as const, padding: '40px' }) }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Nenhuma análise realizada ainda</div>
                <div style={{ fontSize: '12px', color: '#3d4461', marginTop: '8px' }}>Clique em "Rodar Análise" para começar</div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#8b5cf6' }}>{report?.total_entities || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Entidades</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3b82f6' }}>{report?.total_topics || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Tópicos</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b' }}>{report?.total_questions || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Perguntas</div>
            </div>
            <div style={{ ...card({ padding: '16px', textAlign: 'center' as const }) }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ef4444' }}>{report?.total_gaps || 0}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Lacunas</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Entidades' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Entidades Identificadas ({report?.entities?.length || 0})
          </div>
          {(!report?.entities || report.entities.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🏷️</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver entidades</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.entities.slice(0, 30).map((e: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 1fr', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{e.name}</div>
                  <span style={badge('#8b5cf6')}>{e.type}</span>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#8b5cf6' }}>{e.frequency}</span><div style={{ fontSize: '8px', color: '#64748b' }}>FREQ</div></div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.items_referenced?.length || 0} itens</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Tópicos' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Tópicos Mapeados ({report?.topics?.length || 0})
          </div>
          {(!report?.topics || report.topics.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📚</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver tópicos</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.topics.slice(0, 30).map((t: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{t.name}</div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#3b82f6' }}>{t.frequency}</span><div style={{ fontSize: '8px', color: '#64748b' }}>FREQ</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(t.coverage_score) }}>{t.coverage_score}</span><div style={{ fontSize: '8px', color: '#64748b' }}>COVERAGE</div></div>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: '#94a3b8' }}>{t.items_referenced?.length || 0}</span><div style={{ fontSize: '8px', color: '#64748b' }}>ITENS</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Perguntas' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Perguntas Identificadas ({report?.questions?.length || 0})
          </div>
          {(!report?.questions || report.questions.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>❓</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver perguntas</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.questions.slice(0, 30).map((q: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${scoreColor(q.answer_coverage)}` }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</div>
                  <span style={badge('#f59e0b')}>{q.topic}</span>
                  <div style={{ textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(q.answer_coverage) }}>{q.answer_coverage}%</span><div style={{ fontSize: '8px', color: '#64748b' }}>COVERAGE</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Lacunas' && (
        <div style={card()}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Lacunas Semânticas ({report?.gaps?.length || 0})
          </div>
          {(!report?.gaps || report.gaps.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3d4461' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>🔍</div>
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver lacunas</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.gaps.map((g: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px', gap: '8px', alignItems: 'center', backgroundColor: '#080b10', padding: '10px 12px', borderRadius: '6px', borderLeft: `3px solid ${priorityColor(g.priority)}` }}>
                  <span style={badge(priorityColor(g.priority))}>{gapTypeLabel(g.type)}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{g.description}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{g.recommendation}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{g.related_items?.length || 0} itens</span>
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
              <div style={{ fontSize: '14px' }}>Execute uma análise para ver recomendações</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recommendations.slice(0, 30).map((r: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px', gap: '10px', alignItems: 'center', backgroundColor: '#080b10', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${priorityColor(r.priority)}` }}>
                  <span style={badge(priorityColor(r.priority))}>{r.priority.toUpperCase()}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>{r.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{r.description}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#a78bfa', fontWeight: '700' }}>{r.type.replace(/_/g, ' ').toUpperCase()}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{r.impact}</span>
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
            Cole JSON com knowledge_core, keywords_data, inventory_data, research_packs, drafts, sources, facts ou deixe vazio para mock.
          </div>
          <textarea
            style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px', padding: '14px', color: '#e2e8f0', fontSize: '12px', width: '100%', minHeight: '200px', fontFamily: 'monospace', resize: 'vertical' as const }}
            placeholder='{ "knowledge_core": [...], "keywords_data": [...], "inventory_data": [...] }'
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={analyzing} style={{ ...btnPrimary, marginTop: '12px', opacity: analyzing ? 0.5 : 1 }}>
            {analyzing ? '⏳ Analisando...' : '🔮 Rodar Análise com Estes Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
