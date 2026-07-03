import { NextResponse } from 'next/server';
import { getWpService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getWpService();
    const tags = await service.listTags();
    return NextResponse.json({ success: true, data: tags });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
