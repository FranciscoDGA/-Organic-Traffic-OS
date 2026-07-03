import { NextResponse } from 'next/server';
import { SearchService } from '../../../../../../organic-traffic-os/search/engine/search-service';

export async function GET() {
  const service = new SearchService();
  const data = await service.getDashboardOverview();
  return NextResponse.json(data.oportunidades);
}
