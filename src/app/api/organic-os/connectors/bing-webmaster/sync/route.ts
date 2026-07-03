import { NextRequest, NextResponse } from 'next/server';
import { getBwService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteUrl } = body;

    if (!siteUrl) {
      return NextResponse.json({ success: false, error: 'siteUrl é obrigatório' }, { status: 400 });
    }

    const service = getBwService();
    const result = await service.sync(siteUrl);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
