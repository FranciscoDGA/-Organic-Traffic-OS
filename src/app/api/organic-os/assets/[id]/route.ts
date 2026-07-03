import { NextResponse } from 'next/server';
import { AssetService } from '../../../../../../organic-traffic-os/assets/engine/asset-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new AssetService();
  return NextResponse.json(service.getAsset(id));
}
