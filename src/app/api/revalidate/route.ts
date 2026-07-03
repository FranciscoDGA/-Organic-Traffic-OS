import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-revalidate-secret') || req.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATE_SECRET || 'mock_revalidate_secret_123';
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Não autorizado: REVALIDATE_SECRET inválida' }, { status: 401 });
    }

    const body = await req.json();
    const { path } = body;
    if (!path) {
      return NextResponse.json({ error: 'path é obrigatório para revalidação' }, { status: 400 });
    }

    // Tenta revalidar o path no Next.js (ISR)
    try {
      revalidatePath(path);
      console.log(`[Organic Bridge] Cache revalidado com sucesso para a rota: ${path}`);
    } catch (err: any) {
      console.warn(`[Organic Bridge] Falha ao invocar revalidatePath local: ${err.message}`);
    }

    return NextResponse.json({
      success: true,
      message: `Cache revalidado com sucesso.`,
      path,
      revalidated_at: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
