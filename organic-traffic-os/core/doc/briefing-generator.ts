import { DailyBriefing } from './daily-operations.types';
import { getEventsForDate } from './calendar-data';

export function generateBriefing(date: string, missionsCount: number): DailyBriefing {
  const events = getEventsForDate(date);
  return {
    date,
    summary: `Dia operacional com ${missionsCount} missoes geradas e ${events.length} eventos no calendario`,
    yesterdayResults: { published: 8, updated: 3, missionsCompleted: 6 },
    alerts: ['Tabuometro com queda de trafego de 15%', 'Agent de escrita do PassaCumaru com taxa de falha de 12%'],
    opportunities: ['Qual o Seguro com potencial para 500+ leads/mes', 'Tabuometro com custo baixo, ideal para escalar'],
    missionsCreated: missionsCount,
    plannedPublications: events.filter(e => e.type === 'publication').length,
    activeCampaigns: events.filter(e => e.type === 'campaign').length,
    recommendations: ['Priorizar refresh de conteudos do PassaCumaru', 'Expandir categorias de seguros no Qual o Seguro', 'Aumentar producao no Tabuometro para monetizar trafego'],
  };
}
