import { NextRequest, NextResponse } from 'next/server';
import { connectorHub } from '../../../../../../organic-traffic-os/core/och/connector-hub';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectorId } = body;
    if (!connectorId) return NextResponse.json({ success: false, error: 'connectorId required' }, { status: 400 });
    const result = await connectorHub.test(connectorId);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
