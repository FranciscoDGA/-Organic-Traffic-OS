import { NextRequest, NextResponse } from 'next/server';
import { getPRGCService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getPRGCService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const report = svc.getReport(id);
    if (!report) return NextResponse.json({ error: 'Relatorio nao encontrado' }, { status: 404 });
    return NextResponse.json(report);
  }
  const latest = svc.getLatest();
  if (!latest) return NextResponse.json({ error: 'Nenhum relatorio' }, { status: 404 });
  return NextResponse.json(latest);
}
