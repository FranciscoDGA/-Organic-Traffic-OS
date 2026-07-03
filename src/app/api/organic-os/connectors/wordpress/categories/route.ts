import { NextResponse } from 'next/server';
import { getWpService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getWpService();
    const categories = await service.listCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
