import { NextResponse } from 'next/server';
import { StrategyService } from '../../../../../organic-traffic-os/strategy/engine/strategy-service';

export async function GET() {
  const service = new StrategyService();
  return NextResponse.json(service.listStrategies());
}
