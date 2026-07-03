import { NextResponse } from 'next/server';
import { CollectorRegistry } from '@shared/collectors/base/collector-registry';

export async function GET() {
  const collectors = CollectorRegistry.getAll().map(c => ({
    id: c.id,
    nome: c.nome,
    versao: c.versao,
    fonte: c.fonte,
    status: c.status
  }));

  return NextResponse.json({ status: 'success', data: collectors });
}
