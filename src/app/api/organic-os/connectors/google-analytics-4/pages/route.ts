import { NextRequest, NextResponse } from 'next/server';
import { getGa4Service } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const propertyId = url.searchParams.get('propertyId');
    const startDate = url.searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = url.searchParams.get('endDate') || new Date().toISOString().split('T')[0];

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'propertyId é obrigatório' }, { status: 400 });
    }

    const service = getGa4Service();
    const result = await service.fetchPages(propertyId, startDate, endDate);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
