import { NextResponse } from 'next/server';
import { AssetService } from '../../../../../../organic-traffic-os/assets/engine/asset-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new AssetService();
    return NextResponse.json(service.createAsset(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
