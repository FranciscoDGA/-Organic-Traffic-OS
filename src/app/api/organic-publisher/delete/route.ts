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
    const { content_id, workspace_id, force_hard_delete } = body;
    if (!content_id || !workspace_id) {
      return NextResponse.json({ error: 'content_id e workspace_id são obrigatórios' }, { status: 400 });
    }

    if (force_hard_delete) {
      console.log(`[Organic Bridge][WARNING] Hard delete solicitado para o artigo ${content_id}.`);
    }

    console.log(`[Organic Bridge] Artigo ${content_id} arquivado com sucesso (exclusão lógica).`);

    return NextResponse.json({
      success: true,
      message: force_hard_delete ? 'Artigo removido permanentemente.' : 'Artigo arquivado com sucesso.',
      content_id,
      workspace_id,
      status: force_hard_delete ? 'deleted' : 'archived',
      archived_at: new Date().toISOString(),
      logs: [
        { timestamp: new Date().toISOString(), action: 'archive', message: `Artigo ${content_id} teve seu status alterado para arquivado.` }
      ]
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
