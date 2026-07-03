import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 'plan-001', blog_id: 'passacumaru', itens_backlog: 8, semanas: 8, ran_at: new Date().toISOString() }
  ]);
}
