import { NextResponse } from 'next/server';
import { PerformanceService } from '../../../../../organic-traffic-os/performance/engine/performance-service';

export async function GET() {
  const service = new PerformanceService();
  return NextResponse.json(service.getDashboardOverview());
}
