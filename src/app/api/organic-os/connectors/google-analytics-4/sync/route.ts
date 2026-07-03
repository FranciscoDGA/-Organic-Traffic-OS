import { NextRequest, NextResponse } from 'next/server';
import { getGa4Service } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'propertyId é obrigatório' }, { status: 400 });
    }

    const service = getGa4Service();
    const result = await service.sync(propertyId);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
