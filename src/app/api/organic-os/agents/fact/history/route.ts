import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'fact-001', blog_id: 'passacumaru', confianca_media: 85, grade: 'B', ran_at: new Date().toISOString() }
  ]);
}
