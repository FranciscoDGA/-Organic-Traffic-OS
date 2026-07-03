import { Alert, AlertSeverity } from './business-intelligence.types';

let alertCounter = 0;

function createAlert(title: string, message: string, severity: AlertSeverity, source: string, workspaceId?: string): Alert {
  return { id: `alert-${Date.now()}-${++alertCounter}`, title, message, severity, workspaceId, source, timestamp: new Date().toISOString(), acknowledged: false };
}

export function generateAlerts(): Alert[] {
  return [
    createAlert('Queda de Trafego', 'Tabuometro apresentou queda de 15% no trafego organico nas ultimas 2 semanas', 'warning', 'analytics', 'tabuometro'),
    createAlert('Crescimento Excepcional', 'AI Agency OS cresceu 38% em leads este mes, acima da media', 'success', 'analytics', 'aiagencyos'),
    createAlert('Agent com Baixa Performance', 'Agent de escrita do PassaCumaru com taxa de falha de 12%', 'critical', 'runtime', 'passacumaru'),
    createAlert('Publisher Parado', 'Nenhum conteudo publicado no UtilPro Brasil nos ultimos 5 dias', 'warning', 'publisher', 'utilprobrasil'),
    createAlert('Orcamento Proximo do Limite', 'Qual o Seguro atingiu 85% do orcamento mensal de IA', 'warning', 'cost', 'qualoseguro'),
    createAlert('ROI Excelente', 'AI Agency OS apresenta ROI de 8.5x, melhor da plataforma', 'success', 'business', 'aiagencyos'),
    createAlert('Conteudo Critico', '3 artigos do PassaCumaru precisam de atualizacao urgente', 'critical', 'content', 'passacumaru'),
    createAlert('Lead Surge', 'Qual o Seguro gerou 420 leads este mes, recorde historico', 'success', 'leads', 'qualoseguro'),
  ];
}
