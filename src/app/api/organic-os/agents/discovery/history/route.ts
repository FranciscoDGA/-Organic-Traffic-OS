import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 'run-001', blog_id: 'passacumaru', topic: 'Concurso Prefeitura de Cumaru do Norte', opportunities_found: 8, avg_score: 82, ran_at: new Date().toISOString() }
  ]);
}
