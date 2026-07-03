import { NextResponse } from 'next/server';
import { ResearchService } from '../../../../../../organic-traffic-os/research-pack/engine/research-service';

export async function POST(req: Request) {
  try {
    const blueprint = await req.json();
    const service = new ResearchService();
    const pack = service.generatePack(blueprint);
    return NextResponse.json(pack);
  } catch (err) {
    return NextResponse.json({ error: "Invalid blueprint data" }, { status: 400 });
  }
}
