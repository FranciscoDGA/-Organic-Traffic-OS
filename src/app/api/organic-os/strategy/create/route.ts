import { NextResponse } from 'next/server';
import { StrategyService } from '../../../../../../organic-traffic-os/strategy/engine/strategy-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new StrategyService();
    return NextResponse.json(service.generateStrategy(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
