import { NextRequest, NextResponse } from 'next/server';
import { getOEVService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getOEVService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });
  const report = svc.getReport(id);
  if (!report) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });
  return NextResponse.json(report);
}
