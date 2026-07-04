import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { targetUrl } = await request.json();
    
    if (!targetUrl || !targetUrl.startsWith('http')) {
      return NextResponse.json({ error: 'URL inválida. Inclua http:// ou https://' }, { status: 400 });
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s limite exigido

    let res;
    try {
      res = await fetch(targetUrl, { signal: controller.signal, headers: { 'User-Agent': 'Organic-Traffic-OS/1.0' } });
    } catch (err: any) {
      clearTimeout(timeout);
      return NextResponse.json({ error: `Erro real de conexão: ${err.message}` }, { status: 500 });
    }
    clearTimeout(timeout);

    const html = await res.text();
    const $ = cheerio.load(html);

    // Initial Checks
    let score = 100;
    let testsRun = 0;
    const issues: any[] = [];
    let criticalCount = 0;
    let warningCount = 0;
    let opportunityCount = 0;

    const addIssue = (type: 'Critical Issues' | 'Warnings' | 'Opportunities' | 'Recommendations', title: string, category: string) => {
       issues.push({ type, title, category });
       if (type === 'Critical Issues') { criticalCount++; score -= 15; }
       if (type === 'Warnings') { warningCount++; score -= 5; }
       if (type === 'Opportunities') opportunityCount++;
    };

    // 1. HTTP Status
    testsRun++;
    if (res.status >= 400) {
      addIssue('Critical Issues', `Retornou HTTP Status ${res.status}`, 'Performance');
    }

    // 2. Title & Description
    testsRun += 2;
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    
    if (!title || title.length < 10) addIssue('Critical Issues', 'Meta Title ausente ou muito curto', 'SEO Técnico');
    if (!description || description.length < 50) addIssue('Warnings', 'Meta Description ausente ou muito curta', 'SEO Técnico');

    // 3. Headings
    testsRun += 3;
    const h1Count = $('h1').length;
    if (h1Count === 0) addIssue('Critical Issues', 'Nenhum H1 encontrado', 'Conteúdo');
    else if (h1Count > 1) addIssue('Warnings', 'Múltiplos H1s encontrados', 'Conteúdo');

    const h2Count = $('h2').length;
    if (h2Count === 0) addIssue('Opportunities', 'Adicione tags H2 para melhor hierarquia', 'Conteúdo');

    // 4. Alt Text em Imagens
    testsRun++;
    const imagesWithoutAlt = $('img:not([alt])').length;
    if (imagesWithoutAlt > 0) addIssue('Warnings', `${imagesWithoutAlt} imagens sem atributo Alt`, 'SEO Técnico');

    // 5. Canonical
    testsRun++;
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) addIssue('Warnings', 'Tag Canonical ausente', 'SEO Técnico');

    // 6. Schema JSON-LD
    testsRun++;
    const schema = $('script[type="application/ld+json"]').length;
    if (schema === 0) addIssue('Opportunities', 'Nenhum Schema.org detectado', 'SEO Técnico');

    // 7. Open Graph
    testsRun++;
    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (!ogTitle) addIssue('Warnings', 'Open Graph tags ausentes', 'SEO Técnico');

    // 8. Thin Content check
    testsRun++;
    const bodyText = $('body').text().trim().split(/\s+/).length;
    if (bodyText < 300) addIssue('Warnings', 'Thin Content: Menos de 300 palavras', 'Conteúdo');

    // 9. Extração de Links Internos limitados a 5
    testsRun++;
    const internalLinks = new Set<string>();
    $('a[href^="/"], a[href^="' + targetUrl + '"]').each((_, el) => {
       const href = $(el).attr('href');
       if (href && internalLinks.size < 5) internalLinks.add(href);
    });

    if (internalLinks.size === 0) {
      addIssue('Critical Issues', 'Nenhum link interno encontrado na página inicial (Página isolada)', 'SEO Técnico');
    }

    // Ping em 5 links reais (Limitado para evitar timeout global, 2s cada máximo simulado via Promise.all)
    const auditedUrls = [{ url: targetUrl, status: res.status }];
    const linkPromises = Array.from(internalLinks).map(async (link) => {
       const fullUrl = link.startsWith('http') ? link : new URL(link, targetUrl).toString();
       try {
          const lCont = new AbortController();
          const lTime = setTimeout(() => lCont.abort(), 2000);
          const linkRes = await fetch(fullUrl, { method: 'HEAD', signal: lCont.signal });
          clearTimeout(lTime);
          return { url: fullUrl, status: linkRes.status };
       } catch (e) {
          return { url: fullUrl, status: 'Erro/Timeout' };
       }
    });

    const linksChecked = await Promise.all(linkPromises);
    linksChecked.forEach(lc => {
       auditedUrls.push(lc as any);
       if (lc.status === 404 || lc.status === 'Erro/Timeout') {
         addIssue('Critical Issues', `Link quebrado detectado: ${lc.url}`, 'SEO Técnico');
       }
    });

    // Score floor at 0
    score = Math.max(0, score);
    
    // Classificação
    let classification = 'Excelente';
    if (score < 50) classification = 'Crítico';
    else if (score < 75) classification = 'Regular';
    else if (score < 90) classification = 'Bom';

    const endTime = Date.now();
    const timeSpent = ((endTime - startTime) / 1000).toFixed(2);

    return NextResponse.json({
      success: true,
      score,
      classification,
      testsRun,
      timeSpent: `${timeSpent}s`,
      criticalCount,
      warningCount,
      opportunityCount,
      issues,
      auditedUrls,
      metrics: {
        h1Count,
        h2Count,
        imagesWithoutAlt,
        bodyText
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST for auditing' });
}
