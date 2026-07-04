import { NextRequest, NextResponse } from 'next/server';

let simulatedBase = false;

export async function GET(request: NextRequest) {
  if (!simulatedBase) {
    return NextResponse.json({
      status: 'insufficient',
      message: 'Integração pendente (GA/GSC não conectados) ou Dados insuficientes.'
    });
  }

  // Simulated Analytics Data
  const chartData = Array.from({ length: 30 }).map((_, i) => ({
    name: `Dia ${i+1}`,
    cliques: Math.floor(Math.random() * 50) + 20,
    impressoes: Math.floor(Math.random() * 500) + 200,
  }));

  const topPages = [
    { url: '/guia-inbound-marketing', clicks: 1240, impressions: 8400, ctr: '14.7%', position: 3.2 },
    { url: '/ferramentas-crm', clicks: 890, impressions: 5200, ctr: '17.1%', position: 2.1 },
    { url: '/como-atrair-leads', clicks: 450, impressions: 6100, ctr: '7.3%', position: 8.5 }
  ];

  const topKeywords = [
    { keyword: 'inbound marketing b2b', clicks: 540, impressions: 3200, position: 2.5 },
    { keyword: 'ferramentas crm', clicks: 420, impressions: 1800, position: 1.2 },
    { keyword: 'geração de leads b2b', clicks: 310, impressions: 4100, position: 9.1 }
  ];

  const opportunities = {
    falling: [
      { url: '/antigo-guia-seo', drop: '-45% tráfego (últimos 30d)', status: 'Conteúdo em queda' }
    ],
    growing: [
      { url: '/ferramentas-crm', growth: '+25% tráfego', status: 'Conteúdo em crescimento' }
    ],
    highImpressionLowCtr: [
      { url: '/como-atrair-leads', impressions: 6100, ctr: '7.3%', status: 'Otimizar Meta Title/Desc' }
    ],
    noTraffic: [
      { url: '/artigo-orfao-antigo', status: 'Página sem tráfego há 90 dias' }
    ]
  };

  return NextResponse.json({
    status: 'ok',
    metrics: {
      visits: 8450,
      visitsTrend: '+12%',
      impressions: 42100,
      impressionsTrend: '+15%',
      clicks: 3200,
      clicksTrend: '+8%',
      ctr: '7.6%',
      ctrTrend: '-1.2%',
      position: 12.4,
      positionTrend: '+2 posições',
      publishedArticles: 145
    },
    chartData,
    topPages,
    topKeywords,
    opportunities
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
