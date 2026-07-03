import { NextRequest, NextResponse } from 'next/server';
import { getGtService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { terms, country } = body;

    if (!terms || !Array.isArray(terms) || terms.length === 0) {
      return NextResponse.json({ success: false, error: 'terms (array) é obrigatório' }, { status: 400 });
    }

    const service = getGtService();
    const result = await service.compareTerms(terms, country || 'BR');
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
