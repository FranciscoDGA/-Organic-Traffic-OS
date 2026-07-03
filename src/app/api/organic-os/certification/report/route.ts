import { NextRequest, NextResponse } from 'next/server';
import { getCertificationService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getCertificationService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const cert = svc.getCertificate(id);
    if (!cert) return NextResponse.json({ error: 'Certificado nao encontrado' }, { status: 404 });
    return NextResponse.json(cert);
  }
  return NextResponse.json(svc.getLatest() || { error: 'Nenhum certificado' }, { status: 404 });
}
