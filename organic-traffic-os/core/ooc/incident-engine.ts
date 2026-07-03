import { Incident, IncidentPriority } from './operations.types';

let incidentCounter = 0;

const incidentTemplates: { source: string; impact: string; priority: IncidentPriority; cause: string }[] = [
  { source: 'WordPress Connector', impact: 'Publicacoes bloqueadas', priority: 'high', cause: 'Token de acesso expirado' },
  { source: 'ORE Workers', impact: 'Missoes nao processadas', priority: 'critical', cause: 'Worker principal offline' },
  { source: 'AIL Provider', impact: 'Qualidade de conteudo reduzida', priority: 'medium', cause: 'Rate limit do provedor' },
  { source: 'OEB', impact: 'Eventos nao processados', priority: 'high', cause: 'Fila de eventos lotada' },
  { source: 'Google Trends', impact: 'Dados de tendencia indisponiveis', priority: 'low', cause: 'API externa indisponivel' },
];

export function generateIncidents(count: number = 2): Incident[] {
  const incidents: Incident[] = [];
  for (let i = 0; i < count; i++) {
    const template = incidentTemplates[Math.floor(Math.random() * incidentTemplates.length)];
    const id = `inc-${Date.now()}-${++incidentCounter}`;
    const createdAt = new Date(Date.now() - Math.random() * 172800000).toISOString();
    const isOpen = Math.random() > 0.4;
    incidents.push({
      id, source: template.source, impact: template.impact, priority: template.priority,
      probableCause: template.cause,
      status: isOpen ? 'open' : 'resolved',
      timeline: [
        { timestamp: createdAt, action: 'Incidente criado', actor: 'Sistema' },
        ...(isOpen ? [] : [{ timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), action: 'Resolvido', actor: 'Operador' }]),
      ],
      createdAt,
      resolvedAt: isOpen ? undefined : new Date().toISOString(),
    });
  }
  return incidents;
}
