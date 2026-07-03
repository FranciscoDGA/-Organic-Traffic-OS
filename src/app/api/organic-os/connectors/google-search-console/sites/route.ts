import { NextResponse } from 'next/server';
import { getGscService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getGscService();
    const result = await service.listSites();
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
