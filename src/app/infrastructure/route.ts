import { NextResponse } from 'next/server';

export async function GET() {
  // Redireciona para o painel de configurações dentro do Organic OS
  return NextResponse.redirect(new URL('/organic-os/settings', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
