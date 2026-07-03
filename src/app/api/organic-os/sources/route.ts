import { NextResponse } from 'next/server';
import { SourceService } from '../../../../../organic-traffic-os/sources/engine/source-service';

export async function GET() {
  return NextResponse.json([{ id: "1", nome: "Portal GOV", categoria: "Site Oficial", autoridade: 99 }]);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new SourceService();
    return NextResponse.json(service.registerSource(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
