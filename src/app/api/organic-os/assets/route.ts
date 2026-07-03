import { NextResponse } from 'next/server';
import { AssetService } from '../../../../../organic-traffic-os/assets/engine/asset-service';

export async function GET() {
  const service = new AssetService();
  return NextResponse.json(service.listAssets());
}
