import { NextResponse } from 'next/server';
import { CollectorManager } from '@shared/collectors/base/collector-manager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { collectorId, params } = body;

    if (!collectorId) {
      return NextResponse.json({ error: 'collectorId required' }, { status: 400 });
    }

    const result = await CollectorManager.executeCollector(collectorId, params);
    
    return NextResponse.json({ status: 'success', data: result });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
