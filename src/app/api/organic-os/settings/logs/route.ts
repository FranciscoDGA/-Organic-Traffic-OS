import { NextResponse } from 'next/server';

// Log em memória, conforme autorizado pelo usuário
const memoryLogs = [
  { id: 1, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), level: 'INFO', source: 'Sistema', message: 'Sistema iniciado na porta 3000' },
  { id: 2, timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), level: 'WARN', source: 'Bridge', message: 'Endpoint /api/bridge/publish não respondeu em 2000ms' },
  { id: 3, timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), level: 'ERROR', source: 'Publisher', message: 'Falha ao autenticar com Organic Bridge. Verifique a Secret.' },
  { id: 4, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), level: 'INFO', source: 'AI Writer', message: 'Auto-save concluído localmente (Banco offline)' },
  { id: 5, timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), level: 'WARN', source: 'Scheduler', message: 'Cron job ignorado: Integração de banco pendente' },
  { id: 6, timestamp: new Date().toISOString(), level: 'INFO', source: 'Sistema', message: 'Diagnóstico geral solicitado pelo usuário' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    logs: memoryLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  });
}
