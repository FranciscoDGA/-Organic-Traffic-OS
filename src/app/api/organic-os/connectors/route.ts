import { NextResponse } from 'next/server';
import { connectorHub } from '../../../../../organic-traffic-os/core/och/connector-hub';

export async function GET() {
  const connectors = connectorHub.getAllConnectors();
  return NextResponse.json({ success: true, data: connectors.map(c => ({ ...c, healthCheck: { ...c.healthCheck } })) });
}
