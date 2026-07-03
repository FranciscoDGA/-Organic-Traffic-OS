import { NextRequest, NextResponse } from 'next/server';
import { connectorHub } from '../../../../../../../organic-traffic-os/core/och/connector-hub';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const success = await connectorHub.reconnect(id);
    return NextResponse.json({ success, data: { connectorId: id, reconnected: success } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
