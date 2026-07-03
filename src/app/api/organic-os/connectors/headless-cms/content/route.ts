import { NextRequest, NextResponse } from 'next/server';
import { getHeadlessCmsService } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const collection = req.nextUrl.searchParams.get('collection') || 'posts';
    const service = getHeadlessCmsService();
    const content = await service.listContent(collection);
    return NextResponse.json({ success: true, data: content });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
