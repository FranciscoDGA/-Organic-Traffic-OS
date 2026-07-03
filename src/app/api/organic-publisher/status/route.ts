import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const secret = req.headers.get('x-organic-publisher-secret') || req.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.ORGANIC_PUBLISHER_SECRET || 'mock_secret_bridge_123';
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const content_id = req.nextUrl.searchParams.get('content_id');
    if (!content_id) {
      return NextResponse.json({ error: 'content_id é obrigatório' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      content_id,
      status: 'draft', // Retorna sempre draft inicialmente conforme modo manual do Sprint
      auto_publish: false,
      require_approval: true,
      mode: 'manual',
      last_checked: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
