import { NextResponse } from 'next/server';
import { getRuntimeService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getRuntimeService();
    const modules = service.getModules();
    return NextResponse.json({ success: true, data: modules });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
