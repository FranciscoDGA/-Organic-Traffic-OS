import { CalendarEvent } from './daily-operations.types';

export const calendarEvents: CalendarEvent[] = [
  { id: 'cal-1', date: '2026-07-07', title: 'Publicacao Semanal - PassaCumaru', type: 'publication', workspaceId: 'passacumaru', description: 'Artigo sobre editais abertos de julho' },
  { id: 'cal-2', date: '2026-07-07', title: 'Review Semanal - UtilPro', type: 'review', workspaceId: 'utilprobrasil', description: 'Atualizar reviews de ferramentas SaaS' },
  { id: 'cal-3', date: '2026-07-08', title: 'Newsletter - Qual o Seguro', type: 'publication', workspaceId: 'qualoseguro', description: 'Envio da newsletter semanal de seguros' },
  { id: 'cal-4', date: '2026-07-10', title: 'Campanha - AI Agency OS', type: 'campaign', workspaceId: 'aiagencyos', description: 'Lancamento de conteudo sobre automacao' },
  { id: 'cal-5', date: '2026-07-14', title: 'Conteudo Sazonal - Concursos', type: 'seasonal', workspaceId: 'passacumaru', description: 'Artigo sobre concursos de meio de ano' },
  { id: 'cal-6', date: '2026-07-15', title: 'Refresh Mensal - Todos', type: 'review', workspaceId: 'all', description: 'Revisao mensal de conteudos desatualizados' },
  { id: 'cal-7', date: '2026-07-21', title: 'Pilar Page - UtilPro', type: 'publication', workspaceId: 'utilprobrasil', description: 'Guia definitivo de ferramentas de marketing' },
  { id: 'cal-8', date: '2026-07-25', title: 'Newsletter Mensal - Tabuometro', type: 'publication', workspaceId: 'tabuometro', description: 'Resumo mensal de tendencias' },
  { id: 'cal-9', date: '2026-07-28', title: 'Campanha - Qual o Seguro', type: 'campaign', workspaceId: 'qualoseguro', description: 'Campanha de seguros residenciais' },
  { id: 'cal-10', date: '2026-07-31', title: 'Relatorio Mensal - OBI', type: 'deadline', workspaceId: 'all', description: 'Gerar relatorio mensal de performance' },
];

export function getEventsForDate(date: string): CalendarEvent[] {
  return calendarEvents.filter(e => e.date === date);
}

export function getEventsForWeek(startDate: string): CalendarEvent[] {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return calendarEvents.filter(e => { const d = new Date(e.date); return d >= start && d < end; });
}

export function getEventsForMonth(year: number, month: number): CalendarEvent[] {
  return calendarEvents.filter(e => { const d = new Date(e.date); return d.getFullYear() === year && d.getMonth() === month; });
}
