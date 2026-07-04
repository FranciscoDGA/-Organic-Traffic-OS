import { NextRequest, NextResponse } from 'next/server';

let simulatedBase = false;

export async function GET(request: NextRequest) {
  if (!simulatedBase) {
    return NextResponse.json({
      status: 'insufficient',
      message: 'Base insuficiente para calcular links',
      nodes: [],
      links: [],
      score: 0,
      alerts: []
    });
  }

  // Simulated internal linking graph
  const nodes = [
    { id: 'n1', label: 'Inbound Marketing B2B', type: 'Pilar', url: '/inbound-b2b' },
    { id: 'n2', label: 'Estratégias de Conteúdo', type: 'Cluster', url: '/estrategias-conteudo' },
    { id: 'n3', label: 'Ferramentas CRM', type: 'Cluster', url: '/ferramentas-crm' },
    { id: 'n4', label: 'Como atrair leads', type: 'Artigo', url: '/atrair-leads' },
    { id: 'n5', label: 'Melhores CRMs B2B', type: 'Artigo', url: '/melhores-crms' },
    { id: 'n6', label: 'Artigo Solitário Órfão', type: 'Artigo', url: '/artigo-orfao' }, // Órfão
    { id: 'n7', label: 'Artigo 404', type: 'Artigo', url: '/artigo-excluido' } // Link quebrado
  ];

  const links = [
    { sourceId: 'n1', targetId: 'n2', label: 'Descubra estratégias', status: 'Ativo' },
    { sourceId: 'n1', targetId: 'n3', label: 'Veja ferramentas CRM', status: 'Ativo' },
    { sourceId: 'n2', targetId: 'n4', label: 'Atrair leads', status: 'Ativo' },
    { sourceId: 'n3', targetId: 'n5', label: 'Top CRMs', status: 'Ativo' },
    { sourceId: 'n1', targetId: 'n7', label: 'Guia antigo', status: 'Quebrado' },
  ];

  const suggestions = [
    { 
      id: 's1', 
      sourceArticle: 'Melhores CRMs B2B', 
      targetArticle: 'Inbound Marketing B2B', 
      anchorText: 'entender mais sobre inbound marketing B2B',
      priority: 'Alta',
      origin: process.env.OPENAI_API_KEY ? 'OpenAI (Estimado)' : 'Simulação de Teste',
      type: 'Artigo → Pilar'
    },
    { 
      id: 's2', 
      sourceArticle: 'Como atrair leads', 
      targetArticle: 'Estratégias de Conteúdo', 
      anchorText: 'veja nossas estratégias de conteúdo',
      priority: 'Alta',
      origin: process.env.OPENAI_API_KEY ? 'OpenAI (Estimado)' : 'Simulação de Teste',
      type: 'Artigo → Cluster'
    },
    { 
      id: 's3', 
      sourceArticle: 'Artigo Solitário Órfão', 
      targetArticle: 'Como atrair leads', 
      anchorText: 'estratégias para gerar leads',
      priority: 'Crítica (Órfã)',
      origin: process.env.OPENAI_API_KEY ? 'OpenAI (Estimado)' : 'Simulação de Teste',
      type: 'Artigos relacionados entre si'
    }
  ];

  return NextResponse.json({
    status: 'ok',
    nodes,
    links,
    suggestions,
    score: 65, // Internal Link Score
    alerts: [
      { type: 'Página órfã', count: 1, severity: 'Alta', message: 'Artigo Solitário Órfão não recebe links.' },
      { type: 'Link quebrado', count: 1, severity: 'Crítica', message: 'Link de n1 para n7 falha 404.' },
      { type: 'Baixa autoridade interna', count: 0, severity: 'Média', message: 'Nenhuma falha grave.' },
      { type: 'Cluster desconectado', count: 0, severity: 'Baixa', message: 'Todos os clusters estão plugados ao Pilar.' }
    ]
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'simulate') {
      simulatedBase = true;
      return NextResponse.json({ success: true });
    }
    
    if (action === 'clear') {
      simulatedBase = false;
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
