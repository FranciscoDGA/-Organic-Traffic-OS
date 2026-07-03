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

    const workspaceId = req.headers.get('x-organic-workspace-id');
    const allowedWorkspace = process.env.ORGANIC_ALLOWED_WORKSPACE || 'passacumaru';
    if (!workspaceId || workspaceId !== allowedWorkspace) {
      return NextResponse.json({ error: 'Não autorizado: Workspace não correspondente' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, slug, excerpt, html, markdown, seo, schema,
      category, tags, status, workspace_id, content_id,
      featured_image, images
    } = body;

    // 1. Validação de payload completo
    if (!title || !slug || !html || !markdown || !workspace_id || !content_id) {
      return NextResponse.json({ error: 'Payload incompleto. Campos obrigatórios: title, slug, html, markdown, workspace_id, content_id' }, { status: 400 });
    }

    // 2. Validação obrigatória de imagens
    if (!featured_image || !featured_image.url || !featured_image.alt) {
      return NextResponse.json({ error: 'featured_image é obrigatória e deve conter url e alt text' }, { status: 400 });
    }

    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.url || !img.alt) {
          return NextResponse.json({ error: `Imagem interna na posição ${i} está inválida ou não possui alt text` }, { status: 400 });
        }
      }
    }

    // 3. Recomendações/Warnings (Sugerir 2 a 3 imagens)
    const warnings: string[] = [];
    const internalImagesCount = images ? images.length : 0;
    if (internalImagesCount < 2 || internalImagesCount > 3) {
      warnings.push(`Recomendação: É sugerido incluir de 2 a 3 imagens internas no artigo (encontradas: ${internalImagesCount})`);
    }

    // 4. Regras de publicação (Forçar rascunho por padrão - modo manual)
    const finalStatus = 'draft'; 
    const mode = 'manual';
    const autoPublish = false;
    const requireApproval = true;

    // Logs no console / banco de logs do blog
    console.log(`[Organic Bridge] Novo artigo recebido em modo rascunho: "${title}"`);
    console.log(`[Organic Bridge] Imagem destacada: ${featured_image.url} (Alt: ${featured_image.alt})`);
    if (images && images.length > 0) {
      console.log(`[Organic Bridge] ${images.length} imagens internas registradas.`);
    }

    return NextResponse.json({
      success: true,
      message: 'Artigo recebido com sucesso e salvo como rascunho.',
      post: {
        content_id,
        workspace_id,
        title,
        slug,
        status: finalStatus,
        featured_image,
        images: images || [],
        mode,
        auto_publish: autoPublish,
        require_approval: requireApproval
      },
      warnings,
      logs: [
        { timestamp: new Date().toISOString(), action: 'publish_receive', message: `Artigo "${title}" recebido como rascunho. featured_image validada.` }
      ]
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
