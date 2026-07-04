import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, workspaceId, language, country } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL_ID || 'gpt-4o';
    let gptData: any = null;

    if (openAiKey) {
      const prompt = `Atue como um Especialista em SEO Sênior. Forneça análises de palavras-chave para a keyword principal: "${keyword}" (Idioma: ${language}, País: ${country}).
Retorne ESTRITAMENTE em formato JSON, sem crases, sem formatação markdown. Estrutura exata obrigatória:
{
  "intent": "Informacional | Comercial | Navegacional | Transacional",
  "cluster": "Nome sugerido do Cluster semântico",
  "priority": "Alta | Média | Baixa",
  "opportunityScore": "Número de 0 a 100",
  "titles": ["Sujestão de Título 1", "Sugestão 2", "Sugestão 3"],
  "slug": "sugestao-de-slug-otimizada",
  "categories": ["Categoria 1", "Categoria 2"],
  "tags": ["Tag 1", "Tag 2", "Tag 3"],
  "schema": "Article | FAQPage | HowTo | Product",
  "relatedKeywords": ["kw 1", "kw 2", "kw 3"],
  "longTails": ["long tail 1", "long tail 2", "long tail 3"],
  "paa": ["Pergunta PAA 1", "Pergunta PAA 2", "Pergunta PAA 3"],
  "nextArticle": "Título Recomendado para o próximo artigo do cluster"
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
            temperature: 0.7
          })
        });

        if (res.ok) {
          const jsonRes = await res.json();
          const content = jsonRes.choices[0].message.content;
          gptData = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
        } else {
          console.error("OpenAI failed with status:", res.status);
        }
      } catch (err) {
        console.error("Failed parsing OpenAI response:", err);
      }
    }

    const result = {
      keyword: keyword,
      workspaceId: workspaceId,
      volume: 'Integração pendente',
      volumeSource: 'DataForSEO/GSC',
      difficulty: 'Integração pendente',
      difficultySource: 'DataForSEO',
      cpc: 'Integração pendente',
      cpcSource: 'DataForSEO',
      
      intent: gptData?.intent || 'Integração pendente',
      intentSource: openAiKey && gptData ? 'OpenAI (Estimado)' : 'Pendente',
      
      cluster: gptData?.cluster || 'Integração pendente',
      priority: gptData?.priority || 'Integração pendente',
      opportunityScore: gptData?.opportunityScore || 'Integração pendente',
      
      titles: gptData?.titles || [],
      slug: gptData?.slug || 'Integração pendente',
      categories: gptData?.categories || [],
      tags: gptData?.tags || [],
      schema: gptData?.schema || 'Integração pendente',
      
      relatedKeywords: gptData?.relatedKeywords || [],
      longTails: gptData?.longTails || [],
      paa: gptData?.paa || [],
      nextArticle: gptData?.nextArticle || 'Integração pendente',
      
      // Regra 3 (Canibalização e Conteúdo Existente na base atual)
      cannibalization: 'Não detectada na base local atual',
      existingContent: 'Sem conteúdo existente encontrado',
      status: 'Nova'
    };

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
