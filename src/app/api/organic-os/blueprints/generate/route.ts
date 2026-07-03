import { NextResponse } from 'next/server';
import { ArchitectService } from '../../../../../../organic-traffic-os/content-architecture/engine/architect-service';

export async function POST(req: Request) {
  try {
    const brief = await req.json();
    const service = new ArchitectService();
    const blueprint = service.generateBlueprint(brief);
    return NextResponse.json(blueprint);
  } catch (err) {
    return NextResponse.json({ error: "Invalid brief data" }, { status: 400 });
  }
}
