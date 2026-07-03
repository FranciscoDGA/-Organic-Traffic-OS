import { NextRequest, NextResponse } from 'next/server';
import { MonitoringAgentService } from '../../../../../../../organic-traffic-os/core/agents/monitoring-agent/monitoring-agent.service';

let reportsCache: any[] = [];

export function setReportsCache(reports: any[]) {
  reportsCache = reports;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = reportsCache.find(r => r.report?.id === id || r.id === id);
  if (!report) {
    return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
  }
  return NextResponse.json(report);
}
