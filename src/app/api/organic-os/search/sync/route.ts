import { NextResponse } from 'next/server';
import { SearchService } from '../../../../../../organic-traffic-os/search/engine/search-service';

export async function POST() {
  const service = new SearchService();
  return NextResponse.json(await service.syncData());
}
