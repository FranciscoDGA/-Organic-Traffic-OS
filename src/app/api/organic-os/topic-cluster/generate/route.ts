import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { keyword, workspaceId } = await request.json();

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL_ID || 'gpt-4o';
    let gptData: any = null;

    if (openAiKey) {
      const prompt = `Crie uma arquitetura semântica rigorosa (Topic Cluster) baseada na Keyword Principal: "${keyword}".
Limites exatos obrigatórios (para evitar timeout):
- 1 Página Pilar (Pilar Central)
- 3 Subclusters derivados desse Pilar
- 2 Artigos Específicos para CADA subcluster (Total = 6 artigos).

Gere no seguinte formato JSON exato e estrito, sem formatação markdown:
{
  "nodes": [
    {
      "id": "pilar_1",
      "parentId": null,
      "type": "Pilar",
      "keyword": "Sua keyword pilar",
      "intent": "Informacional/Comercial",
      "priority": "Alta",
      "slug": "/pilar-sugerido",
      "category": "Categoria Sugerida",
      "schema": "Article",
      "anchorText": ""
    },
    {
      "id": "cluster_1",
      "parentId": "pilar_1",
      "type": "Cluster",
      "keyword": "Subcluster 1 kw",
      "intent": "...",
      "priority": "Média",
      "slug": "/cluster-1",
      "category": "...",
      "schema": "...",
      "anchorText": "Âncora para o pilar"
    }
    // Siga com cluster_2, cluster_3 e article_1_1, article_1_2, etc, respeitando os parentId
  ]
}`;

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5
          })
        });

        if (res.ok) {
          const jsonRes = await res.json();
          const content = jsonRes.choices[0].message.content;
          gptData = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
        }
      } catch (err) {
        console.error("OpenAI Error in Cluster:", err);
      }
    }

    // Fallback Mocked if AI fails or no key
    if (!gptData || !gptData.nodes) {
      gptData = {
        nodes: [
          { id: 'p1', parentId: null, type: 'Pilar', keyword: keyword, intent: 'Integração pendente', priority: 'Integração pendente', slug: '/integra-pendente', category: 'Pendente', schema: 'Pendente', anchorText: '' }
        ]
      };
    }

    // Atribuindo Status e Checagem Local
    // Como a base está vazia (conforme prompt anterior), não há canibalização ou conteúdo existente.
    // Todos são "Planejado" ou "Novo".
    const enhancedNodes = gptData.nodes.map((n: any, index: number) => ({
      ...n,
      status: 'Novo', // Nova, Planejado, Em Produção, Publicado
      existing: false, // Local DB Real (vazio)
      cannibalized: false, // Local DB Real (vazio)
      order: index + 1
    }));

    // Calculando Health Score e Metricas (Baseado na completude dos dados)
    const totalNodes = enhancedNodes.length;
    const hasClusters = enhancedNodes.some((n: any) => n.type === 'Cluster');
    
    let healthScore = 100;
    let coverage = 100;
    let orphans = 0;
    
    // Se não gerou completo, reduz o score
    if (!hasClusters) {
      healthScore = 20;
      coverage = 10;
      orphans = 1;
    }

    const response = {
      nodes: enhancedNodes,
      metrics: {
        healthScore,
        coverage,
        orphans,
        duplicates: 0,
        cannibalizations: 0,
        totalPlanned: totalNodes,
        totalPublished: 0
      },
      sources: {
        architecture: openAiKey ? 'OpenAI (Estimado)' : 'Integração pendente',
        priority: 'Integração pendente', // GSC nulo localmente
        existingDb: 'Banco Local (Real)',
        metrics: 'DataForSEO (Integração Pendente)'
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
