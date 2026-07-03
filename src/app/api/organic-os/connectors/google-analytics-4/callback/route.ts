import { NextRequest } from 'next/server';
import { getGa4Service } from '../_service-singleton';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`<html><body><h1>Erro na autenticação GA4</h1><p>${error}</p><script>window.close()</script></body></html>`, { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  if (code) {
    const service = getGa4Service();
    await service.handleOAuthCallback(code);
    return new Response(`<html><body><h1>GA4 Autenticado com sucesso!</h1><p>Pode fechar esta janela.</p><script>window.close()</script></body></html>`, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response(`<html><body><h1>Código não encontrado</h1></body></html>`, { status: 400, headers: { 'Content-Type': 'text/html' } });
}
