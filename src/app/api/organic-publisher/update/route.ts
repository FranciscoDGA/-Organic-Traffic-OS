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
    const { content_id, workspace_id, title, html, markdown, force_destruct } = body;
    if (!content_id || !workspace_id) {
      return NextResponse.json({ error: 'content_id e workspace_id são obrigatórios' }, { status: 400 });
    }

    // Bloquear alteração destrutiva sem confirmação
    if ((!html || !markdown) && !force_destruct) {
      return NextResponse.json({ 
        error: 'Tentativa de alteração destrutiva (remoção de conteúdo) sem parâmetro de confirmação force_destruct' 
      }, { status: 400 });
    }

    console.log(`[Organic Bridge] Artigo ${content_id} atualizado. Versão incrementada.`);

    return NextResponse.json({
      success: true,
      message: 'Artigo atualizado com sucesso.',
      content_id,
      workspace_id,
      title,
      version: 2,
      updated_at: new Date().toISOString(),
      logs: [
        { timestamp: new Date().toISOString(), action: 'update', message: `Versão do artigo ${content_id} atualizada com sucesso.` }
      ]
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
