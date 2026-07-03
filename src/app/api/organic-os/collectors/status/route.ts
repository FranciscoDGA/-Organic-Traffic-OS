import { NextResponse } from 'next/server';
import { CollectorCache } from '@shared/collectors/base/collector-cache';
import { CollectorRegistry } from '@shared/collectors/base/collector-registry';

export async function GET() {
  const cachedItems = await CollectorCache.listarTodos();
  const activeCount = CollectorRegistry.getActive().length;

  return NextResponse.json({
    status: 'success',
    data: {
      total_cache_entries: cachedItems.length,
      active_collectors: activeCount,
      cache: cachedItems
    }
  });
}
