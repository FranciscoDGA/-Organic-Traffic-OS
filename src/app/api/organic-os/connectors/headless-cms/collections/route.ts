import { NextResponse } from 'next/server';
import { getHeadlessCmsService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getHeadlessCmsService();
    const collections = await service.listCollections();
    return NextResponse.json({ success: true, data: collections });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
