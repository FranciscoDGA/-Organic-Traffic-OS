import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 'res-001', blog_id: 'passacumaru', titulo: 'Como Estudar para Concurso da Prefeitura de Cumaru do Norte', cobertura_pct: 63, status: 'partial', ran_at: new Date().toISOString() }
  ]);
}
