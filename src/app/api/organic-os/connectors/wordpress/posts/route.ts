import { NextRequest, NextResponse } from 'next/server';
import { getWpService } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const perPage = parseInt(req.nextUrl.searchParams.get('per_page') || '20');
    const service = getWpService();
    const posts = await service.listPosts(perPage);
    return NextResponse.json({ success: true, data: posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
