import { NextResponse } from 'next/server';
import { CollectorCache } from '@shared/collectors/base/collector-cache';

export async function POST() {
  await CollectorCache.limpar();
  return NextResponse.json({ status: 'success', message: 'Cache limpo com sucesso' });
}
