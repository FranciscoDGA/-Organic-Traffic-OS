import { NextResponse } from 'next/server';
import { getGa4Service } from '../_service-singleton';

export async function GET() {
  try {
    const service = getGa4Service();
    const result = await service.listProperties();
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
