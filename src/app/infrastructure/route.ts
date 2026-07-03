import { NextResponse } from 'next/server';

export async function GET() {
  // Redireciona para o painel dentro do Organic OS
  return NextResponse.redirect(new URL('/organic-os/infrastructure', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
