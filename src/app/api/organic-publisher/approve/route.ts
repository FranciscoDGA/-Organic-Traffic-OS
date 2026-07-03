import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = process.env.ORGANIC_ALLOWED_ORIGIN || '*';
    if (allowedOrigin !== '*' && origin && origin !== allowedOrigin) {
      return NextResponse.json({ error: 'CORS: Origem não autorizada' }, { status: 403 });
    }

    const secret = req.headers.get('x-organic-publisher-secret') || req.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.ORGANIC_PUBLISHER_SECRET || 'mock_secret_bridge_123';
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Não autorizado: Secret incorreta ou ausente' }, { status: 401 });
    }

    const body = await req.json();
    const { content_id, workspace_id } = body;
    if (!content_id || !workspace_id) {
      return NextResponse.json({ error: 'content_id e workspace_id são obrigatórios' }, { status: 400 });
    }

    console.log(`[Organic Bridge] Artigo ${content_id} aprovado para publicação oficial.`);

    return NextResponse.json({
      success: true,
      message: 'Artigo aprovado e publicado com sucesso.',
      content_id,
      workspace_id,
      status: 'published',
      published_url: `https://${workspace_id}.com.br/blog/artigo-publicado-${content_id}`,
      published_at: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
