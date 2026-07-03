import { NextRequest, NextResponse } from 'next/server';
import { getAOVService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getAOVService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const report = svc.getReport(id);
    if (!report) return NextResponse.json({ error: 'Simulacao nao encontrada' }, { status: 404 });
    return NextResponse.json(report);
  }
  const latest = svc.getLatest();
  if (!latest) return NextResponse.json({ error: 'Nenhuma simulacao' }, { status: 404 });
  return NextResponse.json(svc.getReport(latest.id));
}
