import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, action, context } = await request.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Text and action are required' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL_ID || 'gpt-4o';
    
    if (!openAiKey) {
       // Mock behavior if no API key
       return NextResponse.json({
         result: `(Simulação de IA - Chave ausente) Ação: ${action}. Texto original processado: ${text.substring(0,20)}...`,
         source: 'Pendente'
       });
    }

    let systemPrompt = 'Atue como um redator especialista em SEO.';
    let userPrompt = '';

    switch(action) {
      case 'rewrite':
        userPrompt = `Reescreva o seguinte texto de forma mais engajadora e natural, mantendo a intenção original: \n\n"${text}"`;
        break;
      case 'expand':
        userPrompt = `Expanda o seguinte parágrafo adicionando mais detalhes relevantes e profundidade: \n\n"${text}"`;
        break;
      case 'summarize':
        userPrompt = `Resuma o seguinte texto direto ao ponto: \n\n"${text}"`;
        break;
      case 'fix_grammar':
        userPrompt = `Corrija erros gramaticais e ortográficos do seguinte texto sem mudar o tom: \n\n"${text}"`;
        break;
      case 'optimize':
        userPrompt = `Otimize o texto abaixo para SEO focando na keyword "${context?.keyword || 'SEO'}": \n\n"${text}"`;
        break;
      case 'tone':
        userPrompt = `Mude o tom do texto abaixo para ser mais Profissional e Convincente: \n\n"${text}"`;
        break;
      default:
        userPrompt = text;
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (res.ok) {
      const jsonRes = await res.json();
      const content = jsonRes.choices[0].message.content;
      return NextResponse.json({
        result: content,
        source: 'OpenAI (Estimado)'
      });
    } else {
      return NextResponse.json({ error: 'Falha na OpenAI', source: 'Erro' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
