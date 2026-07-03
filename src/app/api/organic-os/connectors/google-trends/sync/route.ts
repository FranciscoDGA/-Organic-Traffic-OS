import { NextRequest, NextResponse } from 'next/server';
import { getGtService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, term, terms, country, mode } = body;

    const service = getGtService();

    if (action === 'connect' || (!action && mode)) {
      const result = await service.connect({ enabled: true, mode: mode || 'mock', country: country || 'BR' });
      return NextResponse.json(result);
    }

    if (action === 'disconnect') {
      const result = await service.disconnect();
      return NextResponse.json(result);
    }

    if (action === 'sync' && terms) {
      const result = await service.sync(terms, country || 'BR');
      return NextResponse.json(result);
    }

    if (action === 'fetchInterestOverTime' && term) {
      const result = await service.fetchInterestOverTime(term, country || 'BR');
      return NextResponse.json(result);
    }

    if (action === 'fetchInterestByRegion' && term) {
      const result = await service.fetchInterestByRegion(term, country || 'BR');
      return NextResponse.json(result);
    }

    if (action === 'fetchRelatedQueries' && term) {
      const result = await service.fetchRelatedQueries(term, country || 'BR');
      return NextResponse.json(result);
    }

    if (action === 'fetchRelatedTopics' && term) {
      const result = await service.fetchRelatedTopics(term, country || 'BR');
      return NextResponse.json(result);
    }

    if (action === 'detectSeasonality' && term) {
      const result = await service.detectSeasonality(term, country || 'BR');
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: 'Ação inválida ou parâmetros ausentes' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
