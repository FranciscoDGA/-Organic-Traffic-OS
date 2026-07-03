import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([{ id: "1", descricao: "O sol é uma estrela", categoria: "Ciência", nivel_confianca: 100 }]);
}
