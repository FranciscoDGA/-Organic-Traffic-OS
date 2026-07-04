import { NextRequest, NextResponse } from 'next/server';

let simulatedBase = false;

export async function GET(request: NextRequest) {
  if (!simulatedBase) {
    return NextResponse.json({
      status: 'insufficient',
      message: 'Base insuficiente. Use a Simulação de Teste para carregar a fila.',
      queue: []
    });
  }

  // Simulated queue from AI Writer
  const queue = [
    {
      id: 'pub-1',
      title: 'Guia Completo de Inbound Marketing B2B',
      slug: 'guia-inbound-marketing-b2b',
      content: '# Guia Completo\nO Inbound Marketing B2B...',
      status: 'Aprovado',
      checks: {
        metaTitle: true,
        metaDescription: true,
        canonical: true,
        schema: true,
        internalLinks: true,
        imagesAlt: true,
        category: true,
        slugUnique: true
      },
      origin: 'Simulação de Teste',
      isReady: true // All checks true
    },
    {
      id: 'pub-2',
      title: 'Top 10 Ferramentas CRM',
      slug: 'guia-inbound-marketing-b2b', // Simulando erro de slug duplicado
      content: '# Ferramentas de CRM\nExistem várias...',
      status: 'Em revisão',
      checks: {
        metaTitle: true,
        metaDescription: false, // Faltando meta desc
        canonical: true,
        schema: false, // Faltando schema
        internalLinks: true,
        imagesAlt: false, // Faltando Alt
        category: true,
        slugUnique: false // Duplicado
      },
      origin: 'Simulação de Teste',
      isReady: false
    }
  ];

  return NextResponse.json({
    status: 'ok',
    queue
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, endpointDomain } = body;
    
    if (action === 'simulate') {
      simulatedBase = true;
      return NextResponse.json({ success: true });
    }
    
    if (action === 'clear') {
      simulatedBase = false;
      return NextResponse.json({ success: true });
    }
    
    if (action === 'publish') {
      // Teste real de conexão com Bridge
      if (!endpointDomain) {
        return NextResponse.json({ 
          success: false, 
          error: 'Integração pendente', 
          message: 'Endpoint de destino não configurado no Workspace.' 
        });
      }

      // Format URL just in case
      let targetUrl = endpointDomain.startsWith('http') ? endpointDomain : `https://${endpointDomain}`;
      // Append the bridge standard route
      if (!targetUrl.endsWith('/api/bridge/publish')) {
         targetUrl = `${targetUrl}/api/bridge/publish`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => { controller.abort(); }, 8000);

      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ORGANIC_BRIDGE_SECRET || 'no-secret'}`
          },
          body: JSON.stringify({
             articleId: body.articleId,
             title: body.title
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
           return NextResponse.json({
             success: true,
             message: `Publicado com sucesso no bridge ${targetUrl}`
           });
        } else {
           return NextResponse.json({
             success: false,
             message: `O Bridge retornou status HTTP ${res.status}`
           });
        }

      } catch (err: any) {
        clearTimeout(timeout);
        return NextResponse.json({
           success: false,
           error: 'Falha de conexão',
           message: `Teste real de conexão com Bridge falhou: ${err.message}. Verifique se o domínio existe e se o Bridge está instalado lá.`
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
