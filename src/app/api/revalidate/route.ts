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
    const { path, category, revalidate_home, revalidate_sitemap } = body;
    if (!path) {
      return NextResponse.json({ error: 'path é obrigatório para revalidação' }, { status: 400 });
    }

    const revalidatedPaths: string[] = [];

    // 1. Revalidar o path específico
    try {
      revalidatePath(path);
      revalidatedPaths.push(path);
    } catch (err: any) {
      console.warn(`[Organic Bridge] Falha ao revalidar path: ${err.message}`);
    }

    // 2. Revalidar a home (opcional)
    if (revalidate_home) {
      try {
        revalidatePath('/');
        revalidatedPaths.push('/');
      } catch (err: any) {
        console.warn(`[Organic Bridge] Falha ao revalidar home: ${err.message}`);
      }
    }

    // 3. Revalidar a categoria (se fornecida)
    if (category) {
      const catPath = `/category/${category}`;
      try {
        revalidatePath(catPath);
        revalidatedPaths.push(catPath);
      } catch (err: any) {
        console.warn(`[Organic Bridge] Falha ao revalidar categoria: ${err.message}`);
      }
    }

    // 4. Revalidar o sitemap (opcional)
    if (revalidate_sitemap) {
      try {
        revalidatePath('/sitemap.xml');
        revalidatedPaths.push('/sitemap.xml');
      } catch (err: any) {
        console.warn(`[Organic Bridge] Falha ao revalidar sitemap: ${err.message}`);
      }
    }

    console.log(`[Organic Bridge] Cache revalidado com sucesso para as rotas: ${revalidatedPaths.join(', ')}`);

    return NextResponse.json({
      success: true,
      message: `Cache revalidado com sucesso.`,
      revalidated_paths: revalidatedPaths,
      revalidated_at: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
