import { NextRequest, NextResponse } from 'next/server';
import { getBwService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, api_key, siteUrl } = body;

    const service = getBwService();

    if (action === 'connect' || (!action && api_key)) {
      const result = await service.connect({ api_key: api_key || process.env.BING_API_KEY || '' });
      return NextResponse.json(result);
    }

    if (action === 'disconnect') {
      const result = await service.disconnect();
      return NextResponse.json(result);
    }

    if (action === 'sync' && siteUrl) {
      const result = await service.sync(siteUrl);
      return NextResponse.json(result);
    }

    if (action === 'listSites') {
      const result = await service.listSites();
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: 'Ação inválida ou parâmetros ausentes' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
