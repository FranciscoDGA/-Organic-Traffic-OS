import { NextResponse } from 'next/server';
import { getNewsletterService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getNewsletterService();
    const audiences = await service.listAudiences();
    return NextResponse.json({ success: true, data: audiences });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
