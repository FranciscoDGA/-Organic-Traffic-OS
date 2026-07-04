import { NextRequest, NextResponse } from 'next/server';

// Temporary mock/memory behavior as explicitly allowed by user logic:
// "Se ainda não existir banco persistente para salvar o plano, criar estrutura local/API preparada e marcar 'Persistência pendente'."
let memoryStore: any[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    data: memoryStore,
    dbStatus: "Persistência pendente",
    source: "Banco Local (Em Memória)",
    message: "Atenção: Banco definitivo ainda não configurado."
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simular integração de nós vindos do Topic Cluster/Keywords
    const newItems = Array.isArray(body) ? body : [body];
    
    const processedItems = newItems.map((item, index) => ({
      id: item.id || `cp-${Date.now()}-${index}`,
      workspaceId: item.workspaceId || 'default',
      keyword: item.keyword || 'Keyword Vazia',
      type: item.type || 'Artigo',
      status: item.status || 'Ideia', // Ideia, Planejado, Em produção, Revisão, Aprovado, Publicado
      priority: item.priority || 'Média',
      intent: item.intent || 'Informacional',
      cluster: item.cluster || 'Cluster Não Definido',
      pilar: item.pilar || 'Pilar Não Definido',
      author: item.author || 'Atribuição Pendente',
      suggestedDate: item.suggestedDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      order: item.order || memoryStore.length + index + 1,
      cta: item.cta || 'CTA Sugerido pela IA',
      category: item.category || 'Geral',
      tags: item.tags || [],
      schema: item.schema || 'Article',
      internalLinks: item.internalLinks || [],
      cannibalizationRisk: item.cannibalizationRisk || 'Não detectada na base local atual',
      contentGap: item.contentGap || 'Nova oportunidade (OpenAI)',
      source: item.source || (process.env.OPENAI_API_KEY ? 'OpenAI (Estimado)' : 'Pendente')
    }));

    memoryStore = [...memoryStore, ...processedItems];

    return NextResponse.json({
      success: true,
      added: processedItems.length,
      dbStatus: "Persistência pendente"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json();
    let updated = false;

    memoryStore = memoryStore.map(item => {
      if (item.id === id) {
        updated = true;
        return { ...item, ...updates };
      }
      return item;
    });

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      dbStatus: "Persistência pendente"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
