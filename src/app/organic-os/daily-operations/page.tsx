'use client';

import { useState, useEffect } from 'react';

interface DailyMission { id: string; type: string; workspaceId: string; title: string; priority: string; estimatedDuration: number; estimatedCost: number; reason: string; }
interface DailyBriefing { date: string; summary: string; yesterdayResults: { published: number; updated: number; missionsCompleted: number }; alerts: string[]; opportunities: string[]; missionsCreated: number; plannedPublications: number; activeCampaigns: number; recommendations: string[]; }
interface CalendarEvent { id: string; date: string; title: string; type: string; workspaceId: string; description: string; }

export default function DailyOperationsDashboard() {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'briefing' | 'missions' | 'calendar'>('briefing');
  const [started, setStarted] = useState(false);

  const startDay = async () => {
    const res = await fetch('/api/organic-os/daily/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const data = await res.json();
    setMissions(data.missions || []);
    setBriefing(data.briefing || null);
    setCalendar(data.calendar || []);
    setStarted(true);
  };

  useEffect(() => { startDay(); }, []);

  const wsName: Record<string, string> = { passacumaru: 'PassaCumaru', qualoseguro: 'Qual o Seguro', utilprobrasil: 'UtilPro Brasil', tabuometro: 'Tabuometro', aiagencyos: 'AI Agency OS' };
  const priColor = (p: string) => ({ urgent: '#ef4444', high: '#f59e0b', normal: '#3b82f6', low: '#6b7280', background: '#475569' }[p] || '#6b7280');
  const typeIcon = (t: string) => ({ new_article: '📝', update: '🔄', refresh: '♻️', campaign: '📢', pillar_page: '🏛️', faq: '❓', case_study: '📊', newsletter: '📧', seasonal: '📅' }[t] || '📋');

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Daily Operations Center</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Ciclo operacional diario automatizado</p>
        </div>
        <button onClick={startDay} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: started ? '#22c55e' : '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>{started ? 'Dia Iniciado' : 'Iniciar Dia'}</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        {(['briefing', 'missions', 'calendar'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : 'transparent', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {tab === 'briefing' ? 'Briefing' : tab === 'missions' ? 'Missoes' : 'Calendario'}
          </button>
        ))}
      </div>

      {activeTab === 'briefing' && briefing && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem' }}>Resumo do Dia</h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '1rem' }}>{briefing.summary}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[['Publicados', briefing.yesterdayResults.published], ['Atualizados', briefing.yesterdayResults.updated], ['Missoes', briefing.yesterdayResults.missionsCompleted]].map(([l, v]) => (
                <div key={String(l)} style={{ padding: '0.5rem', background: '#0f172a', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>{String(v)}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{String(l)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[['Missoes Hoje', briefing.missionsCreated], ['Publicacoes', briefing.plannedPublications], ['Campanhas', briefing.activeCampaigns]].map(([l, v]) => (
                <div key={String(l)} style={{ padding: '0.5rem', background: '#0f172a', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e' }}>{String(v)}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{String(l)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Alertas</h3>
              {briefing.alerts.map((a, i) => <div key={i} style={{ fontSize: '0.8rem', color: '#f59e0b', padding: '0.25rem 0' }}>⚠️ {a}</div>)}
            </div>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Oportunidades</h3>
              {briefing.opportunities.map((o, i) => <div key={i} style={{ fontSize: '0.8rem', color: '#22c55e', padding: '0.25rem 0' }}>💡 {o}</div>)}
            </div>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Recomendacoes</h3>
              {briefing.recommendations.map((r, i) => <div key={i} style={{ fontSize: '0.8rem', color: '#60a5fa', padding: '0.25rem 0' }}>→ {r}</div>)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'missions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {missions.map(m => (
            <div key={m.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{typeIcon(m.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{m.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{wsName[m.workspaceId] || m.workspaceId} | {m.reason}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>~{m.estimatedDuration}min</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>${m.estimatedCost.toFixed(2)}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: priColor(m.priority) + '22', color: priColor(m.priority) }}>{m.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {calendar.map(e => (
            <div key={e.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ minWidth: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>{new Date(e.date + 'T12:00:00').getDate()}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{e.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{e.description}</div>
              </div>
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: '#334155', color: '#cbd5e1' }}>{e.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
