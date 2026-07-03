import { NextRequest, NextResponse } from 'next/server';
import { connectorHub } from '../../../../../../organic-traffic-os/core/och/connector-hub';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const connector = connectorHub.getConnector(id);
    if (!connector) return NextResponse.json({ success: false, error: 'Connector not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: connector });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
