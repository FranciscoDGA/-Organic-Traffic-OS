import { NextRequest, NextResponse } from 'next/server';
import { getBwService } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const siteUrl = url.searchParams.get('siteUrl');
    const startDate = url.searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = url.searchParams.get('endDate') || new Date().toISOString().split('T')[0];

    if (!siteUrl) {
      return NextResponse.json({ success: false, error: 'siteUrl é obrigatório' }, { status: 400 });
    }

    const service = getBwService();
    const result = await service.fetchQueries(siteUrl, startDate, endDate);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
