import { NextResponse } from 'next/server';
import { FactService } from '../../../../../../organic-traffic-os/facts/engine/fact-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new FactService();
    const fact = service.registerFact(data);
    return NextResponse.json(fact);
  } catch (err) {
    return NextResponse.json({ error: "Invalid fact data" }, { status: 400 });
  }
}
