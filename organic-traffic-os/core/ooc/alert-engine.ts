import { Alert, AlertSeverity } from './operations.types';

let alertCounter = 0;

const alertTemplates: { source: string; category: string; severity: AlertSeverity; message: string }[] = [
  { source: 'Writing Agent', category: 'agent', severity: 'warning', message: 'Agent com latencia elevada' },
  { source: 'ORE', category: 'runtime', severity: 'info', message: 'Queue de processamento congestionada' },
  { source: 'OCH', category: 'connectors', severity: 'high', message: 'Connector Google Trends timeout' },
  { source: 'AIL', category: 'ai', severity: 'warning', message: 'Custo de IA acima do esperado' },
  { source: 'OEB', category: 'runtime', severity: 'info', message: 'Eventos acumulando na fila' },
  { source: 'WordPress', category: 'connectors', severity: 'critical', message: 'Falha na autenticacao WordPress' },
  { source: 'Scheduler', category: 'runtime', severity: 'warning', message: 'Job executou com atraso' },
  { source: 'QA Agent', category: 'agent', severity: 'info', message: 'Fila de revisao vazia' },
  { source: 'PassaCumaru', category: 'workspace', severity: 'info', message: 'Workspace sem missoes nas ultimas 24h' },
  { source: 'ORE', category: 'runtime', severity: 'critical', message: 'Worker offline detectado' },
  { source: 'Newsletter', category: 'connectors', severity: 'warning', message: 'Limite de envios proximo' },
  { source: 'BI', category: 'business', severity: 'info', message: 'Metricas atualizadas com sucesso' },
];

export function generateAlerts(count: number = 5): Alert[] {
  const alerts: Alert[] = [];
  for (let i = 0; i < count; i++) {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    alerts.push({
      id: `alert-${Date.now()}-${++alertCounter}`,
      source: template.source,
      category: template.category,
      severity: template.severity,
      message: template.message,
      details: `${template.message} detectado em ${template.source}`,
      acknowledged: Math.random() > 0.6,
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    });
  }
  return alerts;
}
