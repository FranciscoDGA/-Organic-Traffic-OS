import { NextRequest, NextResponse } from 'next/server';
import { getHeadlessCmsService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collection, id, confirm } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if (!confirm) {
      return NextResponse.json({ success: false, error: 'Explicit confirmation required. Set confirm=true to publish.' }, { status: 400 });
    }

    const service = getHeadlessCmsService();
    const result = await service.publishContent(collection || 'posts', id);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
