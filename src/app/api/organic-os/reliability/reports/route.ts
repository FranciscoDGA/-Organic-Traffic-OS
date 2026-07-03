import { NextRequest, NextResponse } from 'next/server';
import { getORECService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getORECService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const report = svc.getReport(id);
    if (!report) return NextResponse.json({ error: 'Relatorio nao encontrado' }, { status: 404 });
    return NextResponse.json(report);
  }
  return NextResponse.json(svc.getAll());
}
