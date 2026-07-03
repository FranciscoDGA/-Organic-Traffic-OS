import { NextResponse } from 'next/server';
import { connectorHub } from '../../../../../../organic-traffic-os/core/och/connector-hub';

export async function GET() {
  const health = await connectorHub.healthCheckAll();
  return NextResponse.json({ success: true, data: health });
}
