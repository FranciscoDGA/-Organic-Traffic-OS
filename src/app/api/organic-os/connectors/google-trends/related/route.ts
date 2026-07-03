import { NextRequest, NextResponse } from 'next/server';
import { getGtService } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const term = url.searchParams.get('term');
    const country = url.searchParams.get('country') || 'BR';
    const type = url.searchParams.get('type') || 'queries';

    if (!term) {
      return NextResponse.json({ success: false, error: 'term é obrigatório' }, { status: 400 });
    }

    const service = getGtService();
    const result = type === 'topics'
      ? await service.fetchRelatedTopics(term, country)
      : await service.fetchRelatedQueries(term, country);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
